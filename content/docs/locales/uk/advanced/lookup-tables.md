---
sidebarSortOrder: 4
title: Таблиці пошуку адрес
description:
  Дізнайтеся, як використовувати таблиці пошуку адрес Solana (ALTs) для
  ефективної обробки до 64 адрес у кожній транзакції. Створюйте, розширюйте та
  використовуйте таблиці пошуку за допомогою web3.js.
---

Таблиці пошуку адрес, зазвичай відомі як "_lookup tables_" або скорочено
"_ALTs_", дозволяють розробникам створювати колекції пов’язаних адрес для
ефективного завантаження більшої кількості адрес в одній транзакції.

Оскільки кожна транзакція в блокчейні Solana вимагає переліку всіх адрес, з
якими вона взаємодіє, цей перелік фактично обмежується 32 адресами на
транзакцію. Завдяки [Таблицям пошуку адрес](/docs/uk/advanced/lookup-tables.md)
це обмеження можна збільшити до 64 адрес у кожній транзакції.

## Стиснення адрес на блокчейні

Після того, як усі необхідні адреси були збережені на блокчейні у Таблиці пошуку
адрес, кожну адресу можна посилатися в транзакції за її 1-байтовим індексом у
таблиці (замість повної 32-байтової адреси). Цей метод пошуку ефективно
"_стискає_" 32-байтову адресу до 1-байтового значення індексу.

Таке "_стиснення_" дозволяє зберігати до 256 адрес у одній таблиці пошуку для
використання у будь-якій транзакції.

## Версійні транзакції

Щоб використовувати Таблицю пошуку адрес у транзакції, розробники повинні
застосовувати транзакції версії v0, які були запроваджені з новим форматом
[Версійних транзакцій](/docs/uk/advanced/versions.md).

## Як створити таблицю пошуку адрес

Створення нової таблиці пошуку за допомогою бібліотеки `@solana/web3.js` подібне
до старішого формату `legacy` транзакцій, але має певні відмінності.

