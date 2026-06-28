import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("../context/WalletContext", () => ({
  useWallet: vi.fn(),
}));
vi.mock("../lib/transactions", () => ({
  buildPaymentTx: vi.fn(),
  submitTransaction: vi.fn(),
}));

import * as WalletCtx from "../context/WalletContext";
import * as txLib from "../lib/transactions";
import { SendModal } from "./SendModal";
import type { Goal } from "../types";

const mockUseWallet = WalletCtx.useWallet as ReturnType<typeof vi.fn>;
const mockBuild = txLib.buildPaymentTx as ReturnType<typeof vi.fn>;
const mockSubmit = txLib.submitTransaction as ReturnType<typeof vi.fn>;

const mockGoal: Goal = {
  id: "g1",
  name: "Laptop",
  targetAmount: 500,
  currentAmount: 0,
  targetDate: "2030-12-31",
  destinationAddress: "GDEST",
  transactions: [],
  createdAt: "2026-06-28T00:00:00.000Z",
};

describe("SendModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWallet.mockReturnValue({
      address: "GSOURCE",
      sign: vi.fn().mockResolvedValue("signed-xdr"),
      refreshBalance: vi.fn(),
    });
    mockBuild.mockResolvedValue("unsigned-xdr");
    mockSubmit.mockResolvedValue({ hash: "tx-hash-abc" });
  });

  it("renders goal name and amount input", () => {
    render(<SendModal goal={mockGoal} onSuccess={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByLabelText(/miktar/i)).toBeInTheDocument();
  });

  it("shows success state with hash after sending", async () => {
    render(<SendModal goal={mockGoal} onSuccess={vi.fn()} onClose={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/miktar/i), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByRole("button", { name: /gönder/i }));
    await waitFor(() => {
      expect(screen.getByText(/tx-hash-abc/)).toBeInTheDocument();
    });
  });

  it("calls onSuccess with correct args after sending", async () => {
    const onSuccess = vi.fn();
    render(<SendModal goal={mockGoal} onSuccess={onSuccess} onClose={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/miktar/i), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByRole("button", { name: /gönder/i }));
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        "g1",
        expect.objectContaining({ hash: "tx-hash-abc", amount: 50 }),
        50
      );
    });
  });

  it("shows error message on transaction failure", async () => {
    mockSubmit.mockRejectedValueOnce(new Error("tx_insufficient_balance"));
    render(<SendModal goal={mockGoal} onSuccess={vi.fn()} onClose={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/miktar/i), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByRole("button", { name: /gönder/i }));
    await waitFor(() => {
      expect(screen.getByText(/tx_insufficient_balance/)).toBeInTheDocument();
    });
  });
});
