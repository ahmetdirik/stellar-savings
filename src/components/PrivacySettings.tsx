import { useState } from "react";
import type { Goal } from "../types";
import { encodeGoalUrl } from "../lib/goalUrl";

interface Props {
  goal: Goal;
  onUpdate: (updates: Pick<Goal, "isPublic" | "allowContributions">) => void;
}

export function PrivacySettings({ goal, onUpdate }: Props) {
  const [copied, setCopied] = useState(false);

  function handlePublicToggle() {
    if (goal.isPublic) {
      onUpdate({ isPublic: false, allowContributions: false });
    } else {
      onUpdate({ isPublic: true, allowContributions: false });
    }
  }

  function handleContributionsToggle() {
    onUpdate({ isPublic: true, allowContributions: !goal.allowContributions });
  }

  async function handleCopyLink() {
    const encoded = encodeGoalUrl({
      name: goal.name,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate,
      destinationAddress: goal.destinationAddress,
      allowContributions: goal.allowContributions,
    });
    const url = `${window.location.origin}/goal/${goal.id}/public?d=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4 p-4 backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-xl">
      <h3 className="text-sm font-semibold text-[#F0EAFF]">Privacy Settings</h3>

      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm text-[#9B8EC4]">Make public</span>
        <input
          type="checkbox"
          checked={goal.isPublic}
          onChange={handlePublicToggle}
          aria-label="Make public"
          className="w-4 h-4 accent-[#7C5AE8]"
        />
      </label>

      {goal.isPublic && (
        <>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-[#9B8EC4]">Allow contributions</span>
            <input
              type="checkbox"
              checked={goal.allowContributions}
              onChange={handleContributionsToggle}
              aria-label="Allow contributions"
              className="w-4 h-4 accent-[#7C5AE8]"
            />
          </label>

          <button
            onClick={() => void handleCopyLink()}
            className="w-full py-2 text-sm bg-gradient-to-r from-[#7C5AE8] to-[#5B8DEF] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </>
      )}
    </div>
  );
}
