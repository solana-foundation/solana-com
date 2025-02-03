---
title: PDAs з Anchor
description:
  Дізнайтеся, як використовувати Program Derived Addresses (PDA) в програмах
  Anchor, використовуючи обмеження та реалізуючи поширені шаблони PDA
sidebarLabel: PDAs з Anchor
sidebarSortOrder: 4
---

[Program Derived Addresses (PDA)](/docs/core/pda) — це функція розробки на
Solana, яка дозволяє створювати унікальну адресу, що отримується детерміновано з
попередньо визначених вхідних значень (насіння) та ID програми.

Цей розділ охоплює базові приклади використання PDA в програмі Anchor.

## Обмеження Anchor для PDA

При використанні PDA в програмі Anchor, зазвичай використовуються обмеження
акаунтів Anchor для визначення насіння, що використовуються для отримання PDA.
Ці обмеження служать як перевірки безпеки, щоб переконатися, що правильна адреса
була отримана.

Обмеження, які використовуються для визначення насіння PDA, включають:

- `seeds`: Масив необов'язкових насінь, що використовуються для отримання PDA.
  Насіння можуть бути статичними значеннями або динамічними посиланнями на дані
  акаунтів.
- `bump`: Bump seed, що використовується для отримання PDA. Використовується для
  забезпечення того, щоб адреса не потрапляла на криву Ed25519 і була дійсним
  PDA.
- `seeds::program` - (Необов'язково) ID програми, що використовується для
  отримання адреси PDA. Це обмеження використовується лише для отримання PDA, де
  ID програми не є поточною програмою.

Обмеження `seeds` та `bump` повинні використовуватися разом.

### Приклади використання

Нижче наведені приклади, що демонструють, як використовувати обмеження PDA в
програмі Anchor.

<!-- prettier-ignore -->
<Tabs items={['seeds', 'bump', 'seeds::program', 'init']} >
<Tab value="seeds">

Обмеження `seeds` визначає необов'язкові значення, що використовуються для
отримання PDA.

#### Без необов'язкових сідів

- Використовуйте порожній масив `[]`, щоб визначити PDA без необов'язкових
  насінь.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(
        seeds = [],
        bump,
    )]
    pub pda_account: SystemAccount<'info>,
}
```

#### Одне статичне насіння

- Вкажіть необов'язкові насіння в обмеженні `seeds`.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(
        seeds = [b"hello_world"],
        bump,
    )]
    pub pda_account: SystemAccount<'info>,
}
```

#### Кілька насінь та посилань на акаунти

- Можна вказати кілька насінь в обмеженні `seeds`. Обмеження `seeds` також може
  посилатися на інші адреси акаунтів або дані акаунтів.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    pub signer: Signer<'info>,
    #[account(
        seeds = [b"hello_world", signer.key().as_ref()],
        bump,
    )]
    pub pda_account: SystemAccount<'info>,
}
```

Приклад вище використовує як статичне насіння (`b"hello_world"`), так і
динамічне насіння (публічний ключ підписанта).

</Tab>
<Tab value="bump">

Обмеження `bump` визначає bump seed, що використовується для отримання PDA.

#### Автоматичний розрахунок Bump

При використанні обмеження `bump` без вказаного значення, bump автоматично
вираховується щоразу, коли викликається інструкція.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(
        seeds = [b"hello_world"],
        bump,
    )]
    pub pda_account: SystemAccount<'info>,
}
```

#### Вказати значення Bump

Ви можете явно вказати значення bump, що корисно для оптимізації використання
обчислювальних одиниць. Це передбачає, що акаунт PDA вже був створений і bump
seed зберігається як поле в існуючому акаунті.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(
        seeds = [b"hello_world"],
        bump = pda_account.bump_seed,
    )]
    pub pda_account: Account<'info, CustomAccount>,
}

#[account]
pub struct CustomAccount {
    pub bump_seed: u8,
}
```

Зберігаючи значення bump у даних акаунту, програма не потребує його повторного
обчислення, що дозволяє заощадити обчислювальні одиниці. Збережене значення bump
може бути збережено в самому акаунті або в іншому акаунті.

</Tab>
<Tab value="seeds::program">

Обмеження `seeds::program` визначає ID програми, що використовується для
отримання PDA. Це обмеження використовується лише при отриманні PDA з іншої
програми.

Використовуйте це обмеження, коли ваша інструкція повинна взаємодіяти з
акаунтами PDA, створеними іншою програмою.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(
        seeds = [b"hello_world"],
        bump,
        seeds::program = other_program.key(),
    )]
    pub pda_account: SystemAccount<'info>,
    pub other_program: Program<'info, OtherProgram>,
}
```