Використовуючи бібліотеку `@solana/web3.js`, ви можете скористатися функцією
[`createLookupTable`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/AddressLookupTableProgram.html#createLookupTable)
для створення інструкції, необхідної для створення нової таблиці пошуку, а також
для визначення її адреси.

```js
const web3 = require("@solana/web3.js");

// connect to a cluster and get the current `slot`
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const slot = await connection.getSlot();

// Assumption:
// `payer` is a valid `Keypair` with enough SOL to pay for the execution

const [lookupTableInst, lookupTableAddress] =
  web3.AddressLookupTableProgram.createLookupTable({
    authority: payer.publicKey,
    payer: payer.publicKey,
    recentSlot: slot,
  });

console.log("lookup table address:", lookupTableAddress.toBase58());

// To create the Address Lookup Table onchain:
// send the `lookupTableInst` instruction in a transaction
```

> ПРИМІТКА: Таблиці пошуку адрес можуть бути **створені** за допомогою як
> транзакцій `v0`, так і `legacy`. Але виконуюче середовище Solana може
> отримувати та обробляти додаткові адреси в таблиці пошуку лише під час
> використання
> [Версійних транзакцій v0](/docs/uk/advanced/versions.md#current-transaction-versions).

## Додавання адрес до таблиці пошуку

Додавання адрес до таблиці пошуку відоме як "_розширення_" ("_extending_").
Використовуючи бібліотеку `@solana/web3.js`, ви можете створити нову інструкцію
для _розширення_ за допомогою методу
[`extendLookupTable`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/AddressLookupTableProgram.html#extendLookupTable):

```js
// add addresses to the `lookupTableAddress` table via an `extend` instruction
const extendInstruction = web3.AddressLookupTableProgram.extendLookupTable({
  payer: payer.publicKey,
  authority: payer.publicKey,
  lookupTable: lookupTableAddress,
  addresses: [
    payer.publicKey,
    web3.SystemProgram.programId,
    // list more `publicKey` addresses here
  ],
});

// Send this `extendInstruction` in a transaction to the cluster
// to insert the listing of `addresses` into your lookup table with address `lookupTableAddress`
```

> ПРИМІТКА: Через ті самі обмеження пам'яті транзакцій `legacy`, будь-яка
> транзакція, яка використовується для _розширення_ таблиці пошуку адрес, також
> обмежена в кількості адрес, які можна додати одночасно. Через це вам потрібно
> буде використовувати кілька транзакцій, щоб _розширити_ будь-яку таблицю
> більшою кількістю адрес (приблизно 20), ніж це дозволяють обмеження пам'яті
> однієї транзакції.

Після того як ці адреси були вставлені в таблицю та збережені в блокчейні, ви
зможете використовувати таблицю пошуку адрес у майбутніх транзакціях. Це
дозволяє включити до 64 адрес у цих транзакціях.

## Отримання таблиці пошуку адрес

Аналогічно запиту іншого облікового запису (або PDA) з кластера, ви можете
отримати повну таблицю пошуку адрес за допомогою методу
[`getAddressLookupTable`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html#getAddressLookupTable):

```js
// define the `PublicKey` of the lookup table to fetch
const lookupTableAddress = new web3.PublicKey("");

// get the table from the cluster
const lookupTableAccount = (
  await connection.getAddressLookupTable(lookupTableAddress)
).value;

// `lookupTableAccount` will now be a `AddressLookupTableAccount` object

console.log("Table address from cluster:", lookupTableAccount.key.toBase58());
```

Змінна `lookupTableAccount` тепер буде об'єктом типу
`AddressLookupTableAccount`, який можна проаналізувати для читання списку всіх
адрес, збережених у таблиці пошуку в блокчейні:

```js
// loop through and parse all the addresses stored in the table
for (let i = 0; i < lookupTableAccount.state.addresses.length; i++) {
  const address = lookupTableAccount.state.addresses[i];
  console.log(i, address.toBase58());
}
```

## Як використовувати таблицю пошуку адрес у транзакції

Після того як ви створили таблицю пошуку і зберегли необхідні адреси в блокчейні
(через розширення таблиці пошуку), ви можете створити транзакцію `v0`, щоб
скористатися можливостями пошуку адрес в блокчейні.

Так само, як і для старих транзакцій `legacy`, ви можете створити всі
[інструкції](/docs/uk/terminology.md#instruction), які ваша транзакція
виконуватиме в блокчейні. Потім ви можете передати масив цих інструкцій у
[Message](/docs/uk/terminology.md#message), що використовується в транзакції
`v0`.

> **Примітка:** Інструкції, що використовуються в транзакції `v0`, можна
> створювати за допомогою тих самих методів і функцій, які використовувалися
> раніше для створення інструкцій. Немає необхідності змінювати інструкції,
> пов'язані з використанням таблиці пошуку адрес.

```js
// Assumptions:
// - `arrayOfInstructions` has been created as an `array` of `TransactionInstruction`
// - we are using the `lookupTableAccount` obtained above

// construct a v0 compatible transaction `Message`
const messageV0 = new web3.TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions: arrayOfInstructions, // note this is an array of instructions
}).compileToV0Message([lookupTableAccount]);

// create a v0 transaction from the v0 message
const transactionV0 = new web3.VersionedTransaction(messageV0);

// sign the v0 transaction using the file system wallet we created named `payer`
transactionV0.sign([payer]);

// send and confirm the transaction
// (NOTE: There is NOT an array of Signers here; see the note below...)
const txid = await web3.sendAndConfirmTransaction(connection, transactionV0);

console.log(
  `Transaction: https://explorer.solana.com/tx/${txid}?cluster=devnet`,
);
```

> **Примітка:** Під час відправлення `VersionedTransaction` до кластеру, вона
> має бути підписана **ДО** виклику методу `sendAndConfirmTransaction`. Якщо
> передати масив `Signer` (як у транзакціях `legacy`), метод викличе помилку!

## Додаткові ресурси

- Ознайомтеся з
  [пропозицією](https://docs.anza.xyz/proposals/versioned-transactions) щодо
  таблиць пошуку адрес і версійованих транзакцій
- [Приклад програми на Rust, яка використовує таблиці пошуку адрес](https://github.com/TeamRaccoons/address-lookup-table-multi-swap)
