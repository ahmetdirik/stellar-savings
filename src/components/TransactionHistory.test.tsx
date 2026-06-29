import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionHistory } from "./TransactionHistory";
import type { GoalTransaction } from "../types";

const txs: GoalTransaction[] = [
  { hash: "abc123def456", amount: 50, date: "2026-06-20T10:00:00.000Z" },
  { hash: "xyz789uvw012", amount: 25, date: "2026-06-25T10:00:00.000Z" },
];

describe("TransactionHistory", () => {
  it("boş liste mesajı gösterir", () => {
    render(<TransactionHistory transactions={[]} />);
    expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
  });

  it("transaction miktarlarını gösterir", () => {
    render(<TransactionHistory transactions={txs} />);
    expect(screen.getByText(/50\.00/)).toBeInTheDocument();
    expect(screen.getByText(/25\.00/)).toBeInTheDocument();
  });

  it("hash'lerin kısaltılmış halini gösterir", () => {
    render(<TransactionHistory transactions={txs} />);
    expect(screen.getByText(/abc1.*f456/)).toBeInTheDocument();
  });

  it("Stellar Expert linklerine sahip anchor elementleri render eder", () => {
    render(<TransactionHistory transactions={txs} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining("stellar.expert/explorer/testnet/tx/")
    );
  });
});
