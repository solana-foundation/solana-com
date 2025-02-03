---
title: Файл IDL
description:
  Дізнайтесь про файл Interface Definition Language (IDL) в Anchor, його
  призначення, переваги та те, як він спрощує взаємодію програми з клієнтами
sidebarLabel: Файл IDL
sidebarSortOrder: 2
---

Файл Interface Definition Language (IDL) надає стандартизований JSON-файл, який
описує інструкції та рахунки програми. Цей файл спрощує процес інтеграції вашої
програми на блокчейні з клієнтськими додатками.

Основні переваги IDL:

- Стандартизація: Надає послідовний формат для опису інструкцій та рахунків
  програми
- Генерація клієнта: Використовується для генерації коду клієнта для взаємодії з
  програмою

Команда `anchor build` генерує файл IDL, який знаходиться за адресою
`/target/idl/<program-name>.json`.

Нижче наведені фрагменти коду, що показують, як програма, IDL та клієнт
взаємопов'язані.

## Інструкції програми

Масив `instructions` у файлі IDL безпосередньо відповідає інструкціям,
визначеним у вашій програмі. Він вказує на необхідні рахунки та параметри для
кожної інструкції.

<!-- prettier-ignore -->
<Tabs items={['Program', 'IDL', 'Client']} >
<Tab value="Program">

Наведена програма включає інструкцію `initialize`, що вказує на рахунки та
параметри, які вона потребує.

```rust {8-12, 15-22}
use anchor_lang::prelude::*;

declare_id!("BYFW1vhC1ohxwRbYoLbAWs86STa25i9sD5uEusVjTYNd");

#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Changed data to: {}!", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    data: u64,
}
```

</Tab>
<Tab value="IDL">

Згенерований файл IDL включає інструкцію в стандартизованому форматі JSON,
включаючи її ім'я, рахунки, аргументи та дискримінатор.

```json filename="JSON" {11-12, 14-27, 30-33}
{
  "address": "BYFW1vhC1ohxwRbYoLbAWs86STa25i9sD5uEusVjTYNd",
  "metadata": {
    "name": "hello_anchor",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
      "accounts": [
        {
          "name": "new_account",
          "writable": true,
          "signer": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "NewAccount",
      "discriminator": [176, 95, 4, 118, 91, 177, 125, 232]
    }
  ],
  "types": [
    {
      "name": "NewAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "data",
            "type": "u64"
          }
        ]
      }
    }
  ]
}
```

</Tab>
<Tab value="Client">

Файл IDL потім використовується для генерації клієнта для взаємодії з програмою,
спрощуючи процес виклику інструкції програми.

```ts {19-26}
import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { HelloAnchor } from "../target/types/hello_anchor";
import { Keypair } from "@solana/web3.js";
import assert from "assert";

describe("hello_anchor", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;

  it("initialize", async () => {
    // Generate keypair for the new account
    const newAccountKp = new Keypair();

    // Send transaction
    const data = new BN(42);
    const transactionSignature = await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: wallet.publicKey,
      })
      .signers([newAccountKp])
      .rpc();

    // Fetch the created account
    const newAccount = await program.account.newAccount.fetch(
      newAccountKp.publicKey,
    );

    console.log("Transaction signature: ", transactionSignature);
    console.log("On-chain data is:", newAccount.data.toString());
    assert(data.eq(newAccount.data));
  });
});
```

</Tab>
</Tabs>

## Рахунки програми

Масив `accounts` у файлі IDL відповідає структурам у програмі, позначеним
макросом `#[account]`. Ці структури визначають дані, які зберігаються в
рахунках, створених програмою.

<!-- prettier-ignore -->
<Tabs items={['Program', 'IDL', 'Client']} >
<Tab value="Program">

Наведена програма визначає структуру `NewAccount` з одним полем `data` типу
`u64`.

```rust {24-27}
use anchor_lang::prelude::*;

declare_id!("BYFW1vhC1ohxwRbYoLbAWs86STa25i9sD5uEusVjTYNd");

#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Changed data to: {}!", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    data: u64,
}
```

</Tab>
<Tab value="IDL">

Згенерований файл IDL включає рахунок у стандартизованому форматі JSON,
включаючи його ім'я, дискримінатор та поля.

```json filename="JSON" {39-40, 45-54}
{
  "address": "BYFW1vhC1ohxwRbYoLbAWs86STa25i9sD5uEusVjTYNd",
  "metadata": {
    "name": "hello_anchor",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
      "accounts": [
        {
          "name": "new_account",
          "writable": true,
          "signer": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "NewAccount",
      "discriminator": [176, 95, 4, 118, 91, 177, 125, 232]
    }
  ],
  "types": [
    {
      "name": "NewAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "data",
            "type": "u64"
          }
        ]
      }
    }
  ]
}
```

</Tab>
<Tab value="Client">

Файл IDL потім використовується для генерації клієнта для взаємодії з програмою,
спрощуючи процес отримання та десеріалізації даних рахунку.

