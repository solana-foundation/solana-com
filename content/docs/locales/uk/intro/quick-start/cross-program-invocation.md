---
sidebarLabel: Крос-програмні виклики
title: Крос-програмні виклики
sidebarSortOrder: 5
description:
  Дізнайтеся, як реалізувати крос-програмні виклики (CPIs) у програмах Solana за
  допомогою фреймворку Anchor. У цьому підручнику демонструється, як здійснювати
  переказ SOL між акаунтами, взаємодіяти з Системною програмою та працювати з
  адресами, отриманими від програми (PDAs), у CPIs. Ідеально підходить для
  розробників, які хочуть створювати інтегровані програми Solana.
---

У цьому розділі ми оновимо програму CRUD з попереднього розділу про PDA, щоб
додати крос-програмні виклики (CPIs). Ми модифікуємо програму, щоб забезпечити
переказ SOL між акаунтами в інструкціях `update` та `delete`, демонструючи, як
взаємодіяти з іншими програмами (у цьому випадку з Системною програмою)
зсередини нашої програми.

Метою цього розділу є покрокове пояснення процесу реалізації CPIs у програмі
Solana за допомогою фреймворку Anchor, спираючись на концепції PDA, які ми
розглядали в попередньому розділі. Для отримання додаткової інформації перейдіть
на сторінку [Крос-програмні виклики](/docs/uk/core/cpi).

<Steps>

### Модифікація інструкції Update

Спочатку ми реалізуємо простий механізм "оплати за оновлення" шляхом модифікації
структури `Update` та функції `update`.

Розпочнемо з оновлення файлу `lib.rs`, щоб включити до області видимості
елементи з модуля `system_program`.

```rs filename="lib.rs"
use anchor_lang::system_program::{transfer, Transfer};
```

<Accordion>
<AccordionItem title="Diff">

```diff
  use anchor_lang::prelude::*;
+ use anchor_lang::system_program::{transfer, Transfer};
```

</AccordionItem>
</Accordion>

Далі оновіть структуру Update, щоб включити додатковий акаунт під назвою
`vault_account`. Цей акаунт, який контролюється нашою програмою, отримуватиме
SOL від користувача, коли той оновлює свій акаунт повідомлень.

```rs filename="lib.rs"
#[account(
    mut,
    seeds = [b"vault", user.key().as_ref()],
    bump,
)]
pub vault_account: SystemAccount<'info>,
```

<Accordion>
<AccordionItem title="Diff">

```diff
#[derive(Accounts)]
#[instruction(message: String)]
pub struct Update<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

+   #[account(
+       mut,
+       seeds = [b"vault", user.key().as_ref()],
+       bump,
+   )]
+   pub vault_account: SystemAccount<'info>,
    #[account(
        mut,
        seeds = [b"message", user.key().as_ref()],
        bump = message_account.bump,
        realloc = 8 + 32 + 4 + message.len() + 1,
        realloc::payer = user,
        realloc::zero = true,
    )]
    pub message_account: Account<'info, MessageAccount>,
    pub system_program: Program<'info, System>,
}
```

</AccordionItem>
<AccordionItem title="Explanation">
Ми додаємо новий акаунт під назвою `vault_account` до нашої структури `Update`. Цей акаунт служить програмно-контрольованим "сейфом", який буде отримувати SOL від користувачів, коли вони оновлюють свої повідомлення.

Використовуючи PDA (Program Derived Address) для сейфа, ми створюємо
програмно-контрольований акаунт, унікальний для кожного користувача, що дозволяє
нам управляти коштами користувачів у межах логіки нашої програми.

---

Основні аспекти `vault_account`:

- **Адреса акаунта**:  
  Адреса акаунта є PDA, що отримується за допомогою сідів:  
  `[b"vault", user.key().as_ref()]`
- **Відсутність приватного ключа**:  
  Оскільки це PDA, він не має приватного ключа, тому лише наша програма може
  "підписуватися" за цю адресу під час виконання CPIs.
