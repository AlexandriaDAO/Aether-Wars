import {
  ActionReducerMapBuilder,
  createSlice,
} from "@reduxjs/toolkit";
import { message } from "antd";
import getAetherMintRate from "./thunks/tokenomics/getAetherMintRate";
// Define the interface for our node state
export interface SwapState {
  aetherMintRate: string;
  loading: boolean;
  error: string | null;
}

// Define the initial state using the ManagerState interface
const initialState: SwapState = {
  aetherMintRate: "",
  loading: false,
  error: null,
};

const tokenomicsSlice = createSlice({
  name: "tokenomics",
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<SwapState>) => {
    builder
      .addCase(getAetherMintRate.pending, (state) => {
        message.info("Fetching AETHER mint rate!");
        state.loading = true;
        state.error = null;
      })
      .addCase(getAetherMintRate.fulfilled, (state, action) => {
        message.success("Fetched AETHER mint rate!");
        state.aetherMintRate = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAetherMintRate.rejected, (state, action) => {
        message.error("Could not fetched AETHER mint rate!");
        state.loading = false;
        state.error = action.payload as string;
      })
    
  },
});

export default tokenomicsSlice.reducer;
