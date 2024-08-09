import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE as _SERVICEALEX } from "../../../../../../declarations/ALEX/ALEX.did";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Principal } from "@dfinity/principal";
import LedgerService from "@/utils/LedgerService";

// Define the asyn thunk
const getAccountAlexBalance = createAsyncThunk<
  string, // This is the return type of the thunk's payload
  {
    actor: ActorSubclass<_SERVICEALEX>;
    account: string;
  },
  { rejectValue: string }
>(
  "alex/getAccountAlexBalance",
  async ({ actor, account }, { rejectWithValue }) => {
    try {
      const result = await actor.icrc1_balance_of({
        owner: Principal.fromText(account),
        subaccount: [],
      });
      const LedgerServices = LedgerService();
      const fromatedBal = LedgerServices.e8sToIcp(result).toString();
      return fromatedBal;
    } catch (error) {
      console.error("Failed to get ALEX balance:", error);

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
    return rejectWithValue(
      "An unknown error occurred while fetching ALEX balance"
    );
  }
);

export default getAccountAlexBalance;
