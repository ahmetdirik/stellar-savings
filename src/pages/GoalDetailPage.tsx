import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGoals } from "../hooks/useGoals";
import { useWallet } from "../context/WalletContext";
import { GoalTabs, type GoalTab } from "../components/GoalTabs";
import { TransactionHistory } from "../components/TransactionHistory";
import { GoalAnalytics } from "../components/GoalAnalytics";
import { MilestoneOverlay } from "../components/MilestoneOverlay";
import { PrivacySettings } from "../components/PrivacySettings";
import { ProgressBar } from "../components/ProgressBar";
import { SendModal } from "../components/SendModal";
import { getUnseenMilestone, markMilestoneSeen } from "../lib/milestones";

export function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { goals, recordTransaction, removeGoal, editGoal } = useGoals();
  const { connected } = useWallet();

  const [activeTab, setActiveTab] = useState<GoalTab>("overview");
  const [showSettings, setShowSettings] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [milestone, setMilestone] = useState<number | null>(null);

  const goal = goals.find((g) => g.id === id);

  useEffect(() => {
    if (!goal) return;
    const percent = (goal.currentAmount / goal.targetAmount) * 100;
    const unseen = getUnseenMilestone(goal.id, percent);
    if (unseen !== null) setMilestone(unseen);
  }, [goal]);

  if (!goal) {
    return (
      <div className="min-h-screen bg-[#0F0A1E] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[#9B8EC4]">Goal not found</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gradient-to-r from-[#7C5AE8] to-[#5B8DEF] text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const percent = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const completed = goal.currentAmount >= goal.targetAmount;

  function handleDelete() {
    removeGoal(goal!.id);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#0F0A1E]">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-[#6B5FA8] hover:text-[#9B8EC4] text-sm transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-[#F0EAFF] flex-1">{goal.name}</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Settings"
            className="text-[#6B5FA8] hover:text-[#9B8EC4] transition-colors"
          >
            ⚙
          </button>
        </div>

        {showSettings && (
          <div className="mb-4">
            <PrivacySettings
              goal={goal}
              onUpdate={(updates) => editGoal(goal.id, updates)}
            />
          </div>
        )}

        <GoalTabs active={activeTab} onChange={setActiveTab} />

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-5 space-y-4">
            <ProgressBar percent={percent} />
            <div className="flex justify-between text-sm text-[#9B8EC4]">
              <span>
                {goal.currentAmount.toFixed(2)} / {goal.targetAmount.toFixed(2)} XLM
              </span>
              <span>{Math.round(percent)}%</span>
            </div>

            {connected && !completed && (
              <button
                onClick={() => setShowSend(true)}
                className="w-full py-2 bg-gradient-to-r from-[#7C5AE8] to-[#5B8DEF] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Send XLM
              </button>
            )}

            {completed && (
              <p className="text-center text-green-400 font-semibold">
                Goal Completed!
              </p>
            )}

            <button
              onClick={handleDelete}
              className="w-full py-2 text-sm text-red-400/70 hover:text-red-400 transition-colors"
            >
              Delete Goal
            </button>
          </div>
        )}

        {/* Transactions */}
        {activeTab === "history" && (
          <TransactionHistory transactions={goal.transactions} />
        )}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <GoalAnalytics transactions={goal.transactions} remaining={remaining} />
        )}
      </div>

      {showSend && (
        <SendModal
          goal={goal}
          onSuccess={(goalId, tx, amount) => {
            recordTransaction(goalId, tx, amount);
            setShowSend(false);
          }}
          onClose={() => setShowSend(false)}
        />
      )}

      {milestone !== null && (
        <MilestoneOverlay
          threshold={milestone}
          onClose={() => {
            markMilestoneSeen(goal.id, milestone);
            setMilestone(null);
          }}
        />
      )}
    </div>
  );
}
