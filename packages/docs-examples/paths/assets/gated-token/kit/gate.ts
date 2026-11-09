// #region gate
// gate.ts: open a holder's token account and thaw it through the gate.
import {
  AccountRole,
  type Address,
  type Instruction,
  type TransactionSigner,
} from "@solana/kit";
import {
  AccountState,
  fetchMaybeToken,
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstruction,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import {
  fetchMintConfig,
  findFlagAccountPda,
  findMintConfigPda,
  findThawExtraMetasAccountPda,
  getThawPermissionlessInstruction,
} from "@solana/token-acl-sdk";
import { findWalletEntryPda } from "@solana/token-acl-gate-sdk";
import { rpc } from "./common";

// Token ACL thaws a frozen account only when the gate program approves the
// owner. The gate reads three extra accounts: its extra-metas record for the
// mint, the allowlist ($LIST), and the owner's entry on that list.
export async function thawThroughGate(
  payer: TransactionSigner,
  mint: Address,
  tokenAccount: Address,
  owner: Address,
  listConfig: Address,
): Promise<Instruction> {
  const [mintConfig] = await findMintConfigPda({ mint });
  const { data: config } = await fetchMintConfig(rpc, mintConfig);
  const gate = { programAddress: config.gatingProgram };
  const [flagAccount] = await findFlagAccountPda({ tokenAccount });
  const [extraMetas] = await findThawExtraMetasAccountPda({ mint }, gate);
  const [walletEntry] = await findWalletEntryPda(
    { listConfig, wallet: owner },
    gate,
  );
  const instruction = getThawPermissionlessInstruction({
    authority: payer,
    mint,
    tokenAccount,
    flagAccount,
    tokenAccountOwner: owner,
    mintConfig,
    gatingProgram: config.gatingProgram,
  });
  const extra = [extraMetas, listConfig, walletEntry].map((address) => ({
    address,
    role: AccountRole.READONLY,
  }));
  return { ...instruction, accounts: [...instruction.accounts, ...extra] };
}

// New accounts on this mint start frozen. Returns the owner's token account
// and the instructions that create it (if missing) and thaw it (if frozen).
export async function openThroughGate(
  payer: TransactionSigner,
  mint: Address,
  owner: Address,
  listConfig: Address,
) {
  const [tokenAccount] = await findAssociatedTokenPda({
    mint,
    owner,
    tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
  });
  const account = await fetchMaybeToken(rpc, tokenAccount);
  const instructions: Instruction[] = [];
  if (!account.exists) {
    instructions.push(
      getCreateAssociatedTokenIdempotentInstruction({
        payer,
        ata: tokenAccount,
        owner,
        mint,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      }),
    );
  }
  if (!account.exists || account.data.state === AccountState.Frozen) {
    instructions.push(
      await thawThroughGate(payer, mint, tokenAccount, owner, listConfig),
    );
  }
  return { tokenAccount, instructions };
}
// #endregion gate
