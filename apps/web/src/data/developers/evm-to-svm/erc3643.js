const CONTENT_BLOCK_STYLE_KEYS = {
  spacing: "spacing",
  spacingWithMargins: "spacingWithMargins",
  spacingNoBottom: "spacingNoBottom",
  tableWrapper: "tableWrapper",
  smallOnly: "smallOnly",
  cardDeckWrapper: "cardDeckWrapper",
};

export const BLOCK_STYLES = {
  [CONTENT_BLOCK_STYLE_KEYS.spacing]: {
    large: { paddingTop: "20px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacingWithMargins]: {
    large: { paddingTop: "20px", marginTop: "auto", marginBottom: "auto" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacingNoBottom]: {
    large: { paddingTop: "20px", paddingBottom: "0px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.tableWrapper]: {
    large: {
      paddingRight: "50px",
      paddingLeft: "50px",
      paddingTop: "20px",
      marginBottom: "40px",
    },
  },
  [CONTENT_BLOCK_STYLE_KEYS.smallOnly]: {
    large: { display: "none" },
    medium: { display: "none" },
    small: { display: "flex" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.cardDeckWrapper]: {
    large: { paddingTop: "0px", marginTop: "-3px" },
  },
};

export const META = {
  seoImage:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fc5e5cc5ab3864937a21fcce2eca83194.png",
};

export const NAV_BUTTONS = [
  {
    label: "",
    hierarchy: "outline",
    size: "md",
    iconSize: "md",
    startIcon: "none",
    endIcon: "none",
    url: "https://solana.com/developers/evm-to-svm",
  },
];

export const RESOURCE_CARD_DECK = {
  numCols: 3,
  featured: true,
  cards: [
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "/developers/guides/getstarted/hello-world-in-your-browser",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://www.soldev.app/course",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://youtu.be/0P8JeL3TURU?feature=shared",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "/developers",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
  ],
};

export const CONTENT_EDITOR_CTA = {
  button: {
    url: "/developers/evm-to-svm/erc20",
  },
};

export const TOKEN_EXTENSION_FEATURES_URL =
  "https://solana.com/solutions/token-extensions";

export const CODE_BLOCKS = [
  {
    code: `pragma solidity ^0.8.28;

interface ISpl20 {
    function transfer(address to, address mintAddress, uint256 amount) external;
    function getTokenAccount(address owner, address token) external view returns (uint256 balance, bool isFrozen);
    function mintTokens(address to, address mintAddress, uint256 amount) external;
}

contract SPL3643 {
    ISpl20 public immutable spl20;
    address public immutable mintAddress;

    mapping(address => bool) public isKYCApproved;
    mapping(address => bool) public frozen;

    address public complianceAuthority;
    address public transferHookProgram;

    event KYCApproved(address indexed user, bool status);
    event AccountFrozen(address indexed user, bool status);
    event TransferHookSet(address indexed hookProgram);
    event ForcedTransfer(address indexed from, address indexed to, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(address _spl20, address _mint, address authority) {
        spl20 = ISpl20(_spl20);
        mintAddress = _mint;
        complianceAuthority = authority;
    }

    modifier onlyComplianceAuth() {
        require(msg.sender == complianceAuthority, "not compliance auth");
        _;
    }

    function approveKYC(address user, bool approved) external onlyComplianceAuth {
        isKYCApproved[user] = approved;
        emit KYCApproved(user, approved);
    }

    function freezeAccount(address user, bool freeze) external onlyComplianceAuth {
        frozen[user] = freeze;
        emit AccountFrozen(user, freeze);
    }

    function setTransferHook(address hookProgram) external onlyComplianceAuth {
        transferHookProgram = hookProgram;
        emit TransferHookSet(hookProgram);
    }

    function setComplianceAuthority(address newAuthority) external onlyComplianceAuth {
        complianceAuthority = newAuthority;
    }

    function transfer(address to, uint256 amount) external {
        require(!frozen[msg.sender] && !frozen[to], "account frozen");
        require(isKYCApproved[msg.sender] && isKYCApproved[to], "KYC required");
        if (transferHookProgram != address(0)) {
            bool ok = ITransferHook(transferHookProgram).onTransfer(msg.sender, to, amount);
            require(ok, "blocked by hook");
        }
        spl20.transfer(to, mintAddress, amount);
        emit Transfer(msg.sender, to, amount);
    }

    function forceTransfer(address from, address to, uint256 amount) external onlyComplianceAuth {
        // temporarily unfreeze to bypass Spl20.transfer require(msg.sender == owner)
        frozen[from] = false;
        spl20.transfer(to, mintAddress, amount);
        frozen[from] = true;
        emit ForcedTransfer(from, to, amount);
    }
}

interface ITransferHook {
    function onTransfer(address from, address to, uint256 amount) external returns (bool);
}
`,
    language: "javascript",
  },
  {
    code: `User → Token‑2022 (transfer) ↘
                               Transfer Hook (KYC check) → OK / ERR
                               ↘
                        Token‑2022 (actual balance change)
`,
    language: "latex",
  },
  {
    code: `// programs/kyc_hook/src/lib.rs
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};
use spl_tlv_account_resolution::{seeds::Seed, state::*};
use spl_transfer_hook_interface::instruction::TransferHookInstruction;

declare_id!("KycHook1111111111111111111111111111111111111");

#[program]
pub mod kyc_hook {
    use super::*;

    /// One-time initializer: create extra_account_meta_list PDA,
    /// register the whitelist PDA, and automatically whitelist the payer.
    #[interface(spl_transfer_hook_interface::initialize_extra_account_meta_list)]
    pub fn init_meta(ctx: Context<InitMeta>) -> Result<()> {
        /* -- 1. Seed the whitelist with the payer / mint authority -- */
        let wl = &mut ctx.accounts.whitelist;
        let payer_key = ctx.accounts.payer.key();
        if !wl.allowed.contains(&payer_key) {
            wl.allowed.push(payer_key);
        }

        /* -- 2. Build ExtraAccountMeta so Token-2022 forwards whitelist -- */
        let metas = vec![ExtraAccountMeta::new_with_pubkey(
            &ctx.accounts.whitelist.key(),
            /* is_signer  */ false,
            /* is_writable*/ true,
        )?];

        /* -- 3. Create extra_account_meta_list PDA -- */
        let size     = ExtraAccountMetaList::size_of(metas.len())? as u64;
        let lamports = Rent::get()?.minimum_balance(size as usize);
        let seeds = &[
            b"extra-account-metas",
            ctx.accounts.mint.key().as_ref(),
            &[ctx.bumps.extra_metas],
        ];
        anchor_lang::system_program::create_account(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::CreateAccount {
                    from: ctx.accounts.payer.to_account_info(),
                    to:   ctx.accounts.extra_metas.to_account_info(),
                },
                &[seeds],
            ),
            lamports,
            size,
            ctx.program_id,
        )?;

        /* -- 4. Initialise TLV data inside the PDA -- */
        ExtraAccountMetaList::init::<TransferHookInstruction>(
            &mut ctx.accounts.extra_metas.try_borrow_mut_data()?,
            &metas,
        )?;
        Ok(())
    }

    /// Called automatically on every Token-2022 transfer.
    #[interface(spl_transfer_hook_interface::execute)]
    pub fn execute(ctx: Context<Hook>, _amount: u64) -> Result<()> {
        let wl  = &ctx.accounts.whitelist;
        let src = ctx.accounts.source_token.owner;
        let dst = ctx.accounts.dest_token.owner;

        require!(wl.allowed.contains(&src), ComplianceError::SrcNotAllowed);
        require!(wl.allowed.contains(&dst), ComplianceError::DstNotAllowed);
        Ok(())
    }
}

/* ---------------- Data & account structs ---------------- */

#[account]                 // simple demo whitelist
pub struct Whitelist {
    pub allowed: Vec<Pubkey>,
}

/* init_meta accounts */
#[derive(Accounts)]
pub struct InitMeta<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    /// CHECK: PDA = ["extra-account-metas", mint]
    #[account(mut, seeds = [b"extra-account-metas", mint.key().as_ref()], bump)]
    extra_metas: AccountInfo<'info>,

    /// CHECK: verified by interface macro
    #[account(mut)]
    mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    whitelist: Account<'info, Whitelist>,

    system_program: Program<'info, System>,
}

/* execute accounts (fixed order!) */
#[derive(Accounts)]
pub struct Hook<'info> {
    // 0 source token
    #[account(token::mint = mint, token::authority = owner)]
    source_token: InterfaceAccount<'info, TokenAccount>,
    // 1 mint
    mint: InterfaceAccount<'info, Mint>,
    // 2 destination token
    #[account(token::mint = mint)]
    dest_token: InterfaceAccount<'info, TokenAccount>,
    // 3 owner (source wallet)
    /// CHECK:
    owner: UncheckedAccount<'info>,
    // 4 extra_account_meta_list
    /// CHECK:
    #[account(seeds = [b"extra-account-metas", mint.key().as_ref()], bump)]
    extra_account_meta_list: UncheckedAccount<'info>,
    // 5 whitelist (forwarded via meta list)
    whitelist: Account<'info, Whitelist>,
}

#[error_code]
pub enum ComplianceError {
    #[msg("source wallet not allowed")]
    SrcNotAllowed,
    #[msg("destination wallet not allowed")]
    DstNotAllowed,
}
`,
    language: "rust",
  },
  {
    code: `# 0. Keys & PDAs
COMP_AUTH=$(solana address)          # compliance admin key
WL_PDA=<derived whitelist PDA>       # used in step 2

# 1. Build & deploy the hook
anchor build
solana program deploy target/deploy/kyc_hook.so   # save as HOOK_ID

# 2. Create a KYC-enabled mint (Token-2022 CLI)
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token \\
  --transfer-hook $HOOK_ID \\
  --enable-permanent-delegate \\
  --freeze-authority $COMP_AUTH                  # returns MINT_ADDRESS

# 3. Initialize extra_account_meta_list (one-time)
anchor run init-meta -- --mint $MINT_ADDRESS --whitelist $WL_PDA

# 4. Mint & transfer
spl-token mint     $MINT_ADDRESS 100 $(solana address)   # minting bypasses hook
spl-token transfer $MINT_ADDRESS 10 <RECIPIENT>          # hook executes, KYC enforced
`,
    language: "bash",
  },
];
