import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../context/WalletContext", () => ({ useWallet: vi.fn() }));
vi.mock("../lib/stellar", () => ({
  horizon: { loadAccount: vi.fn() },
  NETWORK_PASSPHRASE: "Test SDF Network ; September 2015",
}));
vi.mock("../lib/transactions", () => ({
  buildPaymentTx: vi.fn(),
  submitTransaction: vi.fn(),
}));

import * as walletCtx from "../context/WalletContext";
import * as stellarLib from "../lib/stellar";
import * as txLib from "../lib/transactions";
import { PublicGoalPage } from "./PublicGoalPage";
import { encodeGoalUrl } from "../lib/goalUrl";
import type { PublicGoalSnapshot } from "../lib/goalUrl";

const mockUseWallet = walletCtx.useWallet as ReturnType<typeof vi.fn>;
const mockLoadAccount = stellarLib.horizon.loadAccount as ReturnType<typeof vi.fn>;
const mockBuild = txLib.buildPaymentTx as ReturnType<typeof vi.fn>;
const mockSubmit = txLib.submitTransaction as ReturnType<typeof vi.fn>;

const snapshot: PublicGoalSnapshot = {
  name: "Laptop",
  targetAmount: 500,
  targetDate: "2030-12-31",
  destinationAddress: "GDC26HD5ETPD4ZHRV4ZQENBOJXEOBHL56NZ2XWR2QSTSLTGHMTROOEWM",
  allowContributions: false,
};

function renderPublic(snap = snapshot) {
  const encoded = encodeGoalUrl(snap);
  return render(
    <MemoryRouter initialEntries={[`/goal/g1/public?d=${encoded}`]}>
      <Routes>
        <Route path="/goal/:id/public" element={<PublicGoalPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("PublicGoalPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWallet.mockReturnValue({
      connected: false,
      address: null,
      connect: vi.fn(),
      sign: vi.fn(),
      refreshBalance: vi.fn(),
    });
    mockLoadAccount.mockResolvedValue({
      balances: [{ asset_type: "native", balance: "200.0000000" }],
    });
  });

  it("goal adını ve on-chain bakiyeyi gösterir", async () => {
    renderPublic();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/200/)).toBeInTheDocument();
    });
  });

  it("allowContributions false iken katkı butonu görünmez", async () => {
    renderPublic();
    await waitFor(() => screen.getByText(/200/));
    expect(screen.queryByRole("button", { name: /contribute/i })).not.toBeInTheDocument();
  });

  it("allowContributions true iken katkı butonu görünür", async () => {
    renderPublic({ ...snapshot, allowContributions: true });
    await waitFor(() => screen.getByText(/200/));
    expect(screen.getByRole("button", { name: /contribute/i })).toBeInTheDocument();
  });

  it("bozuk URL parametresi → hata ekranı gösterir", () => {
    render(
      <MemoryRouter initialEntries={["/goal/g1/public?d=!!!invalid!!!"]}>
        <Routes>
          <Route path="/goal/:id/public" element={<PublicGoalPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/invalid.*link/i)).toBeInTheDocument();
  });

  it("d parametresi yoksa hata ekranı gösterir", () => {
    render(
      <MemoryRouter initialEntries={["/goal/g1/public"]}>
        <Routes>
          <Route path="/goal/:id/public" element={<PublicGoalPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/invalid.*link/i)).toBeInTheDocument();
  });

  it("katkı başarılı olunca tx hash gösterilir", async () => {
    mockUseWallet.mockReturnValue({
      connected: true,
      address: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGZM8WF3FQHYIKCSE5ZT6Y",
      connect: vi.fn(),
      sign: vi.fn().mockResolvedValue("signed-xdr"),
      refreshBalance: vi.fn(),
    });
    mockBuild.mockResolvedValue("unsigned-xdr");
    mockSubmit.mockResolvedValue({ hash: "success-hash-123" });

    renderPublic({ ...snapshot, allowContributions: true });
    await waitFor(() => screen.getByRole("button", { name: /contribute/i }));

    fireEvent.click(screen.getByRole("button", { name: /contribute/i }));
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/success-hash-123/)).toBeInTheDocument();
    });
  });
});
