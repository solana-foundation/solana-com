---
sidebarSortOrder: 3
title: "Версійні Транзакції"
description:
  "Дослідіть основні концепції Solana: транзакції, версійні транзакції,
  розширення функціональності в Solana Runtime, таблиці пошуку адрес та інше."
altRoutes:
  - /docs/uk/core/transactions/versions
---

Версійні Транзакції - це новий формат транзакцій, який дозволяє додаткову
функціональність у Solana Runtime, включаючи
[Таблиці пошуку адрес](/docs/uk/advanced/lookup-tables.md).

Хоча зміни в ончейн-програмах **НЕ** потрібні для підтримки нової
функціональності версійних транзакцій (або для зворотної сумісності), розробники
**ПОВИННІ** оновити клієнтський код, щоб уникнути
[помилок через різні версії транзакцій](#max-supported-transaction-version).

## Поточні версії транзакцій

Solana Runtime підтримує дві версії транзакцій:

- `legacy` - старий формат транзакцій без додаткових переваг
- `0` - додає підтримку
  [Таблиць пошуку адрес](/docs/uk/advanced/lookup-tables.md)

## Максимально підтримувана версія транзакцій

Усі RPC-запити, які повертають транзакцію, **_повинні_** вказувати найвищу
версію транзакцій, яку вони підтримують у своїй програмі, використовуючи
параметр `maxSupportedTransactionVersion`, включаючи
[`getBlock`](/docs/uk/rpc/http/getBlock.mdx) та
[`getTransaction`](/docs/uk/rpc/http/getTransaction.mdx).

RPC-запит завершиться невдачею, якщо буде повернута версійна транзакція, яка має
версію вище встановленої `maxSupportedTransactionVersion`. (наприклад, якщо
повертається транзакція версії `0`, а встановлено `legacy`)

> УВАГА: Якщо значення `maxSupportedTransactionVersion` не встановлено, тоді
> лише транзакції `legacy` будуть дозволені у відповіді RPC. Таким чином, ваші
> RPC-запити **ПРИЗВЕДУТЬ ДО ПОМИЛКИ**, якщо буде повернута будь-яка транзакція
> версії `0`.

## Як встановити максимально підтримувану версію

Ви можете встановити `maxSupportedTransactionVersion`, використовуючи бібліотеку
[`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/v1.x/) або
шляхом прямого надсилання JSON-запитів до RPC-ендпоінту.

### Використання web3.js

Використовуючи бібліотеку
[`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/v1.x/), ви
можете отримати останній блок або конкретну транзакцію:

```js
// підключення до кластера `devnet` та отримання поточного `slot`
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const slot = await connection.getSlot();

// отримання останнього блоку (дозволяючи транзакції версії v0)
const block = await connection.getBlock(slot, {
  maxSupportedTransactionVersion: 0,
});

// отримання конкретної транзакції (дозволяючи транзакції версії v0)
const getTx = await connection.getTransaction(
  "3jpoANiFeVGisWRY5UP648xRXs3iQasCHABPWRWnoEjeA93nc79WrnGgpgazjq4K9m8g2NJoyKoWBV1Kx5VmtwHQ",
  {
    maxSupportedTransactionVersion: 0,
  },
);
```

### JSON-запити до RPC

Використовуючи стандартний JSON-запит POST, ви можете встановити
`maxSupportedTransactionVersion` при отриманні конкретного блоку:

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d \
'{"jsonrpc": "2.0", "id":1, "method": "getBlock", "params": [430, {
  "encoding":"json",
  "maxSupportedTransactionVersion":0,
  "transactionDetails":"full",
  "rewards":false
}]}'
```

## Як створити версійну транзакцію

Версійні транзакції можна створити подібно до старого методу створення
транзакцій. Є відмінності у використанні певних бібліотек, які слід враховувати.

Нижче наведено приклад створення версійної транзакції з використанням бібліотеки
`@solana/web3.js` для передачі SOL між двома рахунками.

#### Примітки:

- `payer` - це дійсний гаманець `Keypair`, наповнений SOL
- `toAccount` - дійсний `Keypair`

Спочатку імпортуйте бібліотеку web3.js та створіть `connection` до бажаного
кластера.

Далі визначте останній `blockhash` і `minRent`, які будуть потрібні для вашої
транзакції та рахунку:

```js
const web3 = require("@solana/web3.js");

// підключення до кластера та отримання мінімальної орендної плати для статусу rent exempt
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
let minRent = await connection.getMinimumBalanceForRentExemption(0);
let blockhash = await connection
  .getLatestBlockhash()
  .then(res => res.blockhash);
```

Створіть `array` усіх `instructions`, які ви хочете відправити у вашій
транзакції. У прикладі нижче ми створюємо просту інструкцію передачі SOL:

```js
// створення масиву з вашими інструкціями
const instructions = [
  web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: minRent,
  }),
];
```

Далі створіть повідомлення у форматі `MessageV0` для вашої транзакції:

```js
// створення повідомлення, сумісного з v0
const messageV0 = new web3.TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions,
}).compileToV0Message();
```

Потім створіть нову `VersionedTransaction`, передаючи ваше повідомлення v0:

```js
const transaction = new web3.VersionedTransaction(messageV0);

// підпишіть вашу транзакцію потрібними підписами
transaction.sign([payer]);
```

Після того, як ваша `VersionedTransaction` підписана всіма необхідними
рахунками, ви можете відправити її до кластера та отримати відповідь:

```js
// відправка нашої транзакції v0 до кластера
const txId = await connection.sendTransaction(transaction);
console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`);
```

> УВАГА: На відміну від `legacy` транзакцій, відправка `VersionedTransaction`
> через `sendTransaction` **НЕ** підтримує підпис транзакцій через передачу
> масиву `Signers` як другого параметра. Ви повинні підписати транзакцію перед
> викликом `connection.sendTransaction()`.

## Додаткові ресурси

- Використання
  [версійних транзакцій для таблиць пошуку адрес](/docs/uk/advanced/lookup-tables.md#how-to-create-an-address-lookup-table)
- Перегляд
  [прикладу транзакції v0](https://explorer.solana.com/tx/h9WQsqSUYhFvrbJWKFPaXximJpLf6Z568NW1j6PBn3f7GPzQXe9PYMYbmWSUFHwgnUmycDNbEX9cr6WjUWkUFKx/?cluster=devnet)
  на Solana Explorer
- Читання
  [ухваленої пропозиції](https://docs.anza.xyz/proposals/versioned-transactions)
  для версійних транзакцій та таблиць пошуку адрес
