---
sidebarLabel: Program Derived Address
title: Програма Derived Address
sidebarSortOrder: 4
description:
  Дізнайтеся, як створити CRUD (Create, Read, Update, Delete) програму Solana,
  використовуючи Program Derived Addresses (PDAs) і фреймворк Anchor. Цей
  покроковий посібник демонструє, як створювати, оновлювати та видаляти акаунти
  повідомлень у блокчейні за допомогою PDAs, реалізувати валідацію акаунтів і
  писати тести. Ідеально для розробників, які хочуть зрозуміти, як
  використовувати PDAs у програмах Solana.
---

У цьому розділі ми розглянемо, як створити базову CRUD (Create, Read, Update,
Delete) програму. Програма зберігатиме повідомлення користувача, використовуючи
Program Derived Address (PDA) як адресу акаунта.

Мета цього розділу – провести вас через етапи створення і тестування програми
Solana, використовуючи фреймворк Anchor, і показати, як використовувати PDA у
програмі. Для отримання додаткової інформації відвідайте сторінку
[Programs Derived Address](/docs/uk/core/pda).

Для довідки ось [фінальний код](https://beta.solpg.io/668304cfcffcf4b13384d20a),
завершений після розгляду розділів PDA і CPI.

<Steps>

### Стартовий Код

Почніть, відкривши це
[посилання на Solana Playground](https://beta.solpg.io/66734b7bcffcf4b13384d1ad)
зі стартовим кодом. Потім натисніть кнопку "Import", щоб додати програму до
вашого списку проєктів у Solana Playground.

![Import](/assets/docs/intro/quickstart/pg-import.png)

У файлі `lib.rs` ви знайдете шаблон програми з інструкціями `create`, `update` і
`delete`, які ми реалізуємо на наступних етапах.

```rs filename="lib.rs"
use anchor_lang::prelude::*;

declare_id!("8KPzbM2Cwn4Yjak7QYAEH9wyoQh86NcBicaLuzPaejdw");

#[program]
pub mod pda {
    use super::*;

    pub fn create(_ctx: Context<Create>) -> Result<()> {
        Ok(())
    }

    pub fn update(_ctx: Context<Update>) -> Result<()> {
        Ok(())
    }

    pub fn delete(_ctx: Context<Delete>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create {}

#[derive(Accounts)]
pub struct Update {}

#[derive(Accounts)]
pub struct Delete {}

#[account]
pub struct MessageAccount {}
```

Перед початком виконайте команду `build` у терміналі Playground, щоб
переконатися, що стартова програма успішно компілюється.

```shell filename="Terminal"
build
```

<Accordion>
<AccordionItem title="Output">

```shell filename="Terminal"
$ build
Building...
Build successful. Completed in 3.50s.
```

</AccordionItem>
</Accordion>

### Визначення Типу Акаунта Повідомлення

Спочатку визначимо структуру акаунта повідомлення, який створюватиме наша
програма. Це дані, які ми зберігатимемо в акаунті, створеному програмою.

У файлі `lib.rs` оновіть структуру `MessageAccount` наступним кодом:

```rs filename="lib.rs"
#[account]
pub struct MessageAccount {
    pub user: Pubkey,
    pub message: String,
    pub bump: u8,
}
```

<Accordion>
<AccordionItem title="Diff">

```diff
- #[account]
- pub struct MessageAccount {}

+ #[account]
+ pub struct MessageAccount {
+    pub user: Pubkey,
+    pub message: String,
+    pub bump: u8,
+ }
```

</AccordionItem>
<AccordionItem title="Explanation">

Макрос `#[account]` у програмі Anchor використовується для позначення структур,
які представляють дані акаунта (тип даних, що зберігається у полі даних
`AccountInfo`).

У цьому прикладі ми визначаємо структуру `MessageAccount` для зберігання
повідомлення, створеного користувачами, яка містить три поля:

- `user` — `Pubkey`, який представляє користувача, що створив акаунт
  повідомлення.
- `message` — `String`, який містить повідомлення користувача.
- `bump` — `u8`, що зберігає ["bump" seed](/docs/uk/core/pda#canonical-bump),
  використаний для отримання адреси, створеної програмою (PDA). Зберігання цього
  значення економить обчислювальні ресурси, оскільки усуває необхідність
  повторного обчислення для кожного використання в наступних інструкціях.

Коли акаунт створюється, дані `MessageAccount` будуть серіалізовані та збережені
у полі даних нового акаунта.

Пізніше, під час читання з акаунта, ці дані можна буде десеріалізувати назад у
тип даних `MessageAccount`. Процес створення та читання даних акаунта буде
продемонстровано у розділі тестування.

</AccordionItem>
</Accordion>

Скомпілюйте програму знову, виконавши команду `build` у терміналі.

```shell filename="Terminal"
build
```

Ми визначили, як виглядатиме наш акаунт повідомлення. Далі ми реалізуємо
інструкції програми.

### Реалізація Інструкції Create

Тепер реалізуємо інструкцію `create` для створення та ініціалізації
`MessageAccount`.

Почніть із визначення акаунтів, необхідних для цієї інструкції, оновивши
структуру `Create` наступним кодом:

```rs filename="lib.rs"
#[derive(Accounts)]
#[instruction(message: String)]
pub struct Create<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        seeds = [b"message", user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + 32 + 4 + message.len() + 1
    )]
    pub message_account: Account<'info, MessageAccount>,
    pub system_program: Program<'info, System>,
}
```

<Accordion>
<AccordionItem title="Diff">

```diff
- #[derive(Accounts)]
- pub struct Create {}

+ #[derive(Accounts)]
+ #[instruction(message: String)]
+ pub struct Create<'info> {
+     #[account(mut)]
+     pub user: Signer<'info>,
+
+     #[account(
+         init,
+         seeds = [b"message", user.key().as_ref()],
+         bump,
+         payer = user,
+         space = 8 + 32 + 4 + message.len() + 1
+     )]
+     pub message_account: Account<'info, MessageAccount>,
+     pub system_program: Program<'info, System>,
+ }
```

</AccordionItem>
<AccordionItem title="Explanation">
Макрос `#[derive(Accounts)]` у програмі Anchor використовується для позначення структур, які представляють список акаунтів, необхідних для інструкції, де кожне поле в структурі є акаунтом.

Кожен акаунт (поле) у структурі позначається типом акаунта (наприклад,
`Signer<'info>`) і може бути додатково позначений обмеженнями (наприклад,
`#[account(mut)]`). Тип акаунта разом із обмеженнями акаунта використовуються
для виконання перевірок безпеки акаунтів, переданих до інструкції.

Назви кожного поля використовуються лише для нашого розуміння і не впливають на
валідацію акаунтів, однак рекомендується використовувати описові імена акаунтів.

---

Структура `Create` визначає акаунти, необхідні для інструкції `create`.

1. `user: Signer<'info>`

   - Представляє користувача, який створює акаунт повідомлення.
   - Позначений як змінний (`#[account(mut)]`), оскільки оплачує створення
     нового акаунта.
   - Повинен бути підписувачем, щоб підтвердити транзакцію, оскільки лампорти
     будуть списані з акаунта.

2. `message_account: Account<'info, MessageAccount>`

   - Новий акаунт, створений для зберігання повідомлення користувача.
   - Обмеження `init` вказує, що акаунт буде створено в інструкції.
   - Обмеження `seeds` і `bump` вказують, що адреса акаунта є Program Derived
     Address (PDA).
   - `payer = user` вказує акаунт, який оплачує створення нового акаунта.
   - `space` вказує кількість байтів, виділених для поля даних нового акаунта.

3. `system_program: Program<'info, System>`

   - Необхідна для створення нових акаунтів.
   - На рівні механіки обмеження `init` викликає Системну програму для створення
     нового акаунта з виділенням вказаного `space` та переназначає власника
     програми на поточну програму.

---

Анотація `#[instruction(message: String)]` дозволяє структурі `Create`
отримувати доступ до параметра `message` з інструкції `create`.

---

Обмеження `seeds` і `bump` використовуються разом для вказівки, що адреса
акаунта є Program Derived Address (PDA).

```rs filename="lib.rs"
seeds = [b"message", user.key().as_ref()],
bump,
```

Обмеження `seeds` визначає необов’язкові вхідні значення, які використовуються
для отримання PDA:

- `b"message"` — Жорстко закодований рядок як перше значення seed.
- `user.key().as_ref()` — Публічний ключ акаунта `user` як друге значення seed.

Обмеження `bump` вказує Anchor автоматично знайти та використовувати правильний
bump seed. Anchor використовує `seeds` і `bump` для отримання PDA.

---

Розрахунок `space` (8 + 32 + 4 + message.len() + 1) виділяє простір для даних
типу `MessageAccount`:

- Дискримінатор акаунта Anchor (ідентифікатор): 8 байтів
- Адреса користувача (Pubkey): 32 байти
- Повідомлення користувача (String): 4 байти для довжини + змінна довжина
  повідомлення
- Bump seed для PDA (u8): 1 байт

```rs filename="lib.rs"
#[account]
pub struct MessageAccount {
    pub user: Pubkey,
    pub message: String,
    pub bump: u8,
}
```

Усі акаунти, створені за допомогою програми Anchor, вимагають 8 байтів для
дискримінатора акаунта, який є ідентифікатором типу акаунта і генерується
автоматично під час створення акаунта.

Тип `String` вимагає 4 байти для зберігання довжини рядка, а решта — це фактичні
дані.

</AccordionItem>
</Accordion>

Далі реалізуйте бізнес-логіку для інструкції `create`, оновивши функцію `create`
наступним кодом:

```rs filename="lib.rs"
pub fn create(ctx: Context<Create>, message: String) -> Result<()> {
    msg!("Create Message: {}", message);
    let account_data = &mut ctx.accounts.message_account;
    account_data.user = ctx.accounts.user.key();
    account_data.message = message;
    account_data.bump = ctx.bumps.message_account;
    Ok(())
}
```

<Accordion>
<AccordionItem title="Diff">

```diff
- pub fn create(_ctx: Context<Create>) -> Result<()> {
-     Ok(())
- }

+ pub fn create(ctx: Context<Create>, message: String) -> Result<()> {
+     msg!("Create Message: {}", message);
+     let account_data = &mut ctx.accounts.message_account;
+     account_data.user = ctx.accounts.user.key();
+     account_data.message = message;
+     account_data.bump = ctx.bumps.message_account;
+     Ok(())
+ }
```

</AccordionItem>
<AccordionItem title="Explanation">

Функція `create` реалізує логіку для ініціалізації даних нового акаунта
повідомлення. Вона приймає два параметри:

1. `ctx: Context<Create>` — Надає доступ до акаунтів, зазначених у структурі
   `Create`.
2. `message: String` — Повідомлення користувача, яке буде збережено.

Тіло функції виконує наступну логіку:

1. Виводить повідомлення у журнали програми за допомогою макроса `msg!()`.

   ```rs
   msg!("Create Message: {}", message);
   ```

2. Ініціалізація Даних Акаунта:

   - Отримує доступ до `message_account` з контексту.

   ```rs
   let account_data = &mut ctx.accounts.message_account;
   ```

   - Встановлює поле `user` як публічний ключ акаунта `user`.

   ```rs
   account_data.user = ctx.accounts.user.key();
   ```

   - Встановлює поле `message` значенням аргумента `message` функції.

   ```rs
   account_data.message = message;
   ```

   - Встановлює значення `bump`, використане для отримання PDA, отримане з
     `ctx.bumps.message_account`.

   ```rs
   account_data.bump = ctx.bumps.message_account;
   ```

</AccordionItem>
</Accordion>

Перекомпілюйте програму.

```shell filename="Terminal"
build
```

### Реалізація Інструкції Update

Далі реалізуйте інструкцію `update` для оновлення `MessageAccount` новим
повідомленням.

Як і раніше, першим кроком є визначення акаунтів, необхідних для інструкції
`update`.

Оновіть структуру `Update` наступним кодом:

```rs filename="lib.rs"
#[derive(Accounts)]
#[instruction(message: String)]
pub struct Update<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

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

<Accordion>
<AccordionItem title="Diff">

```diff
- #[derive(Accounts)]
- pub struct Update {}

+ #[derive(Accounts)]
+ #[instruction(message: String)]
+ pub struct Update<'info> {
+     #[account(mut)]
+     pub user: Signer<'info>,
+
+     #[account(
+         mut,
+         seeds = [b"message", user.key().as_ref()],
+         bump = message_account.bump,
+         realloc = 8 + 32 + 4 + message.len() + 1,
+         realloc::payer = user,
+         realloc::zero = true,
+     )]
+     pub message_account: Account<'info, MessageAccount>,
+     pub system_program: Program<'info, System>,
+ }
```

</AccordionItem>
<AccordionItem title="Explanation">
Структура `Update` визначає акаунти, необхідні для інструкції `update`.

1. `user: Signer<'info>`

   - Представляє користувача, який оновлює акаунт повідомлення.
   - Позначений як змінний (`#[account(mut)]`), оскільки може оплачувати
     додатковий простір для `message_account`, якщо це необхідно.
   - Повинен бути підписувачем для підтвердження транзакції.

