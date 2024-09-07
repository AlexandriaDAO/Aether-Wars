import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE as _SERVICEAETHER } from "../../../../../../declarations/AETHER/AETHER.did";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Principal } from "@dfinity/principal";
import LedgerService from "@/utils/LedgerService";

// Define the asyn thunk
const getAccountAetherBalance = createAsyncThunk<
  string, // This is the return type of the thunk's payload
  {
    actor: ActorSubclass<_SERVICEAETHER>;
    account: string;
  },
  { rejectValue: string }
>(
  "aether/getAccountAetherBalance",
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
      console.error("Failed to get AETHER balance:", error);

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
    return rejectWithValue(
      "An unknown error occurred while fetching AETHER balance"
    );
  }
);

export default getAccountAetherBalance;
