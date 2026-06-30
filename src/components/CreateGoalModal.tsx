import { useState, type FormEvent } from "react";

interface CreateGoalData {
  name: string;
  targetAmount: number;
  targetDate: string;
  destinationAddress: string;
}

interface Props {
  onSubmit: (data: CreateGoalData) => void;
  onClose: () => void;
}

export function CreateGoalModal({ onSubmit, onClose }: Props) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !targetAmount || !targetDate || !destinationAddress) return;
    onSubmit({
      name,
      targetAmount: parseFloat(targetAmount),
      targetDate,
      destinationAddress,
    });
  }

  const inputClass =
    "w-full bg-white/5 border border-white/[0.08] text-[#F0EAFF] placeholder:text-[#6B5FA8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5AE8] focus:border-[#7C5AE8] transition-colors";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-[#1A1035]/90 border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-[#F0EAFF]">Create New Goal</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-[#9B8EC4]">
              Goal Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New Laptop"
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="targetAmount" className="text-sm font-medium text-[#9B8EC4]">
              Target Amount (XLM)
            </label>
            <input
              id="targetAmount"
              type="number"
              min="0.0000001"
              step="any"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="500"
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="targetDate" className="text-sm font-medium text-[#9B8EC4]">
              Target Date
            </label>
            <input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="destinationAddress" className="text-sm font-medium text-[#9B8EC4]">
              Stellar Address (Savings Wallet)
            </label>
            <input
              id="destinationAddress"
              type="text"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder="G..."
              className={`${inputClass} font-mono`}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-white/10 text-[#9B8EC4] rounded-lg text-sm hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-[#7C5AE8] to-[#5B8DEF] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
