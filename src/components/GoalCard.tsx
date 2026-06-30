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
      className="w-full text-left backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-5 space-y-4 hover:bg-white/[0.08] transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-[#F0EAFF] text-lg">{goal.name}</h3>
        {goal.isPublic && (
          <span className="text-xs text-violet-300 bg-violet-900/40 border border-violet-700/40 px-2 py-0.5 rounded-full">
            Public
          </span>
        )}
      </div>

      <ProgressBar percent={percent} />

      <div className="flex justify-between text-sm text-[#9B8EC4]">
        <span>
          <strong className="text-[#F0EAFF]">{goal.currentAmount.toFixed(2)}</strong> /{" "}
          {goal.targetAmount.toFixed(2)} XLM
        </span>
        <span>{Math.round(percent)}%</span>
      </div>

      <div className="text-sm">
        {completed ? (
          <span className="font-semibold text-green-400">Completed!</span>
        ) : days < 0 ? (
          <span className="text-red-400 font-medium">
            {Math.abs(days)} days overdue
          </span>
        ) : (
          <span className="text-[#6B5FA8]">{days} days remaining</span>
        )}
      </div>
    </button>
  );
}