2. `message_account: Account<'info, MessageAccount>`

   - Існуючий акаунт, який зберігає повідомлення користувача і буде оновлений.
   - Обмеження `mut` вказує, що дані цього акаунта будуть змінені.
   - Обмеження `realloc` дозволяє змінювати розмір даних акаунта.
   - Обмеження `seeds` і `bump` гарантують, що акаунт є правильним PDA.

3. `system_program: Program<'info, System>`

   - Необхідна для можливої зміни розміру простору акаунта.
   - Обмеження `realloc` викликає Системну програму для налаштування розміру
     даних акаунта.

---

Зверніть увагу, що обмеження `bump = message_account.bump` використовує bump
seed, який зберігається в `message_account`, замість того, щоб Anchor обчислював
його знову.

---

Анотація `#[instruction(message: String)]` дозволяє структурі `Update`
отримувати доступ до параметра `message` з інструкції `update`.

</AccordionItem>
</Accordion>

Далі реалізуйте логіку для інструкції `update`.

```rs filename="lib.rs"
pub fn update(ctx: Context<Update>, message: String) -> Result<()> {
    msg!("Update Message: {}", message);
    let account_data = &mut ctx.accounts.message_account;
    account_data.message = message;
    Ok(())
}
```

<Accordion>
<AccordionItem title="Diff">

