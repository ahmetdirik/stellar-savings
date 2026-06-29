import { useEffect } from "react";
import confetti from "canvas-confetti";

interface Props {
  threshold: number;
  onClose: () => void;
}

const MILESTONE_LABELS: Record<number, string> = {
  25: "Quarter way there!",
  50: "Halfway!",
  75: "Almost there!",
  100: "Goal reached!",
};

export function MilestoneOverlay({ threshold, onClose }: Props) {
  useEffect(() => {
    void confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm w-full space-y-4">
        <p className="text-6xl">🎉</p>
        <p className="text-2xl font-bold text-indigo-700">{threshold}%</p>
        <p className="text-gray-600">
          {MILESTONE_LABELS[threshold] ?? "Milestone reached!"}
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
