/**
 * Named verification batches referenced by wallet records. Add a new batch
 * when records are re-verified so directory freshness stays data-driven.
 */
export const WALLET_VERIFICATION_DATES = {
  directoryLaunch: "2026-07-15",
  solflareAudit: "2026-07-16",
} as const satisfies Record<string, `${number}-${number}-${number}`>;

export type WalletVerificationDate =
  (typeof WALLET_VERIFICATION_DATES)[keyof typeof WALLET_VERIFICATION_DATES];

export const WALLET_DIRECTORY_LAST_VERIFIED = Object.values(
  WALLET_VERIFICATION_DATES,
).reduce((latest, date) => (date > latest ? date : latest));
