---
title: Додати Solana на Вашу Біржу
---

Цей посібник описує, як додати нативний токен Solana (SOL) до вашої
криптовалютної біржі.

## Налаштування Ноди

Ми наполегливо рекомендуємо налаштувати щонайменше дві ноди на
високопродуктивних комп’ютерах або хмарних інстанціях, своєчасно оновлювати їх
до нових версій і відстежувати роботу сервісу за допомогою вбудованих
інструментів моніторингу.

Це налаштування дозволяє вам:

- мати самостійно керований шлюз до кластеру Solana mainnet-beta для отримання
  даних і надсилання транзакцій на виведення
- мати повний контроль над тим, скільки історичних даних блоків зберігається
- забезпечувати доступність вашого сервісу навіть у разі відмови однієї з нод

Ноди Solana вимагають відносно високої обчислювальної потужності для обробки
швидких блоків і високої пропускної здатності (TPS). Для конкретних вимог
дивіться
[рекомендації щодо апаратного забезпечення](https://docs.anza.xyz/operations/requirements).

Щоб запустити ноду API:

1. [Встановіть набір інструментів командного рядка Solana](/docs/uk/intro/installation.md)
2. Запустіть валідатор щонайменше з наступними параметрами:

```shell
solana-validator \
  --ledger <LEDGER_PATH> \
  --identity <VALIDATOR_IDENTITY_KEYPAIR> \
  --entrypoint <CLUSTER_ENTRYPOINT> \
  --expected-genesis-hash <EXPECTED_GENESIS_HASH> \
  --rpc-port 8899 \
  --no-voting \
  --enable-rpc-transaction-history \
  --limit-ledger-size \
  --known-validator <VALIDATOR_ADDRESS> \
  --only-known-rpc
```

Налаштуйте параметр `--ledger` для бажаного розташування зберігання леджера та
параметр `--rpc-port` для порту, який ви хочете зробити доступним.

Параметри `--entrypoint` та `--expected-genesis-hash` є специфічними для
кластера, до якого ви приєднуєтеся.
[Поточні параметри для Mainnet Beta](https://docs.anza.xyz/clusters/available#example-solana-validator-command-line-2)

Параметр `--limit-ledger-size` дозволяє вказати, скільки
[шредів](/docs/uk/terminology.md#shred) леджера ваша нода зберігатиме на диску.
Якщо цей параметр не вказано, валідатор зберігатиме весь леджер, доки не
закінчиться місце на диску. Значення за замовчуванням намагається обмежити
використання місця на диску леджером до 500 ГБ. За потреби можна змінити це
значення, додавши аргумент до параметра `--limit-ledger-size`. Для перегляду
значення за замовчуванням, яке використовується параметром
`--limit-ledger-size`, виконайте команду `solana-validator --help`. Більше
інформації про вибір власного значення обмеження можна знайти
[тут](https://github.com/solana-labs/solana/blob/583cec922b6107e0f85c7e14cb5e642bc7dfb340/core/src/ledger_cleanup_service.rs#L15-L26).

Вказівка одного або кількох параметрів `--known-validator` може захистити вас
від запуску з підробленого знімку.
[Більше про цінність запуску з відомими валідаторами](https://docs.anza.xyz/operations/guides/validator-start#known-validators)

Додаткові параметри, які варто розглянути:

- `--private-rpc` забороняє публікацію вашого RPC-порту для використання іншими
  нодами
- `--rpc-bind-address` дозволяє вказати іншу IP-адресу для прив’язки RPC-порту

### Автоматичний Перезапуск та Моніторинг

Ми рекомендуємо налаштувати кожну з ваших нод на автоматичний перезапуск після
завершення роботи, щоб мінімізувати втрату даних. Запуск програмного
забезпечення Solana як служби systemd є одним із чудових варіантів.

Для моніторингу ми надаємо інструмент
[`solana-watchtower`](https://github.com/solana-labs/solana/blob/master/watchtower/README.md),
який може моніторити ваш валідатор і визначати, чи є процес `solana-validator`
несправним. Він може бути налаштований для сповіщень через Slack, Telegram,
Discord або Twilio. Для деталей виконайте команду `solana-watchtower --help`.

```shell
solana-watchtower --validator-identity <YOUR VALIDATOR IDENTITY>
```

> Додаткову інформацію про
> [найкращі практики для Solana Watchtower](https://docs.anza.xyz/operations/best-practices/monitoring#solana-watchtower)
> можна знайти у документації.

#### Оголошення про Нові Релізи ПЗ

Ми випускаємо нове програмне забезпечення часто (приблизно один реліз на
тиждень). Іноді нові версії містять несумісні протокольні зміни, які вимагають
своєчасного оновлення ПЗ, щоб уникнути помилок при обробці блоків.

Наші офіційні оголошення про всі види релізів (звичайні та пов’язані з безпекою)
публікуються в [каналі Discord](https://solana.com/discord) під назвою
`#mb-announcement` (`mb` означає `mainnet-beta`).

Як і для валідаторів зі ставками, ми очікуємо, що валідатори, які обслуговуються
біржами, будуть оновлюватися протягом одного-двох робочих днів після оголошення
про звичайний реліз. Для релізів, пов’язаних із безпекою, може знадобитися більш
термінове реагування.

### Цілісність Леджера

За замовчуванням кожна з ваших нод завантажується зі знімку, наданого одним із
ваших відомих валідаторів. Цей знімок відображає поточний стан ланцюга, але не
містить повного історичного леджера. Якщо одна з ваших нод зупиняється та
завантажується з нового знімка, у леджері цієї ноди може з’явитися прогалина.
Щоб уникнути цієї проблеми, додайте параметр `--no-snapshot-fetch` до команди
`solana-validator`, щоб отримувати історичні дані леджера замість знімка.

Не додавайте параметр `--no-snapshot-fetch` під час початкового завантаження,
оскільки неможливо завантажити ноду від самого генезис-блоку. Спочатку
завантажтеся зі знімка, а потім додайте параметр `--no-snapshot-fetch` для
наступних перезавантажень.

Варто зазначити, що обсяг доступного історичного леджера від інших нод у мережі
обмежений. Якщо ваші валідатори зазнають значних простоїв, вони можуть не змогти
синхронізуватися з мережею і будуть змушені завантажити новий знімок від
відомого валідатора, що створить прогалину в історичному леджері, яку неможливо
заповнити.

### Мінімізація Доступу до Портів Валідатора

Валідатору необхідно, щоб різні UDP- і TCP-порти були відкриті для вхідного
трафіку від усіх інших валідаторів Solana. Хоча це найефективніший режим роботи
і настійно рекомендується, можливо обмежити валідатор лише для вхідного трафіку
від одного іншого валідатора Solana.

Спочатку додайте аргумент `--restricted-repair-only-mode`. Це призведе до роботи
валідатора в обмеженому режимі, в якому він не отримуватиме push-повідомлення
від інших валідаторів і замість цього постійно опитуватиме інші валідатори для
отримання блоків. Валідатор буде передавати UDP-пакети іншим валідаторам лише
через порти _Gossip_ та _ServeR_ ("serve repair") і отримуватиме UDP-пакети лише
через порти _Gossip_ та _Repair_.

Порт _Gossip_ є двостороннім і дозволяє вашому валідатору підтримувати зв’язок
із рештою кластеру. Ваш валідатор передаватиме запити на ремонт через порт
_ServeR_, щоб отримувати нові блоки від решти мережі, оскільки Turbine тепер
відключено. Ваш валідатор отримуватиме відповіді на запити ремонту через порт
_Repair_ від інших валідаторів.

Щоб додатково обмежити валідатор для запитів блоків лише від одного або кількох
валідаторів, спочатку визначте публічний ключ (pubkey) цього валідатора та
додайте аргументи `--gossip-pull-validator PUBKEY --repair-validator PUBKEY` для
кожного PUBKEY. Це створить навантаження на кожен валідатор, який ви додаєте,
тому робіть це обережно і лише після консультації з цільовим валідатором.

Ваш валідатор тепер повинен спілкуватися лише з чітко вказаними валідаторами і
лише через порти _Gossip_, _Repair_ та _ServeR_.

## Налаштування Депозитних Акаунтів

Акаунти Solana не потребують жодної ініціалізації в мережі; як тільки вони
містять деяку кількість SOL, вони існують. Щоб налаштувати депозитний акаунт для
вашої біржі, просто створіть ключову пару Solana за допомогою будь-якого з наших
[інструментів для гаманців](https://docs.anza.xyz/cli/wallets).

Рекомендуємо використовувати унікальний депозитний акаунт для кожного з ваших
користувачів.

Акаунти Solana мають бути звільнені від оренди, містячи еквівалент 2-річної
[оренди](/docs/uk/core/fees.md#rent) у SOL. Щоб визначити мінімальний баланс для
звільнення від оренди для ваших депозитних акаунтів, виконайте запит до
[ендпоінту `getMinimumBalanceForRentExemption`](/docs/uk/rpc/http/getMinimumBalanceForRentExemption.mdx):

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getMinimumBalanceForRentExemption",
  "params": [0]
}'
```

##### Result

```json
{ "jsonrpc": "2.0", "result": 890880, "id": 1 }
```

### Офлайн Акаунти

Ви можете залишити ключі для одного або декількох акаунтів колекції офлайн для
підвищення безпеки. У цьому випадку вам потрібно буде переміщати SOL до
"гарячих" акаунтів за допомогою наших
[офлайн-методів](https://docs.anza.xyz/cli/examples/offline-signing).

## Відстеження Депозитів

Коли користувач хоче внести SOL на вашу біржу, інструктуйте його виконати
переказ на відповідну депозитну адресу.

### Міграція Транзакцій із Версіями

Коли мережа Mainnet Beta почне обробляти транзакції із версіями, біржі
**ЗОБОВ'ЯЗАНІ** внести зміни. Якщо не внести змін, виявлення депозитів
працюватиме неправильно, оскільки отримання транзакції з версією або блоку, що
містить такі транзакції, призведе до помилки.

- `{"maxSupportedTransactionVersion": 0}`

  Параметр `maxSupportedTransactionVersion` потрібно додати до запитів
  `getBlock` і `getTransaction`, щоб уникнути порушення роботи виявлення
  депозитів. Остання версія транзакції — `0`, і саме її слід зазначати як
  максимальну підтримувану версію транзакції.

Важливо розуміти, що транзакції з версіями дозволяють користувачам створювати
транзакції, які використовують інший набір ключів акаунтів, завантажених з
ончейн таблиць пошуку адрес.

- `{"encoding": "jsonParsed"}`

  При отриманні блоків і транзакцій тепер рекомендується використовувати
  кодування `"jsonParsed"`, оскільки воно включає всі ключі акаунтів транзакції
  (включаючи ті, що з таблиць пошуку) у список `"accountKeys"` повідомлення. Це
  спрощує розв'язання змін балансу, описаних у `preBalances` / `postBalances` і
  `preTokenBalances` / `postTokenBalances`.

  Якщо використовується кодування `"json"`, записи у `preBalances` /
  `postBalances` і `preTokenBalances` / `postTokenBalances` можуть посилатися на
  ключі акаунтів, які **НЕ** входять до списку `"accountKeys"` і потребують
  розв'язання за допомогою записів `"loadedAddresses"` у метаданих транзакції.

### Опитування Блоків

Для відстеження всіх депозитних акаунтів вашої біржі регулярно опитуйте кожен
підтверджений блок і перевіряйте адреси, що вас цікавлять, використовуючи
JSON-RPC сервіс вашої ноди API Solana.

- Щоб визначити, які блоки доступні, надішліть запит
  [`getBlocks`](/docs/uk/rpc/http/getBlocks.mdx), передавши останній блок, який
  ви вже обробили, як параметр start-slot:

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getBlocks",
  "params": [160017005, 160017015]
}'
```

##### Result

```json
{
  "jsonrpc": "2.0",
  "result": [
    160017005, 160017006, 160017007, 160017012, 160017013, 160017014, 160017015
  ],
  "id": 1
}
```

Не кожен слот створює блок, тому в послідовності чисел можуть бути прогалини.

- Для кожного блоку запитуйте його вміст за допомогою запиту
  [`getBlock`](/docs/uk/rpc/http/getBlock.mdx):

### Поради для Отримання Блоків

- `{"rewards": false}`

За замовчуванням отримані блоки містять інформацію про комісії валідаторів за
кожен блок і нагороди за стейкінг на межах епох. Якщо ця інформація вам не
потрібна, вимкніть її за допомогою параметра `"rewards"`.

- `{"transactionDetails": "accounts"}`

За замовчуванням отримані блоки містять багато інформації про транзакції та
метадані, які не потрібні для відстеження балансів акаунтів. Встановіть параметр
`"transactionDetails"` для прискорення отримання блоків.

```shell
curl https://api.devnet.solana.com -X POST -H 'Content-Type: application/json' -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getBlock",
  "params": [
    166974442,
    {
      "encoding": "jsonParsed",
      "maxSupportedTransactionVersion": 0,
      "transactionDetails": "accounts",
      "rewards": false
    }
  ]
}'
```

##### Result

```json
{
  "jsonrpc": "2.0",
  "result": {
    "blockHeight": 157201607,
    "blockTime": 1665070281,
    "blockhash": "HKhao674uvFc4wMK1Cm3UyuuGbKExdgPFjXQ5xtvsG3o",
    "parentSlot": 166974441,
    "previousBlockhash": "98CNLU4rsYa2HDUyp7PubU4DhwYJJhSX9v6pvE7SWsAo",
    "transactions": [
      ... (omit)
      {
        "meta": {
          "err": null,
          "fee": 5000,
          "postBalances": [
            1110663066,
            1,
            1040000000
          ],
          "postTokenBalances": [],
          "preBalances": [
            1120668066,
            1,
            1030000000
          ],
          "preTokenBalances": [],
          "status": {
            "Ok": null
          }
        },
        "transaction": {
          "accountKeys": [
            {
              "pubkey": "9aE476sH92Vz7DMPyq5WLPkrKWivxeuTKEFKd2sZZcde",
              "signer": true,
              "source": "transaction",
              "writable": true
            },
            {
              "pubkey": "11111111111111111111111111111111",
              "signer": false,
              "source": "transaction",
              "writable": false
            },
            {
              "pubkey": "G1wZ113tiUHdSpQEBcid8n1x8BAvcWZoZgxPKxgE5B7o",
              "signer": false,
              "source": "lookupTable",
              "writable": true
            }
          ],
          "signatures": [
            "2CxNRsyRT7y88GBwvAB3hRg8wijMSZh3VNYXAdUesGSyvbRJbRR2q9G1KSEpQENmXHmmMLHiXumw4dp8CvzQMjrM"
          ]
        },
        "version": 0
      },
      ... (omit)
    ]
  },
  "id": 1
}
```

Поля `preBalances` і `postBalances` дозволяють відстежувати зміни балансу
кожного акаунта без необхідності аналізувати всю транзакцію. Вони містять
початкові та кінцеві баланси кожного акаунта у
[лампортах](/docs/uk/terminology.md#lamport), проіндексовані до списку
`accountKeys`. Наприклад, якщо депозитна адреса, яка вас цікавить, — це
`G1wZ113tiUHdSpQEBcid8n1x8BAvcWZoZgxPKxgE5B7o`, то ця транзакція представляє
переказ 1040000000 - 1030000000 = 10,000,000 лампортів = 0.01 SOL.

Якщо вам потрібна додаткова інформація про тип транзакції або інші специфічні
дані, ви можете запросити блок із RPC у бінарному форматі та проаналізувати його
за допомогою нашого [Rust SDK](https://github.com/solana-labs/solana) або
[JavaScript SDK](https://github.com/solana-labs/solana-web3.js).

### Історія Адрес

Ви також можете запитати історію транзакцій для певної адреси. Це, як правило,
_не_ є життєздатним методом для відстеження всіх ваших депозитних адрес за всіма
слотами, але може бути корисним для аналізу кількох акаунтів за певний період
часу.

- Надішліть запит
  [`getSignaturesForAddress`](/docs/uk/rpc/http/getSignaturesForAddress.mdx) до
  API-ноди:

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getSignaturesForAddress",
  "params": [
    "3M2b3tLji7rvscqrLAHMukYxDK2nB96Q9hwfV6QkdzBN",
    {
      "limit": 3
    }
  ]
}'
```

##### Result

```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "blockTime": 1662064640,
      "confirmationStatus": "finalized",
      "err": null,
      "memo": null,
      "signature": "3EDRvnD5TbbMS2mCusop6oyHLD8CgnjncaYQd5RXpgnjYUXRCYwiNPmXb6ZG5KdTK4zAaygEhfdLoP7TDzwKBVQp",
      "slot": 148697216
    },
    {
      "blockTime": 1662064434,
      "confirmationStatus": "finalized",
      "err": null,
      "memo": null,
      "signature": "4rPQ5wthgSP1kLdLqcRgQnkYkPAZqjv5vm59LijrQDSKuL2HLmZHoHjdSLDXXWFwWdaKXUuryRBGwEvSxn3TQckY",
      "slot": 148696843
    },
    {
      "blockTime": 1662064341,
      "confirmationStatus": "finalized",
      "err": null,
      "memo": null,
      "signature": "36Q383JMiqiobuPV9qBqy41xjMsVnQBm9rdZSdpbrLTGhSQDTGZJnocM4TQTVfUGfV2vEX9ZB3sex6wUBUWzjEvs",
      "slot": 148696677
    }
  ],
  "id": 1
}
```

- Для кожного отриманого підпису отримайте деталі транзакції, надіславши запит
  [`getTransaction`](/docs/uk/rpc/http/getTransaction.mdx):

```shell
curl https://api.devnet.solana.com -X POST -H 'Content-Type: application/json' -d '{
  "jsonrpc":"2.0",
  "id":1,
  "method":"getTransaction",
  "params":[
    "2CxNRsyRT7y88GBwvAB3hRg8wijMSZh3VNYXAdUesGSyvbRJbRR2q9G1KSEpQENmXHmmMLHiXumw4dp8CvzQMjrM",
    {
      "encoding":"jsonParsed",
      "maxSupportedTransactionVersion":0
    }
  ]
}'
```

##### Result

```json
{
  "jsonrpc": "2.0",
  "result": {
    "blockTime": 1665070281,
    "meta": {
      "err": null,
      "fee": 5000,
      "innerInstructions": [],
      "logMessages": [
        "Program 11111111111111111111111111111111 invoke [1]",
        "Program 11111111111111111111111111111111 success"
      ],
      "postBalances": [1110663066, 1, 1040000000],
      "postTokenBalances": [],
      "preBalances": [1120668066, 1, 1030000000],
      "preTokenBalances": [],
      "rewards": [],
      "status": {
        "Ok": null
      }
    },
    "slot": 166974442,
    "transaction": {
      "message": {
        "accountKeys": [
          {
            "pubkey": "9aE476sH92Vz7DMPyq5WLPkrKWivxeuTKEFKd2sZZcde",
            "signer": true,
            "source": "transaction",
            "writable": true
          },
          {
            "pubkey": "11111111111111111111111111111111",
            "signer": false,
            "source": "transaction",
            "writable": false
          },
          {
            "pubkey": "G1wZ113tiUHdSpQEBcid8n1x8BAvcWZoZgxPKxgE5B7o",
            "signer": false,
            "source": "lookupTable",
            "writable": true
          }
        ],
        "addressTableLookups": [
          {
            "accountKey": "4syr5pBaboZy4cZyF6sys82uGD7jEvoAP2ZMaoich4fZ",
            "readonlyIndexes": [],
            "writableIndexes": [3]
          }
        ],
        "instructions": [
          {
            "parsed": {
              "info": {
                "destination": "G1wZ113tiUHdSpQEBcid8n1x8BAvcWZoZgxPKxgE5B7o",
                "lamports": 10000000,
                "source": "9aE476sH92Vz7DMPyq5WLPkrKWivxeuTKEFKd2sZZcde"
              },
              "type": "transfer"
            },
            "program": "system",
            "programId": "11111111111111111111111111111111"
          }
        ],
        "recentBlockhash": "BhhivDNgoy4L5tLtHb1s3TP19uUXqKiy4FfUR34d93eT"
      },
      "signatures": [
        "2CxNRsyRT7y88GBwvAB3hRg8wijMSZh3VNYXAdUesGSyvbRJbRR2q9G1KSEpQENmXHmmMLHiXumw4dp8CvzQMjrM"
      ]
    },
    "version": 0
  },
  "id": 1
}
```

## Відправлення Виведення

Щоб виконати запит користувача на виведення SOL, ви повинні створити транзакцію
переказу Solana та надіслати її на API-ноду для передачі в кластер.

### Синхронний Переказ

Відправлення синхронного переказу до кластера Solana дозволяє легко
переконатися, що переказ успішно завершено та підтверджено кластером.

Інструмент командного рядка Solana пропонує просту команду `solana transfer` для
створення, подання та підтвердження транзакцій переказу. За замовчуванням цей
метод чекатиме та відстежуватиме прогрес через stderr, доки транзакція не буде
підтверджена кластером. У разі невдачі транзакції буде повідомлено про будь-які
помилки.

```shell
solana transfer <USER_ADDRESS> <AMOUNT> --allow-unfunded-recipient --keypair <KEYPAIR> --url http://localhost:8899
```

[Solana Javascript SDK](https://github.com/solana-labs/solana-web3.js) пропонує
схожий підхід для екосистеми JS. Використовуйте `SystemProgram` для створення
транзакції переказу та надсилайте її за допомогою методу
`sendAndConfirmTransaction`.

### Асинхронний Переказ

Для більшої гнучкості ви можете надсилати перекази на виведення асинхронно. У
цьому випадку саме ви несете відповідальність за перевірку успішності транзакції
та її підтвердження кластером.

**Примітка:** Кожна транзакція містить
[recent blockhash](/docs/uk/core/transactions.md#recent-blockhash), що вказує на
її актуальність. Важливо **дочекатися**, поки цей blockhash не стане недійсним,
перш ніж повторювати спробу переказу, який, схоже, не було підтверджено або
завершено кластером. Інакше ви ризикуєте створити подвійний витрату. Дивіться
більше про [термін дії blockhash](#blockhash-expiration) нижче.

Спочатку отримайте недавній blockhash за допомогою ендпоінту
[`getFees`](/docs/uk/rpc/deprecated/getFees.mdx) або команди CLI:

```shell
solana fees --url http://localhost:8899
```

У командному рядку передайте аргумент `--no-wait`, щоб відправити переказ
асинхронно, і додайте ваш недавній blockhash за допомогою аргументу
`--blockhash`:

```shell
solana transfer <USER_ADDRESS> <AMOUNT> --no-wait --allow-unfunded-recipient --blockhash <RECENT_BLOCKHASH> --keypair <KEYPAIR> --url http://localhost:8899
```

Ви також можете створити, підписати та серіалізувати транзакцію вручну, а потім
надіслати її до кластера за допомогою ендпоінта JSON-RPC
[`sendTransaction`](/docs/uk/rpc/http/sendTransaction.mdx).

#### Підтвердження Транзакцій та Фінальність

Отримайте статус групи транзакцій за допомогою ендпоінта JSON-RPC
[`getSignatureStatuses`](/docs/uk/rpc/http/getSignatureStatuses.mdx). Поле
`confirmations` вказує, скільки
[підтверджених блоків](/docs/uk/terminology.md#confirmed-block) минуло з моменту
обробки транзакції. Якщо `confirmations: null`, це означає, що транзакція є
[фіналізованою](/docs/uk/terminology.md#finality).

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc":"2.0",
  "id":1,
  "method":"getSignatureStatuses",
  "params":[
    [
      "5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW",
      "5j7s6NiJS3JAkvgkoc18WVAsiSaci2pxB2A6ueCJP4tprA2TFg9wSyTLeYouxPBJEMzJinENTkpA52YStRW5Dia7"
    ]
  ]
}'
```

##### Result

```json
{
  "jsonrpc": "2.0",
  "result": {
    "context": {
      "slot": 82
    },
    "value": [
      {
        "slot": 72,
        "confirmations": 10,
        "err": null,
        "status": {
          "Ok": null
        }
      },
      {
        "slot": 48,
        "confirmations": null,
        "err": null,
        "status": {
          "Ok": null
        }
      }
    ]
  },
  "id": 1
}
```

#### Термін Дії Blockhash

Ви можете перевірити, чи є конкретний blockhash ще дійсним, надіславши запит
[`getFeeCalculatorForBlockhash`](/docs/uk/rpc/deprecated/getFeeCalculatorForBlockhash.mdx)
з blockhash як параметром. Якщо значення у відповіді `null`, blockhash
недійсний, і транзакція на виведення, яка використовує цей blockhash, не має
шансів на успіх.

### Перевірка Адрес Акаунтів, Наданих Користувачами, для Виведення

Оскільки транзакції на виведення є незворотними, хорошою практикою може бути
перевірка адреси акаунта, наданої користувачем, перед авторизацією виведення,
щоб запобігти випадковій втраті коштів користувача.

#### Основна Перевірка

Адреси Solana — це 32-байтовий масив, закодований за допомогою алфавіту base58
від Bitcoin. Це призводить до отримання ASCII-рядка, що відповідає наступному
регулярному виразу:

```text
[1-9A-HJ-NP-Za-km-z]{32,44}
```

Ця перевірка сама по собі є недостатньою, оскільки адреси Solana не мають
контрольної суми, тому помилки друку не можуть бути виявлені. Для додаткової
перевірки введення користувачем можна декодувати рядок і підтвердити, що довжина
отриманого байтового масиву дорівнює 32. Однак існують адреси, які можуть
декодуватися у 32 байти, незважаючи на помилки, наприклад, пропущений символ,
перестановка символів або ігнорування регістру.

#### Розширена Перевірка

Через вразливість до помилок друку, описану вище, рекомендується запитувати
баланс для можливих адрес виведення та запитувати у користувача підтвердження,
якщо буде виявлено ненульовий баланс.

#### Перевірка Валідного ed25519 Публічного Ключа

Адреса звичайного акаунта в Solana — це Base58-кодований рядок 256-бітного
публічного ключа ed25519. Не всі бітові патерни є валідними публічними ключами
для кривої ed25519, тому можна забезпечити, що адреси акаунтів, надані
користувачем, принаймні є правильними публічними ключами ed25519.

#### Java

Ось приклад на Java для перевірки адреси, наданої користувачем, як валідного
публічного ключа ed25519:

Наступний приклад коду передбачає використання Maven.

`pom.xml`:

```xml
<repositories>
  ...
  <repository>
    <id>spring</id>
    <url>https://repo.spring.io/libs-release/</url>
  </repository>
</repositories>

...

<dependencies>
  ...
  <dependency>
      <groupId>io.github.novacrypto</groupId>
      <artifactId>Base58</artifactId>
      <version>0.1.3</version>
  </dependency>
  <dependency>
      <groupId>cafe.cryptography</groupId>
      <artifactId>curve25519-elisabeth</artifactId>
      <version>0.1.0</version>
  </dependency>
<dependencies>
```

```java
import io.github.novacrypto.base58.Base58;
import cafe.cryptography.curve25519.CompressedEdwardsY;

public class PubkeyValidator
{
    public static boolean verifyPubkey(String userProvidedPubkey)
    {
        try {
            return _verifyPubkeyInternal(userProvidedPubkey);
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean _verifyPubkeyInternal(String maybePubkey) throws Exception
    {
        byte[] bytes = Base58.base58Decode(maybePubkey);
        return !(new CompressedEdwardsY(bytes)).decompress().isSmallOrder();
    }
}
```

## Мінімальні Суми Депозиту та Виведення

Кожен депозит та виведення SOL повинні бути більшими або дорівнювати
мінімальному балансу, звільненому від оренди, для акаунта за адресою гаманця
(базовий акаунт SOL, який не містить даних), який наразі складає: **0.000890880
SOL**.

Аналогічно, кожен депозитний акаунт повинен містити принаймні цей баланс.

```shell
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getMinimumBalanceForRentExemption",
  "params": [0]
}'
```

##### Result

```json
{ "jsonrpc": "2.0", "result": 890880, "id": 1 }
```

## Пріоритетні Комісії та Обчислювальні Одиниці

У періоди високого попиту транзакція може стати недійсною до того, як валідатор
включить її до блоку, оскільки були обрані інші транзакції з вищою економічною
цінністю. Валідні транзакції в Solana можуть бути затримані або скасовані, якщо
Пріоритетні Комісії не впроваджені належним чином.

[Пріоритетні Комісії](/docs/uk/terminology.md#prioritization-fee) — це додаткові
комісії, які можна додати до
[базової комісії за транзакцію](/docs/uk/core/fees.md#transaction-fees), щоб
забезпечити включення транзакцій у блоки і їх доставку.

Ці пріоритетні комісії додаються до транзакції шляхом додавання спеціальної
інструкції `Compute Budget`, яка встановлює бажану суму комісії.

<Callout type="caution" title="Важлива Примітка">

Якщо ці інструкції не впровадити, це може призвести до збоїв у роботі мережі та
скасування транзакцій. Наполегливо рекомендується кожній біржі, що підтримує
Solana, використовувати пріоритетні комісії для уникнення збоїв.

</Callout>

### Що таке Пріоритетна Комісія?

Пріоритетні комісії виражаються у мікролампортах за обчислювальну одиницю
(наприклад, невеликі суми SOL) і додаються до транзакцій, щоб зробити їх
економічно привабливими для валідаторів і забезпечити їх включення до блоків у
мережі.

### Якою має бути Пріоритетна Комісія?

Метод встановлення пріоритетної комісії має включати запити до недавніх значень
пріоритетних комісій, щоб встановити розмір комісії, яка буде привабливою для
мережі. Використовуючи метод RPC
[`getRecentPrioritizationFees`](/docs/uk/rpc/http/getrecentprioritizationfees),
можна отримати дані про пріоритетні комісії, необхідні для підтвердження
транзакції в недавньому блоці.

Стратегія ціноутворення пріоритетних комісій залежить від ваших потреб.
Універсального підходу не існує. Однією зі стратегій може бути розрахунок рівня
успішності ваших транзакцій і коригування пріоритетної комісії відповідно до
даних з API про комісії. Ціноутворення на пріоритетні комісії є динамічним і
залежить від активності в мережі та ставок інших учасників.

### Як Впровадити Пріоритетні Комісії

Додавання пріоритетних комісій до транзакції включає додавання двох інструкцій
Compute Budget:

- для встановлення ціни за обчислювальну одиницю
- для встановлення ліміту обчислювальних одиниць

> Детальний
> [посібник для розробників про використання пріоритетних комісій](/content/guides/advanced/how-to-use-priority-fees.md)
> доступний для додаткової інформації.

Створіть інструкцію `setComputeUnitPrice`, щоб додати Пріоритетну Комісію понад
Базову Комісію за Транзакцію (5,000 лампортів).

```typescript
// import { ComputeBudgetProgram } from "@solana/web3.js"
ComputeBudgetProgram.setComputeUnitPrice({ microLamports: number });
```

Значення, надане в мікролампортах, буде множитися на обчислювальний бюджет
(Compute Unit, CU), щоб визначити Пріоритетну Комісію в лампортах. Наприклад,
якщо ваш бюджет CU становить 1M CU, і ви додаєте `1 мікролампорта/CU`,
Пріоритетна Комісія становитиме 1 лампорт (1M \* 0.000001). Загальна комісія
складе 5001 лампорт.

Щоб встановити новий обчислювальний бюджет для транзакції, створіть інструкцію
`setComputeUnitLimit`.

```typescript
// import { ComputeBudgetProgram } from "@solana/web3.js"
ComputeBudgetProgram.setComputeUnitLimit({ units: number });
```

Значення `units`, яке ви надаєте, замінить стандартне значення обчислювального
бюджету (Compute Budget) в середовищі виконання Solana.

<Callout type="caution" title="Встановіть мінімальну кількість CU, необхідну для транзакції">

Транзакції повинні запитувати мінімальну кількість обчислювальних одиниць (CU),
необхідну для виконання, щоб максимізувати пропускну здатність і мінімізувати
загальні комісії.

Ви можете дізнатися, скільки CU споживає транзакція, надіславши її в інший
кластер Solana, наприклад, devnet. Наприклад,
[простий переказ токенів](https://explorer.solana.com/tx/5scDyuiiEbLxjLUww3APE9X7i8LE3H63unzonUwMG7s2htpoAGG17sgRsNAhR1zVs6NQAnZeRVemVbkAct5myi17)
займає 300 CU.

</Callout>

```typescript
// import { ... } from "@solana/web3.js"

const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
  // note: set this to be the lowest actual CU consumed by the transaction
  units: 300,
});

const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 1,
});

const transaction = new Transaction()
  .add(modifyComputeUnits)
  .add(addPriorityFee)
  .add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount,
      lamports: 10000000,
    }),
  );
```

### Пріоритетні Комісії та Транзакції з Durable Nonces

Якщо у вашій системі використовуються транзакції з Durable Nonces, важливо
правильно впровадити Пріоритетні Комісії разом із Durable Transaction Nonces,
щоб забезпечити успішне виконання транзакцій. Якщо цього не зробити, заплановані
Durable Nonce транзакції не будуть розпізнані належним чином.

Якщо ви ВИКОРИСТОВУЄТЕ Durable Transaction Nonces, інструкція
`AdvanceNonceAccount` МАЄ бути зазначена ПЕРШОЮ у списку інструкцій, навіть якщо
використовуються інструкції обчислювального бюджету для встановлення
пріоритетних комісій.

Специфічний приклад коду, що демонструє використання durable nonces і
пріоритетних комісій разом, можна знайти у
[керівництві для розробників](/content/guides/advanced/how-to-use-priority-fees.md#special-considerations).

## Підтримка Стандарту SPL Token

[SPL Token](https://spl.solana.com/token) є стандартом для створення і обміну
обгорнутих/синтетичних токенів у блокчейні Solana.

Робочий процес SPL Token схожий на той, що використовується для нативних SOL
токенів, але є кілька відмінностей, які будуть розглянуті в цьому розділі.

### Токен Mints

Кожен _тип_ SPL Token декларується шляхом створення акаунта _mint_. Цей акаунт
зберігає метадані, які описують характеристики токена, такі як пропозиція,
кількість десяткових знаків і різні повноваження з контролю за mint. Кожен
акаунт SPL Token посилається на відповідний mint і може взаємодіяти лише з SPL
Token цього типу.

### Встановлення CLI Інструменту `spl-token`

Акаунти SPL Token можна запитувати та змінювати за допомогою утиліти командного
рядка `spl-token`. Приклади, наведені в цьому розділі, залежать від того, що
вона встановлена на вашій локальній системі.

`spl-token` розповсюджується з Rust
[crates.io](https://crates.io/crates/spl-token) через утиліту командного рядка
Rust `cargo`. Останню версію `cargo` можна встановити за допомогою простого
скрипта для вашої платформи на [rustup.rs](https://rustup.rs). Після
встановлення `cargo`, утиліту `spl-token` можна отримати за допомогою такої
команди:

```shell
cargo install spl-token-cli
```

Після цього ви можете перевірити встановлену версію, щоб переконатися у
правильності встановлення:

```shell
spl-token --version
```

Результат має виглядати приблизно так:

```text
spl-token-cli 2.0.1
```

### Створення Акаунтів

Акаунти SPL Token мають додаткові вимоги, яких не мають нативні акаунти System
Program:

1. Акаунти SPL Token мають бути створені до того, як у них можна буде внести
   токени. Акаунти токенів можна створити явно за допомогою команди
   `spl-token create-account` або неявно за допомогою команди
   `spl-token transfer --fund-recipient ...`.
2. Акаунти SPL Token повинні залишатися
   [звільненими від оренди](/docs/uk/core/fees.md#rent-exempt) протягом усього
   періоду їх існування, а отже, вимагають внесення невеликої кількості нативних
   SOL токенів під час створення акаунта. Для акаунтів SPL Token ця сума
   становить 0.00203928 SOL (2,039,280 лампортів).

#### Командний Рядок

Щоб створити акаунт SPL Token з такими властивостями:

1. Асоційований із зазначеним mint
2. Належить ключовій парі фінансуючого акаунта

```shell
spl-token create-account <TOKEN_MINT_ADDRESS>
```

#### Приклад

```shell
spl-token create-account AkUFCWTXb3w9nY2n6SFJvBV6VwvFUCe4KBMCcgLsa2ir
```

Результат:

```
Creating account 6VzWGL51jLebvnDifvcuEDec17sK6Wupi4gYhm5RzfkV
Signature: 4JsqZEPra2eDTHtHpB4FMWSfk3UgcCVmkKkP7zESZeMrKmFFkDkNd91pKP3vPVVZZPiu5XxyJwS73Vi5WsZL88D7
```

Або щоб створити акаунт SPL Token з конкретною ключовою парою:

```shell
solana-keygen new -o token-account.json

spl-token create-account AkUFCWTXb3w9nY2n6SFJvBV6VwvFUCe4KBMCcgLsa2ir token-account.json
```

Результат:

```shell
Creating account 6VzWGL51jLebvnDifvcuEDec17sK6Wupi4gYhm5RzfkV
Signature: 4JsqZEPra2eDTHtHpB4FMWSfk3UgcCVmkKkP7zESZeMrKmFFkDkNd91pKP3vPVVZZPiu5XxyJwS73Vi5WsZL88D7
```

### Перевірка Балансу Акаунта

#### Командний Рядок

Щоб перевірити баланс акаунта SPL Token, використовуйте наступну команду:

```shell
spl-token balance <TOKEN_ACCOUNT_ADDRESS>
```

#### Приклад

```shell
solana balance 6VzWGL51jLebvnDifvcuEDec17sK6Wupi4gYhm5RzfkV
```

Результат:

```
0
```

### Переказ Токенів

Вихідним акаунтом для переказу є фактичний акаунт токенів, який містить
необхідну суму.

Однак адресою отримувача може бути звичайний гаманець. Якщо асоційований токен
акаунт для вказаного mint ще не існує для цього гаманця, переказ створить його,
якщо буде вказаний аргумент `--fund-recipient`.

#### Командний Рядок

Щоб виконати переказ токенів, використовуйте наступну команду:

```shell
spl-token transfer <SENDER_ACCOUNT_ADDRESS> <AMOUNT> <RECIPIENT_WALLET_ADDRESS> --fund-recipient
```

#### Приклад

```shell
spl-token transfer 6B199xxzw3PkAm25hGJpjj3Wj3WNYNHzDAnt1tEqg5BN 1
```

Результат:

```shell
6VzWGL51jLebvnDifvcuEDec17sK6Wupi4gYhm5RzfkV
Transfer 1 tokens
  Sender: 6B199xxzw3PkAm25hGJpjj3Wj3WNYNHzDAnt1tEqg5BN
  Recipient: 6VzWGL51jLebvnDifvcuEDec17sK6Wupi4gYhm5RzfkV
Signature: 3R6tsog17QM8KfzbcbdP4aoMfwgo6hBggJDVy7dZPVmH2xbCWjEj31JKD53NzMrf25ChFjY7Uv2dfCDq4mGFFyAj
```

### Депозити

Оскільки кожна пара `(гаманець, mint)` потребує окремого акаунта в ончейні,
рекомендується, щоб адреси для цих акаунтів були отримані з гаманців для
депозиту SOL за допомогою схеми
[Associated Token Account (ATA)](https://spl.solana.com/associated-token-account),
і приймалися _лише_ депозити з ATA адрес.

Відстеження транзакцій депозиту має використовувати метод
[опитування блоків](#poll-for-blocks), описаний вище. Кожен новий блок слід
сканувати на наявність успішних транзакцій, що посилаються на адреси акаунтів,
отриманих для користувачів. Поля `preTokenBalance` і `postTokenBalance` з
метаданих транзакцій необхідно використовувати для визначення ефективної зміни
балансу. Ці поля ідентифікують mint токена та власника акаунта (основну адресу
гаманця) відповідного акаунта.

Зауважте, що якщо акаунт для отримання створюється під час транзакції, у нього
не буде запису `preTokenBalance`, оскільки стан акаунта раніше не існував. У
цьому випадку початковий баланс можна вважати нульовим.

### Виведення

Адреса для виведення, надана користувачем, має бути адресою їх SOL гаманця.

Перед виконанням [переказу](#token-transfers) для виведення біржа повинна
перевірити адресу, як це
[описано вище](#validating-user-supplied-account-addresses-for-withdrawals).
Крім того, ця адреса має належати System Program і не мати даних акаунта. Якщо
на цій адресі відсутній баланс SOL, перед виконанням виведення слід отримати
підтвердження користувача. Усі інші адреси для виведення повинні бути відхилені.

З адреси для виведення
[Associated Token Account (ATA)](https://spl.solana.com/associated-token-account)
для відповідного mint отримується, і переказ виконується на цей акаунт за
допомогою інструкції
[TransferChecked](https://github.com/solana-labs/solana-program-library/blob/fc0d6a2db79bd6499f04b9be7ead0c400283845e/token/program/src/instruction.rs#L268).
Зауважте, що ATA адреса може ще не існувати, у цьому випадку біржа повинна
профінансувати акаунт від імені користувача. Для акаунтів SPL Token фінансування
акаунта для виведення потребує 0.00203928 SOL (2,039,280 лампортів).

Шаблон команди `spl-token transfer` для виведення:

```shell
spl-token transfer --fund-recipient <exchange token account> <withdrawal amount> <withdrawal address>
```

### Інші Міркування

#### Freeze Authority (Замороження Акаунтів)

Для дотримання регуляторних вимог емітент токенів SPL може опціонально мати
"Freeze Authority" (повноваження замороження) для всіх акаунтів, створених у
зв'язку з його mint. Це дозволяє йому
[заморожувати](https://spl.solana.com/token#freezing-accounts) активи в певному
акаунті за бажанням, роблячи акаунт недоступним до моменту його розморожування.
Якщо ця функція використовується, публічний ключ freeze authority буде
зареєстрований у акаунті mint токену SPL.

### Основна Підтримка Стандарту SPL Token-2022 (Token-Extensions)

[SPL Token-2022](https://spl.solana.com/token-2022) є новим стандартом для
створення й обміну обгорнутих/синтетичних токенів у блокчейні Solana.

Відомий також як "Token Extensions", цей стандарт включає багато нових функцій,
які можуть бути опціонально увімкнені творцями токенів та власниками акаунтів.
До таких функцій належать конфіденційні перекази, комісії за переказ, закриття
mint, метадані, постійні делегати, незмінна власність тощо. Більше інформації
дивіться в
[керівництві з розширень](https://spl.solana.com/token-2022/extensions).

Якщо ваша біржа підтримує SPL Token, багато додаткових зусиль для підтримки SPL
Token-2022 не знадобиться:

- CLI інструмент безпроблемно працює з обома програмами, починаючи з версії
  3.0.0.
- Поля `preTokenBalances` та `postTokenBalances` включають баланси SPL
  Token-2022.
- RPC індексує акаунти SPL Token-2022, але їх потрібно запитувати окремо за
  програмним ідентифікатором `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`.

Програма Associated Token Account працює так само, і правильно розраховує
необхідну суму депозиту SOL для нового акаунта.

Однак через розширення акаунти можуть бути більшими за 165 байтів, тому вони
можуть потребувати більше ніж 0.00203928 SOL для фінансування.

Наприклад, програма Associated Token Account завжди включає розширення
"immutable owner", тому акаунти займають мінімум 170 байтів, що вимагає
0.00207408 SOL.

### Міркування Щодо Розширень

Попередній розділ описує базову підтримку SPL Token-2022. Оскільки розширення
змінюють поведінку токенів, біржам, можливо, доведеться змінити, як вони
обробляють токени.

Можливо побачити всі розширення на mint або токен акаунті за допомогою наступної
команди:

```shell
spl-token display <account address>
```

#### Комісія за Переказ

Токен може бути налаштований з комісією за переказ, при якій частина переданих
токенів утримується на адресі отримувача для подальшого стягнення.

Якщо ваша біржа здійснює переказ цих токенів, зверніть увагу, що не всі токени
можуть надійти на адресу отримувача через утриману суму.

Під час переказу можна вказати очікувану комісію, щоб уникнути несподіванок:

```shell
spl-token transfer --expected-fee <fee amount> --fund-recipient <exchange token account> <withdrawal amount> <withdrawal address>
```

#### Повноваження Закриття Mint

З цим розширенням творець токена може закрити mint, якщо пропозиція токенів
дорівнює нулю.

Коли mint закривається, можуть залишатися порожні токен акаунти, які більше не
будуть асоційовані з дійсним mint.

Ці токен акаунти можна безпечно закрити за допомогою наступної команди:

```shell
spl-token close --address <account address>
```

#### Конфіденційні Перекази

Mint може бути налаштований для конфіденційних переказів, при яких суми токенів
шифруються, але власники акаунтів залишаються публічними.

Біржі можуть налаштувати токен акаунти для відправлення та отримання
конфіденційних переказів, щоб приховати суми користувачів. Увімкнення
конфіденційних переказів для токен акаунтів не є обов’язковим, тому біржі можуть
змусити користувачів надсилати токени неконфіденційно.

Щоб увімкнути конфіденційні перекази, акаунт має бути налаштований відповідним
чином:

```shell
spl-token configure-confidential-transfer-account --address <account address>
```

Для переказу:

```shell
spl-token transfer --confidential <exchange token account> <withdrawal amount> <withdrawal address>
```

Під час конфіденційного переказу поля `preTokenBalance` та `postTokenBalance` не
показуватимуть змін. Щоб виконати операцію з депозитними акаунтами, необхідно
розшифрувати новий баланс, щоб вивести токени:

```shell
spl-token apply-pending-balance --address <account address>
spl-token withdraw-confidential-tokens --address <account address> <amount or ALL>
```

#### Стандартний Стан Акаунтів

Mint може бути налаштований із стандартним станом акаунтів, коли всі нові токен
акаунти за замовчуванням заморожені. Творці токенів можуть вимагати від
користувачів проходження окремого процесу для розморожування акаунта.

#### Непередавані Токени

Деякі токени є непередаваними, але їх все ще можна спалити, а акаунт закрити.

#### Постійний Делегат

Творці токенів можуть призначити постійного делегата для всіх своїх токенів.
Постійний делегат може передавати або спалювати токени з будь-якого акаунта,
потенційно викрадаючи кошти.

Це може бути юридичною вимогою для стейблкоїнів у певних юрисдикціях або
використовуватися для схем повернення токенів.

Будьте уважні, оскільки ці токени можуть бути передані без відома вашої біржі.

#### Перехоплювач Переказів (Transfer Hook)

Токени можуть бути налаштовані з додатковою програмою, яку необхідно викликати
під час переказів для перевірки транзакції або виконання іншої логіки.

Оскільки середовище виконання Solana вимагає, щоб усі акаунти були явно передані
до програми, а перехоплювачі переказів вимагають додаткових акаунтів, біржа
повинна створювати інструкції для переказу цих токенів по-іншому.

CLI та творці інструкцій, такі як
`createTransferCheckedWithTransferHookInstruction`, додають додаткові акаунти
автоматично, але також можна вказати додаткові акаунти явно:

```shell
spl-token transfer --transfer-hook-account <pubkey:role> --transfer-hook-account <pubkey:role> ...
```

#### Обов'язкова Нотатка (Memo) при Переказі

Користувачі можуть налаштувати свої токен акаунти так, щоб перекази вимагали
нотатку (memo).

Біржі можуть додавати інструкцію нотатки перед тим, як переказати токени
користувачам, або вимагати, щоб користувачі додавали нотатку перед відправкою
токенів на біржу:

```shell
spl-token transfer --with-memo <memo text> <exchange token account> <withdrawal amount> <withdrawal address>
```

## Тестування Інтеграції

Обов'язково протестуйте весь свій робочий процес у кластерах Solana devnet та
testnet [clusters](/docs/uk/core/clusters.md) перед переходом до продакшну на
mainnet-beta. Devnet є найбільш відкритим і гнучким, і ідеально підходить для
початкової розробки, тоді як testnet пропонує більш реалістичну конфігурацію
кластера. Обидва кластери devnet та testnet підтримують faucet. Використовуйте
команду `solana airdrop 1`, щоб отримати трохи SOL для devnet або testnet для
розробки та тестування.
