---
title: Програмно Виведені Адреси (PDA)
sidebarLabel: Програмно Виведені Адреси
sidebarSortOrder: 5
description:
  Дізнайтеся про Програмно Виведені Адреси (PDA) в Solana — детерміновані адреси
  облікових записів, які забезпечують безпечне підписання програмами.
  Розберіться у виведенні PDA, канонічних бампах і створенні облікових записів
  PDA.
---

Програмно Виведені Адреси (PDA) надають розробникам у Solana два основних
варіанти використання:

- **Детерміновані адреси облікових записів**: PDA надають механізм для
  детермінованого виведення адреси за допомогою комбінації необов’язкових
  "сідів" (заздалегідь визначених вхідних даних) та певного ідентифікатора
  програми.
- **Забезпечення підписання програмами**: Рантайм Solana дозволяє програмам
  "підписуватися" від імені PDA, які виведені з їхнього ідентифікатора програми.

Можна уявити PDA як спосіб створення структур, схожих на хешмапи, у блокчейні з
використанням заздалегідь визначених вхідних даних (наприклад, рядків, чисел і
інших адрес облікових записів).

Перевага цього підходу полягає в тому, що він усуває потребу в точному
відстеженні адреси. Натомість вам потрібно лише згадати конкретні вхідні дані,
які використовувались для її виведення.

![Програмно Виведена Адреса](/assets/docs/core/pda/pda.svg)

Важливо розуміти, що просте виведення Програмно Виведеної Адреси (PDA) не
автоматично створює обліковий запис у блокчейні за цією адресою. Облікові записи
з PDA як адресою в блокчейні повинні бути явно створені через програму, яка
використовувалась для виведення адреси. Можна уявити виведення PDA як пошук
адреси на карті. Мати адресу — це ще не означає, що за цією адресою щось
побудовано.

> У цьому розділі буде розглянуто деталі виведення PDA. Деталі того, як програми
> використовують PDA для підписання, будуть розглянуті в розділі
> [Взаємодія між програмами (CPI)](/docs/uk/core/cpi.md), оскільки це потребує
> контексту для обох концепцій.

## Основні моменти

- PDA — це адреси, які виводяться детерміновано з використанням комбінації
  визначених користувачем сідів, бамп сіда та ідентифікатора програми.

- PDA — це адреси, які виходять за межі кривої Ed25519 і не мають відповідного
  приватного ключа.

- Програми Solana можуть програмно "підписуватися" від імені PDA, які виведені
  за допомогою їхнього ідентифікатора програми.

- Виведення PDA не створює автоматично обліковий запис у блокчейні.

- Обліковий запис з PDA як адресою повинен бути явно створений через спеціальну
  інструкцію в програмі Solana.

## Що таке PDA

PDA — це адреси, які виводяться детерміновано та виглядають як стандартні
публічні ключі, але не мають асоційованих приватних ключів. Це означає, що жоден
зовнішній користувач не може згенерувати дійсний підпис для цієї адреси. Однак,
рантайм Solana дозволяє програмам програмно "підписуватися" від імені PDA без
необхідності у приватному ключі.

