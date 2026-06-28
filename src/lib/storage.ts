import type { Goal } from "../types";

const STORAGE_KEY = "stellar-savings-goals";

export function loadGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Goal[]) : [];
  } catch {
    return [];
  }
}

export function saveGoals(goals: Goal[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export function addGoal(goal: Goal): Goal[] {
  const goals = [...loadGoals(), goal];
  saveGoals(goals);
  return goals;
}

export function updateGoal(updated: Goal): Goal[] {
  const goals = loadGoals().map((g) => (g.id === updated.id ? updated : g));
  saveGoals(goals);
  return goals;
}

export function deleteGoal(id: string): Goal[] {
  const goals = loadGoals().filter((g) => g.id !== id);
  saveGoals(goals);
  return goals;
}
