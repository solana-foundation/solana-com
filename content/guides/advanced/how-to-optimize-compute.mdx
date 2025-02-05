---
featured: true
date: 2024-03-15T00:00:00Z
difficulty: intermediate
title: "How to Optimize Compute Usage on Solana"
description:
  "Minimizing the amount of compute a program uses is critical both for the
  performance and cost of executing transactions. This guide will show you how
  to optimize compute usage in your programs on Solana."
tags:
  - rust
  - compute
keywords:
  - tutorial
  - priority fees
  - compute usage
  - offline signing
  - transactions
  - intro to solana development
  - blockchain developer
  - blockchain tutorial
  - web3 developer
---

When developing on Solana, it's important to keep in mind the compute usage of
your programs. Program compute usage has an impact on both the max performance
your users can have, as well as increase the cost of executing transactions with
priority fees.

Optimizing your Compute Unit (CU) usage has the following benefits:

1. A smaller transaction is more likely to be included in a block.
2. Cheaper instructions make your program more composable.
3. Lowers overall amount of block usage, enabling more transactions to be
   included in a block.

In this guide, we'll cover how to optimize your program's compute usage to
ensure it's as efficient as possible.

## What are the Current Compute Limitations?

Solana programs have a few compute limitations to be aware of:

- **Max Compute per block**: 48 million CU
- **Max Compute per account per block**: 12 million CU
- **Max Compute per transaction**: 1.4 million CU

Keeping your program's compute usage within these limits is important to ensure
your program can be executed in a timely manner and at a reasonable cost.
Especially when your program starts to get used by a large number of users, you
want to make sure that your program's compute usage is as efficient as possible
to avoid hitting the max compute per account cap.

## How to Measure Compute Usage

When building out your Solana program, you'll want to check how much compute
different parts of your program are using. You can use the `compute_fn` macro to
measure compute unit usage of different snippets of code.

You measure your compute usage with the following code:

```rust
compute_fn!("My message" => {
    // Your code here
});
```

The output of this macro will give you the compute usage before and after your
code, helping you understand what parts of your program are using the most
compute. You can find an example of using this macro in the
[cu_optimizations repository.](https://github.com/solana-developers/cu_optimizations/blob/main/counterAnchor/anchor/programs/counter/src/lib.rs#L20)

## Optimizing your Program

### Logging

While logging is a great way to understand what is going on inside your program,
logging is also very expensive. You should avoid logging non-essential
information in your programs to keep your program usage down.

For example, both base58 encoding and concatenation are expensive operations:

```rust
// 11962 CU !!
// Base58 encoding is expensive, concatenation is expensive
compute_fn! { "Log a pubkey to account info" =>
    msg!("A string {0}", ctx.accounts.counter.to_account_info().key());
}

// 357 CU - string concatenation is expensive
compute_fn! { "Log a pubkey simple concat" =>
    msg!("A string {0}", "5w6z5PWvtkCd4PaAV7avxE6Fy5brhZsFdbRLMt8UefRQ");
}
```

If you do want to log a pubkey, you can use `.key()` and `.log()` to efficiently
log it with lower compute usage:

```rust
// 262 cu
compute_fn! { "Log a pubkey" =>
    ctx.accounts.counter.to_account_info().key().log();
}
```

### Data Types

Larger data types use more Compute Units overall. Make sure you actually need a
larger data type such as a `u64` before you use it, as it can incur much higher
usage overall compared to a smaller data type such as a `u8`.

```rust
// 357
compute_fn! { "Push Vector u64 " =>
    let mut a: Vec<u64> = Vec::new();
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
}

// 211 CU
compute_fn! { "Vector u8 " =>
    let mut a: Vec<u8> = Vec::new();
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(1);
}
```

Overall these data type differences can add up to costing a lot more throughout
your program.

### Serialization

Serialization and deserialization are both expensive operations depending on the
account struct. If possible, use zero copy and directly interact with the
account data to avoid these expensive operations.

```rust
// 6302 CU
pub fn initialize(_ctx: Context<InitializeCounter>) -> Result<()> {
    Ok(())
}

// 5020 CU
pub fn initialize_zero_copy(_ctx: Context<InitializeCounterZeroCopy>) -> Result<()> {
    Ok(())
}
```

```rust
// 108 CU - total CU including serialization 2600
let counter = &mut ctx.accounts.counter;
compute_fn! { "Borsh Serialize" =>
    counter.count = counter.count.checked_add(1).unwrap();
}

// 151 CU - total CU including serialization 1254
let counter = &mut ctx.accounts.counter_zero_copy.load_mut()?;
compute_fn! { "Zero Copy Serialize" =>
    counter.count = counter.count.checked_add(1).unwrap();
}
```

Using the above examples, you can potentially save half or more of your total CU
usage by using zero copy within your program.

### Program Derived Addresses

Using Program Derived Addresses(PDAs) is a common practice within your program,
but it's important to be aware of the compute usage of `find_program_address`
and how you can optimize it.

If `find_program_address` has to take a long time to find a valid address,
meaning it has a high bump, the overall compute unit usage will be higher. You
can optimize finding the PDAs after initialization by saving the bump into an
account and using it in the future.

```rust
pub fn pdas(ctx: Context<PdaAccounts>) -> Result<()> {
    let program_id = Pubkey::from_str("5w6z5PWvtkCd4PaAV7avxE6Fy5brhZsFdbRLMt8UefRQ").unwrap();

    // 12,136 CUs
    compute_fn! { "Find PDA" =>
        Pubkey::find_program_address(&[b"counter"], ctx.program_id);
    }

    // 1,651 CUs
    compute_fn! { "Find PDA" =>
        Pubkey::create_program_address(&[b"counter", &[248_u8]], &program_id).unwrap();
    }

    Ok(())
}

#[derive(Accounts)]
pub struct PdaAccounts<'info> {
    #[account(mut)]
    pub counter: Account<'info, CounterData>,
    // 12,136 CUs when not defining the bump
    #[account(
        seeds = [b"counter"],
        bump
    )]
    pub counter_checked: Account<'info, CounterData>,
}

#[derive(Accounts)]
pub struct PdaAccounts<'info> {
    #[account(mut)]
    pub counter: Account<'info, CounterData>,
    // only 1600 if using the bump that is saved in the counter_checked account
    #[account(
        seeds = [b"counter"],
        bump = counter_checked.bump
    )]
    pub counter_checked: Account<'info, CounterData>,
}
```

## Further Compute Optimizations

There are many other ways to optimize your program's compute usage, such as
writing in native instead of anchor, but it all comes at a cost. If you want the
absolute best compute usage on your program, you should evaluate and test
different methods to see what works best for your specific use case.
