import { createContext } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { ActorSubclass } from "@dfinity/agent";
import { backend } from '../../../declarations/backend';
import { profile_nft } from '../../../declarations/profile_nft';
import { icp_swap } from '../../../declarations/icp_swap';
import { icp_ledger_canister } from '../../../declarations/icp_ledger_canister';
import { tokenomics } from '../../../declarations/tokenomics';
import { LBRY } from '../../../declarations/LBRY';
import { AETHER } from '../../../declarations/AETHER'
import { _SERVICE } from '../../../declarations/backend/backend.did';
import { _SERVICE as _SERVICEPROFILE_NFT } from '../../../declarations/profile_nft/profile_nft.did';
import { _SERVICE as _SERVICESWAP } from '../../../declarations/icp_swap/icp_swap.did';
import { _SERVICE as _SERVICEICPLEDGER } from '../../../declarations/icp_ledger_canister/icp_ledger_canister.did';
import { _SERVICE as _SERVICETOKENOMICS } from '../../../declarations/tokenomics/tokenomics.did';
import { _SERVICE as _SERVICELBRY } from '../../../declarations/LBRY/LBRY.did';
import { _SERVICE as _SERVICEAETHER } from "../../../declarations/AETHER/AETHER.did"

interface SessionContextProps {
	actor: ActorSubclass<_SERVICE>;
	actorProfile_nft: ActorSubclass<_SERVICEPROFILE_NFT>;
	actorSwap: ActorSubclass<_SERVICESWAP>;
	actorIcpLedger: ActorSubclass<_SERVICEICPLEDGER>;
	actorTokenomics: ActorSubclass<_SERVICETOKENOMICS>;
	actorLbry: ActorSubclass<_SERVICELBRY>;
	actorAether: ActorSubclass<_SERVICEAETHER>;
	authClient: AuthClient | undefined;
}

const SessionContext = createContext<SessionContextProps>({
	actor: backend,
	actorProfile_nft: profile_nft,
	actorSwap: icp_swap,
	actorIcpLedger: icp_ledger_canister,
	actorTokenomics: tokenomics,
	actorLbry: LBRY,
	actorAether: AETHER,
	authClient: undefined,
});

export default SessionContext