```diff
- pub fn update(_ctx: Context<Update>) -> Result<()> {
-     Ok(())
- }

+ pub fn update(ctx: Context<Update>, message: String) -> Result<()> {
+     msg!("Update Message: {}", message);
+     let account_data = &mut ctx.accounts.message_account;
+     account_data.message = message;
+     Ok(())
+ }
```

</AccordionItem>
<AccordionItem title="Explanation">
Функція `update` реалізує логіку для модифікації існуючого акаунта повідомлення. Вона приймає два параметри:

1. `ctx: Context<Update>` — Надає доступ до акаунтів, зазначених у структурі
   `Update`.
2. `message: String` — Нове повідомлення, яке замінить існуюче.

Тіло функції виконує такі дії:

1. Виводить повідомлення у журнали програми за допомогою макроса `msg!()`.

2. Оновлює Дані Акаунта:
   - Отримує доступ до `message_account` з контексту.
   - Встановлює поле `message` як нове значення `message` із аргумента функції.

</AccordionItem>
</Accordion>

Перекомпілюйте програму.

```shell filename="Terminal"
build
```

### Реалізація Інструкції Delete

Далі реалізуйте інструкцію `delete` для закриття `MessageAccount`.

Оновіть структуру `Delete` наступним кодом:

```rs filename="lib.rs"
#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"message", user.key().as_ref()],
        bump = message_account.bump,
        close= user,
    )]
    pub message_account: Account<'info, MessageAccount>,
}
```

