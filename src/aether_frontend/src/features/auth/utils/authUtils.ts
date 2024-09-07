import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import {
  createActor,
  backend,
} from "../../../../../declarations/backend";
import {
  createActor as createProfile_nftActor,
  profile_nft,
} from "../../../../../declarations/profile_nft";
import {
  icp_swap,
  createActor as createActorSwap,
} from "../../../../../declarations/icp_swap";
import {
  icp_ledger_canister,
  createActor as createActorIcpLedger,
} from "../../../../../declarations/icp_ledger_canister";
import {
  tokenomics,
  createActor as createActorTokenomics,
} from "../../../../../declarations/tokenomics";
import {
  LBRY,
  createActor as createActorLbry,
} from "../../../../../declarations/LBRY";
import {
  AETHER,
  createActor as createActorAether,
} from "../../../../../declarations/AETHER";

const backend_canister_id = process.env.CANISTER_ID_BACKEND!;
const profile_nft_canister_id = process.env.CANISTER_ID_PROFILE_NFT!;
const icp_swap_canister_id = process.env.CANISTER_ID_ICP_SWAP!;
const icp_ledger_canister_id = process.env.CANISTER_ID_ICP_LEDGER_CANISTER!;
const tokenomics_canister_id = process.env.CANISTER_ID_TOKENOMICS!;
const lbry_canister_id = process.env.CANISTER_ID_LBRY!;
const aether_canister_id = process.env.CANISTER_ID_AETHER!;

export const getPrincipal = (client: AuthClient): string => {
  const identity = client.getIdentity();
  const principal = identity.getPrincipal().toString();
  return principal;
};

const createAuthenticatedActor = async <T>(
  client: AuthClient,
  canisterId: string,
  createActorFn: (canisterId: string, options: { agent: HttpAgent }) => T,
  defaultActor: T
): Promise<T> => {
  try {
    if (await client.isAuthenticated()) {
      const identity = client.getIdentity();
      const agent = new HttpAgent({ identity });
      return createActorFn(canisterId, { agent });
    }
  } catch (error) {
    console.error(`Error initializing actor for ${canisterId}:`, error);
  }
  return defaultActor;
};

export const initializeActor = (client: AuthClient) =>
  createAuthenticatedActor(client, backend_canister_id, createActor, backend);

export const initializeProfile_nftActor = (client: AuthClient) =>
  createAuthenticatedActor(client, profile_nft_canister_id, createProfile_nftActor, profile_nft);

export const initializeActorSwap = (client: AuthClient) =>
  createAuthenticatedActor(client, icp_swap_canister_id, createActorSwap, icp_swap);

export const initializeIcpLedgerActor = (client: AuthClient) =>
  createAuthenticatedActor(client, icp_ledger_canister_id, createActorIcpLedger, icp_ledger_canister);

export const initializeTokenomicsActor = (client: AuthClient) =>
  createAuthenticatedActor(client, tokenomics_canister_id, createActorTokenomics, tokenomics);

export const initializeLbryActor = (client: AuthClient) =>
  createAuthenticatedActor(client, lbry_canister_id, createActorLbry, LBRY);

export const initializeAetherActor = (client: AuthClient) =>
  createAuthenticatedActor(client, aether_canister_id, createActorAether, AETHER);
