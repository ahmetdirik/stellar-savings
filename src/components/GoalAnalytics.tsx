import { calcVelocity, calcProjection } from "../lib/analytics";
import type { GoalTransaction } from "../types";

interface Props {
  transactions: GoalTransaction[];
  remaining: number;
}

export function GoalAnalytics({ transactions, remaining }: Props) {
  const velocity = calcVelocity(transactions);
  const projection = calcProjection(remaining, velocity);

  if (transactions.length < 2) {
    return (
      <div className="text-center py-8 text-[#6B5FA8]">
        <p className="text-sm">At least 2 transactions are needed for analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/[0.08] rounded-xl p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#9B8EC4]">Weekly average</span>
          <span className="font-semibold text-[#7C5AE8]">
            {velocity.toFixed(2)} XLM
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#9B8EC4]">Remaining</span>
          <span className="font-semibold text-[#F0EAFF]">
            {remaining.toFixed(2)} XLM
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#9B8EC4]">Estimated completion</span>
          <span className="font-semibold text-green-400">
            {projection !== null ? `~${projection} days` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
