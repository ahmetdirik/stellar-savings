import { describe, it, expect } from "vitest";
import { calcVelocity, calcProjection } from "./analytics";
import type { GoalTransaction } from "../types";

const tx = (amount: number, daysAgo: number): GoalTransaction => ({
  hash: `hash-${daysAgo}`,
  amount,
  date: new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
});

describe("calcVelocity", () => {
  it("sıfır tx → 0 döner", () => {
    expect(calcVelocity([])).toBe(0);
  });

  it("tek tx → 0 döner (zaman aralığı yok)", () => {
    expect(calcVelocity([tx(100, 0)])).toBe(0);
  });

  it("7 günde 70 XLM → haftalık 70", () => {
    const result = calcVelocity([tx(35, 7), tx(35, 0)]);
    expect(result).toBeCloseTo(70, 0);
  });

  it("14 günde 70 XLM → haftalık 35", () => {
    const result = calcVelocity([tx(35, 14), tx(35, 0)]);
    expect(result).toBeCloseTo(35, 0);
  });
});

describe("calcProjection", () => {
  it("velocity 0 → null döner", () => {
    expect(calcProjection(100, 0)).toBeNull();
  });

  it("negatif velocity → null döner", () => {
    expect(calcProjection(100, -5)).toBeNull();
  });

  it("remaining 0 → 0 gün", () => {
    expect(calcProjection(0, 10)).toBe(0);
  });

  it("haftalık 70 XLM, kalan 70 → 7 gün", () => {
    expect(calcProjection(70, 70)).toBe(7);
  });

  it("yarım haftalık → yukarı yuvarlar", () => {
    // 10 kalan, haftalık 7 → 10/7 * 7 = 10 gün, ceil(10) = 10
    expect(calcProjection(10, 7)).toBe(10);
  });
});
