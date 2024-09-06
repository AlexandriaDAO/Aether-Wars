import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import swapReducer from "@/features/swap/swapSlice"
import icpLedgerReducer from "@/features/icp-ledger/icpLedgerSlice";
import tokenomicsReducer from "@/features/swap/tokenomicsSilce";
import alexReducer from "@/features/swap/alexSlice";


const rootReducer = combineReducers({
	auth: authReducer,
	swap:swapReducer,
	icpLedger:icpLedgerReducer,
	tokenomics:tokenomicsReducer,
	alex:alexReducer,
});

export default rootReducer;
