import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../hooks/useGoals", () => ({ useGoals: vi.fn() }));
vi.mock("../context/WalletContext", () => ({ useWallet: vi.fn() }));
vi.mock("../lib/milestones", () => ({
  getUnseenMilestone: vi.fn(() => null),
  markMilestoneSeen: vi.fn(),
}));

import * as useGoalsMod from "../hooks/useGoals";
import * as walletCtx from "../context/WalletContext";
import { GoalDetailPage } from "./GoalDetailPage";
import type { Goal } from "../types";

const mockUseGoals = useGoalsMod.useGoals as ReturnType<typeof vi.fn>;
const mockUseWallet = walletCtx.useWallet as ReturnType<typeof vi.fn>;

const goal: Goal = {
  id: "g1",
  name: "Laptop",
  targetAmount: 500,
  currentAmount: 200,
  targetDate: "2030-12-31",
  destinationAddress: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN",
  transactions: [],
  createdAt: "2026-06-28T00:00:00.000Z",
  isPublic: false,
  allowContributions: false,
};

function renderDetail(id = "g1") {
  return render(
    <MemoryRouter initialEntries={[`/goal/${id}`]}>
      <Routes>
        <Route path="/goal/:id" element={<GoalDetailPage />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("GoalDetailPage", () => {
  beforeEach(() => {
    mockUseWallet.mockReturnValue({ connected: true, address: "GSRC", sign: vi.fn(), refreshBalance: vi.fn() });
    mockUseGoals.mockReturnValue({
      goals: [goal],
      recordTransaction: vi.fn(),
      removeGoal: vi.fn(),
      editGoal: vi.fn(),
    });
  });

  it("goal adını gösterir", () => {
    renderDetail();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
  });

  it("Overview sekmesi varsayılan olarak aktif", () => {
    renderDetail();
    expect(screen.getByText(/200.*500/)).toBeInTheDocument();
  });

  it("Transactions sekmesine geçince TransactionHistory render olur", () => {
    renderDetail();
    fireEvent.click(screen.getByRole("button", { name: /transactions/i }));
    expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
  });

  it("Analytics sekmesine geçince GoalAnalytics render olur", () => {
    renderDetail();
    fireEvent.click(screen.getByRole("button", { name: /analytics/i }));
    expect(screen.getByText(/at least 2 transactions/i)).toBeInTheDocument();
  });

  it("goal bulunamazsa 'Goal not found' gösterir", () => {
    renderDetail("nonexistent");
    expect(screen.getByText(/goal not found/i)).toBeInTheDocument();
  });

  it("Settings butonuna tıklayınca PrivacySettings görünür", () => {
    renderDetail();
    fireEvent.click(screen.getByRole("button", { name: /settings/i }));
    expect(screen.getByText(/privacy settings/i)).toBeInTheDocument();
  });
});
