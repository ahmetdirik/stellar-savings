import { useState } from "react";
import type { Goal } from "../types";
import { GoalCard } from "./GoalCard";
import { SendModal } from "./SendModal";
import { useGoals } from "../hooks/useGoals";

interface Props {
  goals: Goal[];
}

export function GoalList({ goals }: Props) {
  const { removeGoal, recordTransaction } = useGoals();
  const [sendingGoal, setSendingGoal] = useState<Goal | null>(null);

  if (goals.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🪙</p>
        <p className="text-lg font-medium">No goals yet</p>
        <p className="text-sm">Create your first goal</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onSend={setSendingGoal}
            onDelete={removeGoal}
          />
        ))}
      </div>

      {sendingGoal && (
        <SendModal
          goal={sendingGoal}
          onSuccess={(goalId, tx, amount) => {
            recordTransaction(goalId, tx, amount);
          }}
          onClose={() => setSendingGoal(null)}
        />
      )}
    </>
  );
}
