import * as StellarSdk from "@stellar/stellar-sdk";
import { horizon, NETWORK_PASSPHRASE } from "./stellar";

export async function buildPaymentTx(
  sourceAddress: string,
  destinationAddress: string,
  amount: string,
  memo?: string
): Promise<string> {
  const account = await horizon.loadAccount(sourceAddress);
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: StellarSdk.Asset.native(),
        amount: amount,
      })
    )
    .addMemo(
      memo ? StellarSdk.Memo.text(memo.slice(0, 28)) : StellarSdk.Memo.none()
    )
    .setTimeout(180)
    .build();
  return tx.toXDR();
}

export async function submitTransaction(
  signedXdr: string
): Promise<{ hash: string }> {
  const tx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE
  ) as StellarSdk.Transaction;
  const response = await horizon.submitTransaction(tx);
  return { hash: response.hash };
}
