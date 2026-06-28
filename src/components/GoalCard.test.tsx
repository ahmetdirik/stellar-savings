import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GoalCard } from "./GoalCard";
import type { Goal } from "../types";

const baseGoal: Goal = {
  id: "g1",
  name: "Yeni Laptop",
  targetAmount: 500,
  currentAmount: 200,
  targetDate: "2030-12-31",
  destinationAddress: "GABC",
  transactions: [],
  createdAt: "2026-06-28T00:00:00.000Z",
};

describe("GoalCard", () => {
  it("renders goal name", () => {
    render(<GoalCard goal={baseGoal} onSend={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Yeni Laptop")).toBeInTheDocument();
  });

  it("shows current and target amounts", () => {
    render(<GoalCard goal={baseGoal} onSend={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/200/)).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it("shows days remaining for future date", () => {
    render(<GoalCard goal={baseGoal} onSend={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/gün kaldı/i)).toBeInTheDocument();
  });

  it("shows TAMAMLANDI when currentAmount >= targetAmount", () => {
    const completed = { ...baseGoal, currentAmount: 500 };
    render(<GoalCard goal={completed} onSend={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/tamamlandı/i)).toBeInTheDocument();
  });

  it("calls onSend with goal when Send button clicked", () => {
    const onSend = vi.fn();
    render(<GoalCard goal={baseGoal} onSend={onSend} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /xlm gönder/i }));
    expect(onSend).toHaveBeenCalledWith(baseGoal);
  });

  it("calls onDelete with id when delete button clicked", () => {
    const onDelete = vi.fn();
    render(<GoalCard goal={baseGoal} onSend={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: /sil/i }));
    expect(onDelete).toHaveBeenCalledWith("g1");
  });
});
