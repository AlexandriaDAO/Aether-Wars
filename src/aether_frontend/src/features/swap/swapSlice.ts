import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import getLBRYratio from "./thunks/getLBRYratio";
import getSubaccount from "./thunks/getSubaccount";
import swapLbry from "./thunks/swapLbry";
import getMaxLbryBurn from "./thunks/getMaxLbryBurn";
import burnLbry from "./thunks/burnLBRY";
import getLbryBalance from "./thunks/lbryIcrc/getLbryBalance";
import stakeAether from "./thunks/stakeAether";
import getStakeInfo from "./thunks/getStakedInfo";
import claimReward from "./thunks/claimReward";
import unstake from "./thunks/unstake";
import transferLBRY from "./thunks/lbryIcrc/transferLBRY";
import transferICPFromUserWalletcanister from "./thunks/transferICPFromUserWallet";
// Define the interface for our node state
export interface StakeInfo {
  stakedAether: string;
  rewardIcp: string;
  unix_stake_time: string;
}

export interface SwapState {
  lbryRatio: string;
  lbryBalance: string;
  subaccount: string;
  maxLbryBurn: Number;
  stakeInfo: StakeInfo;
  loading: boolean;
  swapSuccess: boolean;
  burnSuccess: boolean;
  successStake: boolean;
  successClaimReward: boolean;
  unstakeSuccess: boolean;
  transferSuccess:boolean;
  error: string | null;
}

// Define the initial state using the ManagerState interface
const initialState: SwapState = {
  lbryRatio: "0",
  lbryBalance: "0",
  subaccount: "",
  maxLbryBurn: 0,
  stakeInfo: { stakedAether: "0", rewardIcp: "0", unix_stake_time: "0" },
  swapSuccess: false,
  successStake: false,
  burnSuccess: false,
  successClaimReward: false,
  unstakeSuccess: false,
  transferSuccess:false,
  loading: false,
  error: null,
};

const swapSlice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    flagHandler: (state) => {
      state.swapSuccess = false;
      state.burnSuccess=false;
      state.successStake = false;
      state.successClaimReward = false;
      state.unstakeSuccess = false;
      state.transferSuccess=false;
      state.error = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<SwapState>) => {
    builder
      .addCase(getLBRYratio.pending, (state) => {
        message.info("Fetching LBRY ratio");
        state.loading = true;
        state.error = null;
      })
      .addCase(getLBRYratio.fulfilled, (state, action) => {
        message.success("LBRY ratio fetched.");
        state.lbryRatio = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getLBRYratio.rejected, (state, action) => {
        message.error("LBRY ratio could not be fetched!");
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getLbryBalance.pending, (state) => {
        message.info("Fetching LBRY balance!");
        state.loading = true;
        state.error = null;
      })
      .addCase(getLbryBalance.fulfilled, (state, action) => {
        message.success("Fetched LBRY balance!");
        state.lbryBalance = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getLbryBalance.rejected, (state, action) => {
        message.error("LBRY balance could not be fetched!");
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getStakeInfo.pending, (state) => {
        message.info("Fetching staked info!");
        state.loading = true;
        state.error = null;
      })
      .addCase(getStakeInfo.fulfilled, (state, action) => {
        message.success("Fetched staked info!");
        state.stakeInfo = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getStakeInfo.rejected, (state, action) => {
        message.error("Could not fetched staked info!");
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getSubaccount.pending, (state) => {
        message.info("Fetching subaccount!");
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubaccount.fulfilled, (state, action) => {
        message.success("Fetched subaccount!");
        state.subaccount = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getSubaccount.rejected, (state, action) => {
        message.error("Subaccount could not be fetched!");
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(swapLbry.pending, (state) => {
        message.info("Swapping!");
        state.loading = true;
        state.error = null;
      })
      .addCase(swapLbry.fulfilled, (state, action) => {
        message.success("Successfully Swaped!");
        state.loading = false;
        state.swapSuccess = true;
        state.error = null;
      })
      .addCase(swapLbry.rejected, (state, action) => {
        message.error("Error while Swaping!");
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(stakeAether.pending, (state) => {
        message.info("Staking!");
        state.loading = true;
        state.error = null;
      })
      .addCase(stakeAether.fulfilled, (state, action) => {
        message.success("Successfully staked!");
        state.loading = false;
        state.successStake = true;
        state.error = null;
      })
      .addCase(stakeAether.rejected, (state, action) => {
        message.error("Error while staking!");
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(burnLbry.pending, (state) => {
        message.info("Burning LBRY!");
        state.loading = true;
        state.error = null;
      })
      .addCase(burnLbry.fulfilled, (state, action) => {
        message.success("Burned LBRY sucessfully!");
        state.burnSuccess = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(burnLbry.rejected, (state, action) => {
        message.error("Error while burning!");
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(claimReward.pending, (state) => {
        message.info("Claiming!");
        state.loading = true;
        state.error = null;
      })
      .addCase(claimReward.fulfilled, (state, action) => {
        message.success("Successfully Claimed!");
        state.loading = false;
        state.successClaimReward = true;
        state.error = null;
      })
      .addCase(claimReward.rejected, (state, action) => {
        message.error("Error while claiming!");
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(unstake.pending, (state) => {
        message.info("Unstaking!");
        state.loading = true;
        state.error = null;
      })
      .addCase(unstake.fulfilled, (state, action) => {
        message.success("Successfully unstaked!");
        state.loading = false;
        state.unstakeSuccess = true;
        state.error = null;
      })
      .addCase(unstake.rejected, (state, action) => {
        message.error("Error while unstaking!");
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMaxLbryBurn.pending, (state) => {
        message.info("Fetching max allowed LBRY burn!");
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaxLbryBurn.fulfilled, (state, action) => {
        message.success("Successfully fetched max allowed burn!");
        state.maxLbryBurn = action.payload;
        state.error = null;
      })
      .addCase(getMaxLbryBurn.rejected, (state, action) => {
        message.error("Error while fethcing max burn LBRY!");
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(transferLBRY.pending, (state) => {
        message.info("Processing LBRY transfer!");
        state.loading = true;
        state.error = null;
      })
      .addCase(transferLBRY.fulfilled, (state, action) => {
        message.success("Successfully transfered LBRY!");
        state.transferSuccess = true;
        state.loading=false;
        state.error = null;
      })
      .addCase(transferLBRY.rejected, (state, action) => {
        message.error("Error while transfering LBRY");
        state.loading = false;
        state.error = action.payload as string;
      }).addCase(transferICPFromUserWalletcanister.pending, (state) => {
        message.info("Processing ICP transfer from canister user wallet!");
        state.loading = true;
        state.error = null;
      })
      .addCase(transferICPFromUserWalletcanister.fulfilled, (state, action) => {
        message.success("Successfully transfered ICP!");
        state.transferSuccess = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(transferICPFromUserWalletcanister.rejected, (state, action) => {
        message.error("Error while transfering from canister user wallet!");
        state.loading = false;
        state.error = action.payload as string;
      })
      ;
  },
});
export const { flagHandler } = swapSlice.actions;
export default swapSlice.reducer;
