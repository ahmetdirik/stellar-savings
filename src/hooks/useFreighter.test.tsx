import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("@stellar/freighter-api", () => ({
  isConnected: vi.fn(),
  getAddress: vi.fn(),
  requestAccess: vi.fn(),
  signTransaction: vi.fn(),
  getNetwork: vi.fn(),
}));

vi.mock("../lib/stellar", () => ({
  horizon: {
    loadAccount: vi.fn().mockResolvedValue({
      balances: [{ asset_type: "native", balance: "100.5000000" }],
    }),
  },
  NETWORK_PASSPHRASE: "Test SDF Network ; September 2015",
}));

import * as freighter from "@stellar/freighter-api";
import { useFreighter } from "./useFreighter";

const mockFreighter = freighter as {
  isConnected: ReturnType<typeof vi.fn>;
  getAddress: ReturnType<typeof vi.fn>;
  requestAccess: ReturnType<typeof vi.fn>;
  getNetwork: ReturnType<typeof vi.fn>;
  signTransaction: ReturnType<typeof vi.fn>;
};

describe("useFreighter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFreighter.isConnected.mockResolvedValue({ isConnected: false });
    mockFreighter.getAddress.mockResolvedValue({ address: "" });
  });

  it("starts disconnected", async () => {
    const { result } = renderHook(() => useFreighter());
    expect(result.current.connected).toBe(false);
    expect(result.current.address).toBeNull();
  });

  it("connect sets connected and address", async () => {
    mockFreighter.isConnected.mockResolvedValue({ isConnected: true });
    mockFreighter.requestAccess.mockResolvedValue({
      address: "GABC",
    });
    mockFreighter.getNetwork.mockResolvedValue({ network: "TESTNET" });

    const { result } = renderHook(() => useFreighter());
    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.connected).toBe(true);
    expect(result.current.address).toBe("GABC");
    expect(result.current.balance).toBe("100.5000000");
  });

  it("connect throws if Freighter not installed", async () => {
    mockFreighter.isConnected.mockResolvedValue({
      isConnected: false,
      error: new Error("not installed"),
    });
    const { result } = renderHook(() => useFreighter());
    await expect(
      act(async () => {
        await result.current.connect();
      })
    ).rejects.toThrow("Freighter extension not installed");
  });

  it("disconnect clears state", async () => {
    mockFreighter.isConnected.mockResolvedValue({ isConnected: true });
    mockFreighter.requestAccess.mockResolvedValue({ address: "GABC" });
    mockFreighter.getNetwork.mockResolvedValue({ network: "TESTNET" });

    const { result } = renderHook(() => useFreighter());
    await act(async () => {
      await result.current.connect();
    });
    act(() => {
      result.current.disconnect();
    });

    expect(result.current.connected).toBe(false);
    expect(result.current.address).toBeNull();
    expect(result.current.balance).toBeNull();
  });
});
