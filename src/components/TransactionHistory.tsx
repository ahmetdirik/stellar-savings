import type { GoalTransaction } from "../types";

interface Props {
  transactions: GoalTransaction[];
}

export function TransactionHistory({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-[#6B5FA8]">
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
          className="flex items-center justify-between p-3 bg-white/5 border border-white/[0.06] rounded-xl"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-green-400">
              +{tx.amount.toFixed(2)} XLM
            </span>
            <span className="text-xs text-[#6B5FA8]">
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
            className="text-xs font-mono text-[#7C5AE8] hover:text-[#9B8EC4] transition-colors"
          >
            {tx.hash.slice(0, 4)}…{tx.hash.slice(-4)} ↗
          </a>
        </div>
      ))}
    </div>
  );
}
