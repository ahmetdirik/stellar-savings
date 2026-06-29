import { describe, it, expect } from "vitest";
import { encodeGoalUrl, decodeGoalUrl } from "./goalUrl";
import type { PublicGoalSnapshot } from "./goalUrl";

const valid: PublicGoalSnapshot = {
  name: "Laptop",
  targetAmount: 500,
  targetDate: "2026-12-31",
  destinationAddress: "GDC26HD5ETPD4ZHRV4ZQENBOJXEOBHL56NZ2XWR2QSTSLTGHMTROOEWM",
  allowContributions: true,
};

describe("encodeGoalUrl / decodeGoalUrl round-trip", () => {
  it("encodes and decodes valid snapshot correctly", () => {
    const encoded = encodeGoalUrl(valid);
    const decoded = decodeGoalUrl(encoded);
    expect(decoded.name).toBe("Laptop");
    expect(decoded.targetAmount).toBe(500);
    expect(decoded.destinationAddress).toBe(valid.destinationAddress);
    expect(decoded.allowContributions).toBe(true);
  });

  it("trims and truncates name to 100 chars", () => {
    const longName = "A".repeat(150);
    const snap = { ...valid, name: "  " + longName + "  " };
    const decoded = decodeGoalUrl(encodeGoalUrl(snap));
    expect(decoded.name.length).toBe(100);
    expect(decoded.name).toBe("A".repeat(100));
  });
});

describe("decodeGoalUrl — hata durumları", () => {
  it("bozuk base64 → INVALID_PAYLOAD", () => {
    expect(() => decodeGoalUrl("!!!not-base64!!!")).toThrow("INVALID_PAYLOAD");
  });

  it("geçerli base64 ama geçersiz JSON → INVALID_PAYLOAD", () => {
    expect(() => decodeGoalUrl(btoa("not-json"))).toThrow("INVALID_PAYLOAD");
  });

  it("JSON null → INVALID_PAYLOAD", () => {
    expect(() => decodeGoalUrl(btoa("null"))).toThrow("INVALID_PAYLOAD");
  });

  it("eksik alan → MISSING_FIELD:targetAmount", () => {
    const { targetAmount, ...rest } = valid;
    expect(() => decodeGoalUrl(encodeGoalUrl(rest as PublicGoalSnapshot))).toThrow(
      "MISSING_FIELD:targetAmount"
    );
  });

  it("boş name → INVALID_FIELD:name", () => {
    expect(() => decodeGoalUrl(encodeGoalUrl({ ...valid, name: "   " }))).toThrow(
      "INVALID_FIELD:name"
    );
  });

  it("negatif targetAmount → INVALID_FIELD:targetAmount", () => {
    expect(() => decodeGoalUrl(encodeGoalUrl({ ...valid, targetAmount: -1 }))).toThrow(
      "INVALID_FIELD:targetAmount"
    );
  });

  it("sıfır targetAmount → INVALID_FIELD:targetAmount", () => {
    expect(() => decodeGoalUrl(encodeGoalUrl({ ...valid, targetAmount: 0 }))).toThrow(
      "INVALID_FIELD:targetAmount"
    );
  });

  it("geçersiz tarih formatı → INVALID_FIELD:targetDate", () => {
    expect(() =>
      decodeGoalUrl(encodeGoalUrl({ ...valid, targetDate: "31-12-2026" }))
    ).toThrow("INVALID_FIELD:targetDate");
  });

  it("geçersiz Stellar adresi → INVALID_FIELD:destinationAddress", () => {
    expect(() =>
      decodeGoalUrl(encodeGoalUrl({ ...valid, destinationAddress: "NOTAVALIDADDRESS" }))
    ).toThrow("INVALID_FIELD:destinationAddress");
  });

  it("allowContributions string → INVALID_FIELD:allowContributions", () => {
    const tampered = { ...valid, allowContributions: "true" };
    expect(() => decodeGoalUrl(encodeGoalUrl(tampered as unknown as PublicGoalSnapshot))).toThrow(
      "INVALID_FIELD:allowContributions"
    );
  });
});
