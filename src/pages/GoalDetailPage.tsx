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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-500">Goal not found</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
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
    removeGoal(goal.id);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-800 flex-1">{goal.name}</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Settings"
            className="text-gray-400 hover:text-gray-600"
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
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            <ProgressBar percent={percent} />
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {goal.currentAmount.toFixed(2)} / {goal.targetAmount.toFixed(2)} XLM
              </span>
              <span>{Math.round(percent)}%</span>
            </div>

            {connected && !completed && (
              <button
                onClick={() => setShowSend(true)}
                className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Send XLM
              </button>
            )}

            {completed && (
              <p className="text-center text-green-600 font-semibold">
                Goal Completed!
              </p>
            )}

            <button
              onClick={handleDelete}
              className="w-full py-2 text-sm text-red-500 hover:text-red-700 transition-colors"
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
