import React, { useEffect, useState } from 'react';
import { backend } from '../../../declarations/backend';
import { AuthClient } from "@dfinity/auth-client";
import { useAppSelector } from '@/store/hooks/useAppSelector';
import SessionContext from '@/contexts/SessionContext';
import { useAppDispatch } from '@/store/hooks/useAppDispatch';
import principal from '@/features/auth/thunks/principal';
import { initializeActor, 
    initializeProfile_nftActor, 
    initializeActorSwap,
    initializeIcpLedgerActor, 
    initializeLbryActor, 
    initializeTokenomicsActor,
    initializeAetherActor,
} from '@/features/auth/utils/authUtils';
import { profile_nft } from '../../../declarations/profile_nft';
import { icp_swap } from '../../../declarations/icp_swap';
import { icp_ledger_canister } from "../../../declarations/icp_ledger_canister";
import { tokenomics } from '../../../declarations/tokenomics';
import { LBRY } from '../../../declarations/LBRY';
import { AETHER } from '../../../declarations/AETHER';



interface SessionProviderProps {
	children: React.ReactNode;
}

// authClient > user > actor > my-engines > [meiliclient, meiliindex]
const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector(state => state.auth);

	const [actor, setActor] = useState(backend);
	const [actorProfile_nft, setActorProfile_nft] = useState(profile_nft);
	const [actorSwap,setActorSwap]=useState(icp_swap);
	const [actorIcpLedger, setIcpLedger] = useState(icp_ledger_canister);
	const [actorTokenomics, setActorTokenomics] = useState(tokenomics);
	const [actorLbry, setActorLbry] = useState(LBRY);
	const [actorAether, setActorAether] = useState(AETHER);

	const [authClient, setAuthClient] = useState<AuthClient>();


	const initializeAuthClient = async () => {
		const authClient = await AuthClient.create();
		setAuthClient(authClient);
	}

	useEffect(() => {
		initializeAuthClient();
	}, []);

	useEffect(() => {
		if (!authClient) return;

		dispatch(principal(authClient))
	}, [authClient])

	useEffect(()=>{
		if(!authClient) return;

		const setupActor = async()=>{

			setActor(await initializeActor(authClient));

			setActorSwap(await initializeActorSwap(authClient));

			setIcpLedger(await initializeIcpLedgerActor(authClient));

			setActorTokenomics(await initializeTokenomicsActor(authClient));

			setActorLbry(await initializeLbryActor(authClient));

			setActorAether(await initializeAetherActor(authClient));
        
      setActorProfile_nft(await initializeProfile_nftActor(authClient));
        
		}
		setupActor();
	},[user])

	return (
		<SessionContext.Provider value={{ actor, actorSwap,actorIcpLedger,actorTokenomics, actorLbry, actorAether, actorProfile_nft, authClient }}>
			{children}
		</SessionContext.Provider>
	);
};

export default SessionProvider