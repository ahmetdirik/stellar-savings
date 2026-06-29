import { useNavigate } from "react-router-dom";
import type { Goal } from "../types";
import { ProgressBar } from "./ProgressBar";

interface Props {
  goal: Goal;
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function GoalCard({ goal }: Props) {
  const navigate = useNavigate();
  const percent = (goal.currentAmount / goal.targetAmount) * 100;
  const days = daysUntil(goal.targetDate);
  const completed = goal.currentAmount >= goal.targetAmount;

  return (
    <button
      onClick={() => navigate(`/goal/${goal.id}`)}
      className="w-full text-left bg-white rounded-2xl shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-800 text-lg">{goal.name}</h3>
        {goal.isPublic && (
          <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
            Public
          </span>
        )}
      </div>

      <ProgressBar percent={percent} />

      <div className="flex justify-between text-sm text-gray-600">
        <span>
          <strong>{goal.currentAmount.toFixed(2)}</strong> /{" "}
          {goal.targetAmount.toFixed(2)} XLM
        </span>
        <span>{Math.round(percent)}%</span>
      </div>

      <div className="text-sm">
        {completed ? (
          <span className="font-semibold text-green-600">Completed!</span>
        ) : days < 0 ? (
          <span className="text-red-500 font-medium">
            {Math.abs(days)} days overdue
          </span>
        ) : (
          <span className="text-gray-500">{days} days remaining</span>
        )}
      </div>
    </button>
  );
}
