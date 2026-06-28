import * as StellarSdk from "@stellar/stellar-sdk";

export const horizon = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
