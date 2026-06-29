const THRESHOLDS = [25, 50, 75, 100] as const;

function storageKey(goalId: string): string {
  return `milestone-seen-${goalId}`;
}

export function getUnseenMilestone(
  goalId: string,
  percent: number
): number | null {
  const seen = JSON.parse(
    localStorage.getItem(storageKey(goalId)) ?? "[]"
  ) as number[];
  const hit = THRESHOLDS.filter((t) => percent >= t && !seen.includes(t));
  return hit.length > 0 ? Math.max(...hit) : null;
}

export function markMilestoneSeen(goalId: string, threshold: number): void {
  const seen = JSON.parse(
    localStorage.getItem(storageKey(goalId)) ?? "[]"
  ) as number[];
  localStorage.setItem(storageKey(goalId), JSON.stringify([...seen, threshold]));
}
