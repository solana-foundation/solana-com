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
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F46090d5a9f6b4c5cad45a659a2079a20.png",
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

export const CONCEPTUAL_MAP_TABLE = {
  headers: [
    "contentEditor.conceptualMapTable.headers.0",
    "contentEditor.conceptualMapTable.headers.1",
    "contentEditor.conceptualMapTable.headers.2",
  ],
  rows: [
    {
      labelKey: "contentEditor.conceptualMapTable.rows.0.label",
      objectKey: "contentEditor.conceptualMapTable.rows.0.object",
      purposeKey: "contentEditor.conceptualMapTable.rows.0.purpose",
    },
    {
      labelKey: "contentEditor.conceptualMapTable.rows.1.label",
      objectKey: "contentEditor.conceptualMapTable.rows.1.object",
      purposeKey: "contentEditor.conceptualMapTable.rows.1.purpose",
    },
    {
      labelKey: "contentEditor.conceptualMapTable.rows.2.label",
      objectKey: "contentEditor.conceptualMapTable.rows.2.object",
      purposeKey: "contentEditor.conceptualMapTable.rows.2.purpose",
    },
    {
      labelKey: "contentEditor.conceptualMapTable.rows.3.label",
      objectKey: "contentEditor.conceptualMapTable.rows.3.object",
      purposeParts: [
        {
          type: "text",
          key: "contentEditor.conceptualMapTable.rows.3.purpose.prefix",
        },
        { type: "code", value: "share_mint" },
        {
          type: "text",
          key: "contentEditor.conceptualMapTable.rows.3.purpose.middle",
        },
        { type: "code", value: "pda_bump" },
        {
          type: "text",
          key: "contentEditor.conceptualMapTable.rows.3.purpose.suffix",
        },
      ],
    },
    {
      labelKey: "contentEditor.conceptualMapTable.rows.4.label",
      objectKey: "contentEditor.conceptualMapTable.rows.4.object",
      purposeKey: "contentEditor.conceptualMapTable.rows.4.purpose",
    },
  ],
};

