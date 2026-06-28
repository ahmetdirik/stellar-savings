import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSubmitTransaction, mockLoadAccount } = vi.hoisted(() => ({
  mockSubmitTransaction: vi.fn(),
  mockLoadAccount: vi.fn(),
}));

vi.mock("../lib/stellar", () => ({
  horizon: {
    loadAccount: mockLoadAccount,
    submitTransaction: mockSubmitTransaction,
  },
  NETWORK_PASSPHRASE: "Test SDF Network ; September 2015",
}));

import { buildPaymentTx, submitTransaction } from "./transactions";

const VALID_SOURCE = "GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD";
const VALID_DEST = "GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA";

function mockAccount() {
  return {
    id: VALID_SOURCE,
    sequence: "1000",
    accountId: () => VALID_SOURCE,
    sequenceNumber: () => "1000",
    incrementSequenceNumber: vi.fn(),
  };
}

describe("buildPaymentTx", () => {
  beforeEach(() => {
    mockLoadAccount.mockResolvedValue(mockAccount());
  });

  it("returns an XDR string", async () => {
    const xdr = await buildPaymentTx(VALID_SOURCE, VALID_DEST, "10");
    expect(typeof xdr).toBe("string");
    expect(xdr.length).toBeGreaterThan(0);
  });

  it("throws if loadAccount rejects", async () => {
    mockLoadAccount.mockRejectedValueOnce(new Error("account not found"));
    await expect(buildPaymentTx(VALID_SOURCE, VALID_DEST, "10")).rejects.toThrow(
      "account not found"
    );
  });
});

describe("submitTransaction", () => {
  it("returns hash on success", async () => {
    mockSubmitTransaction.mockResolvedValueOnce({ hash: "abc123" });
    mockLoadAccount.mockResolvedValue(mockAccount());
    const xdr = await buildPaymentTx(VALID_SOURCE, VALID_DEST, "5");
    const result = await submitTransaction(xdr);
    expect(result.hash).toBe("abc123");
  });

  it("throws on submission error", async () => {
    mockLoadAccount.mockResolvedValue(mockAccount());
    const xdr = await buildPaymentTx(VALID_SOURCE, VALID_DEST, "5");
    mockSubmitTransaction.mockRejectedValueOnce(new Error("tx_bad_seq"));
    await expect(submitTransaction(xdr)).rejects.toThrow("tx_bad_seq");
  });
});
