---
title: Структура програми Anchor
description:
  Дізнайтеся про структуру програм Anchor, включаючи основні макроси та їх роль
  у спрощенні розробки програм для Solana
sidebarLabel: Структура програми
sidebarSortOrder: 1
---

[Фреймворк Anchor](https://www.anchor-lang.com/) використовує
[макроси Rust](https://doc.rust-lang.org/book/ch19-06-macros.html) для зменшення
обсягу шаблонного коду та спрощення реалізації загальних перевірок безпеки,
необхідних для написання програм для Solana.

Основні макроси, які використовуються в програмі Anchor, включають:

- [`declare_id`](#declare-id-macro): Визначає on-chain адресу програми
- [`#[program]`](#program-macro): Визначає модуль, що містить логіку інструкцій
  програми
- [`#[derive(Accounts)]`](#derive-accounts-macro): Застосовується до структур
  для вказівки списку акаунтів, необхідних для інструкції
- [`#[account]`](#account-macro): Застосовується до структур для створення
  користувацьких типів акаунтів для програми

## Приклад програми

Давайте розглянемо просту програму, яка демонструє використання вищезгаданих
макросів, щоб зрозуміти основну структуру програми Anchor.

Наведена нижче програма створює новий акаунт (`NewAccount`), який зберігає
значення `u64`, передане в інструкцію `initialize`.

```rust filename="lib.rs"
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

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

## Макрос `declare_id!`

Макрос
[`declare_id`](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/account/src/lib.rs#L430)
вказує on-chain адресу програми, відому як ID програми.

```rust filename="lib.rs" {3}
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");
```

За замовчуванням, ID програми — це публічний ключ ключової пари, згенерованої за
адресою `/target/deploy/your_program_name.json`.

Щоб оновити значення ID програми в макросі `declare_id` за допомогою публічного
ключа ключової пари з файлу `/target/deploy/your_program_name.json`, виконайте
наступну команду:

```shell filename="Terminal"
anchor keys sync
```

Команда `anchor keys sync` корисна для виконання при клонуванні репозиторію, де
значення ID програми в макросі `declare_id` клонованого репозиторію не буде
співпадати з тим, що генерується при виконанні команди `anchor build` локально.

## Макрос `#[program]`

Макрос
[`#[program]`](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/program/src/lib.rs#L12)
визначає модуль, що містить усі обробники інструкцій для вашої програми. Кожна
публічна функція в межах цього модуля відповідає інструкції, яку можна
викликати.

```rust filename="lib.rs" {5, 8-12}
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

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

### Контекст інструкції

Обробники інструкцій — це функції, які визначають логіку, що виконується, коли
інструкція викликається. Перший параметр кожного обробника має тип `Context<T>`,
де `T` — це структура, яка реалізує трейд `Accounts` і вказує на акаунти, які
потрібні для інструкції.

Тип
[`Context`](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/src/context.rs#L24)
надає інструкції доступ до наступних неаргументних входів:

```rust
pub struct Context<'a, 'b, 'c, 'info, T> {
    /// Currently executing program id.
    pub program_id: &'a Pubkey,
    /// Deserialized accounts.
    pub accounts: &'b mut T,
    /// Remaining accounts given but not deserialized or validated.
    /// Be very careful when using this directly.
    pub remaining_accounts: &'c [AccountInfo<'info>],
    /// Bump seeds found during constraint validation. This is provided as a
    /// convenience so that handlers don't have to recalculate bump seeds or
    /// pass them in as arguments.
    pub bumps: BTreeMap<String, u8>,
}
```

Поля `Context` можна отримати в інструкції за допомогою позначення через крапку:

- `ctx.accounts`: Акаунти, необхідні для інструкції
- `ctx.program_id`: Публічний ключ програми (адреса)
- `ctx.remaining_accounts`: Додаткові акаунти, які не вказані в структурі
  `Accounts`.
- `ctx.bumps`: Bump seed для будь-яких акаунтів
  [Program Derived Address (PDA)](/docs/core/pda.md), вказаних у структурі
  `Accounts`

Додаткові параметри є необов'язковими та можуть бути включені для вказівки
аргументів, які повинні бути надані при виклику інструкції.

```rust filename="lib.rs" /Context/ /data/1
pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
    ctx.accounts.new_account.data = data;
    msg!("Changed data to: {}!", data);
    Ok(())
}
```

У цьому прикладі структура `Initialize` реалізує трейд `Accounts`, де кожне поле
в структурі представляє акаунт, необхідний для інструкції `initialize`.

```rust filename="lib.rs" /Initialize/ /Accounts/
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
```

## Макрос `#[derive(Accounts)]`

Макрос
[`#[derive(Accounts)]`](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/derive/accounts/src/lib.rs#L630)
застосовується до структури для вказівки акаунтів, які повинні бути надані під
час виклику інструкції. Цей макрос реалізує трейд
[`Accounts`](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/src/lib.rs#L105),
що спрощує перевірку акаунтів, а також серіалізацію та десеріалізацію даних
акаунтів.

```rust /Accounts/ {1}
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

Кожне поле в структурі представляє акаунт, необхідний для інструкції. Іменування
кожного поля є довільним, але рекомендується використовувати описове ім'я, яке
вказує на призначення акаунту.

```rust /signer/2 /new_account/ /system_program/
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

### Перевірка акаунтів

Для запобігання вразливостям безпеки важливо перевіряти, що акаунти, надані
інструкції, є очікуваними. Акаунти перевіряються в програмах Anchor двома
способами, які зазвичай використовуються разом:

- [Обмеження акаунтів](https://www.anchor-lang.com/docs/account-constraints):
  Обмеження визначають додаткові умови, які акаунт повинен задовольняти, щоб
  вважатися дійсним для інструкції. Обмеження застосовуються за допомогою
  атрибута `#[account(..)]`, який розміщується над полем у структурі, що
  реалізує трейд `Accounts`.

  Реалізацію обмежень можна знайти
  [тут](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/syn/src/parser/accounts/constraints.rs).

  ```rust {3, 5}
  #[derive(Accounts)]
  pub struct Initialize<'info> {
      #[account(init, payer = signer, space = 8 + 8)]
      pub new_account: Account<'info, NewAccount>,
      #[account(mut)]
      pub signer: Signer<'info>,
      pub system_program: Program<'info, System>,
  }
  ```

- [Типи акаунтів](https://www.anchor-lang.com/docs/account-types): Anchor надає
  різні типи акаунтів, щоб допомогти гарантувати, що акаунт, наданий клієнтом,
  відповідає тому, що очікує програма.

  Реалізацію типів акаунтів можна знайти
  [тут](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/src/accounts).

  ```rust /Account/2 /Signer/ /Program/
  #[derive(Accounts)]
  pub struct Initialize<'info> {
      #[account(init, payer = signer, space = 8 + 8)]
      pub new_account: Account<'info, NewAccount>,
      #[account(mut)]
      pub signer: Signer<'info>,
      pub system_program: Program<'info, System>,
  }
  ```

Коли інструкція в програмі Anchor викликається, програма спочатку перевіряє
надані акаунти перед виконанням логіки інструкції. Після перевірки ці акаунти
можна отримати в інструкції за допомогою синтаксису `ctx.accounts`.

```rust filename="lib.rs"  /ctx.accounts.new_account/ /new_account/ /Initialize/
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

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

## Макрос `#[account]`

Макрос
[`#[account]`](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/account/src/lib.rs#L66)
застосовується до структур, які визначають дані, що зберігаються в
користувацьких акаунтах, створених вашою програмою.

```rust
#[account]
pub struct NewAccount {
    data: u64,
}
```

Цей макрос реалізує різні трейди
[детальніше тут](https://docs.rs/anchor-lang/latest/anchor_lang/attr.account.html).
Основні функціональні можливості макроса `#[account]` включають:

- [Призначення власника програми](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/account/src/lib.rs#L119-L132):
  При створенні акаунту власник акаунту автоматично встановлюється на програму,
  вказану в `declare_id`.
- [Встановлення дискримінатора](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/account/src/lib.rs#L101-L117):
  Унікальний 8-байтовий дискримінатор, що визначає тип акаунту, додається як
  перші 8 байтів даних акаунту під час його ініціалізації. Це допомагає
  відрізняти типи акаунтів і використовується для перевірки акаунтів.
- [Серіалізація та десеріалізація даних](https://github.com/coral-xyz/anchor/blob/v0.30.1/lang/attribute/account/src/lib.rs#L202-L246):
  Дані акаунту автоматично серіалізуються та десеріалізуються відповідно до типу
  акаунту.

```rust filename="lib.rs" /data/2,6 /NewAccount/ {24-27}
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

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

### Дискримінатор акаунту

Дискримінатор акаунту в програмі Anchor — це 8-байтовий ідентифікатор,
унікальний для кожного типу акаунту. Він отримується з перших 8 байтів SHA256
хешу рядка `account:<AccountName>`. Цей дискримінатор зберігається як перші 8
байтів даних акаунту під час його створення.

При створенні акаунту в програмі Anchor для дискримінатора повинно бути виділено
8 байтів.

```rust /8/1
#[account(init, payer = signer, space = 8 + 8)]
pub new_account: Account<'info, NewAccount>,
```

Дискримінатор використовується в наступних двох сценаріях:

- Ініціалізація: Коли акаунт створюється, дискримінатор встановлюється як перші
  8 байтів даних акаунту.
- Десеріалізація: Коли дані акаунту десеріалізуються, перші 8 байтів даних
  акаунту перевіряються на відповідність дискримінатору очікуваного типу
  акаунту.

Якщо є невідповідність, це вказує на те, що клієнт надав неочікуваний акаунт.
Цей механізм служить перевіркою валідності акаунтів у програмах Anchor.
