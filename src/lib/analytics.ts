import type { GoalTransaction } from "../types";

export function calcVelocity(transactions: GoalTransaction[]): number {
  if (transactions.length < 2) return 0;
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const spanMs =
    new Date(sorted.at(-1)!.date).getTime() -
    new Date(sorted[0]!.date).getTime();
  const weeks = spanMs / 604_800_000;
  if (weeks <= 0) return 0;
  const total = sorted.reduce((s, t) => s + t.amount, 0);
  return total / weeks;
}

export function calcProjection(
  remaining: number,
  weeklyVelocity: number
): number | null {
  if (weeklyVelocity <= 0) return null;
  return Math.ceil((remaining / weeklyVelocity) * 7);
}