- **Тип акаунта**:  
  Це акаунт типу `SystemAccount`, який належить до Системної програми, як і
  звичайні гаманці.

---

Ця структура дозволяє нашій програмі:

- Генерувати унікальні, детерміновані адреси для кожного "сейфа" користувача.
- Контролювати кошти без необхідності використання приватного ключа для
  підписання транзакцій.

---

У інструкції `delete` ми покажемо, як наша програма може "підписуватися" за цей
PDA під час CPI.

---

Далі: реалізуйте логіку CPI в інструкції `update`

Реалізуйте логіку CPI для переказу **0.001 SOL** з акаунта користувача на акаунт
сейфа.

```rs filename="lib.rs"
let transfer_accounts = Transfer {
    from: ctx.accounts.user.to_account_info(),
    to: ctx.accounts.vault_account.to_account_info(),
};
let cpi_context = CpiContext::new(
    ctx.accounts.system_program.to_account_info(),
    transfer_accounts,
);
transfer(cpi_context, 1_000_000)?;
```

<Accordion>
<AccordionItem title="Diff">

```diff
    pub fn update(ctx: Context<Update>, message: String) -> Result<()> {
        msg!("Update Message: {}", message);
        let account_data = &mut ctx.accounts.message_account;
        account_data.message = message;

+       let transfer_accounts = Transfer {
+           from: ctx.accounts.user.to_account_info(),
+           to: ctx.accounts.vault_account.to_account_info(),
+       };
+       let cpi_context = CpiContext::new(
+           ctx.accounts.system_program.to_account_info(),
+           transfer_accounts,
+       );
+       transfer(cpi_context, 1_000_000)?;
        Ok(())
    }
```

</AccordionItem>
<AccordionItem title="Explanation">

В інструкції `update` ми реалізуємо виклик між програмами (CPI), щоб викликати
інструкцію `transfer` Системної програми. Це демонструє, як виконати CPI у межах
нашої програми, забезпечуючи композиційність програм у Solana.

Структура `Transfer` визначає необхідні акаунти для інструкції `transfer`
Системної програми:

- `from` - Акаунт користувача (джерело коштів)
- `to` - Акаунт сейфа (ціль для переказу коштів)

  ```rs filename="lib.rs"
  let transfer_accounts = Transfer {
      from: ctx.accounts.user.to_account_info(),
      to: ctx.accounts.vault_account.to_account_info(),
  };
  ```

  `CpiContext` визначає:

- Програму, яку потрібно викликати (Системна програма)
- Акаунти, необхідні для CPI (визначені у структурі `Transfer`)

  ```rs filename="lib.rs"
  let cpi_context = CpiContext::new(
      ctx.accounts.system_program.to_account_info(),
      transfer_accounts,
  );
  ```

Функція `transfer` викликає інструкцію переказу у Системній програмі, передаючи:

- `cpi_context` (програму та акаунти)
- Суму для переказу (1,000,000 лампортів, що еквівалентно 0.001 SOL)

  ```rs filename="lib.rs"
  transfer(cpi_context, 1_000_000)?;
  ```

---

Налаштування для CPI відповідає тому, як створюються інструкції на стороні
клієнта, де ми вказуємо програму, акаунти та дані інструкції для виклику
конкретної інструкції. Коли викликається інструкція `update` нашої програми,
вона внутрішньо викликає інструкцію переказу Системної програми.

</AccordionItem>
</Accordion>

Перекомпілюйте програму.

```shell filename="Terminal"
build
```

### Змініть Інструкцію Delete

Ми реалізуємо механізм "повернення коштів при видаленні", змінивши структуру
`Delete` та функцію `delete`.

Спершу оновіть структуру `Delete`, додавши до неї `vault_account`. Це дозволить
нам переказати всі SOL із сейфа назад користувачеві, коли він закриває свій
акаунт повідомлення.

```rs filename="lib.rs"
#[account(
    mut,
    seeds = [b"vault", user.key().as_ref()],
    bump,
)]
pub vault_account: SystemAccount<'info>,
```

