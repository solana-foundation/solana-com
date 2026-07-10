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

  const payload: unknown = await res.json();
  if (!Array.isArray(payload)) return null;

  const records = payload as TrilliumValidatorReward[];
  const matches = records.filter(
    (entry) => entry.vote_account_pubkey === voteAccount,
  );
  if (matches.length === 0) return null;

  // Trillium returns per-epoch rows; sw_first_epoch_with_stake is only on some.
  const recordWithFirstEpoch = matches.find(
    (entry) => entry.sw_first_epoch_with_stake != null,
  );
  if (!recordWithFirstEpoch) return null;

  const latestRecord = matches[0];

  return {
    signature: "",
    slot: recordWithFirstEpoch.sw_first_epoch_with_stake * SLOTS_PER_EPOCH,
    blockTime: null,
    capped: false,
    scanned: 0,
    logoUrl:
      latestRecord?.icon_url?.trim() ||
      recordWithFirstEpoch.icon_url?.trim() ||
      null,
  };
}
