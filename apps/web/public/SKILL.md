---
name: solana-blockchain
description: Comprehensive guide for AI agents to understand and build on Solana blockchain. Use when answering questions about Solana development, writing smart contracts (programs), creating transactions, working with accounts, tokens, or interacting with Solana RPC APIs.
---

# Solana Blockchain Development

> Solana is a high-performance blockchain for decentralized applications. It provides fast (~400ms blocks), secure, scalable (65,000+ TPS), and energy-efficient infrastructure.

## Quick Facts

- **Block time**: ~400ms
- **Transaction size limit**: 1232 bytes
- **Account size limit**: 10MiB
- **Blockhash expiry**: 150 blocks (~1 minute)
- **Native token**: SOL (1 SOL = 1,000,000,000 lamports)
- **Smart contracts**: Called "programs" (stateless, written in Rust)

## Core Concepts

### Accounts

All data lives in accounts. Think of Solana as a key-value database.

```rust
pub struct Account {
    pub lamports: u64,        // Balance in lamports
    pub data: Vec<u8>,        // Arbitrary data bytes
    pub owner: Pubkey,        // Program that owns this account
    pub executable: bool,     // Is this a program?
    pub rent_epoch: Epoch,    // Deprecated
}
```

**Account types**:
- **Program accounts**: Executable code (smart contracts)
- **Data accounts**: Store state, owned by programs
- **System accounts**: Wallet accounts (owned by System Program)

**Key rules**:
- Only the owner program can modify `data` or deduct `lamports`
- Anyone can credit lamports to any account
- Accounts must maintain minimum balance (rent-exempt)

### Transactions

Transactions contain one or more instructions. They are atomic—all succeed or all fail.

```rust
pub struct Transaction {
    pub signatures: Vec<Signature>,  // 64 bytes each
    pub message: Message,
}

pub struct Message {
    pub header: MessageHeader,
    pub account_keys: Vec<Pubkey>,
    pub recent_blockhash: Hash,      // Timestamp/dedup
    pub instructions: Vec<CompiledInstruction>,
}
```

**Transaction rules**:
- First signature = fee payer
- Blockhash expires after ~1 minute (150 blocks)
- Max size: 1232 bytes

### Programs

Programs are stateless executable accounts. They process instructions and modify account data.

**Development approaches**:
1. **Anchor**: Framework with Rust macros, reduces boilerplate
2. **Native Rust**: Direct `solana-program` crate usage

**Program ownership**:
- System Program creates accounts and transfers SOL
- BPF Loader deploys/upgrades programs
- Your program owns its data accounts

### Program Derived Addresses (PDAs)

PDAs are deterministic addresses without private keys. Programs can sign for their PDAs.

```typescript
// Derive a PDA
import { PublicKey } from "@solana/web3.js";

const [pda, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("seed"), userPubkey.toBuffer()],
  programId
);
```

**PDA rules**:
- Derived from: program ID + seeds + bump
- Canonical bump: first value (starting at 255) that produces valid off-curve address
- Always verify bump in on-chain code for security

### Cross Program Invocations (CPIs)

Programs can call other programs. Signer privileges extend from caller to callee.

```rust
// CPI with PDA signer
let signer_seeds: &[&[&[u8]]] = &[&[b"pda", &[bump]]];
let cpi_ctx = CpiContext::new(program.to_account_info(), accounts)
    .with_signer(signer_seeds);
transfer(cpi_ctx, amount)?;
```

**CPI rules**:
- Max invocation depth: 5
- Programs can sign for their PDAs
- Compute units shared across CPI chain

## Code Examples

### Generate Keypair

```typescript
// @solana/kit (recommended)
import { generateKeyPairSigner } from "@solana/kit";
const signer = await generateKeyPairSigner();

// Legacy @solana/web3.js
import { Keypair } from "@solana/web3.js";
const keypair = Keypair.generate();
```

### Transfer SOL

```typescript
// @solana/kit
import {
  createSolanaRpc,
  generateKeyPairSigner,
  lamports,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  pipe,
  signTransactionMessageWithSigners
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";

const rpc = createSolanaRpc("https://api.devnet.solana.com");
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transferIx = getTransferSolInstruction({
  source: sender,
  destination: recipient.address,
  amount: lamports(1_000_000_000n / 100n) // 0.01 SOL
});

const txMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(sender, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstructions([transferIx], tx)
);

const signedTx = await signTransactionMessageWithSigners(txMessage);
```

