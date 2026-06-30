import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as StellarSdk from "@stellar/stellar-sdk";
import { decodeGoalUrl, type PublicGoalSnapshot } from "../lib/goalUrl";
import { horizon } from "../lib/stellar";
import { buildPaymentTx, submitTransaction } from "../lib/transactions";
import { useWallet } from "../context/WalletContext";
import { ProgressBar } from "../components/ProgressBar";

type SendStatus = "idle" | "building" | "signing" | "submitting" | "success" | "error";

export function PublicGoalPage() {
  const [searchParams] = useSearchParams();
  const { connected, address, connect, sign, refreshBalance } = useWallet();

  const [snapshot, setSnapshot] = useState<PublicGoalSnapshot | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [currentAmount, setCurrentAmount] = useState<number | null>(null);
  const [showContribute, setShowContribute] = useState(false);
  const [amount, setAmount] = useState("");
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const [txHash, setTxHash] = useState("");
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    const raw = searchParams.get("d");
    if (!raw) {
      setDecodeError("INVALID_PAYLOAD");
      return;
    }
    try {
      setSnapshot(decodeGoalUrl(raw));
    } catch (err) {
      setDecodeError(err instanceof Error ? err.message : "INVALID_PAYLOAD");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!snapshot) return;
    horizon
      .loadAccount(snapshot.destinationAddress)
      .then((account) => {
        const native = account.balances.find(
          (b: { asset_type: string }) => b.asset_type === "native"
        );
        setCurrentAmount(native ? parseFloat(native.balance) : 0);
      })
      .catch(() => setCurrentAmount(0));
  }, [snapshot]);

  if (decodeError) {
    return (
      <div className="min-h-screen bg-[#0F0A1E] flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <p className="text-xl">⚠️</p>
          <p className="font-semibold text-[#F0EAFF]">Invalid or broken link</p>
          <p className="text-sm text-[#6B5FA8]">This goal link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  if (!snapshot) return null;

  const percent =
    currentAmount !== null ? (currentAmount / snapshot.targetAmount) * 100 : 0;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!snapshot) return;

    const parsed = parseFloat(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setSendError("Invalid amount");
      setSendStatus("error");
      return;
    }
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(snapshot.destinationAddress)) {
      setSendError("Invalid destination address");
      setSendStatus("error");
      return;
    }

    const sourceAddress = address;
    if (!sourceAddress) {
      setSendError("Wallet not connected");
      setSendStatus("error");
      return;
    }

    try {
      setSendStatus("building");
      const xdr = await buildPaymentTx(
        sourceAddress,
        snapshot.destinationAddress,
        amount,
        snapshot.name
      );
      setSendStatus("signing");
      const signed = await sign(xdr);
      setSendStatus("submitting");
      const result = await submitTransaction(signed);
      setTxHash(result.hash);
      setSendStatus("success");
      void refreshBalance();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Unknown error");
      setSendStatus("error");
    }
  }

  const statusLabel: Record<SendStatus, string> = {
    idle: "Send",
    building: "Building...",
    signing: "Signing...",
    submitting: "Submitting...",
    success: "Sent!",
    error: "Retry",
  };

  const inputClass =
    "w-full bg-white/5 border border-white/[0.08] text-[#F0EAFF] placeholder:text-[#6B5FA8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5AE8] focus:border-[#7C5AE8] disabled:opacity-50 transition-colors";

  return (
    <div className="min-h-screen bg-[#0F0A1E] flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 w-full max-w-md space-y-4">
        <div className="text-center space-y-1">
          <p className="text-xs text-[#6B5FA8] uppercase tracking-wide">Savings Goal</p>
          <h1 className="text-2xl font-bold text-[#F0EAFF]">{snapshot.name}</h1>
        </div>

        <ProgressBar percent={percent} />

        <div className="flex justify-between text-sm text-[#9B8EC4]">
          <span>
            <strong className="text-[#F0EAFF]">
              {currentAmount !== null ? currentAmount.toFixed(2) : "—"}
            </strong>{" "}
            / {snapshot.targetAmount.toFixed(2)} XLM
          </span>
          <span>{Math.round(percent)}%</span>
        </div>

        <p className="text-sm text-center text-[#6B5FA8]">
          Target: {new Date(snapshot.targetDate).toLocaleDateString("en-GB", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </p>

        {snapshot.allowContributions && !showContribute && (
          <button
            onClick={() => setShowContribute(true)}
            aria-label="Contribute"
            className="w-full py-2 bg-gradient-to-r from-[#7C5AE8] to-[#5B8DEF] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Contribute
          </button>
        )}

        {snapshot.allowContributions && showContribute && (
          <>
            {!connected && (
              <button
                onClick={() => void connect()}
                className="w-full py-2 bg-white/5 border border-white/10 text-[#9B8EC4] text-sm rounded-lg hover:bg-white/10 transition-colors"
              >
                Connect Wallet
              </button>
            )}

            {connected && sendStatus !== "success" && (
              <form onSubmit={(e) => void handleSend(e)} className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="contribAmount" className="text-sm font-medium text-[#9B8EC4]">
                    Amount (XLM)
                  </label>
                  <input
                    id="contribAmount"
                    type="number"
                    min="0.0000001"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="10"
                    aria-label="Amount"
                    disabled={sendStatus !== "idle" && sendStatus !== "error"}
                    className={inputClass}
                    required
                  />
                </div>
                {sendStatus === "error" && (
                  <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg p-2">
                    {sendError}
                  </p>
                )}
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={sendStatus !== "idle" && sendStatus !== "error"}
                  className="w-full py-2 bg-gradient-to-r from-[#7C5AE8] to-[#5B8DEF] text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {statusLabel[sendStatus]}
                </button>
              </form>
            )}

            {sendStatus === "success" && (
              <div className="bg-green-900/20 border border-green-800/40 rounded-lg p-4 text-center space-y-1">
                <p className="text-green-400 font-semibold">Contribution sent!</p>
                <p className="text-xs font-mono text-[#6B5FA8] break-all">{txHash}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
