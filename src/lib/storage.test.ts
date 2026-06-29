import { describe, it, expect, beforeEach } from "vitest";
import { loadGoals, addGoal, updateGoal, deleteGoal } from "./storage";
import type { Goal } from "../types";

const mockGoal: Goal = {
  id: "abc-1",
  name: "Laptop",
  targetAmount: 500,
  currentAmount: 0,
  targetDate: "2026-12-31",
  destinationAddress: "GABC123",
  transactions: [],
  createdAt: "2026-06-28T00:00:00.000Z",
  isPublic: false,
  allowContributions: false,
};

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loadGoals returns [] when storage is empty", () => {
    expect(loadGoals()).toEqual([]);
  });

  it("loadGoals returns [] when storage contains invalid JSON", () => {
    localStorage.setItem("hedef-kumbarasi-goals", "not-json");
    expect(loadGoals()).toEqual([]);
  });

  it("addGoal persists goal and returns updated list", () => {
    const result = addGoal(mockGoal);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Laptop");
    expect(loadGoals()).toHaveLength(1);
  });

  it("addGoal appends to existing goals", () => {
    addGoal(mockGoal);
    const second = { ...mockGoal, id: "abc-2", name: "Phone" };
    const result = addGoal(second);
    expect(result).toHaveLength(2);
  });

  it("updateGoal replaces goal with matching id", () => {
    addGoal(mockGoal);
    const updated = { ...mockGoal, currentAmount: 100 };
    const result = updateGoal(updated);
    expect(result[0].currentAmount).toBe(100);
    expect(loadGoals()[0].currentAmount).toBe(100);
  });

  it("deleteGoal removes goal by id", () => {
    addGoal(mockGoal);
    const result = deleteGoal("abc-1");
    expect(result).toHaveLength(0);
    expect(loadGoals()).toHaveLength(0);
  });

  it("loadGoals fills missing isPublic and allowContributions with false", () => {
    const oldGoal = {
      id: "abc-1",
      name: "Laptop",
      targetAmount: 500,
      currentAmount: 0,
      targetDate: "2026-12-31",
      destinationAddress: "GABC123",
      transactions: [],
      createdAt: "2026-06-28T00:00:00.000Z",
      // isPublic and allowContributions missing
    };
    localStorage.setItem("hedef-kumbarasi-goals", JSON.stringify([oldGoal]));
    const goals = loadGoals();
    expect(goals[0].isPublic).toBe(false);
    expect(goals[0].allowContributions).toBe(false);
  });
});