Також додайте `system_program`, оскільки CPI для переказу вимагає виклику
Системної програми.

```rs filename="lib.rs"
pub system_program: Program<'info, System>,
```

<Accordion>
<AccordionItem title="Diff">

```diff
#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

+   #[account(
+       mut,
+       seeds = [b"vault", user.key().as_ref()],
+       bump,
+   )]
+   pub vault_account: SystemAccount<'info>,
    #[account(
        mut,
        seeds = [b"message", user.key().as_ref()],
        bump = message_account.bump,
        close= user,
    )]
    pub message_account: Account<'info, MessageAccount>,
+   pub system_program: Program<'info, System>,
}
```

</AccordionItem>
<AccordionItem title="Explanation">

Акаунт `vault_account` використовує той самий PDA, що і в структурі `Update`.

Додавання `vault_account` до структури `Delete` дозволяє нашій програмі отримати
доступ до сейфа користувача під час виконання інструкції видалення, щоб
переказати накопичені SOL назад користувачеві.

</AccordionItem>
</Accordion>

Далі реалізуйте логіку CPI в інструкції `delete`, щоб переказати SOL із сейфа
назад на акаунт користувача.

```rs filename="lib.rs"
let user_key = ctx.accounts.user.key();
let signer_seeds: &[&[&[u8]]] =
    &[&[b"vault", user_key.as_ref(), &[ctx.bumps.vault_account]]];

let transfer_accounts = Transfer {
    from: ctx.accounts.vault_account.to_account_info(),
    to: ctx.accounts.user.to_account_info(),
};
let cpi_context = CpiContext::new(
    ctx.accounts.system_program.to_account_info(),
    transfer_accounts,
).with_signer(signer_seeds);
transfer(cpi_context, ctx.accounts.vault_account.lamports())?;
```

Зверніть увагу, що ми оновили `_ctx: Context<Delete>` до `ctx: Context<Delete>`,
оскільки будемо використовувати контекст у тілі функції.

<Accordion>
<AccordionItem title="Diff">

```diff
-    pub fn delete(_ctx: Context<Delete>) -> Result<()> {
+    pub fn delete(ctx: Context<Delete>) -> Result<()> {
         msg!("Delete Message");

+        let user_key = ctx.accounts.user.key();
+        let signer_seeds: &[&[&[u8]]] =
+            &[&[b"vault", user_key.as_ref(), &[ctx.bumps.vault_account]]];
+
+        let transfer_accounts = Transfer {
+            from: ctx.accounts.vault_account.to_account_info(),
+            to: ctx.accounts.user.to_account_info(),
+        };
+        let cpi_context = CpiContext::new(
+            ctx.accounts.system_program.to_account_info(),
+            transfer_accounts,
+        ).with_signer(signer_seeds);
+        transfer(cpi_context, ctx.accounts.vault_account.lamports())?;
         Ok(())
     }

```

</AccordionItem>
<AccordionItem title="Explanation">
В інструкції `delete` ми реалізуємо ще один виклик між програмами (CPI), щоб викликати інструкцію переказу Системної програми. Цей CPI демонструє, як здійснити переказ, який потребує підписувача на основі Program Derived Address (PDA).

Спершу ми визначаємо сіди для підпису PDA сейфа:

```rs filename="lib.rs"
let user_key = ctx.accounts.user.key();
let signer_seeds: &[&[&[u8]]] =
    &[&[b"vault", user_key.as_ref(), &[ctx.bumps.vault_account]]];
```

Структура `Transfer` визначає необхідні акаунти для інструкції переказу
Системної програми:

- `from`: Акаунт сейфа (джерело коштів)
- `to`: Акаунт користувача (ціль для переказу коштів)

  ```rs filename="lib.rs"
  let transfer_accounts = Transfer {
      from: ctx.accounts.vault_account.to_account_info(),
      to: ctx.accounts.user.to_account_info(),
  };
  ```

  `CpiContext` визначає:

