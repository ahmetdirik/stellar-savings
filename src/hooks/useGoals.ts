import { useState, useCallback } from "react";
import type { Goal, GoalTransaction } from "../types";
import { loadGoals, addGoal, updateGoal, deleteGoal } from "../lib/storage";

type CreateGoalData = Omit<Goal, "id" | "currentAmount" | "transactions" | "createdAt" | "isPublic" | "allowContributions">;

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals());

  const createGoal = useCallback((data: CreateGoalData) => {
    const goal: Goal = {
      ...data,
      id: crypto.randomUUID(),
      currentAmount: 0,
      transactions: [],
      createdAt: new Date().toISOString(),
      isPublic: false,
      allowContributions: false,
    };
    setGoals(addGoal(goal));
  }, []);

  const recordTransaction = useCallback(
    (goalId: string, tx: GoalTransaction, amount: number) => {
      setGoals((prev) => {
        const goal = prev.find((g) => g.id === goalId);
        if (!goal) return prev;
        const updated: Goal = {
          ...goal,
          currentAmount: goal.currentAmount + amount,
          transactions: [...goal.transactions, tx],
        };
        return updateGoal(updated);
      });
    },
    []
  );

  const removeGoal = useCallback((id: string) => {
    setGoals(deleteGoal(id));
  }, []);

  const editGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) => {
      const goal = prev.find((g) => g.id === id);
      if (!goal) return prev;
      return updateGoal({ ...goal, ...updates });
    });
  }, []);

  return { goals, createGoal, recordTransaction, removeGoal, editGoal };
}
