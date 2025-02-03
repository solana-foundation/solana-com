---
title: "Тестування з NodeJS"
description:
  "Тестування нативних solana programs написаних Rust використовуючи NodeJS"
sidebarSortOrder: 5
---

## Тестування з NodeJS

Коли ви розробляєте програми на Solana, важливо забезпечити їхню правильність і
надійність. До цього часу розробники використовували `solana-test-validator` для
тестування. Цей документ описує тестування вашої програми Solana за допомогою
Node.js і бібліотеки `solana-bankrun`.

## Огляд

Є два способи тестування програм на Solana:

1. [solana-test-validator](https://docs.anza.xyz/cli/examples/test-validator):
   Локальний емулятор блокчейна Solana, який обробляє транзакції, що
   надсилаються на валідацію.
2. Різні фреймворки для тестування програм SBF (Solana Bytecode Format) на базі
   BanksClient:
   - `Bankrun` — це фреймворк, що імітує роботу Solana bank, дозволяючи
     розробникам розгортати програми, взаємодіяти з ними та оцінювати їх
     поведінку у тестових умовах, що нагадують mainnet.
   - Підтримуються фреймворки як
     [solana-program-test](https://docs.rs/solana-program-test) (Rust),
     [solana-bankrun](https://github.com/kevinheavey/solana-bankrun) (Rust,
     JavaScript), [anchor-bankrun](https://www.npmjs.com/package/anchor-bankrun)
     (Anchor, JavaScript),
     [solders.bankrun](https://kevinheavey.github.io/solders/api_reference/bankrun.html)
     (Python).

> [`pnpm create solana-program`](https://github.com/solana-program/create-solana-program)  
> може
> допомогти створити клієнти для JS і Rust, включаючи тести. Anchor ще не
> підтримується.

У цьому керівництві ми використовуємо `Solana Bankrun`.  
`Bankrun` — це дуже швидкий, потужний та легкий фреймворк для тестування програм
Solana у Node.js.

- Основна перевага використання `Solana Bankrun` полягає в тому, що вам не
  потрібно налаштовувати середовище для тестування програм, як це потрібно при
  використанні `solana-test-validator`. Це можна зробити за допомогою коду
  всередині тестів.
- `Bankrun` динамічно встановлює час та дані акаунтів, що неможливо при
  використанні `solana-test-validator`.

## Інсталяція

Додайте `solana-bankrun` як dev-залежність до вашого Node.js проекту. Якщо ваша
Solana програма ще не є Node.js проектом, ви можете ініціалізувати її за
допомогою команди `npm init`:

```bash
npm i -D solana-bankrun
```

## Використання

### Директорія для Програми

Перш за все, `.so` файл вашої програми повинен бути присутнім в одній із
наступних директорій:

- `./tests/fixtures` (створіть цю директорію, якщо її ще не існує).
- Ваша поточна робоча директорія.
- Директорія, яку ви визначите в змінних середовища `BPF_OUT_DIR` або
  `SBF_OUT_DIR`.  
  Наприклад:

```json
{
  "scripts": {
    "test": "pnpm ts-mocha -p ./tsconfig.json -t 1000000 ./tests/test.ts"
  }
}
```

### Початок Роботи

Функція `start` з бібліотеки `solana-bankrun` запускає `BanksServer` і
`BanksClient`, розгортає програми та додає акаунти відповідно до ваших
інструкцій.

Приклад використання:

```typescript
import { start } from "solana-bankrun";
import { PublicKey } from "@solana/web3.js";

test("testing program instruction", async () => {
  const programId = PublicKey.unique();
  const context = await start([{ name: "program_name", programId }], []);

  const client = context.banksClient;
  const payer = context.payer;
  // write tests
});
```

### `context` у Bankrun

- Ми отримуємо доступ до `context` з функції `start`. `context` містить
  `BanksClient`, останній blockhash та профінансовану keypair для підпису
  транзакцій.
- У `context` є `payer`, який є профінансованою парою ключів і може
  використовуватися для підпису транзакцій.
- `context` також містить `context.lastBlockhash` або
  `context.getLatestBlockhash`, що спрощує отримання
  [Blockhash](https://solana.com/docs/terminology#blockhash) під час тестів.
- `context.banksClient` використовується для надсилання транзакцій і отримання
  даних акаунтів зі стану реєстру. Наприклад, іноді потрібна
  [оренда (Rent)](https://solana.com/docs/terminology#rent) (в лампортах) для
  створення транзакції, наприклад, при використанні інструкції `createAccount()`
  з `SystemProgram`. Це можна зробити за допомогою `BanksClient`:

  ```typescript
  const rent = await client.getRent();

  const Ix: TransactionInstruction = SystemProgram.createAccount({
    // ...
    lamports: Number(rent.minimumBalance(BigInt(ACCOUNT_SIZE))),
    //....
  });
  ```

- Ви можете зчитувати дані акаунта з `BanksClient`, використовуючи функцію
  `getAccount`.

  ```typescript
  AccountInfo = await client.getAccount(counter);
  ```

### Обробка Транзакції

Функція `processTransaction()` виконує транзакцію з використанням завантажених
програм і акаунтів, отриманих із функції `start`. Вона повертає результат
виконаної транзакції.

```typescript
let transaction = await client.processTransaction(tx);
```

## Приклад

Ось приклад тесту для програми  
[hello world](https://github.com/solana-developers/program-examples/tree/main/basics/hello-solana/native):

```typescript
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { start } from "solana-bankrun";
import { describe, test } from "node:test";
import { assert } from "chai";

describe("hello-solana", async () => {
  // load program in solana-bankrun
  const PROGRAM_ID = PublicKey.unique();
  const context = await start(
    [{ name: "hello_solana_program", programId: PROGRAM_ID }],
    [],
  );
  const client = context.banksClient;
  const payer = context.payer;

  test("Say hello!", async () => {
    const blockhash = context.lastBlockhash;
    // We set up our instruction first.
    let ix = new TransactionInstruction({
      // using payer keypair from context to sign the txn
      keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
      programId: PROGRAM_ID,
      data: Buffer.alloc(0), // No data
    });

    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    // using payer keypair from context to sign the txn
    tx.add(ix).sign(payer);

    // Now we process the transaction
    let transaction = await client.processTransaction(tx);

    assert(transaction.logMessages[0].startsWith("Program " + PROGRAM_ID));
    assert(transaction.logMessages[1] === "Program log: Hello, Solana!");
    assert(
      transaction.logMessages[2] ===
        "Program log: Our program's Program ID: " + PROGRAM_ID,
    );
    assert(
      transaction.logMessages[3].startsWith(
        "Program " + PROGRAM_ID + " consumed",
      ),
    );
    assert(transaction.logMessages[4] === "Program " + PROGRAM_ID + " success");
    assert(transaction.logMessages.length == 5);
  });
});
```

Ось як виглядає результат після запуску тестів для  
[hello world програми](https://github.com/solana-developers/program-examples/tree/main/basics/hello-solana/native):

```text
[2024-06-04T12:57:36.188822000Z INFO  solana_program_test] "hello_solana_program" SBF program from tests/fixtures/hello_solana_program.so, modified 3 seconds, 20 ms, 687 µs and 246 ns ago
[2024-06-04T12:57:36.246838000Z DEBUG solana_runtime::message_processor::stable_log] Program 11111111111111111111111111111112 invoke [1]
[2024-06-04T12:57:36.246892000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Hello, Solana!
[2024-06-04T12:57:36.246917000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Our program's Program ID: 11111111111111111111111111111112
[2024-06-04T12:57:36.246932000Z DEBUG solana_runtime::message_processor::stable_log] Program 11111111111111111111111111111112 consumed 2905 of 200000 compute units
[2024-06-04T12:57:36.246937000Z DEBUG solana_runtime::message_processor::stable_log] Program 11111111111111111111111111111112 success
▶ hello-solana
  ✔ Say hello! (5.667917ms)
▶ hello-solana (7.047667ms)

ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 63.52616
```