export const CODE_BLOCKS = [
  {
    code: `Program  ──┐
           └─> handles instructions
Accounts ───┘  (carry all mutable state)`,
    language: "latex",
  },
  {
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISpl20 {
    function mintTokens(address to, address mintAddr, uint256 amount) external;
    function transfer(address to, address mintAddr, uint256 amount) external;
    function getMint(address mintAddr) external view returns (uint8, uint256, address, address, address);
    function getTokenAccount(address owner, address mintAddr) external view returns (address, address, uint256, bool);
}

contract Spl4626Vault {
    ISpl20  public immutable spl20;
    address public immutable mintAddr;
    uint8   public immutable assetDecimals;
    uint256 public totalShareSupply;

    mapping(address => uint256) public shareBalance;
    mapping(address => mapping(address => uint256)) public shareAllowance;

    bool private locked;

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares);
    event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares);

    modifier nonReentrant() {
        require(!locked, "REENTRANCY");
        locked = true;
        _;
        locked = false;
    }

    constructor(ISpl20 _spl20, address _mintAddr) {
        spl20 = _spl20;
        mintAddr = _mintAddr;
        (uint8 dec,, , ,) = _spl20.getMint(_mintAddr);
        assetDecimals = dec;
    }

    function totalAssets() public view returns (uint256 assets) {
        (, , assets, ) = spl20.getTokenAccount(address(this), mintAddr);
    }

    function convertToShares(uint256 assets) public view returns (uint256) {
        return totalShareSupply == 0 ? assets : (assets * totalShareSupply) / totalAssets();
    }

    function convertToAssets(uint256 shares) public view returns (uint256) {
        return totalShareSupply == 0 ? shares : (shares * totalAssets()) / totalShareSupply;
    }

    function _mint(address to, uint256 amount) internal {
        totalShareSupply += amount;
        shareBalance[to] += amount;
    }

    function _burn(address from, uint256 amount) internal {
        shareBalance[from] -= amount;
        totalShareSupply -= amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        shareAllowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function deposit(uint256 assets, address receiver) external nonReentrant returns (uint256 shares) {
        require(assets > 0, "zero assets");
        spl20.transfer(address(this), mintAddr, assets);
        shares = convertToShares(assets);
        _mint(receiver, shares);
        emit Deposit(msg.sender, receiver, assets, shares);
    }

    function redeem(uint256 shares, address receiver, address owner) external nonReentrant returns (uint256 assets) {
        require(shares > 0, "zero shares");
        if (msg.sender != owner) {
            uint256 allowed = shareAllowance[owner][msg.sender];
            require(allowed >= shares, "allowance too low");
            if (allowed != type(uint256).max) {
                shareAllowance[owner][msg.sender] = allowed - shares;
            }
        }
        assets = convertToAssets(shares);
        _burn(owner, shares);
        spl20.transfer(receiver, mintAddr, assets);
        emit Withdraw(msg.sender, receiver, owner, assets, shares);
    }
}
`,
    language: "solidity",
  },
  {
    code: `use anchor_lang::prelude::*;
use anchor_spl::token::{
    self, Mint, Token, TokenAccount,
    Transfer, MintTo, Burn,
};

declare_id!("VaUlt4626pHkYwWjSfERn6y6oAYcg4UH8zQcAXXXXXXXXX"); // replace after deploy

#[account]
pub struct VaultState {
    pub share_mint: Pubkey,
    pub pda_bump:   u8,
}
const VAULT_STATE_SIZE: usize = 8 + 32 + 1;

#[program]
pub mod spl_4626_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state        = &mut ctx.accounts.vault_state;
        state.share_mint = ctx.accounts.share_mint.key();
        state.pda_bump   = *ctx.bumps.get("token_account_owner_pda").unwrap();
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, assets: u64) -> Result<()> {
        require!(assets > 0, CustomError::ZeroAmount);
        token::transfer(ctx.accounts.transfer_into_vault_ctx(), assets)?;

        let supply        = ctx.accounts.share_mint.supply;
        let total_assets  = ctx.accounts.vault_token_account.amount;
        let shares = if supply == 0 {
            assets
        } else {
            (assets as u128 * supply as u128 / total_assets as u128) as u64
        };

        token::mint_to(ctx.accounts.mint_shares_ctx(), shares)?;

        emit!(DepositEvt {
            caller:   ctx.accounts.signer.key(),
            receiver: ctx.accounts.signer.key(),
            assets,
            shares,
        });
        Ok(())
    }

    pub fn redeem(ctx: Context<Redeem>, shares: u64) -> Result<()> {
        require!(shares > 0, CustomError::ZeroAmount);

        let supply        = ctx.accounts.share_mint.supply;
        let total_assets  = ctx.accounts.vault_token_account.amount;
        let assets        = (shares as u128 * total_assets as u128 / supply as u128) as u64;

        token::burn(ctx.accounts.burn_shares_ctx(), shares)?;
        token::transfer(ctx.accounts.transfer_out_ctx(), assets)?;

        emit!(WithdrawEvt {
            caller:   ctx.accounts.signer.key(),
            receiver: ctx.accounts.signer.key(),
            owner:    ctx.accounts.signer.key(),
            assets,
            shares,
        });
        Ok(())
    }
}

#[event]
pub struct DepositEvt {
    pub caller:   Pubkey,
    pub receiver: Pubkey,
    pub assets:   u64,
    pub shares:   u64,
}
#[event]
pub struct WithdrawEvt {
    pub caller:   Pubkey,
    pub receiver: Pubkey,
    pub owner:    Pubkey,
    pub assets:   u64,
    pub shares:   u64,
}