<Accordion>
<AccordionItem title="Diff">

```diff
- #[derive(Accounts)]
- pub struct Delete {}

+ #[derive(Accounts)]
+ pub struct Delete<'info> {
+     #[account(mut)]
+     pub user: Signer<'info>,
+
+     #[account(
+         mut,
+         seeds = [b"message", user.key().as_ref()],
+         bump = message_account.bump,
+         close = user,
+     )]
+     pub message_account: Account<'info, MessageAccount>,
+ }
```

</AccordionItem>
<AccordionItem title="Explanation">

Структура `Delete` визначає акаунти, необхідні для інструкції `delete`:

1. `user: Signer<'info>`

   - Представляє користувача, який закриває акаунт повідомлення.
   - Позначений як змінний (`#[account(mut)]`), оскільки він отримуватиме
     лампорти з закритого акаунта.
   - Повинен бути підписувачем, щоб гарантувати, що тільки відповідний
     користувач може закрити свій акаунт повідомлення.

2. `message_account: Account<'info, MessageAccount>`

   - Акаунт, який буде закритий.
   - Обмеження `mut` вказує, що цей акаунт буде змінено.
   - Обмеження `seeds` і `bump` гарантують, що акаунт є правильним PDA.
   - Обмеження `close = user` вказує, що цей акаунт буде закритий, а його
     лампорти передані в акаунт `user`.

