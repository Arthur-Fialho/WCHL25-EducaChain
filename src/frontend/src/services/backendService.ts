import { backend } from "../../../declarations/backend";

/**
 * Service for handling all backend canister API calls
 */
export const backendService = {
  async getBtcAddress(): Promise<string> {
    return await backend.getBtcAddress();
  },

  async donate(): Promise<string> {
    return await backend.donate();
  },

  async requestScholarship(): Promise<string> {
    return await backend.requestScholarship();
  },
};
