---
sidebarLabel: Запис у Мережу
title: Запис у Мережу
sidebarSortOrder: 2
description:
  Дізнайтеся, як взаємодіяти з мережею Solana шляхом надсилання транзакцій та
  інструкцій. Слідуйте покроковим прикладам для переказу токенів SOL та
  створення нових токенів за допомогою System Program та Token Extensions
  Program.
---

Тепер, коли ми розглянули зчитування даних із мережі Solana, давайте навчимося
записувати дані до неї. У Solana взаємодія з мережею здійснюється шляхом
надсилання транзакцій, що складаються з інструкцій. Ці інструкції визначаються
програмами, які містять бізнес-логіку про те, як мають оновлюватися акаунти.

Розглянемо два поширені операції, переказ SOL і створення токена, щоб
продемонструвати, як створювати і надсилати транзакції. Для отримання додаткової
інформації відвідайте сторінки
[Транзакції та Інструкції](/docs/uk/core/transactions) і
[Комісії у Solana](/docs/uk/core/fees).

## Переказ SOL

Почнемо із простої операції переказу SOL з вашого гаманця на інший акаунт. Це
вимагає виклику інструкції переказу у System Program.

<Steps>

### Відкриття Прикладу 1

Натисніть це [посилання](https://beta.solpg.io/6671d85ecffcf4b13384d19e), щоб
відкрити приклад у Solana Playground. Ви побачите такий код:

```ts filename="client.ts"
import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";

const sender = pg.wallet.keypair;
const receiver = new Keypair();

const transferInstruction = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: receiver.publicKey,
  lamports: 0.01 * LAMPORTS_PER_SOL,
});

const transaction = new Transaction().add(transferInstruction);

const transactionSignature = await sendAndConfirmTransaction(
  pg.connection,
  transaction,
  [sender],
);

console.log(
  "Transaction Signature:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);
```

<Accordion>
<AccordionItem title="Explanation">

Цей скрипт виконує наступні дії:

- Встановлює ваш гаманець Playground як відправника:

  ```ts
  const sender = pg.wallet.keypair;
  ```

- Створює нову ключову пару як отримувача:

  ```ts
  const receiver = new Keypair();
  ```

- Створює інструкцію переказу для переказу 0.01 SOL:

  ```ts
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver.publicKey,
    lamports: 0.01 * LAMPORTS_PER_SOL,
  });
  ```

- Формує транзакцію, включаючи інструкцію переказу:

  ```ts
  const transaction = new Transaction().add(transferInstruction);
  ```

- Відправляє та підтверджує транзакцію:

  ```ts
  const transactionSignature = await sendAndConfirmTransaction(
    pg.connection,
    transaction,
    [sender],
  );
  ```

- Виводить посилання на SolanaFM у термінал Playground для перегляду деталей
  транзакції.

  ```ts
  console.log(
    "Transaction Signature:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );
  ```

</AccordionItem>
</Accordion>

### Запуск Прикладу 1

Запустіть код, виконавши команду `run`.

```shell filename="Terminal"
run
```

Натисніть на посилання у виведених даних, щоб переглянути деталі транзакції у
SolanaFM Explorer.

<Accordion>
<AccordionItem title="Output">

```shell filename="Terminal"
Running client...
  client.ts:
    Transaction Signature: https://solana.fm/tx/he9dBwrEPhrfrx2BaX4cUmUbY22DEyqZ837zrGrFRnYEBmKhCb5SvoaUeRKSeLFXiGxC8hFY5eDbHqSJ7NYYo42?cluster=devnet-solana
```

</AccordionItem>
</Accordion>

![Transfer SOL](/assets/docs/intro/quickstart/transfer-sol.png)

Ви щойно надіслали свою першу транзакцію у Solana! Зверніть увагу, як ми
створили інструкцію, додали її до транзакції, а потім відправили цю транзакцію
до мережі. Це базовий процес для створення будь-якої транзакції.

</Steps>

## Створення Токена

Тепер створимо новий токен шляхом створення та ініціалізації акаунта Mint. Для
цього потрібні дві інструкції:

- Виклик System Program для створення нового акаунта.
- Виклик Token Extensions Program для ініціалізації даних акаунта.

<Steps>

### Відкриття Прикладу 2

Натисніть це [посилання](https://beta.solpg.io/6671da4dcffcf4b13384d19f), щоб
відкрити приклад у Solana Playground. Ви побачите наступний код:

```ts filename="client.ts"
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";

const wallet = pg.wallet;
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Generate keypair to use as address of mint account
const mint = new Keypair();

// Calculate minimum lamports for space required by mint account
const rentLamports = await getMinimumBalanceForRentExemptMint(connection);

// Instruction to create new account with space for new mint account
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: wallet.publicKey,
  newAccountPubkey: mint.publicKey,
  space: MINT_SIZE,
  lamports: rentLamports,
  programId: TOKEN_2022_PROGRAM_ID,
});

// Instruction to initialize mint account
const initializeMintInstruction = createInitializeMint2Instruction(
  mint.publicKey,
  2, // decimals
  wallet.publicKey, // mint authority
  wallet.publicKey, // freeze authority
  TOKEN_2022_PROGRAM_ID,
);

// Build transaction with instructions to create new account and initialize mint account
const transaction = new Transaction().add(
  createAccountInstruction,
  initializeMintInstruction,
);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [
    wallet.keypair, // payer
    mint, // mint address keypair
  ],
);

console.log(
  "\nTransaction Signature:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
);

console.log(
  "\nMint Account:",
  `https://solana.fm/address/${mint.publicKey}?cluster=devnet-solana`,
);
```

<Accordion>
<AccordionItem title="Explanation">

Цей скрипт виконує наступні кроки:

- Налаштовує ваш гаманець Playground і з'єднання з devnet Solana:

  ```ts
  const wallet = pg.wallet;
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  ```

- Генерує нову ключову пару для акаунта mint:

  ```ts
  const mint = new Keypair();
  ```

- Розраховує мінімальну кількість лампортів, необхідну для акаунта Mint:

  ```ts
  const rentLamports = await getMinimumBalanceForRentExemptMint(connection);
  ```

- Створює інструкцію для створення нового акаунта mint, вказуючи програму Token
  Extensions (TOKEN_2022_PROGRAM_ID) як власника нового акаунта:

  ```ts
  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: mint.publicKey,
    space: MINT_SIZE,
    lamports: rentLamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });
  ```

- Створює інструкцію для ініціалізації даних акаунта mint:

  ```ts
  const initializeMintInstruction = createInitializeMint2Instruction(
    mint.publicKey,
    2,
    wallet.publicKey,
    wallet.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );
  ```

- Додає обидві інструкції до однієї транзакції:

  ```ts
  const transaction = new Transaction().add(
    createAccountInstruction,
    initializeMintInstruction,
  );
  ```

- Відправляє та підтверджує транзакцію. Гаманець і ключова пара mint передаються
  як підписувачі транзакції. Гаманець потрібен для оплати створення нового
  акаунта, а ключова пара mint потрібна, оскільки її публічний ключ
  використовується як адреса нового акаунта:

  ```ts
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [wallet.keypair, mint],
  );
  ```

- Виводить посилання для перегляду транзакції та деталей акаунта mint на
  SolanaFM:

  ```ts
  console.log(
    "\nTransaction Signature:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );

  console.log(
    "\nMint Account:",
    `https://solana.fm/address/${mint.publicKey}?cluster=devnet-solana`,
  );
  ```

</AccordionItem>
</Accordion>

### Запуск Прикладу 2

Запустіть код, виконавши команду `run`.

```shell filename="Terminal"
run
```

Ви побачите два посилання, виведених у термінал Playground:

- Одне для деталей транзакції
- Інше для новоствореного акаунта mint

Натисніть на посилання, щоб переглянути деталі транзакції та новостворений
акаунт mint у SolanaFM.

<Accordion>
<AccordionItem title="Output">

```shell filename="Terminal"
Running client...
  client.ts:

Transaction Signature: https://solana.fm/tx/3BEjFxqyGwHXWSrEBnc7vTSaXUGDJFY1Zr6L9iwLrjH8KBZdJSucoMrFUEJgWrWVRYzrFvbjX8TmxKUV88oKr86g?cluster=devnet-solana

Mint Account: https://solana.fm/address/CoZ3Nz488rmATDhy1hPk5fvwSZaipCngvf8rYBYVc4jN?cluster=devnet-solana
```

</AccordionItem>
</Accordion>

![Create Token](/assets/docs/intro/quickstart/create-token.png)

![Mint Account](/assets/docs/intro/quickstart/mint-account.png)

Зверніть увагу, як цього разу ми створили транзакцію з кількома інструкціями.
Спочатку ми створили новий акаунт, а потім ініціалізували його дані як mint.
Таким чином створюються складніші транзакції, які включають інструкції з кількох
програм.

</Steps>
