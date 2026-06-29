import * as StellarSdk from "@stellar/stellar-sdk";

export interface PublicGoalSnapshot {
  name: string;
  targetAmount: number;
  targetDate: string;
  destinationAddress: string;
  allowContributions: boolean;
}

const REQUIRED_KEYS: (keyof PublicGoalSnapshot)[] = [
  "name",
  "targetAmount",
  "targetDate",
  "destinationAddress",
  "allowContributions",
];

export function encodeGoalUrl(goal: PublicGoalSnapshot): string {
  return btoa(JSON.stringify(goal));
}

export function decodeGoalUrl(raw: string): PublicGoalSnapshot {
  let parsed: unknown;
  try {
    parsed = JSON.parse(atob(raw));
  } catch {
    throw new Error("INVALID_PAYLOAD");
  }

  if (typeof parsed !== "object" || parsed === null)
    throw new Error("INVALID_PAYLOAD");

  const obj = parsed as Record<string, unknown>;

  for (const key of REQUIRED_KEYS) {
    if (!(key in obj)) throw new Error(`MISSING_FIELD:${key}`);
  }

  if (typeof obj.name !== "string" || obj.name.trim().length === 0)
    throw new Error("INVALID_FIELD:name");
  if (typeof obj.targetAmount !== "number" || obj.targetAmount <= 0)
    throw new Error("INVALID_FIELD:targetAmount");
  if (
    typeof obj.targetDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(obj.targetDate)
  )
    throw new Error("INVALID_FIELD:targetDate");
  if (
    typeof obj.destinationAddress !== "string" ||
    !StellarSdk.StrKey.isValidEd25519PublicKey(obj.destinationAddress)
  )
    throw new Error("INVALID_FIELD:destinationAddress");
  if (typeof obj.allowContributions !== "boolean")
    throw new Error("INVALID_FIELD:allowContributions");

  return {
    name: (obj.name as string).trim().slice(0, 100),
    targetAmount: obj.targetAmount as number,
    targetDate: obj.targetDate as string,
    destinationAddress: obj.destinationAddress as string,
    allowContributions: obj.allowContributions as boolean,
  };
}
