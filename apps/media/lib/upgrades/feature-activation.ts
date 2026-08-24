import {
  address,
  createSolanaRpc,
  getBase64Encoder,
  type Address,
} from "@solana/kit";

export const FEATURE_GATE_PROGRAM_ADDRESS = address(
  "Feature111111111111111111111111111111111111",
);
const FEATURE_ACCOUNT_SIZE = 9;
export const LARGER_TRANSACTIONS_FEATURE_ADDRESS = address(
  "txv1aq4pp281K9um3tnPgkfX8UqtFT6wcVW3hNezGLL",
);

type FeatureAccount = {
  data: readonly [string, "base64"];
  owner: Address;
};

export type FeatureActivationStatus =
  | "Not set"
  | `Live in Epoch ${number}`
  | "Active";

export function readFeatureAccountState(
  account: FeatureAccount | null,
): "not-set" | "pending" | "active" {
  if (account === null) return "not-set";

  const data = getBase64Encoder().encode(account.data[0]);
  if (
    account.owner !== FEATURE_GATE_PROGRAM_ADDRESS ||
    data.length < FEATURE_ACCOUNT_SIZE
  ) {
    throw new Error("Invalid feature gate account");
  }

  if (data[0] === 0) return "pending";
  if (data[0] === 1) return "active";
  throw new Error("Invalid feature gate activation state");
}

export async function getFeatureActivationStatus(
  rpcUrl: string,
  featureAddress: Address,
  abortSignal?: AbortSignal,
): Promise<FeatureActivationStatus> {
  const rpc = createSolanaRpc(rpcUrl);
  const { value: account } = await rpc
    .getAccountInfo(featureAddress, {
      commitment: "confirmed",
      encoding: "base64",
    })
    .send({ abortSignal });
  const state = readFeatureAccountState(account);

  if (state === "not-set") return "Not set";
  if (state === "active") return "Active";

  const { epoch } = await rpc
    .getEpochInfo({ commitment: "confirmed" })
    .send({ abortSignal });
  return `Live in Epoch ${Number(epoch) + 1}`;
}
