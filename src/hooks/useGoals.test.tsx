import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("../lib/storage", () => ({
  loadGoals: vi.fn(() => []),
  addGoal: vi.fn((goal) => [goal]),
  updateGoal: vi.fn((goal) => [goal]),
  deleteGoal: vi.fn(() => []),
}));

import * as storage from "../lib/storage";
import { useGoals } from "./useGoals";

const mockStorage = storage as {
  loadGoals: ReturnType<typeof vi.fn>;
  addGoal: ReturnType<typeof vi.fn>;
  updateGoal: ReturnType<typeof vi.fn>;
  deleteGoal: ReturnType<typeof vi.fn>;
};

describe("useGoals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.loadGoals.mockReturnValue([]);
    mockStorage.addGoal.mockImplementation((goal) => [goal]);
    mockStorage.updateGoal.mockImplementation((goal) => [goal]);
    mockStorage.deleteGoal.mockReturnValue([]);
  });

  it("starts with goals from storage", () => {
    const stored = [
      {
        id: "1",
        name: "Laptop",
        targetAmount: 500,
        currentAmount: 0,
        targetDate: "2026-12-31",
        destinationAddress: "GABC",
        transactions: [],
        createdAt: "2026-06-28T00:00:00.000Z",
      },
    ];
    mockStorage.loadGoals.mockReturnValue(stored);
    const { result } = renderHook(() => useGoals());
    expect(result.current.goals).toHaveLength(1);
    expect(result.current.goals[0].name).toBe("Laptop");
  });

  it("createGoal adds a new goal with generated id and defaults", () => {
    const { result } = renderHook(() => useGoals());
    act(() => {
      result.current.createGoal({
        name: "Phone",
        targetAmount: 200,
        targetDate: "2026-10-01",
        destinationAddress: "GXYZ",
      });
    });
    expect(mockStorage.addGoal).toHaveBeenCalledOnce();
    const addedGoal = mockStorage.addGoal.mock.calls[0][0];
    expect(addedGoal.name).toBe("Phone");
    expect(addedGoal.currentAmount).toBe(0);
    expect(addedGoal.transactions).toEqual([]);
    expect(typeof addedGoal.id).toBe("string");
  });

  it("recordTransaction updates currentAmount and appends tx", () => {
    const goal = {
      id: "abc",
      name: "Laptop",
      targetAmount: 500,
      currentAmount: 100,
      targetDate: "2026-12-31",
      destinationAddress: "GABC",
      transactions: [],
      createdAt: "2026-06-28T00:00:00.000Z",
    };
    mockStorage.loadGoals.mockReturnValue([goal]);
    mockStorage.updateGoal.mockImplementation((g) => [g]);

    const { result } = renderHook(() => useGoals());
    act(() => {
      result.current.recordTransaction(
        "abc",
        { hash: "tx1", amount: 50, date: "2026-06-28T00:00:00.000Z" },
        50
      );
    });

    const updatedGoal = mockStorage.updateGoal.mock.calls[0][0];
    expect(updatedGoal.currentAmount).toBe(150);
    expect(updatedGoal.transactions).toHaveLength(1);
  });

  it("removeGoal calls deleteGoal and updates state", () => {
    const { result } = renderHook(() => useGoals());
    act(() => {
      result.current.removeGoal("abc");
    });
    expect(mockStorage.deleteGoal).toHaveBeenCalledWith("abc");
  });
});
