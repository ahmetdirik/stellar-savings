import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { useGoals } from "../hooks/useGoals";
import { WalletBar } from "../components/WalletBar";
import { GoalList } from "../components/GoalList";
import { CreateGoalModal } from "../components/CreateGoalModal";

export function HomePage() {
  const { connected } = useWallet();
  const { goals, createGoal } = useGoals();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F0A1E]">
      <div className="max-w-2xl mx-auto p-4">
        <WalletBar />

        {!connected ? (
          <div className="text-center py-24 text-[#6B5FA8]">
            <p className="text-5xl mb-4">🔐</p>
            <p className="text-lg font-medium">Connect your wallet to get started</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#9B8EC4]">
                My Goals ({goals.length})
              </h2>
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#7C5AE8] to-[#5B8DEF] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                + New Goal
              </button>
            </div>
            <GoalList goals={goals} />
          </>
        )}
      </div>

      {showCreate && (
        <CreateGoalModal
          onSubmit={(data) => {
            createGoal(data);
            setShowCreate(false);
          }}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
