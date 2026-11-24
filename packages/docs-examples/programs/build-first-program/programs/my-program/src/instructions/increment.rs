use anchor_lang::prelude::*;

use crate::{constants::*, error::ErrorCode, state::Counter};

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(
        mut,
        seeds = [COUNTER_SEED],
        bump
    )]
    pub counter: Account<'info, Counter>,
    pub authority: Signer<'info>,
}

pub fn handle_increment(ctx: Context<Increment>) -> Result<()> {
    require_keys_eq!(
        ctx.accounts.counter.authority,
        ctx.accounts.authority.key(),
        ErrorCode::Unauthorized,
    );
    require!(
        ctx.accounts.counter.count < MAX_COUNT,
        ErrorCode::CounterOverflow,
    );

    ctx.accounts.counter.count += 1;
    msg!("Hello, world! Counter is now {}", ctx.accounts.counter.count);
    Ok(())
}