Для контексту,
[Keypairs](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/src/signer/keypair.rs#L25)
у Solana є точками на кривій Ed25519 (еліптична криптографія), які мають
публічний ключ і відповідний приватний ключ. Ми часто використовуємо публічні
ключі як унікальні ідентифікатори для нових облікових записів у блокчейні, а
приватні ключі для підписання.

![Адреса на кривій](/assets/docs/core/pda/address-on-curve.svg)

PDA — це точка, яка навмисно виводиться за межі кривої Ed25519 з використанням
заздалегідь визначених вхідних даних. Точка, яка не знаходиться на кривій
Ed25519, не має дійсного відповідного приватного ключа і не може бути
використана для криптографічних операцій (підписання).

PDA може бути використана як адреса (унікальний ідентифікатор) для облікового
запису в блокчейні, забезпечуючи спосіб зручного зберігання, мапування та
отримання стану програми.

![Адреса поза кривою](/assets/docs/core/pda/address-off-curve.svg)

## Як вивести PDA

Виведення PDA вимагає 3 вхідних даних.

- **Необов’язкові сіди**: Заздалегідь визначені вхідні дані (наприклад, рядок,
  число, інші адреси облікових записів), які використовуються для виведення PDA.
  Ці вхідні дані конвертуються в буфер байтів.
- **Бамп сід**: Додатковий вхідний параметр (зі значенням між 255-0), який
  використовується для забезпечення того, що згенерований PDA знаходиться поза
  кривою Ed25519. Цей бамп сід (починаючи з 255) додається до необов’язкових
  сідів під час генерації PDA, щоб "виштовхнути" точку за межі кривої Ed25519.
  Бамп сід іноді називають "нонсом".
- **Ідентифікатор програми**: Адреса програми, з якої виведений PDA. Ця ж
  програма може "підписуватися" від імені PDA.

![Виведення PDA](/assets/docs/core/pda/pda-derivation.svg)

Приклади нижче включають посилання на Solana Playground, де ви можете запустити
приклади в редакторі прямо у веббраузері.

### FindProgramAddress

Щоб вивести PDA, ми можемо використовувати метод
[`findProgramAddressSync`](https://github.com/solana-labs/solana-web3.js/blob/ca9da583a39cdf8fd874a2e03fccdc849e29de34/packages/library-legacy/src/publickey.ts#L212)
з пакета [`@solana/web3.js`](https://www.npmjs.com/package/@solana/web3.js).
Існують еквіваленти цієї функції на інших мовах програмування (наприклад,
[Rust](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/pubkey.rs#L484)),
але в цьому розділі ми розглянемо приклади з використанням Javascript.

Під час використання методу `findProgramAddressSync` ми передаємо:

- заздалегідь визначені необов’язкові сіди, перетворені в буфер байтів, та
- ідентифікатор програми (адресу), використаний для виведення PDA.

Після знаходження дійсного PDA, `findProgramAddressSync` повертає як адресу
(PDA), так і бамп сід, який використовувався для виведення PDA.

Нижче наведено приклад виведення PDA без надання необов’язкових сідів.

```ts /[]/
import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("11111111111111111111111111111111");

const [PDA, bump] = PublicKey.findProgramAddressSync([], programId);

console.log(`PDA: ${PDA}`);
console.log(`Bump: ${bump}`);
```

Ви можете запустити цей приклад на
[Solana Playground](https://beta.solpg.io/66031e5acffcf4b13384cfef). Виведення
PDA та бамп сіда завжди буде однаковим:

```
PDA: Cu7NwqCXSmsR5vgGA3Vw9uYVViPi3kQvkbKByVQ8nPY9
Bump: 255
```

У наступному прикладі додається необов’язковий сід "helloWorld".

```ts /string/
import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("11111111111111111111111111111111");
const string = "helloWorld";

const [PDA, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from(string)],
  programId,
);

console.log(`PDA: ${PDA}`);
console.log(`Bump: ${bump}`);
```

Ви також можете запустити цей приклад на
[Solana Playground](https://beta.solpg.io/66031ee5cffcf4b13384cff0). Виведення
PDA та бамп сіда завжди буде однаковим:

```
PDA: 46GZzzetjCURsdFPb7rcnspbEMnCBXe9kpjrsZAkKb6X
Bump: 254
```

Зверніть увагу, що бамп сід дорівнює 254. Це означає, що 255 вивів точку на
кривій Ed25519 і не є дійсним PDA.

Бамп сід, який повертається функцією `findProgramAddressSync`, — це перше
значення (у діапазоні від 255 до 0) для заданої комбінації необов’язкових сідів
та ідентифікатора програми, яке виводить дійсний PDA.

> Це перше дійсне значення бамп сіда називається "канонічним бампом". З метою
> безпеки програм рекомендовано використовувати лише канонічний бамп при роботі
> з PDA.

### CreateProgramAddress

У своїй основі, `findProgramAddressSync` ітеративно додає додатковий бамп сід
(нонс) до буфера сідів і викликає метод
[`createProgramAddressSync`](https://github.com/solana-labs/solana-web3.js/blob/ca9da583a39cdf8fd874a2e03fccdc849e29de34/packages/library-legacy/src/publickey.ts#L168).
Значення бамп сіда починається з 255 і зменшується на 1, доки не буде знайдено
дійсний PDA (поза кривою).

Ви можете відтворити попередній приклад, використовуючи
`createProgramAddressSync` та явно передавши бамп сід зі значенням 254.

```ts /bump/
import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("11111111111111111111111111111111");
const string = "helloWorld";
const bump = 254;

const PDA = PublicKey.createProgramAddressSync(
  [Buffer.from(string), Buffer.from([bump])],
  programId,
);

console.log(`PDA: ${PDA}`);
```

Запустіть цей приклад вище на
[Solana Playground](https://beta.solpg.io/66031f8ecffcf4b13384cff1). За
однакових сідів та ідентифікатора програми, виведення PDA буде відповідати
попередньому прикладу:

```
PDA: 46GZzzetjCURsdFPb7rcnspbEMnCBXe9kpjrsZAkKb6X
```

### Канонічний бамп

"Канонічний бамп" відноситься до першого значення бамп сіда (починаючи з 255 і
зменшуючи на 1), яке виводить дійсний PDA. З метою безпеки програм рекомендовано
використовувати лише PDA, виведені з канонічного бампа.

Використовуючи попередній приклад як орієнтир, приклад нижче намагається вивести
PDA, використовуючи всі значення бамп сіда від 255 до 0.

```ts
import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("11111111111111111111111111111111");
const string = "helloWorld";

// Loop through all bump seeds for demonstration
for (let bump = 255; bump >= 0; bump--) {
  try {
    const PDA = PublicKey.createProgramAddressSync(
      [Buffer.from(string), Buffer.from([bump])],
      programId,
    );
    console.log("bump " + bump + ": " + PDA);
  } catch (error) {
    console.log("bump " + bump + ": " + error);
  }
}
```

Запустіть приклад на
[Solana Playground](https://beta.solpg.io/66032009cffcf4b13384cff2), і ви
повинні побачити наступний результат:

```
bump 255: Error: Invalid seeds, address must fall off the curve
bump 254: 46GZzzetjCURsdFPb7rcnspbEMnCBXe9kpjrsZAkKb6X
bump 253: GBNWBGxKmdcd7JrMnBdZke9Fumj9sir4rpbruwEGmR4y
bump 252: THfBMgduMonjaNsCisKa7Qz2cBoG1VCUYHyso7UXYHH
bump 251: EuRrNqJAofo7y3Jy6MGvF7eZAYegqYTwH2dnLCwDDGdP
bump 250: Error: Invalid seeds, address must fall off the curve
...
// remaining bump outputs
```

Як і очікувалось, бамп сід 255 викликає помилку, а перший бамп сід, який
виводить дійсний PDA, дорівнює 254.

Однак зверніть увагу, що бамп сіди 253-251 також виводять дійсні PDA з різними
адресами. Це означає, що для заданих необов’язкових сідів та `programId` бамп
сід з іншим значенням все ще може вивести дійсний PDA.

<Callout type="warning">
  При створенні програм на Solana рекомендовано додавати перевірки безпеки,
  які підтверджують, що PDA, переданий до програми, виведений з використанням
  канонічного бампа. Невиконання цього може призвести до вразливостей, які
  дозволять несподіваним обліковим записам передаватися до програми.
</Callout>

## Створення облікових записів PDA

Ця програмна демонстрація на
[Solana Playground](https://beta.solpg.io/github.com/ZYJLiu/doc-examples/tree/main/pda-account)
показує, як створити обліковий запис, використовуючи PDA як адресу нового
облікового запису. Програма написана з використанням фреймворку Anchor.

У файлі `lib.rs` ви знайдете наступну програму, яка включає єдину інструкцію для
створення нового облікового запису з використанням PDA як адреси облікового
запису. Новий обліковий запис зберігає адресу `user` та `bump` сід, який
використовувався для виведення PDA.

```rust filename="lib.rs" {11-14,26-29}
use anchor_lang::prelude::*;

declare_id!("75GJVCJNhaukaa2vCCqhreY31gaphv7XTScBChmr1ueR");

#[program]
pub mod pda_account {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let account_data = &mut ctx.accounts.pda_account;
        // store the address of the `user`
        account_data.user = *ctx.accounts.user.key;
        // store the canonical bump
        account_data.bump = ctx.bumps.pda_account;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        // set the seeds to derive the PDA
        seeds = [b"data", user.key().as_ref()],
        // use the canonical bump
        bump,
        payer = user,
        space = 8 + DataAccount::INIT_SPACE
    )]
    pub pda_account: Account<'info, DataAccount>,
    pub system_program: Program<'info, System>,
}

#[account]

#[derive(InitSpace)]
pub struct DataAccount {
    pub user: Pubkey,
    pub bump: u8,
}
```

Сіди, які використовуються для виведення PDA, включають зафіксований рядок
`data` та адресу облікового запису `user`, передану в інструкції. Фреймворк
Anchor автоматично виводить канонічний `bump` сід.

```rust /data/ /user.key()/ /bump/
#[account(
    init,
    seeds = [b"data", user.key().as_ref()],
    bump,
    payer = user,
    space = 8 + DataAccount::INIT_SPACE
)]
pub pda_account: Account<'info, DataAccount>,
```

Обмеження `init` вказує Anchor викликати Системну Програму для створення нового
облікового запису з використанням PDA як адреси. Це виконується за допомогою
[Взаємодії між програмами (CPI)](/docs/uk/core/cpi.md).

```rust /init/
#[account(
    init,
    seeds = [b"data", user.key().as_ref()],
    bump,
    payer = user,
    space = 8 + DataAccount::INIT_SPACE
)]
pub pda_account: Account<'info, DataAccount>,
```

У тестовому файлі (`pda-account.test.ts`), розташованому за посиланням на Solana
Playground, наданим вище, ви знайдете еквівалентний код на Javascript для
виведення PDA.

```ts /data/ /user.publicKey/
const [PDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("data"), user.publicKey.toBuffer()],
  program.programId,
);
```

Далі надсилається транзакція для виклику інструкції `initialize`, щоб створити
новий обліковий запис у блокчейні з використанням PDA як адреси. Після
надсилання транзакції PDA використовується для отримання облікового запису в
блокчейні, який був створений за цією адресою.

```ts /initialize()/ /PDA/  {14}
it("Is initialized!", async () => {
  const transactionSignature = await program.methods
    .initialize()
    .accounts({
      user: user.publicKey,
      pdaAccount: PDA,
    })
    .rpc();

  console.log("Transaction Signature:", transactionSignature);
});

it("Fetch Account", async () => {
  const pdaAccount = await program.account.dataAccount.fetch(PDA);
  console.log(JSON.stringify(pdaAccount, null, 2));
});
```

Зверніть увагу, що якщо ви викликаєте інструкцію `initialize` більше одного
разу, використовуючи ту саму адресу `user` як сід, транзакція завершиться
помилкою. Це відбувається тому, що обліковий запис вже існує за виведеною
адресою.