#[error_code]
pub enum CustomError {
    #[msg("amount must be > 0")]
    ZeroAmount,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer  = signer,
        seeds  = [b"vault_state"],
        bump,
        space  = VAULT_STATE_SIZE,
    )]
    pub vault_state: Account<'info, VaultState>,

    #[account(seeds = [b"token_account_owner_pda"], bump)]
    /// CHECK: program-derived signer
    pub token_account_owner_pda: AccountInfo<'info>,

    #[account(
        init,
        payer = signer,
        seeds = [b"share_mint"],
        bump,
        mint::decimals   = mint_of_token_being_sent.decimals,
        mint::authority  = token_account_owner_pda,
    )]
    pub share_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = signer,
        seeds = [b"token_vault", mint_of_token_being_sent.key().as_ref()],
        bump,
        token::mint      = mint_of_token_being_sent,
        token::authority = token_account_owner_pda,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub mint_of_token_being_sent: Account<'info, Mint>,

    #[account(mut)] pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program:  Program<'info, Token>,
    pub rent:           Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut, seeds=[b"vault_state"], bump)]
    pub vault_state: Account<'info, VaultState>,
    #[account(seeds=[b"token_account_owner_pda"], bump)]
    /// CHECK:
    pub token_account_owner_pda: AccountInfo<'info>,

    #[account(mut,
        seeds=[b"token_vault", mint_of_token_being_sent.key().as_ref()],
        bump,
        token::mint      = mint_of_token_being_sent,
        token::authority = token_account_owner_pda
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(mut)] pub sender_token_account: Account<'info, TokenAccount>,
    #[account(mut)] pub sender_share_account: Account<'info, TokenAccount>,

    #[account(seeds=[b"share_mint"], bump)]
    pub share_mint: Account<'info, Mint>,
    pub mint_of_token_being_sent: Account<'info, Mint>,

    #[account(mut)] pub signer: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Redeem<'info> {
    #[account(mut, seeds=[b"vault_state"], bump)]
    pub vault_state: Account<'info, VaultState>,
    #[account(seeds=[b"token_account_owner_pda"], bump)]
    /// CHECK:
    pub token_account_owner_pda: AccountInfo<'info>,

    #[account(mut,
        seeds=[b"token_vault", mint_of_token_being_sent.key().as_ref()],
        bump,
        token::mint      = mint_of_token_being_sent,
        token::authority = token_account_owner_pda
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(mut)] pub sender_token_account: Account<'info, TokenAccount>,
    #[account(mut)] pub sender_share_account: Account<'info, TokenAccount>,

    #[account(seeds=[b"share_mint"], bump)]
    pub share_mint: Account<'info, Mint>,
    pub mint_of_token_being_sent: Account<'info, Mint>,

    #[account(mut)] pub signer: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

impl<'info> Deposit<'info> {
    fn transfer_into_vault_ctx(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from:      self.sender_token_account.to_account_info(),
                to:        self.vault_token_account.to_account_info(),
                authority: self.signer.to_account_info(),
            },
        )
    }
    fn mint_shares_ctx(&self) -> CpiContext<'_, '_, '_, 'info, MintTo<'info>> {
        let seeds = &[b"token_account_owner_pda", &[self.vault_state.pda_bump]];
        CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            MintTo {
                mint:      self.share_mint.to_account_info(),
                to:        self.sender_share_account.to_account_info(),
                authority: self.token_account_owner_pda.to_account_info(),
            },
            &[seeds],
        )
    }
}

impl<'info> Redeem<'info> {
    fn burn_shares_ctx(&self) -> CpiContext<'_, '_, '_, 'info, Burn<'info>> {
        let seeds = &[b"token_account_owner_pda", &[self.vault_state.pda_bump]];
        CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            Burn {
                mint:      self.share_mint.to_account_info(),
                from:      self.sender_share_account.to_account_info(),
                authority: self.token_account_owner_pda.to_account_info(),
            },
            &[seeds],
        )
    }
    fn transfer_out_ctx(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let seeds = &[b"token_account_owner_pda", &[self.vault_state.pda_bump]];
        CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            Transfer {
                from:      self.vault_token_account.to_account_info(),
                to:        self.sender_token_account.to_account_info(),
                authority: self.token_account_owner_pda.to_account_info(),
            },
            &[seeds],
        )
    }
}
`,
    language: "rust",
  },
];
