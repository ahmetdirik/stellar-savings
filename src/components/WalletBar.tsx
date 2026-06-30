import { useWallet } from "../context/WalletContext";

export function WalletBar() {
  const { connected, address, balance, loading, connect, disconnect } = useWallet();

  return (
    <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 mb-4">
      <div className="flex flex-col">
        <span className="text-xl font-bold text-[#7C5AE8]">🪙 Stellar Savings</span>
        {connected && balance && (
          <span className="text-sm text-[#9B8EC4]">{parseFloat(balance).toFixed(2)} XLM</span>
        )}
      </div>

      {connected && address ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-[#F0EAFF]">
            {address.slice(0, 4)}...{address.slice(-4)}
          </span>
          <button
            onClick={disconnect}
            className="px-3 py-1.5 text-sm bg-red-900/30 text-red-400 border border-red-800/40 rounded-lg hover:bg-red-900/50 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => void connect()}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-[#7C5AE8] to-[#5B8DEF] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}
