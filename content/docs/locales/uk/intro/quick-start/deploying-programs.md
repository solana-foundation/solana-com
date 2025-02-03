---
sidebarLabel: Розгортання Програм
title: Розгортання Вашої Першої Програми Solana
sidebarSortOrder: 3
description:
  Дізнайтеся, як створити, розгорнути та протестувати вашу першу програму Solana
  за допомогою фреймворку Anchor та Solana Playground. Цей посібник для
  початківців демонструє, як створити просту програму, розгорнути її на devnet,
  виконати тести та закрити програму.
---

У цьому розділі ми створимо, розгорнемо та протестуємо просту програму Solana за
допомогою фреймворку Anchor. Наприкінці ви розгорнете свою першу програму у
блокчейні Solana!

Мета цього розділу — ознайомити вас із Solana Playground. Ми розглянемо більш
детальний приклад у розділах про PDA та CPI. Для отримання додаткової інформації
відвідайте сторінку [Програми на Solana](/docs/core/programs).

<Steps>

### Створення Проєкту Anchor

Спочатку відкрийте https://beta.solpg.io у новій вкладці браузера.

- Натисніть кнопку "Create a new project" у лівій панелі.

- Введіть назву проєкту, виберіть Anchor як фреймворк, потім натисніть кнопку
  "Create".

![Новий Проєкт](/assets/docs/intro/quickstart/pg-new-project.gif)

Ви побачите створений проєкт із кодом програми у файлі `src/lib.rs`.

```rust filename="lib.rs"
use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("11111111111111111111111111111111");

#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Changed data to: {}!", data); // Message will show up in the tx logs
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // We must specify the space in order to initialize an account.
    // First 8 bytes are default account discriminator,
    // next 8 bytes come from NewAccount.data being type u64.
    // (u64 = 64 bits unsigned integer = 8 bytes)
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    data: u64
}
```

<Accordion>
<AccordionItem title="Explanation">
На даний момент ми розглянемо лише загальний огляд коду програми:

- Макрос `declare_id!` визначає адресy вашої програми у блокчейні. Ця адреса
  буде автоматично оновлена, коли ми скомпілюємо програму на наступному етапі.

  ```rs
  declare_id!("11111111111111111111111111111111");
  ```

- Макрос `#[program]` позначає модуль, який містить функції, що представляють
  інструкції програми.

  ```rs
  #[program]
  mod hello_anchor {
      use super::*;
      pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
          ctx.accounts.new_account.data = data;
          msg!("Changed data to: {}!", data); // Message will show up in the tx logs
          Ok(())
      }
  }
  ```

  У цьому прикладі інструкція `initialize` приймає два параметри:

1. `ctx: Context<Initialize>` — надає доступ до акаунтів, необхідних для цієї
   інструкції, як це зазначено у структурі `Initialize`.
2. `data: u64` — параметр інструкції, який передається під час виклику
   інструкції.

Тіло функції встановлює значення поля `data` для `new_account` відповідно до
переданого аргументу `data`, а потім виводить повідомлення до журналу програми.

- Макрос `#[derive(Accounts)]` використовується для визначення структури, яка
  задає акаунти, необхідні для певної інструкції, де кожне поле представляє
  окремий акаунт.

Типи полів (наприклад, `Signer<'info>`) і обмеження (наприклад,
`#[account(mut)]`) використовуються Anchor для автоматичного виконання
стандартних перевірок безпеки, пов'язаних із валідацією акаунтів.

```rs
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

- Макрос `#[account]` використовується для визначення структури, яка представляє
  структуру даних акаунта, створеного та керованого програмою.

  ```rs
  #[account]
  pub struct NewAccount {
    data: u64
  }
  ```

</AccordionItem>
</Accordion>

### Скомпілюйте та Розгорніть Програму

Щоб скомпілювати програму, просто виконайте команду `build` у терміналі.

```shell filename="Terminal"
build
```

Зверніть увагу, що адреса у `declare_id!()` була оновлена. Це адреса вашої
програми у блокчейні.

<Accordion>
<AccordionItem title="Output">

```shell filename="Terminal"
$ build
Building...
Build successful. Completed in 1.46s.
```

