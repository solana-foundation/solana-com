---
title: CPIs з Anchor
description:
  Дізнайтеся, як реалізувати Cross Program Invocations (CPI) в програмах на
  Anchor, що дозволяє взаємодіяти між різними програмами на Solana
sidebarLabel: CPIs з Anchor
sidebarSortOrder: 5
---

[Cross Program Invocations (CPI)](/docs/core/cpi.md) означають процес, коли одна
програма викликає інструкції іншої програми, що дозволяє здійснювати композицію
програм на Solana.

Цей розділ охоплює основи реалізації CPIs в програмі Anchor, використовуючи
інструкцію простого переказу SOL як практичний приклад. Після того, як ви
зрозумієте основи реалізації CPI, ви зможете застосувати ці ж концепції для
будь-якої інструкції.

## Cross Program Invocations

Розглянемо програму, яка реалізує CPI для інструкції переказу в System Program.
Ось приклад програми на
[Solana Playground](https://beta.solpg.io/66df2751cffcf4b13384d35a).

Файл `lib.rs` містить одну інструкцію `sol_transfer`. Коли інструкція
`sol_transfer` в програмі Anchor викликається, програма внутрішньо викликає
інструкцію переказу з System Program.

```rs filename="lib.rs" /sol_transfer/ /transfer/ {23}
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("9AvUNHjxscdkiKQ8tUn12QCMXtcnbR9BVGq3ULNzFMRi");

#[program]
pub mod cpi {
    use super::*;

    pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
        let from_pubkey = ctx.accounts.sender.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

        let cpi_context = CpiContext::new(
            program_id,
            Transfer {
                from: from_pubkey,
                to: to_pubkey,
            },
        );

        transfer(cpi_context, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(mut)]
    sender: Signer<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
```

Файл `cpi.test.ts` показує, як викликати інструкцію `sol_transfer` програми
Anchor і реєструє посилання на деталі транзакції на SolanaFM.

```ts filename="cpi.test.ts"
it("SOL Transfer Anchor", async () => {
  const transactionSignature = await program.methods
    .solTransfer(new BN(transferAmount))
    .accounts({
      sender: sender.publicKey,
      recipient: recipient.publicKey,
    })
    .rpc();

  console.log(
    `\nTransaction Signature:` +
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```

Ви можете побудувати, розгорнути та запустити тест для цього прикладу на
Playground, щоб переглянути деталі транзакції на
[SolanaFM explorer](https://solana.fm/).

Деталі транзакції покажуть, що спочатку була викликана програма Anchor
(інструкція 1), яка потім викликає System Program (інструкція 1.1), що
призводить до успішного переказу SOL.

![Деталі транзакції](/assets/docs/core/cpi/transaction-details.png)

### Пояснення прикладу 1

Реалізація CPI слідує такому ж шаблону, як і створення інструкції для додавання
в транзакцію. Коли реалізуємо CPI, потрібно вказати ID програми, рахунки та дані
інструкції для викликаної інструкції.

Інструкція переказу в System Program вимагає два рахунки:

- `from`: Рахунок, що надсилає SOL.
- `to`: Рахунок, що отримує SOL.

У прикладній програмі структура `SolTransfer` вказує рахунки, необхідні для
інструкції переказу. System Program також включена, оскільки CPI викликає System
Program.

```rust /sender/ /recipient/ /system_program/
#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(mut)]
    sender: Signer<'info>, // from account
    #[account(mut)]
    recipient: SystemAccount<'info>, // to account
    system_program: Program<'info, System>, // program ID
}
```

Наступні вкладки представляють три підходи до реалізації Cross Program
Invocations (CPI), кожен з яких має різний рівень абстракції. Усі приклади є
функціонально еквівалентними. Основною метою є ілюстрація деталей реалізації
CPI.

<!-- prettier-ignore -->
<Tabs groupId="language" items={['1', '2', '3']}>
<Tab value="1">

Інструкція `sol_transfer`, включена в прикладний код, показує типовий підхід до
побудови CPIs за допомогою фреймворку Anchor.

Цей підхід передбачає створення
[`CpiContext`](https://docs.rs/anchor-lang/latest/anchor_lang/context/struct.CpiContext.html),
який містить `program_id` та рахунки, необхідні для викликаної інструкції, а
також допоміжну функцію (`transfer`) для виклику конкретної інструкції.

```rust
use anchor_lang::system_program::{transfer, Transfer};
```

```rust /cpi_context/ {14}
pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    let from_pubkey = ctx.accounts.sender.to_account_info();
    let to_pubkey = ctx.accounts.recipient.to_account_info();
    let program_id = ctx.accounts.system_program.to_account_info();

    let cpi_context = CpiContext::new(
        program_id,
        Transfer {
            from: from_pubkey,
            to: to_pubkey,
        },
    );

    transfer(cpi_context, amount)?;
    Ok(())
}
```

Змінна `cpi_context` вказує ID програми (System Program) та рахунки (відправник
і отримувач), необхідні для інструкції переказу.

```rust /program_id/ /from_pubkey/ /to_pubkey/
let cpi_context = CpiContext::new(
    program_id,
    Transfer {
        from: from_pubkey,
        to: to_pubkey,
    },
);
```

Змінні `cpi_context` та `amount` передаються в функцію `transfer` для виконання
CPI, що викликає інструкцію переказу з System Program.

```rust
transfer(cpi_context, amount)?;
```

</Tab>
<Tab value="2">

Цей приклад показує інший підхід до реалізації CPI за допомогою функції `invoke`
та
[`system_instruction::transfer`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/system_instruction.rs#L881),
що зазвичай використовується в рідних програмах на Rust.

Під капотом попередній приклад є абстракцією цієї реалізації. Нижче наведений
приклад є функціонально еквівалентним попередньому.

```rust
use anchor_lang::solana_program::{program::invoke, system_instruction};
```

```rust /instruction/1,3 {9}
pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    let from_pubkey = ctx.accounts.sender.to_account_info();
    let to_pubkey = ctx.accounts.recipient.to_account_info();
    let program_id = ctx.accounts.system_program.to_account_info();

    let instruction =
        &system_instruction::transfer(&from_pubkey.key(), &to_pubkey.key(), amount);

    invoke(instruction, &[from_pubkey, to_pubkey, program_id])?;
    Ok(())
}
```

</Tab>
<Tab value="3">

Ви також можете вручну створити інструкцію для передачі в функцію `invoke()`. Це
корисно, коли немає доступної бібліотеки, що допомагає побудувати інструкцію,
яку ви хочете викликати. Цей підхід вимагає вказати `AccountMeta` для інструкції
та правильно створити буфер даних інструкції.

Інструкція `sol_transfer` нижче є вручну реалізованим CPI для інструкції
переказу в System Program.

```rust /instruction/10,13 {28}
pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    let from_pubkey = ctx.accounts.sender.to_account_info();
    let to_pubkey = ctx.accounts.recipient.to_account_info();
    let program_id = ctx.accounts.system_program.to_account_info();

    // Prepare instruction AccountMetas
    let account_metas = vec![
        AccountMeta::new(from_pubkey.key(), true),
        AccountMeta::new(to_pubkey.key(), false),
    ];

    // SOL transfer instruction discriminator
    let instruction_discriminator: u32 = 2;

    // Prepare instruction data
    let mut instruction_data = Vec::with_capacity(4 + 8);
    instruction_data.extend_from_slice(&instruction_discriminator.to_le_bytes());
    instruction_data.extend_from_slice(&amount.to_le_bytes());

    // Create instruction
    let instruction = Instruction {
        program_id: program_id.key(),
        accounts: account_metas,
        data: instruction_data,
    };

    // Invoke instruction
    invoke(&instruction, &[from_pubkey, to_pubkey, program_id])?;
    Ok(())
}
```

Інструкція `sol_transfer` вище повторює цей
[приклад](/docs/core/transactions.md#manual-sol-transfer) вручну побудованої
інструкції переказу SOL. Вона слідує тому ж шаблону, що і створення
[інструкції](/docs/core/transactions.md#instruction) для додавання в транзакцію.

При створенні інструкції на Rust використовуйте наступний синтаксис для вказівки
`AccountMeta` для кожного рахунку:

```rust
AccountMeta::new(account1_pubkey, true),           // writable, signer
AccountMeta::new(account2_pubkey, false),          // writable, not signer
AccountMeta::new_readonly(account3_pubkey, false), // not writable, not signer
AccountMeta::new_readonly(account4_pubkey, true),  // writable, signer
```

</Tab>
</Tabs>

Ось програмний приклад на
[Solana Playground](https://beta.solpg.io/github.com/ZYJLiu/doc-examples/tree/main/cpi),
який містить усі 3 приклади.

## Cross Program Invocations з PDA підписами

Далі розглянемо програму, яка реалізує CPI для інструкції переказу в System
Program, де відправником є Програма Походження Адреси (PDA), для якої програма
повинна "підписати" транзакцію. Ось приклад програми на
[Solana Playground](https://beta.solpg.io/66df2bd2cffcf4b13384d35b).

Файл `lib.rs` містить наступну програму з єдиною інструкцією `sol_transfer`.

```rust filename="lib.rs"
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("3455LkCS85a4aYmSeNbRrJsduNQfYRY82A7eCD3yQfyR");

#[program]
pub mod cpi {
    use super::*;

    pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
        let from_pubkey = ctx.accounts.pda_account.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

        let seed = to_pubkey.key();
        let bump_seed = ctx.bumps.pda_account;
        let signer_seeds: &[&[&[u8]]] = &[&[b"pda", seed.as_ref(), &[bump_seed]]];

        let cpi_context = CpiContext::new(
            program_id,
            Transfer {
                from: from_pubkey,
                to: to_pubkey,
            },
        )
        .with_signer(signer_seeds);

        transfer(cpi_context, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(
        mut,
        seeds = [b"pda", recipient.key().as_ref()],
        bump,
    )]
    pda_account: SystemAccount<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
```

Файл `cpi.test.ts` показує, як викликати інструкцію `sol_transfer` програми
Anchor і реєструє посилання на деталі транзакції на SolanaFM.

Він показує, як отримати PDA за допомогою насіння, вказаного в програмі:

```ts /pda/ /wallet.publicKey/
const [PDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("pda"), wallet.publicKey.toBuffer()],
  program.programId,
);
```

Першим кроком у цьому прикладі є фінансування рахунку PDA за допомогою простого
переказу SOL з гаманця Playground.

```ts filename="cpi.test.ts"
it("Fund PDA with SOL", async () => {
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: PDA,
    lamports: transferAmount,
  });

  const transaction = new Transaction().add(transferInstruction);

  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [wallet.payer], // signer
  );

  console.log(
    `\nTransaction Signature:` +
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```

Коли PDA буде фінансовано SOL, викликається інструкція `sol_transfer`. Ця
інструкція переказує SOL з рахунку PDA назад на рахунок `wallet` через CPI до
System Program, що "підписується" програмою.

```ts
it("SOL Transfer with PDA signer", async () => {
  const transactionSignature = await program.methods
    .solTransfer(new BN(transferAmount))
    .accounts({
      pdaAccount: PDA,
      recipient: wallet.publicKey,
    })
    .rpc();

  console.log(
    `\nTransaction Signature: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```

Ви можете побудувати, розгорнути та запустити тест, щоб переглянути деталі
транзакції на [SolanaFM explorer](https://solana.fm/).

Деталі транзакції покажуть, що спочатку була викликана користувацька програма
(інструкція 1), яка потім викликає System Program (інструкція 1.1), що
призводить до успішного переказу SOL.

![Деталі транзакції](/assets/docs/core/cpi/transaction-details-pda.png)

### Пояснення прикладу 2

У прикладному коді структура `SolTransfer` вказує рахунки, необхідні для
інструкції переказу.

Відправником є PDA, для якого програма повинна підписати транзакцію. `seeds`,
які використовуються для отримання адреси для `pda_account`, включають зашитий
рядок "pda" та адресу рахунку `recipient`. Це означає, що адреса для
`pda_account` є унікальною для кожного `recipient`.

```rust /pda_account/ /recipient/2 /system_program/
#[derive(Accounts)]
pub struct SolTransfer<'info> {
    #[account(
        mut,
        seeds = [b"pda", recipient.key().as_ref()],
        bump,
    )]
    pda_account: SystemAccount<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
```

Еквівалент на Javascript для отримання PDA включений у тестовий файл.

```ts /pda/ /wallet.publicKey/
const [PDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("pda"), wallet.publicKey.toBuffer()],
  program.programId,
);
```

Наступні вкладки представляють два підходи до реалізації Cross Program
Invocations (CPI), кожен з яких має різний рівень абстракції. Обидва приклади є
функціонально еквівалентними. Основною метою є ілюстрація деталей реалізації
CPI.

<!-- prettier-ignore -->
<Tabs groupId="language" items={['1', '2']}>
<Tab value="1">

Інструкція `sol_transfer`, включена в прикладний код, показує типовий підхід до
побудови CPIs за допомогою фреймворку Anchor.

Цей підхід передбачає створення
[`CpiContext`](https://docs.rs/anchor-lang/latest/anchor_lang/context/struct.CpiContext.html),
який містить `program_id` та рахунки, необхідні для викликаної інструкції, а
також допоміжну функцію (`transfer`) для виклику конкретної інструкції.

```rust /cpi_context/ {19}
pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    let from_pubkey = ctx.accounts.pda_account.to_account_info();
    let to_pubkey = ctx.accounts.recipient.to_account_info();
    let program_id = ctx.accounts.system_program.to_account_info();

    let seed = to_pubkey.key();
    let bump_seed = ctx.bumps.pda_account;
    let signer_seeds: &[&[&[u8]]] = &[&[b"pda", seed.as_ref(), &[bump_seed]]];

    let cpi_context = CpiContext::new(
        program_id,
        Transfer {
            from: from_pubkey,
            to: to_pubkey,
        },
    )
    .with_signer(signer_seeds);

    transfer(cpi_context, amount)?;
    Ok(())
}
```

При підписанні за допомогою PDA, насіння та bump seed включаються в
`cpi_context` як `signer_seeds` за допомогою `with_signer()`. Bump seed для PDA
можна отримати за допомогою `ctx.bumps`, після чого вказується ім'я рахунку PDA.

```rust /signer_seeds/ /bump_seed/ {3}
let seed = to_pubkey.key();
let bump_seed = ctx.bumps.pda_account;
let signer_seeds: &[&[&[u8]]] = &[&[b"pda", seed.as_ref(), &[bump_seed]]];

let cpi_context = CpiContext::new(
    program_id,
    Transfer {
        from: from_pubkey,
        to: to_pubkey,
    },
)
.with_signer(signer_seeds);
```

Змінні `cpi_context` та `amount` передаються в функцію `transfer` для виконання
CPI.

```rust
transfer(cpi_context, amount)?;
```

Коли обробляється CPI, середовище виконання Solana перевіряє, чи правильно
наведені насіння та ID програми викликача для отримання дійсного PDA. Потім PDA
додається як підписант під час виклику. Цей механізм дозволяє програмам
підписувати PDA, які отримані з їхнього ID програми.

</Tab>
<Tab value="2">

Під капотом попередній приклад є обгорткою для функції `invoke_signed()`, яка
використовує
[`system_instruction::transfer`](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/system_instruction.rs#L881)
для побудови інструкції.

Цей приклад показує, як використовувати функцію `invoke_signed()`, щоб зробити
CPI підписаним PDA.

```rust
use anchor_lang::solana_program::{program::invoke_signed, system_instruction};
```

```rust /instruction/1,3 {13}
pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
    let from_pubkey = ctx.accounts.pda_account.to_account_info();
    let to_pubkey = ctx.accounts.recipient.to_account_info();
    let program_id = ctx.accounts.system_program.to_account_info();

    let seed = to_pubkey.key();
    let bump_seed = ctx.bumps.pda_account;
    let signer_seeds: &[&[&[u8]]] = &[&[b"pda", seed.as_ref(), &[bump_seed]]];

    let instruction =
        &system_instruction::transfer(&from_pubkey.key(), &to_pubkey.key(), amount);

    invoke_signed(instruction, &[from_pubkey, to_pubkey, program_id], signer_seeds)?;
    Ok(())
}
```

Ця реалізація функціонально еквівалентна попередньому прикладу. `signer_seeds`
передаються в функцію `invoke_signed`.

</Tab>
</Tabs>

Ось програмний приклад на
[Solana Playground](https://beta.solpg.io/github.com/ZYJLiu/doc-examples/tree/main/cpi-pda),
який містить обидва приклади.