```ts {29-31}
import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { HelloAnchor } from "../target/types/hello_anchor";
import { Keypair } from "@solana/web3.js";
import assert from "assert";

describe("hello_anchor", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;

  it("initialize", async () => {
    // Generate keypair for the new account
    const newAccountKp = new Keypair();

    // Send transaction
    const data = new BN(42);
    const transactionSignature = await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: wallet.publicKey,
      })
      .signers([newAccountKp])
      .rpc();

    // Fetch the created account
    const newAccount = await program.account.newAccount.fetch(
      newAccountKp.publicKey,
    );

    console.log("Transaction signature: ", transactionSignature);
    console.log("On-chain data is:", newAccount.data.toString());
    assert(data.eq(newAccount.data));
  });
});
```

</Tab>
</Tabs>

## Дискримінатори

Anchor призначає унікальний 8-байтовий дискримінатор для кожної інструкції та
типу рахунку в програмі. Ці дискримінатори служать як ідентифікатори для
відрізнення різних інструкцій або типів рахунків.

Дискримінатор генерується за допомогою перших 8 байтів хешу Sha256 префікса,
поєднаного з ім'ям інструкції або рахунку. Починаючи з версії Anchor v0.30, ці
дискримінатори включені в файл IDL.

Зверніть увагу, що при роботі з Anchor, вам зазвичай не потрібно взаємодіяти
безпосередньо з цими дискримінаторами. Цей розділ надає контекст щодо того, як
генерується і використовується дискримінатор.

<!-- prettier-ignore -->
<Tabs items={['Instructions', 'Accounts']} >
<Tab value="Instructions">

Дискримінатор інструкції використовується програмою для визначення, яку
конкретну інструкцію виконати при виклику.

Коли інструкція програми Anchor викликається, дискримінатор включається як перші
8 байтів даних інструкції. Це робиться автоматично клієнтом Anchor.

```json filename="IDL"  {4}
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
       ...
    }
  ]
```

Дискримінатор для інструкції — це перші 8 байтів хешу Sha256 префікса `global`
плюс ім'я інструкції.

Наприклад:

```
sha256("global:initialize")
```

Hexadecimal output:

```
af af 6d 1f 0d 98 9b ed d4 6a 95 07 32 81 ad c2 1b b5 e0 e1 d7 73 b2 fb bd 7a b5 04 cd d4 aa 30
```

The first 8 bytes are used as the discriminator for the instruction.

```
af = 175
af = 175
6d = 109
1f = 31
0d = 13
98 = 152
9b = 155
ed = 237
```

Реалізацію генерації дискримінатора ви можете знайти в кодовій базі Anchor
[тут](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/syn/src/codegen/program/common.rs#L5-L19),
яка використовується
[тут](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/syn/src/codegen/program/instruction.rs#L27).

</Tab>
<Tab value="Accounts">

Дискримінатор рахунку використовується для ідентифікації конкретного типу
рахунку при десеріалізації даних з ланцюга та встановлюється при створенні
рахунку.

```json filename="IDL"  {4}
  "accounts": [
    {
      "name": "NewAccount",
      "discriminator": [176, 95, 4, 118, 91, 177, 125, 232]
    }
  ]
```

Дискримінатор для рахунку — це перші 8 байтів хешу Sha256 префікса `account`
плюс ім'я рахунку.

Наприклад:

```
sha256("account:NewAccount")
```

Hexadecimal output:

```
b0 5f 04 76 5b b1 7d e8 a1 93 57 2a d3 5e b1 ae e5 f0 69 e2 09 7e 5c d2 64 56 55 2a cb 4a e9 57
```

Перші 8 байтів використовуються як дискримінатор для рахунку.

```
b0 = 176
5f = 95
04 = 4
76 = 118
5b = 91
b1 = 177
7d = 125
e8 = 232
```

Реалізацію генерації дискримінатора ви можете знайти в кодовій базі Anchor
[тут](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/account/src/lib.rs#L101-L117).

Зверніть увагу, що різні програми, які використовують однакові імена рахунків,
генеруватимуть той самий дискримінатор. При десеріалізації даних рахунків
програми Anchor також перевірятимуть, що рахунок належить очікуваній програмі
для заданого типу рахунку.

</Tab>
<Tab value="Events">

Дискримінатор події використовується для ідентифікації конкретного типу події
при десеріалізації даних з ланцюга при емісії події.

```json filename="IDL"  {4}
  "events": [
    {
      "name": "NewEvent",
      "discriminator": [113, 21, 185, 70, 164, 99, 232, 201]
    }
  ]
```

Дискримінатор для події — це перші 8 байтів хешу Sha256 префікса `event` плюс
ім'я події.

Наприклад:

```
sha256("event:NewEvent")
```

Hexadecimal output:

```
71 15 b9 46 a4 63 e8 c9 2a 3c 4d 83 87 16 cd 9b 66 28 cb e2 cb 7c 5d 70 59 f3 42 2b dc 35 03 53
```

Перші 8 байтів використовуються як дискримінатор для рахунку.

Перетворення з шістнадцяткового в десятковий дає нам:

```
71 = 113
15 = 21
b9 = 185
46 = 70
a4 = 164
63 = 99
e8 = 232
c9 = 201
```

Реалізацію генерації дискримінатора ви можете знайти в кодовій базі Anchor
[тут](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/event/src/lib.rs#L23-L27).

Зверніть увагу, що різні програми, які використовують однакові імена подій,
генеруватимуть той самий дискримінатор. При десеріалізації даних подій програми
Anchor також перевірятимуть, що подія належить очікуваній програмі для заданого
типу події.

</Tab>
</Tabs>
