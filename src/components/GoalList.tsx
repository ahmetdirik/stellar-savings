import type { Goal } from "../types";
import { GoalCard } from "./GoalCard";

interface Props {
  goals: Goal[];
}

export function GoalList({ goals }: Props) {
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
    <div className="grid gap-4 sm:grid-cols-2">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