</AccordionItem>
</Accordion>

Далі реалізуйте логіку для інструкції `delete`.

```rs filename="lib.rs"
pub fn delete(_ctx: Context<Delete>) -> Result<()> {
    msg!("Delete Message");
    Ok(())
}
```

<Accordion>
<AccordionItem title="Diff">

```diff
- pub fn delete(_ctx: Context<Delete>) -> Result<()> {
-     Ok(())
- }

+ pub fn delete(_ctx: Context<Delete>) -> Result<()> {
+     msg!("Delete Message");
+     Ok(())
+ }
```

</AccordionItem>
<AccordionItem title="Explanation">

Функція `delete` приймає один параметр:

1. `_ctx: Context<Delete>` — Надає доступ до акаунтів, зазначених у структурі
   `Delete`. Використання `_ctx` вказує, що контекст не буде використовуватися в
   тілі функції.

Тіло функції лише виводить повідомлення у журнали програми за допомогою макроса
`msg!()`. Додаткова логіка не потрібна, оскільки фактичне закриття акаунта
виконується за допомогою обмеження `close` у структурі `Delete`.

</AccordionItem>
</Accordion>

Перекомпілюйте програму.

```shell filename="Terminal"
build
```

### Розгортання Програми

Базова CRUD-програма завершена. Розгорніть програму, виконавши команду `deploy`
у терміналі Playground.

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
</Accordion>

### Налаштування Тестового Файлу

Разом зі стартовим кодом також включений тестовий файл у `anchor.test.ts`.

```ts filename="anchor.test.ts"
import { PublicKey } from "@solana/web3.js";

describe("pda", () => {
  it("Create Message Account", async () => {});

  it("Update Message Account", async () => {});

  it("Delete Message Account", async () => {});
});
```

Додайте наведений нижче код всередину блоку `describe`, але перед секціями `it`.

```ts filename="anchor.test.ts"
const program = pg.program;
const wallet = pg.wallet;

const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
  [Buffer.from("message"), wallet.publicKey.toBuffer()],
  program.programId,
);
```

<Accordion>
<AccordionItem title="Diff">

```diff
  import { PublicKey } from "@solana/web3.js";

  describe("pda", () => {
+    const program = pg.program;
+    const wallet = pg.wallet;
+
+    const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
+      [Buffer.from("message"), wallet.publicKey.toBuffer()],
+      program.programId
+    );

    it("Create Message Account", async () => {});

    it("Update Message Account", async () => {});

    it("Delete Message Account", async () => {});
  });
```

</AccordionItem>
<AccordionItem title="Explanation">

У цьому розділі ми просто налаштовуємо тестовий файл.

Solana Playground спрощує початкову підготовку: `pg.program` дозволяє отримати
доступ до клієнтської бібліотеки для взаємодії з програмою, а `pg.wallet`
представляє ваш гаманець у Playground.

```ts filename="anchor.test.ts"
const program = pg.program;
const wallet = pg.wallet;
```

У рамках налаштування ми отримуємо PDA акаунта повідомлення. Це демонструє, як
отримати PDA у Javascript, використовуючи сіди, визначені у програмі.

```ts filename="anchor.test.ts"
const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
  [Buffer.from("message"), wallet.publicKey.toBuffer()],
  program.programId,
);
```

</AccordionItem>
</Accordion>

