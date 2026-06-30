import { useState, type FormEvent } from "react";
import type { Goal, GoalTransaction } from "../types";
import { useWallet } from "../context/WalletContext";
import { buildPaymentTx, submitTransaction } from "../lib/transactions";

type SendStatus = "idle" | "building" | "signing" | "submitting" | "success" | "error";

interface Props {
  goal: Goal;
  onSuccess: (goalId: string, tx: GoalTransaction, amount: number) => void;
  onClose: () => void;
}

export function SendModal({ goal, onSuccess, onClose }: Props) {
  const { address, sign, refreshBalance } = useWallet();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");
  const [hash, setHash] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!address || !amount) return;

    try {
      setStatus("building");
      const xdr = await buildPaymentTx(
        address,
        goal.destinationAddress,
        amount,
        goal.name
      );

      setStatus("signing");
      const signedXdr = await sign(xdr);

      setStatus("submitting");
      const result = await submitTransaction(signedXdr);

      const tx: GoalTransaction = {
        hash: result.hash,
        amount: parseFloat(amount),
        date: new Date().toISOString(),
      };

      setHash(result.hash);
      setStatus("success");
      onSuccess(goal.id, tx, parseFloat(amount));
      void refreshBalance();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  const statusLabel: Record<SendStatus, string> = {
    idle: "Send",
    building: "Building transaction...",
    signing: "Signing in wallet...",
    submitting: "Submitting...",
    success: "Sent!",
    error: "Retry",
  };

  const inputClass =
    "w-full bg-white/5 border border-white/[0.08] text-[#F0EAFF] placeholder:text-[#6B5FA8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5AE8] focus:border-[#7C5AE8] disabled:opacity-50 transition-colors";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-[#1A1035]/90 border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#F0EAFF]">{goal.name}</h2>
          <button onClick={onClose} className="text-[#6B5FA8] hover:text-[#9B8EC4] text-lg transition-colors">
            ✕
          </button>
        </div>

        <p className="text-sm text-[#9B8EC4]">
          {goal.currentAmount.toFixed(2)} / {goal.targetAmount.toFixed(2)} XLM saved
        </p>

        {status === "success" ? (
          <div className="space-y-3">
            <div className="bg-green-900/20 border border-green-800/40 rounded-lg p-4 text-center">
              <p className="text-green-400 font-semibold">✓ Transaction Successful!</p>
              <p className="text-xs text-[#6B5FA8] mt-2 font-mono break-all">{hash}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 bg-gradient-to-r from-[#7C5AE8] to-[#5B8DEF] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSend(e)} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="sendAmount" className="text-sm font-medium text-[#9B8EC4]">
                Amount (XLM)
              </label>
              <input
                id="sendAmount"
                type="number"
                min="0.0000001"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10"
                disabled={status !== "idle" && status !== "error"}
                className={inputClass}
                required
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg p-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status !== "idle" && status !== "error"}
              className="w-full py-2 bg-gradient-to-r from-[#7C5AE8] to-[#5B8DEF] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {statusLabel[status]}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
