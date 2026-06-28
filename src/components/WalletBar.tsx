import { useWallet } from "../context/WalletContext";

export function WalletBar() {
  const { connected, address, balance, loading, connect, disconnect } = useWallet();

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-xl mb-6">
      <div className="flex flex-col">
        <span className="text-xl font-bold text-indigo-600">🪙 Stellar Savings</span>
        {connected && balance && (
          <span className="text-sm text-gray-500">{parseFloat(balance).toFixed(2)} XLM</span>
        )}
      </div>

      {connected && address ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-gray-600">
            {address.slice(0, 4)}...{address.slice(-4)}
          </span>
          <button
            onClick={disconnect}
            className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => void connect()}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}
