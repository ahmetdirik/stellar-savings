import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PrivacySettings } from "./PrivacySettings";
import type { Goal } from "../types";

const baseGoal: Goal = {
  id: "g1",
  name: "Laptop",
  targetAmount: 500,
  currentAmount: 0,
  targetDate: "2030-12-31",
  destinationAddress: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN",
  transactions: [],
  createdAt: "2026-06-28T00:00:00.000Z",
  isPublic: false,
  allowContributions: false,
};

describe("PrivacySettings", () => {
  it("private goal'da katkı toggle ve link alanı gizlenir", () => {
    render(<PrivacySettings goal={baseGoal} onUpdate={vi.fn()} />);
    expect(screen.queryByLabelText(/allow contributions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/copy link/i)).not.toBeInTheDocument();
  });

  it("isPublic toggle'a basınca onUpdate çağrılır", () => {
    const onUpdate = vi.fn();
    render(<PrivacySettings goal={baseGoal} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByLabelText(/make public/i));
    expect(onUpdate).toHaveBeenCalledWith({ isPublic: true, allowContributions: false });
  });

  it("public goal'da katkı toggle görünür", () => {
    const publicGoal = { ...baseGoal, isPublic: true };
    render(<PrivacySettings goal={publicGoal} onUpdate={vi.fn()} />);
    expect(screen.getByLabelText(/allow contributions/i)).toBeInTheDocument();
  });

  it("public goal'da katkı toggle'a basınca onUpdate çağrılır", () => {
    const onUpdate = vi.fn();
    const publicGoal = { ...baseGoal, isPublic: true };
    render(<PrivacySettings goal={publicGoal} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByLabelText(/allow contributions/i));
    expect(onUpdate).toHaveBeenCalledWith({ isPublic: true, allowContributions: true });
  });

  it("public goal'da link kopyalama butonu görünür", () => {
    const publicGoal = { ...baseGoal, isPublic: true };
    render(<PrivacySettings goal={publicGoal} onUpdate={vi.fn()} />);
    expect(screen.getByRole("button", { name: /copy link/i })).toBeInTheDocument();
  });

  it("isPublic false'a alınca allowContributions da false olur", () => {
    const onUpdate = vi.fn();
    const publicGoal = { ...baseGoal, isPublic: true, allowContributions: true };
    render(<PrivacySettings goal={publicGoal} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByLabelText(/make public/i));
    expect(onUpdate).toHaveBeenCalledWith({ isPublic: false, allowContributions: false });
  });
});