```typescript
// Legacy @solana/web3.js
import { Connection, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const tx = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient.publicKey,
    lamports: 0.01 * LAMPORTS_PER_SOL
  })
);
const sig = await sendAndConfirmTransaction(connection, tx, [sender]);
```

### Set Priority Fees

```typescript
import { ComputeBudgetProgram } from "@solana/web3.js";

const instructions = [
  ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 }),
  ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }),
  // ... your instructions
];
```

**Tip**: Simulate transaction first to estimate CUs, add 10% buffer.

### Get Token Balance

```typescript
// @solana/kit
import { address, createSolanaRpc } from "@solana/kit";

const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");
const balance = await rpc.getTokenAccountBalance(tokenAccountAddress).send();
```

## RPC API Quick Reference

### Common Methods

| Method | Purpose |
|--------|---------|
| `getAccountInfo` | Get account data and metadata |
| `getBalance` | Get SOL balance |
| `getLatestBlockhash` | Get recent blockhash for transactions |
| `sendTransaction` | Submit signed transaction |
| `simulateTransaction` | Test transaction without submitting |
| `getSignatureStatuses` | Check transaction confirmation |
| `getProgramAccounts` | Query all accounts owned by program |
| `getTokenAccountsByOwner` | Get SPL token accounts for wallet |
| `requestAirdrop` | Get devnet/testnet SOL |

### Commitment Levels

| Level | Description |
|-------|-------------|
| `processed` | Node has processed (may be rolled back) |
| `confirmed` | Supermajority confirmed |
| `finalized` | Max lockout reached, cannot be rolled back |

### Request Example

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getAccountInfo",
  "params": [
    "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg",
    { "encoding": "base64" }
  ]
}
```

## Network Clusters

| Cluster | RPC Endpoint | Use |
|---------|-------------|-----|
| Mainnet | `https://api.mainnet-beta.solana.com` | Production |
| Devnet | `https://api.devnet.solana.com` | Development |
| Testnet | `https://api.testnet.solana.com` | Validator testing |
| Localhost | `http://localhost:8899` | Local development |

## Important Program IDs

| Program | Address |
|---------|---------|
| System Program | `11111111111111111111111111111111` |
| Token Program | `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` |
| Token-2022 | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` |
| Associated Token | `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL` |
| BPF Loader | `BPFLoaderUpgradeab1e11111111111111111111111` |

## Transaction Fees

**Base fee**: 5000 lamports per signature (50% burned, 50% to validator)

**Priority fee**: `CU limit × CU price (microlamports)`

**Compute units**:
- Default per instruction: 200,000 CU
- Default per transaction: 1,400,000 CU

## Common Patterns

### Account Validation (Anchor)

```rust
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + DataAccount::INIT_SPACE,
        seeds = [b"data", payer.key().as_ref()],
        bump
    )]
    pub data_account: Account<'info, DataAccount>,

    pub system_program: Program<'info, System>,
}
```

### Error Handling

```rust
#[error_code]
pub enum MyError {
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Invalid authority")]
    InvalidAuthority,
}

// Usage
require!(ctx.accounts.authority.key() == expected, MyError::InvalidAuthority);
```

## Security Checklist

- [ ] Verify account ownership (check `owner` field)
- [ ] Validate PDA derivation with canonical bump
- [ ] Check signer status for privileged operations
- [ ] Validate account is writable before modification
- [ ] Use checked math to prevent overflow
- [ ] Verify account discriminators (Anchor does this automatically)
- [ ] Close accounts properly to reclaim rent

## Resources

- **Documentation**: https://solana.com/docs
- **Full LLM Context**: https://solana.com/llms-full.txt
- **Cookbook**: https://solana.com/cookbook
- **RPC API Reference**: https://solana.com/docs/rpc
- **Stack Exchange**: https://solana.stackexchange.com
- **GitHub**: https://github.com/solana-labs
- **Anchor Framework**: https://www.anchor-lang.com
- **Validator Docs**: https://docs.anza.xyz

## Terminology

| Term | Definition |
|------|------------|
| **Lamport** | Smallest SOL unit (1 SOL = 10^9 lamports) |
| **Slot** | Time window for block production |
| **Epoch** | ~2-3 days, used for staking rewards |
| **Rent** | Storage cost (accounts must be rent-exempt) |
| **PDA** | Program Derived Address |
| **CPI** | Cross Program Invocation |
| **IDL** | Interface Definition Language (Anchor) |
| **ATA** | Associated Token Account |
