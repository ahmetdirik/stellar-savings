import { describe, it, expect, beforeEach } from "vitest";
import { getUnseenMilestone, markMilestoneSeen } from "./milestones";

describe("milestones", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("yüzde 0 → null döner", () => {
    expect(getUnseenMilestone("g1", 0)).toBeNull();
  });

  it("yüzde 24 → null döner", () => {
    expect(getUnseenMilestone("g1", 24)).toBeNull();
  });

  it("yüzde 25 → 25 döner", () => {
    expect(getUnseenMilestone("g1", 25)).toBe(25);
  });

  it("yüzde 60 → 50 döner (en yüksek görülmemiş eşik)", () => {
    expect(getUnseenMilestone("g1", 60)).toBe(50);
  });

  it("yüzde 100 → 100 döner", () => {
    expect(getUnseenMilestone("g1", 100)).toBe(100);
  });

  it("markMilestoneSeen sonrası aynı eşik tekrar dönmez", () => {
    expect(getUnseenMilestone("g1", 25)).toBe(25);
    markMilestoneSeen("g1", 25);
    expect(getUnseenMilestone("g1", 25)).toBeNull();
  });

  it("yüzde 75'te 25 ve 50 gösterilmişse → 75 döner", () => {
    markMilestoneSeen("g1", 25);
    markMilestoneSeen("g1", 50);
    expect(getUnseenMilestone("g1", 75)).toBe(75);
  });

  it("farklı goalId'ler birbirini etkilemez", () => {
    markMilestoneSeen("g1", 25);
    expect(getUnseenMilestone("g2", 25)).toBe(25);
  });
});
