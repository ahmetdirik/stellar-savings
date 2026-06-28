import { useState } from "react";
import type { Goal, GoalTransaction } from "../types";
import { GoalCard } from "./GoalCard";
import { SendModal } from "./SendModal";

interface Props {
  goals: Goal[];
  onDelete: (id: string) => void;
  onSendSuccess: (goalId: string, tx: GoalTransaction, amount: number) => void;
}

export function GoalList({ goals, onDelete, onSendSuccess }: Props) {
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
            onDelete={onDelete}
          />
        ))}
      </div>

      {sendingGoal && (
        <SendModal
          goal={sendingGoal}
          onSuccess={(goalId, tx, amount) => {
            onSendSuccess(goalId, tx, amount);
            setSendingGoal(null);
          }}
          onClose={() => setSendingGoal(null)}
        />
      )}
    </>
  );
}
