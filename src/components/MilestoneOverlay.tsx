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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-8 text-center max-w-sm w-full space-y-4">
        <p className="text-6xl">🎉</p>
        <p
          className="text-4xl font-bold text-[#7C5AE8]"
          style={{ textShadow: "0 0 32px rgba(124,90,232,0.5)" }}
        >
          {threshold}%
        </p>
        <p className="text-[#9B8EC4]">
          {MILESTONE_LABELS[threshold] ?? "Milestone reached!"}
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 bg-gradient-to-r from-[#7C5AE8] to-[#5B8DEF] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
