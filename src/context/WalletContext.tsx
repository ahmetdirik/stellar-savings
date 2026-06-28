import { createContext, useContext, type ReactNode } from "react";
import { useFreighter } from "../hooks/useFreighter";

type WalletContextType = ReturnType<typeof useFreighter>;

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useFreighter();
  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