- Програму, яку потрібно викликати (Системна програма)
- Акаунти, задіяні у переказі (визначені у структурі `Transfer`)
- Сіди для підпису PDA

  ```rs filename="lib.rs"
  let cpi_context = CpiContext::new(
      ctx.accounts.system_program.to_account_info(),
      transfer_accounts,
  ).with_signer(signer_seeds);
  ```

  Функція `transfer` викликає інструкцію переказу в Системній програмі,
  передаючи:

- `cpi_context` (програму, акаунти та підписувач на основі PDA)
- Суму для переказу (весь баланс акаунта сейфа)

  ```rs filename="lib.rs"
  transfer(cpi_context, ctx.accounts.vault_account.lamports())?;
  ```

  Ця реалізація CPI демонструє, як програми можуть використовувати PDA для
  управління коштами. Коли викликається інструкція `delete` нашої програми, вона
  внутрішньо викликає інструкцію переказу Системної програми, підписуючи за PDA,
  щоб авторизувати переказ усіх коштів із сейфа назад користувачеві.

</AccordionItem>
</Accordion>

Перекомпілюйте програму.

```shell filename="Terminal"
build
```

### Розгортання Програми

Після внесення цих змін нам потрібно повторно розгорнути оновлену програму. Це
забезпечує доступність модифікованої програми для тестування. У Solana оновлення
програми вимагає лише розгортання скомпільованої програми за тим самим
ідентифікатором програми (program ID).

```shell filename="Terminal"
deploy
```

<Accordion>
<AccordionItem title="Output">

```bash
$ deploy
Deploying... This could take a while depending on the program size and network conditions.
Deployment successful. Completed in 17s.
```

</AccordionItem>
<AccordionItem title="Explanation">

Лише орган влади оновлення (upgrade authority) програми може її оновити. Орган
влади оновлення встановлюється під час розгортання програми, і це єдиний акаунт,
який має дозвіл модифікувати або закривати програму. Якщо орган влади оновлення
відкликається, програма стає незмінною і її ніколи не можна буде закрити або
оновити.

Під час розгортання програм у Solana Playground гаманцем Playground є орган
влади оновлення для всіх ваших програм.

</AccordionItem>
</Accordion>

### Оновлення Файлу Тестів

Далі ми оновимо наш файл `anchor.test.ts`, щоб включити новий акаунт сейфа у
наші інструкції. Це вимагає отримання PDA сейфа та його включення до викликів
інструкцій `update` і `delete`.

#### Отримання PDA Сейфа

Спершу додайте код для отримання PDA сейфа:

```ts filename="anchor.test.ts"
const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault"), wallet.publicKey.toBuffer()],
  program.programId,
);
```

<Accordion>
<AccordionItem title="Diff">

```diff
describe("pda", () => {
  const program = pg.program;
  const wallet = pg.wallet;

  const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("message"), wallet.publicKey.toBuffer()],
    program.programId
  );

+  const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
+    [Buffer.from("vault"), wallet.publicKey.toBuffer()],
+    program.programId
+  );

  // ...tests
  });
```

</AccordionItem>
</Accordion>
#### Зміна Тесту Update

Далі оновіть інструкцію `update`, щоб включити `vaultAccount`.

```ts filename="anchor.test.ts"  {5}
const transactionSignature = await program.methods
  .update(message)
  .accounts({
    messageAccount: messagePda,
    vaultAccount: vaultPda,
  })
  .rpc({ commitment: "confirmed" });
```

<Accordion>
<AccordionItem title="Diff">

```diff
    const transactionSignature = await program.methods
      .update(message)
      .accounts({
        messageAccount: messagePda,
+       vaultAccount: vaultPda,
      })
      .rpc({ commitment: "confirmed" });
```

</AccordionItem>
</Accordion>

#### Зміна Тесту Delete

Далі оновіть інструкцію `delete`, щоб включити `vaultAccount`.

