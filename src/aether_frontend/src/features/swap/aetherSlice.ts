import {
  ActionReducerMapBuilder,
  createSlice,
} from "@reduxjs/toolkit";
import { message } from "antd";
import getAccountAetherBalance from "./thunks/aetherIcrc/getAccountAetherBalance";
import transferAETHER from "./thunks/aetherIcrc/transferAETHER";
import transferICPFromUserWalletcanister from "./thunks/transferICPFromUserWallet";
// Define the interface for our node state
export interface AetherState {
  aetherBal: string;
  loading: boolean;
  transferSuccess:boolean;
  error: string | null;
}

// Define the initial state using the ManagerState interface
const initialState: AetherState = {
  aetherBal: "",
  loading: false,
  transferSuccess:false,
  error: null,
};

const aetherSlice = createSlice({
  name: "aether",
  initialState,
  reducers: {
    flagHandler: (state) => {
      state.transferSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AetherState>) => {
    builder
      .addCase(getAccountAetherBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccountAetherBalance.fulfilled, (state, action) => {
        state.aetherBal = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAccountAetherBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(transferAETHER.pending, (state) => {
        message.info("Processing AETHER transfer!");
        state.loading = true;
        state.error = null;
      })
      .addCase(transferAETHER.fulfilled, (state, action) => {
        message.success("Successfully transfered!");
        state.transferSuccess = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(transferAETHER.rejected, (state, action) => {
        message.error("Error while transfering AETHER");
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default aetherSlice.reducer;
