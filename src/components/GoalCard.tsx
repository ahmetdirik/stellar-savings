import type { Goal } from "../types";
import { ProgressBar } from "./ProgressBar";

interface Props {
  goal: Goal;
  onSend: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function GoalCard({ goal, onSend, onDelete }: Props) {
  const percent = (goal.currentAmount / goal.targetAmount) * 100;
  const days = daysUntil(goal.targetDate);
  const completed = goal.currentAmount >= goal.targetAmount;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-800 text-lg">{goal.name}</h3>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-xs text-red-400 hover:text-red-600"
          aria-label="Delete"
        >
          Delete
        </button>
      </div>

      <ProgressBar percent={percent} />

      <div className="flex justify-between text-sm text-gray-600">
        <span>
          <strong>{goal.currentAmount.toFixed(2)}</strong> / {goal.targetAmount.toFixed(2)} XLM
        </span>
        <span>{Math.round(percent)}%</span>
      </div>

      <div className="text-sm">
        {completed ? (
          <span className="font-semibold text-green-600">✓ Completed!</span>
        ) : days < 0 ? (
          <span className="text-red-500 font-medium">{Math.abs(days)} days overdue</span>
        ) : (
          <span className="text-gray-500">{days} days remaining</span>
        )}
      </div>

      {!completed && (
        <button
          onClick={() => onSend(goal)}
          className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Send XLM
        </button>
      )}
    </div>
  );
}