</Tab>
<Tab value="init">

Обмеження `init` зазвичай використовується разом з `seeds` та `bump` для
створення нового акаунту з адресою, яка є PDA. Під капотом обмеження `init`
викликає System Program для створення акаунту.

```rs
#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        seeds = [b"hello_world", signer.key().as_ref()],
        bump,
        payer = signer,
        space = 8 + 1,
    )]
    pub pda_account: Account<'info, CustomAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct CustomAccount {
    pub bump_seed: u8,
}
```

</Tab>
</Tabs>

## Насіння PDA в IDL

Насіння Program Derived Address (PDA), визначені в обмеженні `seeds`, включені в
IDL файл програми. Це дозволяє клієнту Anchor автоматично вирішувати акаунти,
використовуючи ці насіння під час побудови інструкцій.

Наведений нижче приклад показує взаємозв'язок між програмою, IDL та клієнтом.

<!-- prettier-ignore -->
<Tabs items={['Program', 'IDL', 'Client']} >
<Tab value="Program">

Програма нижче визначає `pda_account`, використовуючи статичне насіння
(`b"hello_world"`) та публічний ключ підписанта як динамічне насіння.

```rs {18} /signer/
use anchor_lang::prelude::*;

declare_id!("BZLiJ62bzRryYp9mRobz47uA66WDgtfTXhhgM25tJyx5");

#[program]
mod hello_anchor {
    use super::*;
    pub fn test_instruction(ctx: Context<InstructionAccounts>) -> Result<()> {
        msg!("PDA: {}", ctx.accounts.pda_account.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InstructionAccounts<'info> {
    pub signer: Signer<'info>,
    #[account(
        seeds = [b"hello_world", signer.key().as_ref()],
        bump,
    )]
    pub pda_account: SystemAccount<'info>,
}
```

</Tab>
<Tab value="IDL">

IDL файл програми включає насіння PDA, визначені в обмеженні `seeds`.

- Статичне насіння `b"hello_world"` перетворюється на байтові значення.
- Динамічне насіння включається як посилання на акаунт підписанта.

```json {22-29}
{
  "address": "BZLiJ62bzRryYp9mRobz47uA66WDgtfTXhhgM25tJyx5",
  "metadata": {
    "name": "hello_anchor",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "test_instruction",
      "discriminator": [33, 223, 61, 208, 32, 193, 201, 79],
      "accounts": [
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "pda_account",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [104, 101, 108, 108, 111, 95, 119, 111, 114, 108, 100]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        }
      ],
      "args": []
    }
  ]
}
```

</Tab>
<Tab value="Client">

Клієнт Anchor може автоматично визначити адресу PDA, використовуючи IDL файл.

У наведеному нижче прикладі Anchor автоматично визначає адресу PDA,
використовуючи гаманець постачальника як підписанта, а його публічний ключ як
динамічне насіння для отримання PDA. Це усуває необхідність явного отримання PDA
під час побудови інструкції.

```ts {13}
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloAnchor } from "../target/types/hello_anchor";

describe("hello_anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.testInstruction().rpc();
    console.log("Your transaction signature", tx);
  });
});
```

Коли інструкція викликається, PDA виводиться в журнали програми, як це визначено
в інструкції програми.

```{3}
Program BZLiJ62bzRryYp9mRobz47uA66WDgtfTXhhgM25tJyx5 invoke [1]
Program log: Instruction: TestInstruction
Program log: PDA: 3Hikt5mpKaSS4UNA5Du1TZJ8tp4o8VC8YWW6X9vtfVnJ
Program BZLiJ62bzRryYp9mRobz47uA66WDgtfTXhhgM25tJyx5 consumed 18505 of 200000 compute units
Program BZLiJ62bzRryYp9mRobz47uA66WDgtfTXhhgM25tJyx5 success
```

</Tab>
</Tabs>
