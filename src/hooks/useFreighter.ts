import { useState, useEffect, useCallback } from "react";
import {
  isConnected,
  getAddress,
  requestAccess,
  signTransaction,
  getNetwork,
} from "@stellar/freighter-api";
import { horizon } from "../lib/stellar";

export function useFreighter() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void checkConnection();
  }, []);

  async function fetchBalance(addr: string) {
    try {
      const account = await horizon.loadAccount(addr);
      const native = account.balances.find((b) => b.asset_type === "native");
      setBalance(native?.balance ?? "0");
    } catch {
      setBalance("0");
    }
  }

  async function checkConnection() {
    const { isConnected: installed, error } = await isConnected();
    if (error || !installed) return;
    const { address: addr, error: addrErr } = await getAddress();
    if (addrErr || !addr) return;
    setConnected(true);
    setAddress(addr);
    await fetchBalance(addr);
  }

  const connect = useCallback(async () => {
    setLoading(true);
    try {
      const { isConnected: installed, error } = await isConnected();
      if (error || !installed) throw new Error("Freighter extension not installed");

      const { address: addr, error: accessErr } = await requestAccess();
      if (accessErr) throw new Error(accessErr.message);

      const { network: net, error: netErr } = await getNetwork();
      if (netErr) throw new Error(netErr.message);
      if (!net.toLowerCase().includes("test")) {
        throw new Error("Please switch Freighter to Testnet");
      }

      setConnected(true);
      setAddress(addr);
      await fetchBalance(addr);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setAddress(null);
    setBalance(null);
  }, []);

  const sign = useCallback(
    async (xdr: string): Promise<string> => {
      if (!connected) throw new Error("Wallet not connected");
      const { signedTxXdr, error } = await signTransaction(xdr, {
        networkPassphrase: "Test SDF Network ; September 2015",
      });
      if (error) throw new Error(error.message);
      return signedTxXdr;
    },
    [connected]
  );

  const refreshBalance = useCallback(async () => {
    if (address) await fetchBalance(address);
  }, [address]);

  return { connected, address, balance, loading, connect, disconnect, sign, refreshBalance };
}
