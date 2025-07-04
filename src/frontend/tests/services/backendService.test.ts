import { describe, it, expect, vi, beforeEach } from "vitest";
import { backendService } from "../../src/services/backendService";
import { backend } from "../../../declarations/backend";

// Mock the backend canister
vi.mock("../../../declarations/backend", () => ({
  backend: {
    getBtcAddress: vi.fn().mockResolvedValue("BTC_ADDRESS_MOCK"),
    donate: vi.fn().mockResolvedValue("Donation received!"),
    requestScholarship: vi.fn().mockResolvedValue("Scholarship requested!"),
  },
}));

describe("backendService", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe("getBtcAddress", () => {
    it("should call backend.getBtcAddress and return the address", async () => {
      const result = await backendService.getBtcAddress();
      expect(backend.getBtcAddress).toHaveBeenCalled();
      expect(result).toBe("BTC_ADDRESS_MOCK");
    });
  });

  describe("donate", () => {
    it("should call backend.donate and return success message", async () => {
      const result = await backendService.donate();
      expect(backend.donate).toHaveBeenCalled();
      expect(result).toBe("Donation received!");
    });
  });

  describe("requestScholarship", () => {
    it("should call backend.requestScholarship and return success message", async () => {
      const result = await backendService.requestScholarship();
      expect(backend.requestScholarship).toHaveBeenCalled();
      expect(result).toBe("Scholarship requested!");
    });
  });
});
