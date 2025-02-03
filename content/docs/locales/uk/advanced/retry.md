---
sidebarSortOrder: 2
title: Повторна відправка транзакцій
altRoutes:
  - /docs/core/transactions/retry
description:
  Дізнайтеся, як обробляти втрачені транзакції та впроваджувати користувацьку
  логіку повторної відправки у Solana. Цей посібник охоплює повторне передавання
  транзакцій, перевірки перед виконанням (preflight) і найкращі практики для
  забезпечення надійної обробки транзакцій у блокчейні Solana.
---

# Повторна відправка транзакцій

Іноді здається, що дійсна транзакція може бути втрачена до її включення в блок.
Це зазвичай трапляється під час завантаженості мережі, коли RPC-вузол не може
повторно передати транзакцію до [лідера](/docs/uk/terminology.md#leader). Для
кінцевого користувача це може виглядати так, ніби транзакція повністю зникає.
Хоча RPC-вузли мають універсальний алгоритм повторного передавання, розробники
додатків також можуть створювати власну логіку повторної передачі.

## Коротко:

- RPC-вузли намагатимуться повторно передати транзакції за допомогою
  універсального алгоритму.
- Розробники додатків можуть впроваджувати власну логіку повторного передавання.
- Розробникам слід використовувати параметр `maxRetries` у методі JSON-RPC
  `sendTransaction`.
- Розробникам слід вмикати перевірки перед виконанням (preflight), щоб виявляти
  помилки до відправки транзакцій.
- Перед повторним підписанням будь-якої транзакції важливо переконатися, що
  термін дії blockhash вихідної транзакції минув.

## Шлях транзакції

### Як клієнти відправляють транзакції

У Solana немає концепції мемпулу. Усі транзакції, незалежно від того, чи
ініційовані вони програмно або користувачем, ефективно маршрутизуються до
лідерів для обробки в блоках. Є два основні способи надсилання транзакцій до
лідерів:

1. Через RPC-сервер за допомогою методу JSON-RPC
   [sendTransaction](/docs/uk/rpc/http/sendTransaction.mdx).
2. Безпосередньо до лідерів через
   [TPU Client](https://docs.rs/solana-client/latest/solana_client/tpu_client/index.html).

Більшість користувачів відправляють транзакції через RPC-сервер. Коли клієнт
надсилає транзакцію, RPC-вузол намагається передати її поточному та наступному
лідерам. Поки транзакція не буде оброблена лідером, вона існує лише у вигляді
запису в клієнта або проміжних RPC-вузлів. У випадку використання TPU клієнтом,
передавання та маршрутизація обробляються програмним забезпеченням клієнта.

![Огляд шляху транзакції, від клієнта до лідера](/assets/docs/rt-tx-journey.png)

### Як RPC-вузли передають транзакції

Після отримання транзакції через `sendTransaction`, RPC-вузол перетворює
транзакцію в [UDP](https://uk.wikipedia.org/wiki/UDP) пакет і передає його
відповідним лідерам. UDP дозволяє вузлам швидко обмінюватися даними, але не
гарантує доставки пакетів.

Оскільки розклад лідерів Solana відомий заздалегідь для кожного
[епоха](/docs/uk/terminology.md#epoch) (~2 дні), RPC-вузол передає транзакції
безпосередньо до поточного та наступного лідерів. За замовчуванням RPC-вузли
намагаються повторно передавати транзакції кожні дві секунди, доки транзакція не
буде завершена або доки термін дії її blockhash не закінчиться (~1 хвилина 19
секунд). Якщо черга для повторної передачі перевищує
[10,000 транзакцій](https://github.com/solana-labs/solana/blob/bfbbc53dac93b3a5c6be9b4b65f679fdb13e41d9/send-transaction-service/src/send_transaction_service.rs#L20),
нові транзакції скидаються.

![Процес обробки транзакцій TPU](/assets/docs/rt-tpu-jito-labs.png)

## Як транзакції скидаються

Транзакції можуть бути скинуті через кілька причин, таких як перевантаження
мережі, втрати пакетів UDP або конфлікти через різні статуси вузлів у пулі RPC.

## Обробка скинутих транзакцій

Розробники можуть використовувати параметр `maxRetries` методу `sendTransaction`
для створення власної логіки повторного передавання, зокрема перевірки
`lastValidBlockHeight` і опитування стану мережі.

## Налаштування власної логіки

Впровадження алгоритмів, таких як
[експоненціальне збільшення інтервалів](https://uk.wikipedia.org/wiki/Експоненційне_зростання),
або постійне повторне передавання, як у
[Mango](https://github.com/blockworks-foundation/mango-ui/blob/b6abfc6c13b71fc17ebbe766f50b8215fa1ec54f/src/utils/send.tsx#L713),
може допомогти впоратися із завантаженістю мережі.

```ts
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import * as nacl from "tweetnacl";

const sleep = async (ms: number) => {
  return new Promise(r => setTimeout(r, ms));
};

(async () => {
  const payer = Keypair.generate();
  const toAccount = Keypair.generate().publicKey;

  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction({ signature: airdropSignature });

  const blockhashResponse = await connection.getLatestBlockhash();
  const lastValidBlockHeight = blockhashResponse.lastValidBlockHeight - 150;

  const transaction = new Transaction({
    feePayer: payer.publicKey,
    blockhash: blockhashResponse.blockhash,
    lastValidBlockHeight: lastValidBlockHeight,
  }).add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount,
      lamports: 1000000,
    }),
  );
  const message = transaction.serializeMessage();
  const signature = nacl.sign.detached(message, payer.secretKey);
  transaction.addSignature(payer.publicKey, Buffer.from(signature));
  const rawTransaction = transaction.serialize();
  let blockheight = await connection.getBlockHeight();

  while (blockheight < lastValidBlockHeight) {
    connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
    });
    await sleep(500);
    blockheight = await connection.getBlockHeight();
  }
})();
```

При опитуванні через `getLatestBlockhash` додатки повинні вказувати бажаний
рівень
[зобов'язань (commitment)](/docs/uk/rpc/index.mdx#configuring-state-commitment).
Встановлюючи зобов'язання на рівень `confirmed` (підтверджений) або `finalized`
(~30 блоків після `confirmed`), додаток може уникнути опитування blockhash із
меншості вузлів.

Якщо додаток має доступ до RPC-вузлів за балансувальником навантаження, він
також може розподіляти своє навантаження між конкретними вузлами. RPC-вузли, які
обслуговують ресурсоємні запити, такі як
[getProgramAccounts](/content/guides/javascript/get-program-accounts.md), можуть
відставати і бути менш ефективними для пересилання транзакцій. Для додатків, що
обробляють транзакції в реальному часі, може бути розумним використовувати
спеціалізовані вузли, які обслуговують лише `sendTransaction`.

### Вартість пропуску перевірки перед виконанням

За замовчуванням `sendTransaction` виконує три перевірки перед відправкою
транзакції. Зокрема, `sendTransaction`:

- Перевіряє, що всі підписи є дійсними.
- Перевіряє, що вказаний blockhash знаходиться в межах останніх 150 блоків.
- Симулює транзакцію на основі слоту банку, зазначеного у `preflightCommitment`.

У разі, якщо одна з цих перевірок не пройде, `sendTransaction` видасть помилку
до відправки транзакції. Перевірки перед виконанням можуть стати вирішальним
фактором між втратою транзакції та можливістю клієнта обробити помилку. Щоб
гарантувати врахування цих поширених помилок, рекомендується залишати
`skipPreflight` встановленим у значення `false`.

### Коли потрібно повторно підписувати транзакції

Попри всі спроби повторного передавання, іноді клієнт може бути змушений
повторно підписати транзакцію. Перед повторним підписанням будь-якої транзакції
**дуже важливо** переконатися, що термін дії blockhash вихідної транзакції
закінчився. Якщо початковий blockhash все ще дійсний, обидві транзакції можуть
бути прийняті мережею. Для кінцевого користувача це виглядатиме як ненавмисне
повторне відправлення однієї і тієї ж транзакції.

У Solana втрачену транзакцію можна безпечно відхилити, якщо blockhash, на який
вона посилається, старший за `lastValidBlockHeight`, отриманий із
`getLatestBlockhash`. Розробникам слід відстежувати цей `lastValidBlockHeight`,
опитуючи [`getEpochInfo`](/docs/uk/rpc/http/getEpochInfo.mdx) і порівнюючи з
`blockHeight` у відповіді. Після того, як blockhash стане недійсним, клієнти
можуть повторно підписати транзакцію з новозапитаним blockhash.
