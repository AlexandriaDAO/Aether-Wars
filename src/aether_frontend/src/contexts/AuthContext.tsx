// src/aether_frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createActor as createAetherActor, backend } from '../../../declarations/backend';
import { createActor as createProfile_nftActor, profile_nft } from '../../../declarations/profile_nft';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from '@dfinity/principal';
import { AccountIdentifier, LedgerCanister } from '@dfinity/ledger-icp';

interface AuthContextProps {
  aetherActor: any;
  profile_nftActor: any;
  UID: Principal | null;
  accountIdentifier: AccountIdentifier | null;
  balanceE8s: bigint | null;
  login: (e: React.FormEvent) => Promise<void>;
  logout: (e: React.FormEvent) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  aetherActor: backend,
  profile_nftActor: profile_nft,
  UID: null,
  accountIdentifier: null,
  balanceE8s: null,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

const LEDGER_CANISTER_ID = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [aetherActor, setAetherActor] = useState(backend);
  const [profile_nftActor, setProfile_nftActor] = useState(profile_nft);
  const [UID, setUID] = useState<Principal | null>(null);
  const accountIdentifier = useMemo(() => UID && AccountIdentifier.fromPrincipal({ principal: UID }), [UID]);
  const [balanceE8s, setBalanceE8s] = useState<bigint | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (accountIdentifier) {
        const ledger = LedgerCanister.create({ canisterId: LEDGER_CANISTER_ID });
        const balance = await ledger.accountBalance({ accountIdentifier });
        setBalanceE8s(balance);
        console.log("Balance: ", balance);
      } else {
        setBalanceE8s(null);
      }
    };
  
    fetchBalance();
  }, [accountIdentifier]);

  useEffect(() => {
    const initializeAuth = async () => {
      const authClient = await AuthClient.create();
      const isAuthenticated = await authClient.isAuthenticated();

      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity });
        const newAetherActor = createAetherActor(process.env.CANISTER_ID_BACKEND!, {
          agent,
        });
        const newProfile_nftActor = createProfile_nftActor(process.env.CANISTER_ID_PROFILE_NFT!, {
          agent,
        });

        setAetherActor(newAetherActor);
        setProfile_nftActor(newProfile_nftActor);
        setUID(await newAetherActor.whoami());
      }
    };

    initializeAuth();
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    let authClient = await AuthClient.create();

    await new Promise<void>((resolve) => {
      authClient.login({
        identityProvider:
          process.env.DFX_NETWORK === "ic"
            ? "https://identity.ic0.app"
            : `http://localhost:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`,
            derivationOrigin: "https://xo3nl-yaaaa-aaaap-abl4q-cai.icp0.io",
        onSuccess: () => resolve(),
      });
    });
  

    // At this point we're authenticated, and we can get the identity from the auth client:
    const identity = authClient.getIdentity();
    // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
    const agent = new HttpAgent({ identity });
    // Using the interface description of our webapp, we create actors that we use to call the service methods.
    const newAetherActor = createAetherActor(process.env.CANISTER_ID_BACKEND!, {
      agent,
    });
    const newProfile_nftActor = createProfile_nftActor(process.env.CANISTER_ID_PROFILE_NFT!, {
      agent,
    });

    setAetherActor(newAetherActor);
    setProfile_nftActor(newProfile_nftActor);
    setUID(await newAetherActor.whoami());
  };

  const logout = async (e: React.FormEvent) => {
    e.preventDefault();
    let authClient = await AuthClient.create();
    await authClient.logout();
    setAetherActor(backend);
    setProfile_nftActor(profile_nft);
    setUID(null);
  };

  return (
    <AuthContext.Provider value={{ aetherActor, profile_nftActor, UID, accountIdentifier, balanceE8s, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};