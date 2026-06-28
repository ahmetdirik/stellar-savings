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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Create New Goal</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Goal Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New Laptop"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="targetAmount" className="text-sm font-medium text-gray-700">
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="targetDate" className="text-sm font-medium text-gray-700">
              Target Date
            </label>
            <input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="destinationAddress" className="text-sm font-medium text-gray-700">
              Stellar Address (Savings Wallet)
            </label>
            <input
              id="destinationAddress"
              type="text"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder="G..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
