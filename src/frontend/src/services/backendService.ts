import { backend } from "../../../declarations/backend";

/**
 * Service for handling all backend canister API calls
 */
export const backendService = {
  async getBtcAddress(): Promise<string> {
    return await backend.get_btc_address();
  },

  async donate(): Promise<string> {
    return await backend.donate();
  },

  async requestScholarship(): Promise<string> {
    const result = await backend.complete_stage_and_request_funds();
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(result.Err);
    }
  },
};
