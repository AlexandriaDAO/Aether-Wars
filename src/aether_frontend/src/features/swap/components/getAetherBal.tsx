import React, { useEffect } from "react";
import { useAppDispatch } from '../../../store/hooks/useAppDispatch';
import { useAppSelector } from "../../../store/hooks/useAppSelector";
import { ActorSubclass } from "@dfinity/agent";

import { _SERVICE as _SERVICESWAP } from '../../../../../declarations/icp_swap/icp_swap.did';
import { _SERVICE as _SERVICEAETHER} from '../../../../../declarations/AETHER/AETHER.did' 
import getAccountAetherBalance from "../thunks/aetherIcrc/getAccountAetherBalance";
interface LbryRatioProps {
    actorAether: ActorSubclass<_SERVICEAETHER>;
}

const GetAetherBal: React.FC<LbryRatioProps> = ({ actorAether }) => {
    const dispatch = useAppDispatch();
    const aether = useAppSelector((state) => state.aether);
    const auth = useAppSelector((state) => state.auth);
    const swap = useAppSelector((state) => state.swap);

    useEffect(() => {
        dispatch(getAccountAetherBalance({ actor:actorAether, account: auth.user }))
    }, [auth.user])
    useEffect(() => {
        if (swap.successStake === true||swap.unstakeSuccess === true||swap.burnSuccess === true ||swap.successClaimReward===true) {
            dispatch(getAccountAetherBalance({ actor:actorAether, account: auth.user }))
        }
    }, [swap])
    return (<div className="account-wrapper">
        Aether Balance :{aether.aetherBal}
    </div>);
};
export default GetAetherBal;