Запустіть тестовий файл, виконавши команду `test` у терміналі Playground, щоб
переконатися, що файл працює, як очікувалося. Ми реалізуємо тести на наступних
етапах.

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
    ✔ Create Message Account
    ✔ Update Message Account
    ✔ Delete Message Account
  3 passing (4ms)
```

</AccordionItem>
</Accordion>

### Виклик Інструкції Create

Оновіть перший тест наступним кодом:

```ts filename="anchor.test.ts"
it("Create Message Account", async () => {
  const message = "Hello, World!";
  const transactionSignature = await program.methods
    .create(message)
    .accounts({
      messageAccount: messagePda,
    })
    .rpc({ commitment: "confirmed" });

  const messageAccount = await program.account.messageAccount.fetch(
    messagePda,
    "confirmed",
  );

  console.log(JSON.stringify(messageAccount, null, 2));
  console.log(
    "Transaction Signature:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```

<Accordion>
<AccordionItem title="Diff">

```diff
- it("Create Message Account", async () => {});

+ it("Create Message Account", async () => {
+   const message = "Hello, World!";
+   const transactionSignature = await program.methods
+     .create(message)
+     .accounts({
+       messageAccount: messagePda,
+     })
+     .rpc({ commitment: "confirmed" });
+
+   const messageAccount = await program.account.messageAccount.fetch(
+     messagePda,
+     "confirmed"
+   );
+
+   console.log(JSON.stringify(messageAccount, null, 2));
+   console.log(
+     "Transaction Signature:",
+     `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
+   );
+ });
```

</AccordionItem>
<AccordionItem title="Explanation">

Спочатку ми надсилаємо транзакцію, яка викликає інструкцію `create`, передаючи
"Hello, World!" як повідомлення.

```ts filename="anchor.test.ts"
const message = "Hello, World!";
const transactionSignature = await program.methods
  .create(message)
  .accounts({
    messageAccount: messagePda,
  })
  .rpc({ commitment: "confirmed" });
```

Після надсилання транзакції та створення акаунта ми отримуємо акаунт за його
адресою (`messagePda`).

```ts filename="anchor.test.ts"
const messageAccount = await program.account.messageAccount.fetch(
  messagePda,
  "confirmed",
);
```

Нарешті, ми виводимо у журнал дані акаунта та посилання для перегляду деталей
транзакції.

```ts filename="anchor.test.ts"
console.log(JSON.stringify(messageAccount, null, 2));
console.log(
  "Transaction Signature:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

</AccordionItem>
</Accordion>

### Виклик Інструкції Update

Оновіть другий тест наступним кодом:

```ts filename="anchor.test.ts"
it("Update Message Account", async () => {
  const message = "Hello, Solana!";
  const transactionSignature = await program.methods
    .update(message)
    .accounts({
      messageAccount: messagePda,
    })
    .rpc({ commitment: "confirmed" });

  const messageAccount = await program.account.messageAccount.fetch(
    messagePda,
    "confirmed",
  );

  console.log(JSON.stringify(messageAccount, null, 2));
  console.log(
    "Transaction Signature:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```

<Accordion>
<AccordionItem title="Diff">

```diff
- it("Update Message Account", async () => {});

+ it("Update Message Account", async () => {
+   const message = "Hello, Solana!";
+   const transactionSignature = await program.methods
+     .update(message)
+     .accounts({
+       messageAccount: messagePda,
+     })
+     .rpc({ commitment: "confirmed" });
+
+   const messageAccount = await program.account.messageAccount.fetch(
+     messagePda,
+     "confirmed"
+   );
+
+   console.log(JSON.stringify(messageAccount, null, 2));
+   console.log(
+     "Transaction Signature:",
+     `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
+   );
+ });
```

</AccordionItem>
<AccordionItem title="Explanation">

Спочатку ми надсилаємо транзакцію, яка викликає інструкцію `update`, передаючи
"Hello, Solana!" як нове повідомлення.

```ts filename="anchor.test.ts"
const message = "Hello, Solana!";
const transactionSignature = await program.methods
  .update(message)
  .accounts({
    messageAccount: messagePda,
  })
  .rpc({ commitment: "confirmed" });
