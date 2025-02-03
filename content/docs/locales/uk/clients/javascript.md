---
sidebarLabel: JavaScript / TypeScript
title: JavaScript Клієнт для Solana
sidebarSortOrder: 2
description:
  Дізнайтеся, як взаємодіяти з Solana за допомогою клієнтської бібліотеки
  JavaScript/TypeScript (@solana/web3.js). У цьому посібнику розглядаються
  підключення гаманця, транзакції та взаємодія з власними програмами з
  прикладами коду.
---

## Що таке Solana-Web3.js?

Бібліотека Solana-Web3.js створена для забезпечення повного охоплення Solana. Ця
бібліотека побудована на основі [Solana JSON RPC API](/docs/rpc).

Повну документацію для бібліотеки `@solana/web3.js` можна знайти
[тут](https://solana-labs.github.io/solana-web3.js/v1.x/).

## Загальна термінологія

| Термін     | Визначення                                                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Програма   | Безстанова виконувана програма, написана для інтерпретації інструкцій. Програми можуть виконувати дії на основі наданих інструкцій.                                |
| Інструкція | Найменша одиниця програми, яку клієнт може включити в транзакцію. Під час виконання коду інструкція може містити одну або кілька міжпрограмних викликів.           |
| Транзакція | Одна або кілька інструкцій, підписаних клієнтом за допомогою одного або кількох Keypair, і виконуються атомарно з двома можливими результатами: успіх або невдача. |

Для повного списку термінів дивіться
[Термінологія Solana](/docs/terminology.md#cross-program-invocation-cpi)

## Початок роботи

### Встановлення

#### yarn

```shell
yarn add @solana/web3.js@1
```

#### npm

```shell
npm install --save @solana/web3.js@1
```

#### Пакет

```html
<!-- Розробка (не мініфікований) -->
<script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"></script>

<!-- Продукція (мініфікований) -->
<script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js"></script>
```

### Використання

#### Javascript

```javascript
const solanaWeb3 = require("@solana/web3.js");
console.log(solanaWeb3);
```

#### ES6

```javascript
import * as solanaWeb3 from "@solana/web3.js";
console.log(solanaWeb3);
```

#### Пакет для браузера

```javascript
// solanaWeb3 надається в глобальному просторі імен за допомогою скрипта пакета
console.log(solanaWeb3);
```

## Швидкий старт

### Підключення до гаманця

Щоб користувачі могли використовувати ваш dApp або додаток у Solana, їм потрібно
отримати доступ до свого Keypair. Keypair - це приватний ключ з відповідним
відкритим ключем, який використовується для підпису транзакцій.

Є два способи отримати Keypair:

1. Генерація нового Keypair
2. Отримання Keypair за допомогою секретного ключа

Ви можете отримати новий Keypair наступним чином:

```javascript
const { Keypair } = require("@solana/web3.js");

let keypair = Keypair.generate();
```

Це згенерує новий Keypair для користувача, який можна використовувати у вашому
додатку.

Ви можете дозволити введення secretKey через текстове поле та отримати Keypair
за допомогою `Keypair.fromSecretKey(secretKey)`.

```javascript
const { Keypair } = require("@solana/web3.js");

let secretKey = Uint8Array.from([
  202, 171, 192, 129, 150, 189, 204, 241, 142, 71, 205, 2, 81, 97, 2, 176, 48,
  81, 45, 1, 96, 138, 220, 132, 231, 131, 120, 77, 66, 40, 97, 172, 91, 245, 84,
  221, 157, 190, 9, 145, 176, 130, 25, 43, 72, 107, 190, 229, 75, 88, 191, 136,
  7, 167, 109, 91, 170, 164, 186, 15, 142, 36, 12, 23,
]);

let keypair = Keypair.fromSecretKey(secretKey);
```

Багато гаманців сьогодні дозволяють користувачам імпортувати свій Keypair за
допомогою різних розширень або веб-гаманців. Загальна рекомендація -
використовувати гаманці, а не Keypair, для підпису транзакцій. Гаманець створює
шар розділення між dApp та Keypair, забезпечуючи, що dApp ніколи не має доступу
до секретного ключа. Ви можете знайти способи підключення до зовнішніх гаманців
за допомогою бібліотеки
[wallet-adapter](https://github.com/solana-labs/wallet-adapter).

### Створення та відправка транзакцій

Щоб взаємодіяти з програмами на Solana, ви створюєте, підписуєте та відправляєте
транзакції до мережі. Транзакції - це колекції інструкцій з підписами. Порядок,
в якому інструкції існують у транзакції, визначає порядок їх виконання.

Транзакція в Solana-Web3.js створюється за допомогою об'єкта
[`Transaction`](/docs/clients/javascript.md#Transaction) і додавання бажаних
повідомлень, адрес або інструкцій.

Приклад транзакції передачі:

```javascript
const {
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

let fromKeypair = Keypair.generate();
let toKeypair = Keypair.generate();
let transaction = new Transaction();

transaction.add(
  SystemProgram.transfer({
    fromPubkey: fromKeypair.publicKey,
    toPubkey: toKeypair.publicKey,
    lamports: LAMPORTS_PER_SOL,
  }),
);
```

Вищенаведений код створює транзакцію, готову до підпису та передачі в мережу.
Інструкція `SystemProgram.transfer` була додана до транзакції, що містить суму
lamports для відправки, а також публічні ключі `to` і `from`.

Все, що залишилося зробити - підписати транзакцію за допомогою Keypair і
відправити її через мережу. Ви можете виконати відправку транзакції за допомогою
`sendAndConfirmTransaction`, якщо хочете сповістити користувача або зробити щось
після завершення транзакції, або використовувати `sendTransaction`, якщо не
потрібно чекати підтвердження транзакції.

```javascript
const {
  sendAndConfirmTransaction,
  clusterApiUrl,
  Connection,
} = require("@solana/web3.js");

let keypair = Keypair.generate();
let connection = new Connection(clusterApiUrl("testnet"));

sendAndConfirmTransaction(connection, transaction, [keypair]);
```

Вищенаведений код приймає `TransactionInstruction` за допомогою `SystemProgram`,
створює `Transaction` і відправляє її через мережу. Ви використовуєте
`Connection`, щоб визначити, до якої мережі Solana ви підключаєтесь, а саме
`mainnet-beta`, `testnet` або `devnet`.

### Взаємодія з власними програмами

Попередній розділ розглядає відправлення базових транзакцій. У Solana все, що ви
робите, взаємодіє з різними програмами, включаючи транзакцію передачі в
попередньому розділі. На момент написання програми на Solana пишуться на Rust
або C.

Розглянемо `SystemProgram`. Сигнатура методу для виділення простору в вашому
обліковому записі в Solana на Rust виглядає так:

```rust
pub fn allocate(
    pubkey: &Pubkey,
    space: u64
) -> Instruction
```

У Solana, коли ви хочете взаємодіяти з програмою, ви повинні спочатку знати всі
облікові записи, з якими програма буде взаємодіяти.

Ви завжди повинні надавати кожен обліковий запис, з яким програма буде
взаємодіяти в інструкції. Крім того, ви повинні вказати, чи є обліковий запис
`isSigner` або `isWritable`.

У методі `allocate` вище потрібен один обліковий запис `pubkey`, а також
кількість `space` для виділення. Ми знаємо, що метод `allocate` записує в
обліковий запис, виділяючи в ньому простір, роблячи `pubkey` обов'язковим
`isWritable`. `isSigner` потрібен, коли ви вказуєте обліковий запис, який
виконує інструкцію. У цьому випадку підписувач - це обліковий запис, який
викликає виділення простору в собі.

Давайте подивимося, як викликати цю інструкцію за допомогою solana-web3.js:

```javascript
let keypair = web3.Keypair.generate();
let payer = web3.Keypair.generate();
let connection = new web3.Connection(web3.clusterApiUrl("testnet"));

let airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });
```

Спочатку ми налаштовуємо Keypair і підключення, щоб у нас був обліковий запис
для виділення на тестовій мережі. Ми також створюємо Keypair для платника і
додаємо трохи SOL, щоб оплатити транзакцію виділення.

```javascript
let allocateTransaction = new web3.Transaction({
  feePayer: payer.publicKey,
});
let keys = [{ pubkey: keypair.publicKey, isSigner: true, isWritable: true }];
let params = { space: 100 };
```

Ми створюємо транзакцію `allocateTransaction`, об'єкти keys та params. Поле
`feePayer` є необов'язковим при створенні транзакції, воно вказує, хто оплачує
транзакцію, за замовчуванням використовується pubkey першого підписувача в
транзакції. `keys` представляє всі облікові записи, з якими функція програми
`allocate` буде взаємодіяти. Оскільки функція `allocate` також вимагає простору,
ми створили `params`, щоб його використати пізніше при виклику функції
`allocate`.

```javascript
let allocateStruct = {
  index: 8,
  layout: struct([u32("instruction"), ns64("space")]),
};
```

Це створено за допомогою `u32` і `ns64` з `@solana/buffer-layout` для створення
payload. Функція `allocate` приймає параметр `space`. Щоб взаємодіяти з
функцією, ми повинні надати дані у форматі Buffer. Бібліотека `buffer-layout`
допомагає з виділенням буфера та його правильним кодуванням для інтерпретації
програмами на Rust в Solana.

Давайте розглянемо цю структуру детальніше.

```javascript
{
  index: 8, /* <-- */
  layout: struct([
    u32('instruction'),
    ns64('space'),
  ])
}
```

`index` встановлений у 8, тому що функція `allocate` знаходиться на 8-й позиції
у enum інструкцій для `SystemProgram`.

```rust
/* https://github.com/solana-labs/solana/blob/21bc43ed58c63c827ba4db30426965ef3e807180/sdk/program/src/system_instruction.rs#L142-L305 */
pub enum SystemInstruction {
    /** 0 **/CreateAccount {/**/},
    /** 1 **/Assign {/**/},
    /** 2 **/Transfer {/**/},
    /** 3 **/CreateAccountWithSeed {/**/},
    /** 4 **/AdvanceNonceAccount,
    /** 5 **/WithdrawNonceAccount(u64),
    /** 6 **/InitializeNonceAccount(Pubkey),
    /** 7 **/AuthorizeNonceAccount(Pubkey),
    /** 8 **/Allocate {/**/},
    /** 9 **/AllocateWithSeed {/**/},
    /** 10 **/AssignWithSeed {/**/},
    /** 11 **/TransferWithSeed {/**/},
    /** 12 **/UpgradeNonceAccount,
}
```

Далі `u32('instruction')`.

```javascript
{
  index: 8,
  layout: struct([
    u32('instruction'), /* <-- */
    ns64('space'),
  ])
}
```

`layout` у структурі allocate завжди має мати `u32('instruction')` першим при
використанні для виклику інструкції.

```javascript
{
  index: 8,
  layout: struct([
    u32('instruction'),
    ns64('space'), /* <-- */
  ])
}
```

`ns64('space')` - це аргумент для функції `allocate`. Ви можете бачити, що в
оригінальній функції `allocate` на Rust, space мав тип `u64`. `u64` є 64-бітовим
unsigned integer. У Javascript за замовчуванням підтримуються тільки 53-бітові
числа. `ns64` з `@solana/buffer-layout` допомагає з конвертацією типів між Rust
і Javascript. Ви можете знайти більше конвертацій типів між Rust і Javascript на
[solana-labs/buffer-layout](https://github.com/solana-labs/buffer-layout).

```javascript
let data = Buffer.alloc(allocateStruct.layout.span);
let layoutFields = Object.assign({ instruction: allocateStruct.index }, params);
allocateStruct.layout.encode(layoutFields, data);
```

Використовуючи створений раніше bufferLayout, ми можемо виділити буфер даних.
Потім ми присвоюємо наші params `{ space: 100 }`, щоб вони правильно відповідали
макету, і кодуємо їх у буфер даних. Тепер дані готові для відправлення до
програми.

```javascript
allocateTransaction.add(
  new web3.TransactionInstruction({
    keys,
    programId: web3.SystemProgram.programId,
    data,
  }),
);

await web3.sendAndConfirmTransaction(connection, allocateTransaction, [
  payer,
  keypair,
]);
```

Нарешті, ми додаємо інструкцію транзакції з усіма ключами облікових записів,
платником, даними та programId і передаємо транзакцію до мережі.

Повний код можна знайти нижче.

```javascript
const { struct, u32, ns64 } = require("@solana/buffer-layout");
const { Buffer } = require("buffer");
const web3 = require("@solana/web3.js");

let keypair = web3.Keypair.generate();
let payer = web3.Keypair.generate();

let connection = new web3.Connection(web3.clusterApiUrl("testnet"));

let airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

let allocateTransaction = new web3.Transaction({
  feePayer: payer.publicKey,
});
let keys = [{ pubkey: keypair.publicKey, isSigner: true, isWritable: true }];
let params = { space: 100 };

let allocateStruct = {
  index: 8,
  layout: struct([u32("instruction"), ns64("space")]),
};

let data = Buffer.alloc(allocateStruct.layout.span);
let layoutFields = Object.assign({ instruction: allocateStruct.index }, params);
allocateStruct.layout.encode(layoutFields, data);

allocateTransaction.add(
  new web3.TransactionInstruction({
    keys,
    programId: web3.SystemProgram.programId,
    data,
  }),
);

await web3.sendAndConfirmTransaction(connection, allocateTransaction, [
  payer,
  keypair,
]);
```
