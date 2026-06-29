import type { Goal } from "../types";

const STORAGE_KEY = "hedef-kumbarasi-goals";

export function loadGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const goals = JSON.parse(raw) as Goal[];
    // Backward compatibility: old records don't have isPublic/allowContributions, fill with false
    return goals.map((g) => ({
      ...g,
      isPublic: g.isPublic ?? false,
      allowContributions: g.allowContributions ?? false,
    }));
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
