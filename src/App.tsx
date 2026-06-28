import { useState } from "react";
import { WalletProvider, useWallet } from "./context/WalletContext";
import { useGoals } from "./hooks/useGoals";
import { WalletBar } from "./components/WalletBar";
import { GoalList } from "./components/GoalList";
import { CreateGoalModal } from "./components/CreateGoalModal";

function AppInner() {
  const { connected } = useWallet();
  const { goals, createGoal, recordTransaction, removeGoal } = useGoals();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <WalletBar />

        {!connected ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🔐</p>
            <p className="text-lg font-medium">Başlamak için cüzdanınızı bağlayın</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Hedeflerim ({goals.length})
              </h2>
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                + Yeni Hedef
              </button>
            </div>

            <GoalList
              goals={goals}
              onDelete={removeGoal}
              onSendSuccess={recordTransaction}
            />
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

export default function App() {
  return (
    <WalletProvider>
      <AppInner />
    </WalletProvider>
  );
}
