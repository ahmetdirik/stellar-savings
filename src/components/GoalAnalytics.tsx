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
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">At least 2 transactions are needed for analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Weekly average</span>
          <span className="font-semibold text-indigo-700">
            {velocity.toFixed(2)} XLM
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Remaining</span>
          <span className="font-semibold text-gray-800">
            {remaining.toFixed(2)} XLM
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estimated completion</span>
          <span className="font-semibold text-green-700">
            {projection !== null ? `~${projection} days` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