```ts filename="anchor.test.ts"  {5}
const transactionSignature = await program.methods
  .delete()
  .accounts({
    messageAccount: messagePda,
    vaultAccount: vaultPda,
  })
  .rpc({ commitment: "confirmed" });
```

<Accordion>
<AccordionItem title="Diff">

```diff
    const transactionSignature = await program.methods
      .delete()
      .accounts({
        messageAccount: messagePda,
+       vaultAccount: vaultPda,
      })
      .rpc({ commitment: "confirmed" });
```

</AccordionItem>
</Accordion>
### Перезапуск Тестів

Після внесення цих змін запустіть тести, щоб переконатися, що все працює, як
очікувалося:

```shell filename="Terminal"
test
```

<Accordion>
<AccordionItem title="Output">

```bash
$ test
Running tests...
  anchor.test.ts:
  pda
    {
  "user": "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
  "message": "Hello, World!",
  "bump": 254
}
    Transaction Signature: https://solana.fm/tx/qGsYb87mUUjeyh7Ha7r9VXkACw32HxVBujo2NUxqHiUc8qxRMFB7kdH2D4JyYtPBx171ddS91VyVrFXypgYaKUr?cluster=devnet-solana
    ✔ Create Message Account (842ms)
    {
  "user": "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
  "message": "Hello, Solana!",
  "bump": 254
}
    Transaction Signature: https://solana.fm/tx/3KCDnNSfDDfmSy8kpiSrJsGGkzgxx2mt18KejuV2vmJjeyenkSoEfs2ghUQ6cMoYYgd9Qax9CbnYRcvF2zzumNt8?cluster=devnet-solana
    ✔ Update Message Account (946ms)
    Expect Null: null
    Transaction Signature: https://solana.fm/tx/3M7Z7Mea3TtQc6m9z386B9QuEgvLKxD999mt2RyVtJ26FgaAzV1QA5mxox3eXie3bpBkNpDQ4mEANr3trVHCWMC2?cluster=devnet-solana
    ✔ Delete Message Account (859ms)
  3 passing (3s)
```

</AccordionItem>
</Accordion>
Після цього ви можете переглянути посилання SolanFM, щоб побачити деталі транзакції, де ви знайдете CPI для інструкцій переказу в межах інструкцій `update` і `delete`.

![Update CPI](/assets/docs/intro/quickstart/cpi-update.png)

![Delete CPI](/assets/docs/intro/quickstart/cpi-delete.png)

Якщо ви зіткнулися з помилками, ви можете переглянути
[фінальний код](https://beta.solpg.io/668304cfcffcf4b13384d20a).

</Steps>

## Наступні Кроки

Ви завершили посібник з швидкого старту Solana! Ви дізналися про акаунти,
транзакції, PDA, CPI та розгорнули власні програми.

Відвідайте сторінки [Основні Концепції](/docs/uk/core/accounts) для більш
детального пояснення тем, розглянутих у цьому посібнику.

Додаткові навчальні матеріали доступні на сторінці
[Ресурси для Розробників](/developers).

### Досліджуйте Більше Прикладів

Якщо ви віддаєте перевагу навчанню через приклади, перегляньте
[Репозиторій з Прикладами Програм](https://github.com/solana-developers/program-examples)
для різноманітних прикладів програм.

Solana Playground пропонує зручну функцію, яка дозволяє імпортувати або
переглядати проєкти за їх посиланнями на GitHub. Наприклад, відкрийте це
[посилання Solana Playground](https://beta.solpg.io/https://github.com/solana-developers/program-examples/tree/main/basics/hello-solana/anchor),
щоб переглянути Anchor-проєкт із цього
[репозиторію GitHub](https://github.com/solana-developers/program-examples/tree/main/basics/hello-solana/anchor).

Натисніть кнопку `Import` і введіть ім'я проєкту, щоб додати його до свого
списку проєктів у Solana Playground. Після імпорту проєкту всі зміни автоматично
зберігаються та залишаються у середовищі Playground.
