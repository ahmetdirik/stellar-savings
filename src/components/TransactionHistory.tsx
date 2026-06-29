import type { GoalTransaction } from "../types";

interface Props {
  transactions: GoalTransaction[];
}

export function TransactionHistory({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">No transactions yet</p>
      </div>
    );
  }

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-2">
      {sorted.map((tx) => (
        <div
          key={tx.hash}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-gray-800">
              +{tx.amount.toFixed(2)} XLM
            </span>
            <span className="text-xs text-gray-400">
              {new Date(tx.date).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-indigo-500 hover:text-indigo-700"
          >
            {tx.hash.slice(0, 4)}…{tx.hash.slice(-4)} ↗
          </a>
        </div>
      ))}
    </div>
  );
}
