// #region create
// npx tsx create-the-mint.ts
import { generateKeyPairSigner } from "@solana/kit";
import {
  createTokenizedSecurityInitTransaction,
  getListConfigPda,
  inspectToken,
} from "@solana/mosaic-sdk";
import { loadSigner, rpc, sendMessage } from "./common";

const payer = await loadSigner("tokenization-demo");
// One address per operational power, from the keys generated in step 1.
const authority = async (role: string) =>
  (await loadSigner(`demo-authorities/${role}`)).address;

const mint = await generateKeyPairSigner();

// The fee payer is also the mint authority here, so the same transaction can
// create the Token ACL config, the allowlist, and permissionless thaw.
const transaction = await createTokenizedSecurityInitTransaction(
  rpc,
  "Demo Tokenized Note",
  "DEMOTN",
  6,
  "https://example.com/demotn.json",
  payer, // mint authority
  mint,
  payer, // fee payer
  undefined,
  {
    aclMode: "allowlist",
    enableSrfc37: true,
    metadataAuthority: await authority("metadata"),
    pausableAuthority: await authority("pause"),
    permanentDelegateAuthority: await authority("delegate"),
    permissionedBurnAuthority: await authority("burn"),
  },
);
await sendMessage(transaction);

const token = await inspectToken(rpc, mint.address, "confirmed");
console.log("Mint:", mint.address);
console.log(
  "Allowlist:",
  await getListConfigPda({ authority: payer.address, mint: mint.address }),
);
console.log(
  "Freeze authority (Token ACL mint config):",
  token.authorities.freezeAuthority,
);
// #endregion create
