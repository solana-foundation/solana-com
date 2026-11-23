export const NAV_BUTTONS = [
  {
    label: "",
    hierarchy: "outline",
    size: "md",
    iconSize: "md",
    startIcon: "none",
    endIcon: "none",
    url: "/developers/migrate-to-solana/cosmos",
  },
  {
    label: "",
    hierarchy: "outline",
    size: "md",
    iconSize: "md",
    startIcon: "none",
    endIcon: "none",
    url: "/developers/migrate-to-solana/cosmos/cosmwasm",
  },
];

// Prose lives in the i18n catalog (`sections.<id>.prose`); each "prose"
// entry consumes the next catalog string, code blocks stay here untranslated.
export const RUNBOOK_SECTIONS = [
  {
    id: "why-solana",
    blocks: ["prose"],
  },
  {
    id: "planning-announcement",
    blocks: [
      "prose",
      {
        language: "text",
        code: `Title: [Deprecation Proposal] Shut Down CHAIN_NAME and Migrate to Solana

Summary:
The team proposes to sunset CHAIN_NAME on DATE, migrate TOKEN to Solana as an SPL token,
and redirect development resources to the Solana ecosystem.

Rationale:
- Security, liquidity, ecosystem, or product fit reasons
- Data supporting the decision

Migration plan:
- Token migration architecture
- Smart contract migration path
- Timeline and exchange coordination
- Unclaimed token policy`,
      },
      "prose",
      {
        language: "text",
        code: `Day 0:   Public announcement and forum proposal
Day 14:  On-chain governance vote opens
Day 21:  Governance vote closes
Day 28:  Migration portal opens and exchange work begins
Day 90:  Chain halts at the pre-announced block height
Day 180: Optional migration-claim deadline`,
      },
      "prose",
    ],
  },
  {
    id: "cosmos-shutdown",
    blocks: [
      "prose",
      {
        language: "toml",
        code: `# ~/.chain/config/app.toml
halt-height = 12345678`,
      },
      { language: "bash", code: `chaind start --halt-height=12345678` },
      "prose",
      {
        language: "bash",
        code: `chaind export --height=12345678 --for-zero-height &gt; final_state.json`,
      },
      "prose",
      {
        language: "bash",
        code: `cat final_state.json | jq '.app_state.bank.balances' &gt; final_balances.json
cat final_state.json | jq '.app_state.staking.delegations' &gt; final_delegations.json
cat final_state.json | jq '.app_state.staking.unbonding_delegations' &gt; final_unbonding.json`,
      },
      "prose",
      {
        language: "python",
        code: `# snapshot_merge.py - pseudocode
snapshot = {}

for entry in balances:
    addr = entry["address"]
    amount = sum(c["amount"] for c in entry["coins"] if c["denom"] == "utoken")
    snapshot[addr] = snapshot.get(addr, 0) + int(amount)

for delegation in delegations:
    addr = delegation["delegator_address"]
    tokens = shares_to_tokens(delegation["shares"], delegation["validator_address"])
    snapshot[addr] = snapshot.get(addr, 0) + int(tokens)

for entry in unbonding:
    addr = entry["delegator_address"]
    for ubd in entry["entries"]:
        snapshot[addr] = snapshot.get(addr, 0) + int(ubd["balance"])`,
      },
      "prose",
      {
        language: "text",
        code: `Subject: Validator Offboarding - Action Required

The chain will halt at block HEIGHT on DATE.
1. Configure halt-height=HEIGHT
2. Export final state after halt
3. Archive your node data to cold storage
4. Confirm your final commission destination`,
      },
    ],
  },
  {
    id: "token-migration-architecture",
    blocks: [
      "prose",
      {
        language: "text",
        code: `Cosmos final snapshot
  -> normalized claims file
  -> Merkle tree build
  -> published root + claim JSON
  -> Solana claimer program initialized with root
  -> token vault funded
  -> users submit proof and receive SPL tokens`,
      },
      "prose",
      {
        language: "rust",
        code: `pub struct Distributor {
    pub merkle_root: [u8; 32],
    pub mint: Address,
    pub vault: Address,
    pub vault_authority_bump: u8,
    pub claim_window_end_ts: i64,
}

pub struct ClaimStatus {
    pub index: u64,
    pub claimed: bool,
}`,
      },
      "prose",
      {
        language: "rust",
        code: `pub fn claim(
    ctx: Context&lt;Claim&gt;,
    index: u64,
    amount: u64,
    proof: Vec&lt;[u8; 32]&gt;,
) -&gt; Result&lt;()&gt; {
    require!(!ctx.accounts.claim_status.claimed, ClaimError::AlreadyClaimed);
    require!(
        verify_proof(
            ctx.accounts.distributor.merkle_root,
            hash_leaf(index, ctx.accounts.recipient.key(), amount),
            &amp;proof,
        ),
        ClaimError::InvalidProof
    );

    transfer_from_vault(&amp;ctx, amount)?;
    ctx.accounts.claim_status.claimed = true;
    Ok(())
}`,
      },
      "prose",
      {
        language: "rust",
        code: `token::transfer(
    CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        token::Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        },
        &amp;[&amp;[b"vault_authority", &amp;[ctx.bumps.vault_authority]]],
    ),
    amount,
)?;`,
      },
      "prose",
    ],
  },
  {
    id: "address-linking",
    blocks: [
      "prose",
      {
        language: "json",
        code: `{
  "cosmos_address": "osmo1...",
  "solana_address": "7Yp...base58...",
  "snapshot_height": 12345678,
  "nonce": "migration-v1"
}`,
      },
    ],
  },
  {
    id: "launching-on-solana",
    blocks: [
      "prose",
      {
        language: "bash",
        code: `solana-keygen new --outfile migration-authority.json
solana config set --keypair migration-authority.json
solana config set --url mainnet-beta

spl-token create-token --decimals 6 &gt; token_address.txt`,
      },
      "prose",
      {
        language: "json",
        code: `{
  "name": "Your Token Name",
  "symbol": "TKN",
  "description": "Migrated from CHAIN_NAME Cosmos chain to Solana.",
  "image": "https://your-metadata-server.com/logo.png",
  "external_url": "https://yourproject.com"
}`,
      },
      "prose",
      {
        language: "bash",
        code: `spl-token create-account MINT_ADDRESS
spl-token mint MINT_ADDRESS 1000000000
spl-token authorize MINT_ADDRESS mint --disable
spl-token authorize MINT_ADDRESS freeze --disable`,
      },
      "prose",
    ],
  },
  {
    id: "program-migration",
    blocks: [
      "prose",
      {
        language: "text",
        code: `Category A - Migrate with state
Category B - Migrate logic only
Category C - Deprecate
Category D - Replace with native Solana equivalents`,
      },
      "prose",
      {
        language: "bash",
        code: `cat final_state.json | jq '.app_state.wasm.contracts' | \
  python3 extract_vesting.py &gt; vesting_positions.json`,
      },
      {
        language: "rust",
        code: `#[account]
pub struct VestingSchedule {
    pub recipient: Pubkey,
    pub total_amount: u64,
    pub start_timestamp: i64,
    pub end_timestamp: i64,
    pub claimed_amount: u64,
    pub bump: u8,
}`,
      },
      "prose",
    ],
  },
  {
    id: "governance-migration",
    blocks: ["prose"],
  },
  {
    id: "user-migration",
    blocks: ["prose"],
  },
  {
    id: "decommissioning",
    blocks: [
      "prose",
      {
        language: "text",
        code: `Validators:
  - primary validator
  - sentry nodes
  - seed nodes

API and RPC:
  - public RPC
  - LCD or REST
  - gRPC
  - websocket

Indexers and explorers:
  - Mintscan, Big Dipper, internal explorer

Relayers:
  - Hermes or Go Relayer instances

Storage and DNS:
  - databases
  - snapshots
  - subdomains`,
      },
      "prose",
      {
        language: "bash",
        code: `tar -czf chain-archive-final-$(date +%Y%m%d).tar.gz ~/.chain/
aws s3 cp chain-archive-final-*.tar.gz s3://your-archive-bucket/

chaind export --height=HALT_HEIGHT &gt; final_state_archive.json
gzip final_state_archive.json
aws s3 cp final_state_archive.json.gz s3://your-archive-bucket/`,
      },
      "prose",
    ],
  },
  {
    id: "full-migration-checklist",
    blocks: ["prose"],
  },
  {
    id: "learn-from-others",
    blocks: ["prose"],
  },
];

// Card copy is in the catalog (`resourceCards`), index-aligned.
export const RESOURCE_CARD_URLS = [
  "https://github.com/solana-foundation/program-examples/tree/main/tokens/merkle-tree-token-claimer",
  "https://realms.today",
  "https://squads.xyz",
];
