import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE as _SERVICETOKENOMICS } from "../../../../../../declarations/tokenomics/tokenomics.did";
import { createAsyncThunk } from "@reduxjs/toolkit";
import LedgerService from "@/utils/LedgerService";
// Define the asyn thunk
const getAetherMintRate = createAsyncThunk<
  string, // This is the return type of the thunk's payload
  {
    actor: ActorSubclass<_SERVICETOKENOMICS>;
  },
  { rejectValue: string }
>("tokenomics/getAetherMintRate", async ({ actor }, { rejectWithValue }) => {
  try {
    const result = await actor.get_current_AETHER_rate();
    const LedgerServices = LedgerService();
    const fromatedBal = LedgerServices.e8sToIcp(
      result * BigInt(10000)
    ).toString();
    return fromatedBal;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
  }
  return rejectWithValue(
    "An unknown error occurred while fetching AETHER mint rate"
  );
});

export default getAetherMintRate;
