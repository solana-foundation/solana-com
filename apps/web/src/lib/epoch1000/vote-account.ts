import type { FirstTx } from "./solana";

const SLOTS_PER_EPOCH = 432_000;
const TRILLIUM_VALIDATOR_REWARDS_URL =
  "https://api.trillium.so/validator_rewards";

interface TrilliumValidatorReward {
  vote_account_pubkey: string;
  sw_first_epoch_with_stake: number;
  icon_url?: string | null;
}

export interface ValidatorLookup extends FirstTx {
  logoUrl: string | null;
}

/** Validator history from Trillium's per-validator rewards endpoint. */
export async function findValidatorFirstTransaction(
  voteAccount: string,
): Promise<ValidatorLookup | null> {
  const res = await fetch(`${TRILLIUM_VALIDATOR_REWARDS_URL}/${voteAccount}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Trillium API failed: ${res.status}`);

  const records = (await res.json()) as TrilliumValidatorReward[];
  const record = records.find(
    (entry) => entry.vote_account_pubkey === voteAccount,
  );
  if (!record || record.sw_first_epoch_with_stake == null) return null;

  return {
    signature: "",
    slot: record.sw_first_epoch_with_stake * SLOTS_PER_EPOCH,
    blockTime: null,
    capped: false,
    scanned: 0,
    logoUrl: record.icon_url?.trim() || null,
  };
}
