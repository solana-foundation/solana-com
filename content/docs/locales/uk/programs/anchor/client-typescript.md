---
title: JS/TS Client
description:
  Дізнайтеся, як використовувати клієнтську бібліотеку TypeScript для взаємодії
  з Solana
sidebarLabel: JS/TS Client
sidebarSortOrder: 3
---

Anchor надає бібліотеку клієнта TypeScript
([@coral-xyz/anchor](https://github.com/coral-xyz/anchor/tree/v0.30.1/ts/packages/anchor))
Це спрощує процес взаємодії з програмами Solana від клієнта у JavaScript або
TypeScript.

## Клієнтська програма

Для використання клієнтської бібліотеки спочатку створіть екземпляр
[`Program`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/index.ts#L58)
Використання [IDL -файлу] (/DOCS/Програми/Анкер/IDL), створений Anchor.

Створення екземпляра програми вимагає IDL програми та
[`AnchorProvider`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/provider.ts#L55).
`AnchorProvider` - це абстракція, яка поєднує дві речі:

- `Підключення ' - з'єднання з [кластером Solana] (/docs/core/clusters.md) (тобто
  localhost, devnet, mainnet)
- `Wallet` - (необов’язково) Гаманець за замовчуванням, який використовується
  для оплати та підписання транзакцій
    <!-- prettier-ignore -->
  <Tabs items={['Frontend/Node', 'Test File']}> <Tab value="Frontend/Node">

При інтеграції з фронтендом за допомогою [Адаптер гаманця] (https://solana.com/developers/guides/wallets/add-solana-wallet-adapter-to-nextjs),
Вам потрібно буде налаштувати `AnchorProvider` та `Program`.

```ts {9-10, 12-14}
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import type { HelloAnchor } from "./idlType";
import idl from "./idl.json";

const { connection } = useConnection();
const wallet = useAnchorWallet();

const provider = new AnchorProvider(connection, wallet, {});
setProvider(provider);

export const program = new Program(idl as HelloAnchor, {
  connection,
});
```

У фрагменті коду вище:

- `idl.json` - це файл IDL, створений якір, знайдено на
  `/target/idl/<mance-name> .json` в якорі.
- `idltype.ts` - це тип IDL (для використання з TS), знайдено в
  `/target/type/<mange-name> .ts` в якорі.

Крім того, ви можете створити екземпляр, використовуючи лише IDL і підключення
до кластеру солани.Це означає, що немає за замовчуванням `Wallet`, але дозволяє
використовувати` Програму 'для отримання облікових записів або побудувати
Інструкції без підключеного гаманця.

```ts {8-10}
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import type { HelloAnchor } from "./idlType";
import idl from "./idl.json";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const program = new Program(idl as HelloAnchor, {
  connection,
});
```

</Tab>
<Tab value="Test File">

Якір автоматично налаштовує екземпляр `Program` у тестовому файлі за
замовчуванням нові проекти.Однак ця установка відрізняється від того, як ви
ініціалізуєте програму Поза робочою областю якоря, наприклад, у програмах React
або Node.js.

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloAnchor } from "../target/types/hello_anchor";

describe("hello_anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
```

</Tab>
</Tabs>

## Виклик інструкцій

Після того як `Program` налаштовано за допомогою програмного IDL, ви можете
використовувати якір
[`MethodsBuilder`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/methods.ts#L155)
для:

- Створіть окремі інструкції
- Будуйте транзакції
- Будуйте та надсилайте транзакції

Основний формат виглядає як наступне:

<!-- prettier-ignore -->
<Tabs items={['methods', 'instruction', 'accounts', `signers`]}>
<Tab value="methods">

`program.methods` - Це API Builder для створення інструкційних дзвінків з IDL
програми

```ts /methods/ {1}
await program.methods
  .instructionName(instructionData)
  .accounts({})
  .signers([])
  .rpc();
```

</Tab>
<Tab value="instruction">

У розділі `.methods` вказуйте назву інструкції з IDL програми, передаючи
будь-які необхідні аргументи як значення, розділені комами.

```ts /instructionName/ /instructionData1/ /instructionData2/ {2}
await program.methods
  .instructionName(instructionData1, instructionData2)
  .accounts({})
  .signers([])
  .rpc();
```

</Tab>
<Tab value="accounts">

`.accounts` - Вказуйте адресу облікових записів, необхідних для інструкції, як
це зазначено в IDL.

```ts /accounts/ {3}
await program.methods
  .instructionName(instructionData)
  .accounts({})
  .signers([])
  .rpc();
```

Зверніть увагу, що деякі адреси облікових записів не потрібно вказувати явно,
оскільки клієнт Anchor може автоматично їх визначити. Це зазвичай стосується:

- Загальних облікових записів (наприклад, Програма Системи)
- Облікових записів, де адреса є PDA (Програма-Походження Адреси)

</Tab>
<Tab value="signers">

`.signers` - Необов'язково передайте масив ключових пар, які потрібні як
додаткові підписанти для інструкції. Це зазвичай використовується при створенні
нових облікових записів, де адреса облікового запису є публічним ключем
нещодавно згенерованої ключової пари.

```ts /signers/ {4}
await program.methods
  .instructionName(instructionData)
  .accounts({})
  .signers([])
  .rpc();
```

Зверніть увагу, що `.signers` слід використовувати тільки при використанні
`.rpc()`. Коли ви використовуєте `.transaction()` або `.instruction()`,
підписанти повинні бути додані до транзакції перед її відправкою.

</Tab>
</Tabs>

Anchor надає кілька методів для створення інструкцій програми:

<!-- prettier-ignore -->
<Tabs items={['.rpc', '.transaction', '.instruction']}>
<Tab value=".rpc">

Метод
[`rpc()`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/methods.ts#L283)
[відправляє підписану транзакцію](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/rpc.ts#L29)
з вказаною інструкцією та повертає `TransactionSignature`.

При використанні `.rpc` гаманець з `Provider` автоматично додається як
підписант.

```ts {13}
// Generate keypair for the new account
const newAccountKp = new Keypair();

const data = new BN(42);
const transactionSignature = await program.methods
  .initialize(data)
  .accounts({
    newAccount: newAccountKp.publicKey,
    signer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([newAccountKp])
  .rpc();
```

</Tab>
<Tab value=".transaction">

Метод
[`transaction()`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/methods.ts#L382)
[створює `Transaction`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/transaction.ts#L18-L26)
з вказаною інструкцією без відправки транзакції.

```ts {12} /transaction()/1,2,4
// Generate keypair for the new account
const newAccountKp = new Keypair();

const data = new BN(42);
const transaction = await program.methods
  .initialize(data)
  .accounts({
    newAccount: newAccountKp.publicKey,
    signer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .transaction();

const transactionSignature = await connection.sendTransaction(transaction, [
  wallet.payer,
  newAccountKp,
]);
```

</Tab>
<Tab value=".instruction">

Метод
[`instruction()`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/methods.ts#L348)
[створює `TransactionInstruction`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/instruction.ts#L57-L61)
з вказаною інструкцією. Це корисно, якщо ви хочете вручну додати інструкцію до
транзакції та поєднати її з іншими інструкціями.

```ts {12} /instruction()/
// Generate keypair for the new account
const newAccountKp = new Keypair();

const data = new BN(42);
const instruction = await program.methods
  .initialize(data)
  .accounts({
    newAccount: newAccountKp.publicKey,
    signer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .instruction();

const transaction = new Transaction().add(instruction);

const transactionSignature = await connection.sendTransaction(transaction, [
  wallet.payer,
  newAccountKp,
]);
```

</Tab> 
</Tabs>

## Отримання облікових записів

Клієнт `Program` спрощує процес отримання та десеріалізації облікових записів,
створених вашою програмою Anchor.

Використовуйте `program.account`, за яким слідує назва типу облікового запису,
визначеного в IDL. Anchor надає кілька методів для отримання облікових записів.

<!-- prettier-ignore -->
<Tabs items={['all', 'memcmp', 'fetch', 'fetchMultiple']}>
<Tab value="all">

Використовуйте
[`all()`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/account.ts#L251)
для отримання всіх існуючих облікових записів для конкретного типу облікового
запису.

```ts /all/
const accounts = await program.account.newAccount.all();
```

</Tab>
<Tab value="memcmp">

Використовуйте `memcmp` (порівняння пам'яті) для фільтрації облікових записів,
дані яких відповідають конкретному значенню на вказаному зсуві. Для використання
`memcmp` необхідно розуміти байтову структуру поля даних для типу облікового
запису, який ви отримуєте.

При обчисленні зсуву пам'ятайте, що перші 8 байтів у облікових записах,
створених програмою Anchor, зарезервовані для дискримінатора облікового запису.

```ts /memcmp/
const accounts = await program.account.newAccount.all([
  {
    memcmp: {
      offset: 8,
      bytes: "",
    },
  },
]);
```

</Tab>
<Tab value="fetch">

Використовуйте
[`fetch()`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/account.ts#L165)
для отримання даних облікового запису для одного облікового запису.

```ts /fetch/
const account = await program.account.newAccount.fetch(ACCOUNT_ADDRESS);
```

</Tab>
<Tab value="fetchMultiple">

Використовуйте
[`fetchMultiple()`](https://github.com/coral-xyz/anchor/blob/v0.30.1/ts/packages/anchor/src/program/namespace/account.ts#L200)
для отримання даних облікових записів для кількох облікових записів, передавши
масив адрес облікових записів.

```ts /fetchMultiple/
const accounts = await program.account.newAccount.fetchMultiple([
  ACCOUNT_ADDRESS_ONE,
  ACCOUNT_ADDRESS_TWO,
]);
```

</Tab>
</Tabs>
