// #region types
// The x402 "exact" scheme messages, as plain types. The server answers an
// unpaid request with 402 and a list of accepted payments; the client retries
// with an X-PAYMENT header holding a signed USDC transfer; the server answers
// with X-PAYMENT-RESPONSE holding the settled transaction signature.
export const X402_VERSION = 1;

/** CAIP-2 id of Solana devnet (genesis hash prefix). */
export const NETWORK =
  process.env.X402_NETWORK ?? "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1";

export interface PaymentRequirements {
  scheme: "exact";
  network: string;
  /** Price in the asset's base units (USDC: 1_000_000 = 1 USDC). */
  maxAmountRequired: string;
  /** Token mint. */
  asset: string;
  /** Wallet that receives the payment (its USDC token account is credited). */
  payTo: string;
  resource: string;
  description: string;
  mimeType: string;
  maxTimeoutSeconds: number;
}

export interface PaymentRequired {
  x402Version: number;
  error: string;
  accepts: PaymentRequirements[];
}

export interface PaymentPayload {
  x402Version: number;
  scheme: "exact";
  network: string;
  /** Base64 wire transaction, fully signed by the payer. */
  payload: { transaction: string };
}

export interface SettlementResponse {
  success: boolean;
  transaction: string;
  network: string;
}

export const encodeHeader = (value: unknown) =>
  Buffer.from(JSON.stringify(value)).toString("base64");
export const decodeHeader = <T>(value: string): T =>
  JSON.parse(Buffer.from(value, "base64").toString("utf8")) as T;
// #endregion types