</AccordionItem>
</Accordion>
Після компіляції програми виконайте команду `deploy` у терміналі, щоб розгорнути програму в мережі (за замовчуванням devnet). Для розгортання програми необхідно виділити SOL для акаунта у блокчейні, який зберігатиме програму.

Перед розгортанням переконайтеся, що у вас достатньо SOL. Ви можете отримати
devnet SOL, виконавши команду `solana airdrop 5` у терміналі Playground або
скориставшись [веб-фонтаном](https://faucet.solana.com/).

```shell filename="Terminal"
deploy
```

<Accordion>
<AccordionItem title="Output">

```shell filename="Terminal"
$ deploy
Deploying... This could take a while depending on the program size and network conditions.
Warning: 1 transaction not confirmed, retrying...
Deployment successful. Completed in 19s.
```

</AccordionItem>
</Accordion>

Альтернативно, ви також можете скористатися кнопками `Build` і `Deploy` на лівій
панелі.

![Build and Deploy](/assets/docs/intro/quickstart/pg-build-deploy.png)

Після розгортання програми ви можете викликати її інструкції.

### Тестування Програми

Разом із стартовим кодом включений тестовий файл, який знаходиться у
`tests/anchor.test.ts`. У цьому файлі показано, як викликати інструкцію
`initialize` у стартовій програмі з клієнта.

```ts filename="anchor.test.ts"
// No imports needed: web3, anchor, pg and more are globally available

describe("Test", () => {
  it("initialize", async () => {
    // Generate keypair for the new account
    const newAccountKp = new web3.Keypair();

    // Send transaction
    const data = new BN(42);
    const txHash = await pg.program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: pg.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([newAccountKp])
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await pg.connection.confirmTransaction(txHash);

    // Fetch the created account
    const newAccount = await pg.program.account.newAccount.fetch(
      newAccountKp.publicKey,
    );

    console.log("On-chain data is:", newAccount.data.toString());

    // Check whether the data on-chain is equal to local 'data'
    assert(data.eq(newAccount.data));
  });
});
```

Щоб запустити тестовий файл після розгортання програми, виконайте команду `test`
у терміналі.

```shell filename="Terminal"
test
```

Ви повинні побачити результат, який вказує, що тест пройшов успішно.

<Accordion>
<AccordionItem title="Output">

```shell filename="Terminal"
$ test
Running tests...
  hello_anchor.test.ts:
  hello_anchor
    Use 'solana confirm -v 3TewJtiUz1EgtT88pLJHvKFzqrzDNuHVi8CfD2mWmHEBAaMfC5NAaHdmr19qQYfTiBace6XUmADvR4Qrhe8gH5uc' to see the logs
    On-chain data is: 42
    ✔ initialize (961ms)
  1 passing (963ms)
```

</AccordionItem>
</Accordion>
Ви також можете скористатися кнопкою `Test` на лівій панелі.

![Run Test](/assets/docs/intro/quickstart/pg-test.png)

Потім ви можете переглянути журнали транзакцій, виконавши команду
`solana confirm -v` та вказавши хеш транзакції (підпис) із результатів тесту:

```shell filename="Terminal"
solana confirm -v [TxHash]
```

Наприклад:

```shell filename="Terminal"
solana confirm -v 3TewJtiUz1EgtT88pLJHvKFzqrzDNuHVi8CfD2mWmHEBAaMfC5NAaHdmr19qQYfTiBace6XUmADvR4Qrhe8gH5uc
```

<Accordion>
<AccordionItem title="Output">

```shell filename="Terminal" {29-35}
$ solana confirm -v 3TewJtiUz1EgtT88pLJHvKFzqrzDNuHVi8CfD2mWmHEBAaMfC5NAaHdmr19qQYfTiBace6XUmADvR4Qrhe8gH5uc
RPC URL: https://api.devnet.solana.com
Default Signer: Playground Wallet
Commitment: confirmed

Transaction executed in slot 308150984:
  Block Time: 2024-06-25T12:52:05-05:00
  Version: legacy
  Recent Blockhash: 7AnZvY37nMhCybTyVXJ1umcfHSZGbngnm4GZx6jNRTNH
  Signature 0: 3TewJtiUz1EgtT88pLJHvKFzqrzDNuHVi8CfD2mWmHEBAaMfC5NAaHdmr19qQYfTiBace6XUmADvR4Qrhe8gH5uc
  Signature 1: 3TrRbqeMYFCkjsxdPExxBkLAi9SB2pNUyg87ryBaTHzzYtGjbsAz9udfT9AkrjSo1ZjByJgJHBAdRVVTZv6B87PQ
  Account 0: srw- 3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R (fee payer)
  Account 1: srw- c7yy8zdP8oeZ2ewbSb8WWY2yWjDpg3B43jk3478Nv7J
  Account 2: -r-- 11111111111111111111111111111111
  Account 3: -r-x 2VvQ11q8xrn5tkPNyeraRsPaATdiPx8weLAD8aD4dn2r
  Instruction 0
    Program:   2VvQ11q8xrn5tkPNyeraRsPaATdiPx8weLAD8aD4dn2r (3)
    Account 0: c7yy8zdP8oeZ2ewbSb8WWY2yWjDpg3B43jk3478Nv7J (1)
    Account 1: 3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R (0)
    Account 2: 11111111111111111111111111111111 (2)
    Data: [175, 175, 109, 31, 13, 152, 155, 237, 42, 0, 0, 0, 0, 0, 0, 0]
  Status: Ok
    Fee: ◎0.00001
    Account 0 balance: ◎5.47001376 -> ◎5.46900152
    Account 1 balance: ◎0 -> ◎0.00100224
    Account 2 balance: ◎0.000000001
    Account 3 balance: ◎0.00139896
  Log Messages:
    Program 2VvQ11q8xrn5tkPNyeraRsPaATdiPx8weLAD8aD4dn2r invoke [1]
    Program log: Instruction: Initialize
    Program 11111111111111111111111111111111 invoke [2]
    Program 11111111111111111111111111111111 success
    Program log: Changed data to: 42!
    Program 2VvQ11q8xrn5tkPNyeraRsPaATdiPx8weLAD8aD4dn2r consumed 5661 of 200000 compute units
    Program 2VvQ11q8xrn5tkPNyeraRsPaATdiPx8weLAD8aD4dn2r success

Confirmed
```

</AccordionItem>
</Accordion>

Альтернативно, ви можете переглянути деталі транзакції на
[SolanaFM](https://solana.fm/) або
[Solana Explorer](https://explorer.solana.com/?cluster=devnet), здійснивши пошук
за підписом (хешем) транзакції.

<Callout>
  Нагадуємо, що потрібно оновити підключення до кластеру (мережі) у вибраному Explorer, щоб воно відповідало кластеру Solana Playground. За замовчуванням у Solana Playground використовується кластер devnet.
</Callout>

### Закриття Програми

Нарешті, SOL, виділений для програми у блокчейні, може бути повністю повернутий
шляхом закриття програми.

Ви можете закрити програму, виконавши наступну команду та вказавши адресу
програми, яка знаходиться у `declare_id!()`:

```shell filename="Terminal"
solana program close [ProgramID]
```

Наприклад:

```shell filename="Terminal"
solana program close 2VvQ11q8xrn5tkPNyeraRsPaATdiPx8weLAD8aD4dn2r
```

<Accordion>
<AccordionItem title="Output">

```shell filename="Terminal"
$ solana program close 2VvQ11q8xrn5tkPNyeraRsPaATdiPx8weLAD8aD4dn2r
Closed Program Id 2VvQ11q8xrn5tkPNyeraRsPaATdiPx8weLAD8aD4dn2r, 2.79511512 SOL reclaimed
```

</AccordionItem>
<AccordionItem title="Explanation">

Тільки орган влади оновлення програми може її закрити. Орган влади оновлення
встановлюється під час розгортання програми, і це єдиний акаунт, який має дозвіл
модифікувати або закривати програму. Якщо орган влади оновлення відкликається,
програма стає незмінною і її ніколи не можна буде закрити або оновити.

Під час розгортання програм у Solana Playground гаманцем Playground є орган
влади оновлення для всіх ваших програм.

</AccordionItem>
</Accordion>

Вітаємо! Ви щойно створили та розгорнули свою першу програму Solana за допомогою
фреймворку Anchor!

</Steps>
