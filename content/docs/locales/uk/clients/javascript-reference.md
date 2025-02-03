---
title: Web3.js API Приклади
description:
  Дізнайтеся, як взаємодіяти з блокчейном Solana за допомогою бібліотеки
  @solana/web3.js через практичні приклади коду та пояснення.
---

## Довідник по Web3 API

Бібліотека `@solana/web3.js` забезпечує покриття
[Solana JSON RPC API](/docs/uk/rpc).

Повну документацію до бібліотеки `@solana/web3.js` можна знайти
[тут](https://solana-labs.github.io/solana-web3.js/v1.x/).

## Загальні

### Підключення

[Документація](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html)

Об'єкт `Connection` використовується для взаємодії з
[Solana JSON RPC](/docs/uk/rpc). Ви можете використовувати Connection для
підтвердження транзакцій, отримання інформації про облікові записи тощо.

Створення підключення здійснюється шляхом вказання URL-адреси RPC-кластера та
бажаного рівня зобов'язань. Після цього ви можете використовувати цей об'єкт
підключення для взаємодії з будь-яким із API JSON RPC Solana.

#### Приклад використання

```javascript
const web3 = require("@solana/web3.js");

let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

let slot = await connection.getSlot();
console.log(slot);
// 93186439

let blockTime = await connection.getBlockTime(slot);
console.log(blockTime);
// 1630747045

let block = await connection.getBlock(slot);
console.log(block);

/*
{
    blockHeight: null,
    blockTime: 1630747045,
    blockhash: 'AsFv1aV5DGip9YJHHqVjrGg6EKk55xuyxn2HeiN9xQyn',
    parentSlot: 93186438,
    previousBlockhash: '11111111111111111111111111111111',
    rewards: [],
    transactions: []
}
*/

let slotLeader = await connection.getSlotLeader();
console.log(slotLeader);
//49AqLYbpJYc2DrzGUAH1fhWJy62yxBxpLEkfJwjKy2jr
```

Наведений вище приклад показує лише кілька методів класу Connection. Повний
список можна знайти у
[генерованій документації](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html).

### Транзакція

[Документація](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html)

Транзакція використовується для взаємодії з програмами на блокчейні Solana. Ці
транзакції створюються за допомогою TransactionInstructions, які містять усі
можливі облікові записи для взаємодії, а також необхідні дані або адреси
програм. Кожна TransactionInstruction складається з ключів, даних і programId.
Ви можете виконувати кілька інструкцій в одній транзакції, взаємодіючи з
кількома програмами одночасно.

#### Приклад використання

```javascript
const web3 = require("@solana/web3.js");
const nacl = require("tweetnacl");

// Запит airdrop SOL для оплати транзакцій
let payer = web3.Keypair.generate();
let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

let airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

let toAccount = web3.Keypair.generate();

// Створення простої транзакції
let transaction = new web3.Transaction();

// Додати інструкцію для виконання
transaction.add(
  web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: 1000,
  }),
);

// Відправка та підтвердження транзакції
// За замовчуванням feePayer - це перший підписант
await web3.sendAndConfirmTransaction(connection, transaction, [payer]);

// Альтернативно, створення транзакції вручну
let recentBlockhash = await connection.getLatestBlockhash();
let manualTransaction = new web3.Transaction({
  recentBlockhash: recentBlockhash.blockhash,
  feePayer: payer.publicKey,
});
manualTransaction.add(
  web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: 1000,
  }),
);

let transactionBuffer = manualTransaction.serializeMessage();
let signature = nacl.sign.detached(transactionBuffer, payer.secretKey);

manualTransaction.addSignature(payer.publicKey, signature);

let isVerifiedSignature = manualTransaction.verifySignatures();
console.log(`The signatures were verified: ${isVerifiedSignature}`);

// The signatures were verified: true

let rawTransaction = manualTransaction.serialize();

await web3.sendAndConfirmRawTransaction(connection, rawTransaction);
```

### Keypair

[Документація](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Keypair.html)

Keypair використовується для створення облікового запису з публічним і секретним
ключами в Solana. Ви можете згенерувати Keypair, створити його з seed або
секретного ключа.

#### Приклад використання

```javascript
const { Keypair } = require("@solana/web3.js");

let account = Keypair.generate();

console.log(account.publicKey.toBase58());
console.log(account.secretKey);

// 2DVaHtcdTf7cm18Zm9VV8rKK4oSnjmTkKE6MiXe18Qsb
// Uint8Array(64) [...]

let seed = Uint8Array.from([
  70, 60, 102, 100, 70, 60, 102, 100, 70, 60, 102, 100, 70, 60, 102, 100,
]);
let accountFromSeed = Keypair.fromSeed(seed);

console.log(accountFromSeed.publicKey.toBase58());
console.log(accountFromSeed.secretKey);

// 3LDverZtSC9Duw2wyGC1C38atMG49toPNW9jtGJiw9Ar
// Uint8Array(64) [...]

let accountFromSecret = Keypair.fromSecretKey(account.secretKey);

console.log(accountFromSecret.publicKey.toBase58());
console.log(accountFromSecret.secretKey);

// 2DVaHtcdTf7cm18Zm9VV8rKK4oSnjmTkKE6MiXe18Qsb
// Uint8Array(64) [...]
```

Використання `generate` генерує випадкову Keypair для облікового запису на
Solana. Використання `fromSeed` дозволяє створити Keypair з детермінованим
конструктором. `fromSecret` створює Keypair із секретного масиву Uint8Array. Ви
можете побачити, що publicKey для Keypair, створеної за допомогою `generate`, і
`fromSecret` однакові, оскільки секретний ключ однаковий.

### Використання `generate` створює випадкову пару ключів для використання як обліковий запис у Solana.

Використання `fromSeed` дозволяє створити пару ключів за допомогою
детермінованого конструктора. `fromSecret` створює пару ключів із секретного
масиву Uint8Array. Ви можете побачити, що publicKey для пари ключів `generate` і
`fromSecret` є однаковими, оскільки секрет від пари ключів `generate`
використовується в `fromSecret`.

**Попередження**: Не використовуйте `fromSeed`, якщо ви не створюєте seed із
високою ентропією. Не розголошуйте ваш seed. Ставтеся до seed так само, як до
приватного ключа.

### PublicKey

[Джерело документації](https://solana-labs.github.io/solana-web3.js/v1.x/classes/PublicKey.html)

`PublicKey` використовується в `@solana/web3.js` для транзакцій, пар ключів і
програм. Вам потрібен publicKey при зазначенні кожного облікового запису в
транзакції, а також як загальний ідентифікатор у Solana.

`PublicKey` можна створити за допомогою base58-строки, буфера, Uint8Array, числа
або масиву чисел.

#### Приклад використання

```javascript
const { Buffer } = require("buffer");
const web3 = require("@solana/web3.js");
const crypto = require("crypto");

// Створення PublicKey з base58-строки
let base58publicKey = new web3.PublicKey(
  "5xot9PVkphiX2adznghwrAuxGs2zeWisNSxMW6hU6Hkj",
);
console.log(base58publicKey.toBase58());

// 5xot9PVkphiX2adznghwrAuxGs2zeWisNSxMW6hU6Hkj

// Створення програмної адреси
let highEntropyBuffer = crypto.randomBytes(31);
let programAddressFromKey = await web3.PublicKey.createProgramAddress(
  [highEntropyBuffer.slice(0, 31)],
  base58publicKey,
);
console.log(
  `Згенерована програмна адреса: ${programAddressFromKey.toBase58()}`,
);

// Згенерована програмна адреса: 3thxPEEz4EDWHNxo1LpEpsAxZryPAHyvNVXJEJWgBgwJ

// Знаходження програмної адреси за PublicKey
let validProgramAddress = await web3.PublicKey.findProgramAddress(
  [Buffer.from("", "utf8")],
  programAddressFromKey,
);
console.log(`Дійсна програмна адреса: ${validProgramAddress}`);

// Дійсна програмна адреса: C14Gs3oyeXbASzwUpqSymCKpEyccfEuSe8VRar9vJQRE,253
```

### SystemProgram

[Джерело документації](https://solana-labs.github.io/solana-web3.js/v1.x/classes/SystemProgram.html)

`SystemProgram` дозволяє створювати облікові записи, виділяти дані облікових
записів, призначати облікові записи програмам, працювати з nonce-обліковими
записами та переводити лампорти. Ви можете використовувати клас
`SystemInstruction` для декодування та читання окремих інструкцій.

#### Приклад використання

```javascript
const web3 = require("@solana/web3.js");

// Запит SOL для оплати транзакцій
let payer = web3.Keypair.generate();
let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

let airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

// Виділення даних облікового запису
let allocatedAccount = web3.Keypair.generate();
let allocateInstruction = web3.SystemProgram.allocate({
  accountPubkey: allocatedAccount.publicKey,
  space: 100,
});
let transaction = new web3.Transaction().add(allocateInstruction);

await web3.sendAndConfirmTransaction(connection, transaction, [
  payer,
  allocatedAccount,
]);

// Створення nonce-облікового запису
let nonceAccount = web3.Keypair.generate();
let minimumAmountForNonceAccount =
  await connection.getMinimumBalanceForRentExemption(web3.NONCE_ACCOUNT_LENGTH);
let createNonceAccountTransaction = new web3.Transaction().add(
  web3.SystemProgram.createNonceAccount({
    fromPubkey: payer.publicKey,
    noncePubkey: nonceAccount.publicKey,
    authorizedPubkey: payer.publicKey,
    lamports: minimumAmountForNonceAccount,
  }),
);

await web3.sendAndConfirmTransaction(
  connection,
  createNonceAccountTransaction,
  [payer, nonceAccount],
);

// Переведення nonce - використовується для створення транзакцій як зберігач облікового запису
let advanceNonceTransaction = new web3.Transaction().add(
  web3.SystemProgram.nonceAdvance({
    noncePubkey: nonceAccount.publicKey,
    authorizedPubkey: payer.publicKey,
  }),
);

await web3.sendAndConfirmTransaction(connection, advanceNonceTransaction, [
  payer,
]);

// Переведення лампортів між обліковими записами
let toAccount = web3.Keypair.generate();

let transferTransaction = new web3.Transaction().add(
  web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: 1000,
  }),
);
await web3.sendAndConfirmTransaction(connection, transferTransaction, [payer]);

// Призначення нового облікового запису програмі
let programId = web3.Keypair.generate();
let assignedAccount = web3.Keypair.generate();

let assignTransaction = new web3.Transaction().add(
  web3.SystemProgram.assign({
    accountPubkey: assignedAccount.publicKey,
    programId: programId.publicKey,
  }),
);

await web3.sendAndConfirmTransaction(connection, assignTransaction, [
  payer,
  assignedAccount,
]);
```

### Secp256k1Program

[Документація Джерела](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Secp256k1Program.html)

`Secp256k1Program` використовується для перевірки підписів `Secp256k1`, які
використовуються як у Bitcoin, так і в Ethereum.

#### Приклад Використання

```javascript
const { keccak_256 } = require("js-sha3");
const web3 = require("@solana/web3.js");
const secp256k1 = require("secp256k1");

// Створення Ethereum адреси з secp256k1
let secp256k1PrivateKey;
do {
  secp256k1PrivateKey = web3.Keypair.generate().secretKey.slice(0, 32);
} while (!secp256k1.privateKeyVerify(secp256k1PrivateKey));

let secp256k1PublicKey = secp256k1
  .publicKeyCreate(secp256k1PrivateKey, false)
  .slice(1);

let ethAddress =
  web3.Secp256k1Program.publicKeyToEthAddress(secp256k1PublicKey);
console.log(`Ethereum Address: 0x${ethAddress.toString("hex")}`);

// Ethereum Address: 0xadbf43eec40694eacf36e34bb5337fba6a2aa8ee

// Фінансування облікового запису для створення інструкцій
let fromPublicKey = web3.Keypair.generate();
let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

let airdropSignature = await connection.requestAirdrop(
  fromPublicKey.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

// Підписування повідомлення з ключем Ethereum
let plaintext = Buffer.from("string address");
let plaintextHash = Buffer.from(keccak_256.update(plaintext).digest());
let { signature, recid: recoveryId } = secp256k1.ecdsaSign(
  plaintextHash,
  secp256k1PrivateKey,
);

// Створення транзакції для перевірки підпису
let transaction = new Transaction().add(
  web3.Secp256k1Program.createInstructionWithEthAddress({
    ethAddress: ethAddress.toString("hex"),
    plaintext,
    signature,
    recoveryId,
  }),
);

// Транзакція буде успішною, якщо повідомлення підтверджено, що його підписано цією адресою
await web3.sendAndConfirmTransaction(connection, transaction, [fromPublicKey]);
```

### Message

[Документація Джерела](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Message.html)

`Message` використовується як альтернативний спосіб створення транзакцій. Ви
можете створити повідомлення за допомогою облікових записів, заголовка,
інструкцій та недавнього блочного хеша, які є частиною транзакції.
[Transaction](/docs/uk/clients/javascript.md#Transaction) є `Message` плюс
список необхідних підписів для виконання транзакції.

#### Приклад Використання

```javascript
const { Buffer } = require("buffer");
const bs58 = require("bs58");
const web3 = require("@solana/web3.js");

let toPublicKey = web3.Keypair.generate().publicKey;
let fromPublicKey = web3.Keypair.generate();

let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

let airdropSignature = await connection.requestAirdrop(
  fromPublicKey.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

let type = web3.SYSTEM_INSTRUCTION_LAYOUTS.Transfer;
let data = Buffer.alloc(type.layout.span);
let layoutFields = Object.assign({ instruction: type.index });
type.layout.encode(layoutFields, data);

let recentBlockhash = await connection.getRecentBlockhash();

let messageParams = {
  accountKeys: [
    fromPublicKey.publicKey.toString(),
    toPublicKey.toString(),
    web3.SystemProgram.programId.toString(),
  ],
  header: {
    numReadonlySignedAccounts: 0,
    numReadonlyUnsignedAccounts: 1,
    numRequiredSignatures: 1,
  },
  instructions: [
    {
      accounts: [0, 1],
      data: bs58.encode(data),
      programIdIndex: 2,
    },
  ],
  recentBlockhash,
};

let message = new web3.Message(messageParams);

let transaction = web3.Transaction.populate(message, [
  fromPublicKey.publicKey.toString(),
]);

await web3.sendAndConfirmTransaction(connection, transaction, [fromPublicKey]);
```

### Struct

[Документація Джерела](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Struct.html)

Клас `Struct` використовується для створення структур, сумісних із Rust, у
JavaScript. Цей клас сумісний лише з Rust-структурами, закодованими за допомогою
Borsh.

#### Приклад Використання

Структура в Rust:

```rust
pub struct Fee {
    pub denominator: u64,
    pub numerator: u64,
}
```

Використання з web3:

```javascript
import BN from "bn.js";
import { Struct } from "@solana/web3.js";

export class Fee extends Struct {
  denominator: BN;
  numerator: BN;
}
```

### Enum

[Документація Джерела](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Enum.html)

Клас `Enum` використовується для представлення сумісного з Rust енумератора у
JavaScript. Енумератор буде представлений як строка при логуванні, але може бути
правильно закодований/декодований при використанні разом з
[Struct](/docs/uk/clients/javascript.md#Struct). Цей клас сумісний лише з
Rust-енумераторами, закодованими за допомогою Borsh.

#### Приклад Використання

Rust:

```rust
pub enum AccountType {
    Uninitialized,
    StakePool,
    ValidatorList,
}
```

Web3:

```javascript
import { Enum } from "@solana/web3.js";

export class AccountType extends Enum {}
```

### NonceAccount

[Документація Джерела](https://solana-labs.github.io/solana-web3.js/v1.x/classes/NonceAccount.html)

Зазвичай транзакція відхиляється, якщо поле `recentBlockhash` транзакції є
застарілим. Для забезпечення певних кастодіальних послуг використовуються
облікові записи `NonceAccount`. Транзакції, які використовують
`recentBlockhash`, зафіксовані на блокчейні обліковим записом `NonceAccount`, не
старіють доти, доки цей обліковий запис не буде оновлено.

Ви можете створити `NonceAccount`, спочатку створивши звичайний обліковий запис,
а потім використовуючи `SystemProgram`, щоб зробити цей обліковий запис
`NonceAccount`.

#### Приклад Використання

```javascript
const web3 = require("@solana/web3.js");

// Створення з'єднання
let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

// Генерація облікових записів
let account = web3.Keypair.generate();
let nonceAccount = web3.Keypair.generate();

// Фінансування облікового запису
let airdropSignature = await connection.requestAirdrop(
  account.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

// Отримання мінімальної суми для звільнення від оренди
let minimumAmount = await connection.getMinimumBalanceForRentExemption(
  web3.NONCE_ACCOUNT_LENGTH,
);

// Формування транзакції CreateNonceAccount
let transaction = new web3.Transaction().add(
  web3.SystemProgram.createNonceAccount({
    fromPubkey: account.publicKey,
    noncePubkey: nonceAccount.publicKey,
    authorizedPubkey: account.publicKey,
    lamports: minimumAmount,
  }),
);
// Створення Nonce Account
await web3.sendAndConfirmTransaction(connection, transaction, [
  account,
  nonceAccount,
]);

let nonceAccountData = await connection.getNonce(
  nonceAccount.publicKey,
  "confirmed",
);

console.log(nonceAccountData);
// NonceAccount {
//   authorizedPubkey: PublicKey {
//     _bn: <BN: 919981a5497e8f85c805547439ae59f607ea625b86b1138ea6e41a68ab8ee038>
//   },
//   nonce: '93zGZbhMmReyz4YHXjt2gHsvu5tjARsyukxD4xnaWaBq',
//   feeCalculator: { lamportsPerSignature: 5000 }
// }

let nonceAccountInfo = await connection.getAccountInfo(
  nonceAccount.publicKey,
  "confirmed",
);

let nonceAccountFromInfo = web3.NonceAccount.fromAccountData(
  nonceAccountInfo.data,
);

console.log(nonceAccountFromInfo);
// NonceAccount {
//   authorizedPubkey: PublicKey {
//     _bn: <BN: 919981a5497e8f85c805547439ae59f607ea625b86b1138ea6e41a68ab8ee038>
//   },
//   nonce: '93zGZbhMmReyz4YHXjt2gHsvu5tjARsyukxD4xnaWaBq',
//   feeCalculator: { lamportsPerSignature: 5000 }
// }
```

Наведений вище приклад показує як створити `NonceAccount` за допомогою
`SystemProgram.createNonceAccount`, а також як отримати `NonceAccount` з
accountInfo. Використовуючи nonce, ви можете створювати транзакції офлайн з
nonce замість `recentBlockhash`.

### VoteAccount

[Документація Джерела](https://solana-labs.github.io/solana-web3.js/v1.x/classes/VoteAccount.html)

`VoteAccount` — це об'єкт, який дозволяє декодувати облікові записи для
голосування з використанням нативної програми голосування в мережі.

#### Приклад Використання

```javascript
const web3 = require("@solana/web3.js");

let voteAccountInfo = await connection.getProgramAccounts(web3.VOTE_PROGRAM_ID);
let voteAccountFromData = web3.VoteAccount.fromAccountData(
  voteAccountInfo[0].account.data,
);
console.log(voteAccountFromData);
/*
VoteAccount {
  nodePubkey: PublicKey {
    _bn: <BN: cf1c635246d4a2ebce7b96bf9f44cacd7feed5552be3c714d8813c46c7e5ec02>
  },
  authorizedWithdrawer: PublicKey {
    _bn: <BN: b76ae0caa56f2b9906a37f1b2d4f8c9d2a74c1420cd9eebe99920b364d5cde54>
  },
  commission: 10,
  rootSlot: 104570885,
  votes: [
    { slot: 104570886, confirmationCount: 31 },
    { slot: 104570887, confirmationCount: 30 },
    { slot: 104570888, confirmationCount: 29 },
    { slot: 104570889, confirmationCount: 28 },
    { slot: 104570890, confirmationCount: 27 },
    { slot: 104570891, confirmationCount: 26 },
    { slot: 104570892, confirmationCount: 25 },
    { slot: 104570893, confirmationCount: 24 },
    { slot: 104570894, confirmationCount: 23 },
    ...
  ],
  authorizedVoters: [ { epoch: 242, authorizedVoter: [PublicKey] } ],
  priorVoters: [
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object]
   ],
  epochCredits: [
    { epoch: 179, credits: 33723163, prevCredits: 33431259 },
    { epoch: 180, credits: 34022643, prevCredits: 33723163 },
    { epoch: 181, credits: 34331103, prevCredits: 34022643 },
    { epoch: 182, credits: 34619348, prevCredits: 34331103 },
    { epoch: 183, credits: 34880375, prevCredits: 34619348 },
    { epoch: 184, credits: 35074055, prevCredits: 34880375 },
    { epoch: 185, credits: 35254965, prevCredits: 35074055 },
    { epoch: 186, credits: 35437863, prevCredits: 35254965 },
    { epoch: 187, credits: 35672671, prevCredits: 35437863 },
    { epoch: 188, credits: 35950286, prevCredits: 35672671 },
    { epoch: 189, credits: 36228439, prevCredits: 35950286 },
    ...
  ],
  lastTimestamp: { slot: 104570916, timestamp: 1635730116 }
}
*/
```

## Staking

### StakeProgram

[Документація Джерела](https://solana-labs.github.io/solana-web3.js/v1.x/classes/StakeProgram.html)

`StakeProgram` полегшує процес стейкінгу SOL і делегування їх будь-яким
валідаторам у мережі. Ви можете використовувати `StakeProgram`, щоб створити
стейк-обліковий запис, застейкати SOL, авторизувати облікові записи для
виведення стейка, деактивувати стейк і вивести кошти. Клас `StakeInstruction`
використовується для декодування та читання додаткових інструкцій з транзакцій,
що викликають `StakeProgram`.

#### Приклад Використання

```javascript
const web3 = require("@solana/web3.js");

// Фінансування ключа для створення транзакцій
let fromPublicKey = web3.Keypair.generate();
let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

let airdropSignature = await connection.requestAirdrop(
  fromPublicKey.publicKey,
  web3.LAMPORTS_PER_SOL,
);
await connection.confirmTransaction({ signature: airdropSignature });

// Створення облікового запису
let stakeAccount = web3.Keypair.generate();
let authorizedAccount = web3.Keypair.generate();
/* Примітка: Це мінімальна сума для стейк-облікового запису — Додайте додаткові лампорти для стейкінгу
    Наприклад, ми додаємо 50 лампорт як частину стейка */
let lamportsForStakeAccount =
  (await connection.getMinimumBalanceForRentExemption(
    web3.StakeProgram.space,
  )) + 50;

let createAccountTransaction = web3.StakeProgram.createAccount({
  fromPubkey: fromPublicKey.publicKey,
  authorized: new web3.Authorized(
    authorizedAccount.publicKey,
    authorizedAccount.publicKey,
  ),
  lamports: lamportsForStakeAccount,
  lockup: new web3.Lockup(0, 0, fromPublicKey.publicKey),
  stakePubkey: stakeAccount.publicKey,
});
await web3.sendAndConfirmTransaction(connection, createAccountTransaction, [
  fromPublicKey,
  stakeAccount,
]);

// Перевірка доступності стейка
let stakeBalance = await connection.getBalance(stakeAccount.publicKey);
console.log(`Stake balance: ${stakeBalance}`);
// Stake balance: 2282930

// Ми можемо перевірити стан нашого стейка. Це може зайняти деякий час, щоб активуватись
let stakeState = await connection.getStakeActivation(stakeAccount.publicKey);
console.log(`Stake state: ${stakeState.state}`);
// Stake state: inactive

// Щоб делегувати наш стейк, ми отримуємо поточні облікові записи голосування та вибираємо перший
let voteAccounts = await connection.getVoteAccounts();
let voteAccount = voteAccounts.current.concat(voteAccounts.delinquent)[0];
let votePubkey = new web3.PublicKey(voteAccount.votePubkey);

// Тепер ми можемо делегувати наш стейк до облікового запису голосування
let delegateTransaction = web3.StakeProgram.delegate({
  stakePubkey: stakeAccount.publicKey,
  authorizedPubkey: authorizedAccount.publicKey,
  votePubkey: votePubkey,
});
await web3.sendAndConfirmTransaction(connection, delegateTransaction, [
  fromPublicKey,
  authorizedAccount,
]);

// Щоб вивести наші кошти, ми спочатку повинні деактивувати стейк
let deactivateTransaction = web3.StakeProgram.deactivate({
  stakePubkey: stakeAccount.publicKey,
  authorizedPubkey: authorizedAccount.publicKey,
});
await web3.sendAndConfirmTransaction(connection, deactivateTransaction, [
  fromPublicKey,
  authorizedAccount,
]);

// Після деактивації ми можемо вивести наші кошти
let withdrawTransaction = web3.StakeProgram.withdraw({
  stakePubkey: stakeAccount.publicKey,
  authorizedPubkey: authorizedAccount.publicKey,
  toPubkey: fromPublicKey.publicKey,
  lamports: stakeBalance,
});

await web3.sendAndConfirmTransaction(connection, withdrawTransaction, [
  fromPublicKey,
  authorizedAccount,
]);
```

### Authorized

[Документація Джерела](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Authorized.html)

`Authorized` — це об'єкт, який використовується під час створення авторизованого
облікового запису для стейкінгу в Solana. Ви можете окремо призначити `staker` і
`withdrawer`, що дозволяє іншому обліковому запису виводити кошти, ніж той, що
виконує стейкінг.

Більше прикладів використання об'єкта `Authorized` ви можете знайти в розділі
[`StakeProgram`](/docs/uk/clients/javascript.md#StakeProgram).

### Lockup

[Документація Джерела](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Lockup.html)

`Lockup` використовується разом із
[StakeProgram](/docs/uk/clients/javascript.md#StakeProgram) для створення
облікового запису. `Lockup` визначає, як довго стейк буде заблокований або
недоступний для вилучення. Якщо `Lockup` встановлений на 0 як для епохи, так і
для мітки часу Unix, блокування для облікового запису буде відключено.

#### Приклад Використання

```javascript
const {
  Authorized,
  Keypair,
  Lockup,
  StakeProgram,
} = require("@solana/web3.js");

let account = Keypair.generate();
let stakeAccount = Keypair.generate();
let authorized = new Authorized(account.publicKey, account.publicKey);
let lockup = new Lockup(0, 0, account.publicKey);

let createStakeAccountInstruction = StakeProgram.createAccount({
  fromPubkey: account.publicKey,
  authorized: authorized,
  lamports: 1000,
  lockup: lockup,
  stakePubkey: stakeAccount.publicKey,
});
```

Наведений вище код створює `createStakeAccountInstruction`, який
використовується для створення облікового запису за допомогою `StakeProgram`.
Блокування встановлено на 0 як для епохи, так і для мітки часу Unix, що
відключає блокування для облікового запису.

Детальніше див. у розділі
[StakeProgram](/docs/uk/clients/javascript.md#StakeProgram).
