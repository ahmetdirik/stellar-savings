import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GoalCard } from "./GoalCard";
import type { Goal } from "../types";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const baseGoal: Goal = {
  id: "g1",
  name: "Yeni Laptop",
  targetAmount: 500,
  currentAmount: 200,
  targetDate: "2030-12-31",
  destinationAddress: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN",
  transactions: [],
  createdAt: "2026-06-28T00:00:00.000Z",
  isPublic: false,
  allowContributions: false,
};

describe("GoalCard", () => {
  it("renders goal name", () => {
    render(<MemoryRouter><GoalCard goal={baseGoal} /></MemoryRouter>);
    expect(screen.getByText("Yeni Laptop")).toBeInTheDocument();
  });

  it("shows current and target amounts", () => {
    render(<MemoryRouter><GoalCard goal={baseGoal} /></MemoryRouter>);
    expect(screen.getByText(/200/)).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it("shows days remaining for future date", () => {
    render(<MemoryRouter><GoalCard goal={baseGoal} /></MemoryRouter>);
    expect(screen.getByText(/days remaining/i)).toBeInTheDocument();
  });

  it("shows Completed when currentAmount >= targetAmount", () => {
    const completed = { ...baseGoal, currentAmount: 500 };
    render(<MemoryRouter><GoalCard goal={completed} /></MemoryRouter>);
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
  });

  it("navigates to /goal/:id when clicked", () => {
    render(<MemoryRouter><GoalCard goal={baseGoal} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/goal/g1");
  });

  it("shows Public badge when isPublic is true", () => {
    const publicGoal = { ...baseGoal, isPublic: true };
    render(<MemoryRouter><GoalCard goal={publicGoal} /></MemoryRouter>);
    expect(screen.getByText("Public")).toBeInTheDocument();
  });
});
