import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("../context/WalletContext", () => ({
  useWallet: vi.fn(),
}));

import * as WalletCtx from "../context/WalletContext";
import { WalletBar } from "./WalletBar";

const mockUseWallet = WalletCtx.useWallet as ReturnType<typeof vi.fn>;

describe("WalletBar", () => {
  it("shows connect button when disconnected", () => {
    mockUseWallet.mockReturnValue({
      connected: false,
      address: null,
      balance: null,
      loading: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });
    render(<WalletBar />);
    expect(screen.getByRole("button", { name: /connect wallet/i })).toBeInTheDocument();
  });

  it("calls connect when connect button clicked", () => {
    const connect = vi.fn();
    mockUseWallet.mockReturnValue({
      connected: false,
      address: null,
      balance: null,
      loading: false,
      connect,
      disconnect: vi.fn(),
    });
    render(<WalletBar />);
    fireEvent.click(screen.getByRole("button", { name: /connect wallet/i }));
    expect(connect).toHaveBeenCalledOnce();
  });

  it("shows truncated address and balance when connected", () => {
    mockUseWallet.mockReturnValue({
      connected: true,
      address: "GABC1234DEFG5678",
      balance: "42.5000000",
      loading: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });
    render(<WalletBar />);
    expect(screen.getByText(/GABC.*5678/)).toBeInTheDocument();
    expect(screen.getByText(/42\.5/)).toBeInTheDocument();
  });

  it("calls disconnect when disconnect button clicked", () => {
    const disconnect = vi.fn();
    mockUseWallet.mockReturnValue({
      connected: true,
      address: "GABC1234",
      balance: "10.0000000",
      loading: false,
      connect: vi.fn(),
      disconnect,
    });
    render(<WalletBar />);
    fireEvent.click(screen.getByRole("button", { name: /disconnect/i }));
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