```

Після надсилання транзакції та оновлення акаунта ми отримуємо акаунт за його
адресою (`messagePda`).

```ts filename="anchor.test.ts"
const messageAccount = await program.account.messageAccount.fetch(
  messagePda,
  "confirmed",
);
```

Нарешті, ми виводимо у журнал дані акаунта та посилання для перегляду деталей
транзакції.

```ts filename="anchor.test.ts"
console.log(JSON.stringify(messageAccount, null, 2));
console.log(
  "Transaction Signature:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

</AccordionItem>
</Accordion>

### Виклик Інструкції Delete

Оновіть третій тест наступним кодом:

```ts filename="anchor.test.ts"
it("Delete Message Account", async () => {
  const transactionSignature = await program.methods
    .delete()
    .accounts({
      messageAccount: messagePda,
    })
    .rpc({ commitment: "confirmed" });

  const messageAccount = await program.account.messageAccount.fetchNullable(
    messagePda,
    "confirmed",
  );

  console.log("Expect Null:", JSON.stringify(messageAccount, null, 2));
  console.log(
    "Transaction Signature:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
});
```

<Accordion>
<AccordionItem title="Diff">

```diff
- it("Delete Message Account", async () => {});

+ it("Delete Message Account", async () => {
+   const transactionSignature = await program.methods
+     .delete()
+     .accounts({
+       messageAccount: messagePda,
+     })
+     .rpc({ commitment: "confirmed" });
+
+   const messageAccount = await program.account.messageAccount.fetchNullable(
+     messagePda,
+     "confirmed"
+   );
+
+   console.log("Expect Null:", JSON.stringify(messageAccount, null, 2));
+   console.log(
+     "Transaction Signature:",
+     `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
+   );
+ });
```

</AccordionItem>
<AccordionItem title="Explanation">

Спочатку ми надсилаємо транзакцію, яка викликає інструкцію `delete` для закриття
акаунта повідомлення.

```ts filename="anchor.test.ts"
const transactionSignature = await program.methods
  .delete()
  .accounts({
    messageAccount: messagePda,
  })
  .rpc({ commitment: "confirmed" });
```

Після надсилання транзакції та закриття акаунта ми намагаємося отримати акаунт
за його адресою (`messagePda`), використовуючи `fetchNullable`, оскільки ми
очікуємо, що результат буде `null`, тому що акаунт закритий.

```ts filename="anchor.test.ts"
const messageAccount = await program.account.messageAccount.fetchNullable(
  messagePda,
  "confirmed",
);
```

Нарешті, ми виводимо у журнал дані акаунта та посилання для перегляду деталей
транзакції, де дані акаунта повинні бути відображені як `null`.

```ts filename="anchor.test.ts"
console.log(JSON.stringify(messageAccount, null, 2));
console.log(
  "Transaction Signature:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

</AccordionItem>
</Accordion>

### Запуск Тестів

Після налаштування тестів запустіть тестовий файл, виконавши команду `test` у
терміналі Playground.

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
    Transaction Signature: https://solana.fm/tx/5oBT4jEdUR6CRYsFNGoqvyMBTRDvFqRWTAAmCGM9rEvYRBWy3B2bkb6GVFpVPKBnkr714UCFUurBSDKSa7nLHo8e?cluster=devnet-solana
    ✔ Create Message Account (1025ms)
    {
  "user": "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
  "message": "Hello, Solana!",
  "bump": 254
}
    Transaction Signature: https://solana.fm/tx/42veGAsQjHbJP1SxWBGcfYF7EdRN9X7bACNv23NSZNe4U7w2dmaYgSv8UUWXYzwgJPoNHejhtWdKZModHiMaTWYK?cluster=devnet-solana
    ✔ Update Message Account (713ms)
    Expect Null: null
    Transaction Signature: https://solana.fm/tx/Sseog2i2X7uDEn2DyDMMJKVHeZEzmuhnqUwicwGhnGhstZo8URNwUZgED8o6HANiojJkfQbhXVbGNLdhsFtWrd6?cluster=devnet-solana
    ✔ Delete Message Account (812ms)
  3 passing (3s)
```

</AccordionItem>
</Accordion>

</Steps>
