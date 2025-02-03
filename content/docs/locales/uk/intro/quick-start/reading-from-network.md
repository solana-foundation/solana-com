---
sidebarLabel: Читання з Мережі
title: Читання з Мережі
sidebarSortOrder: 1
description:
  Дізнайтеся, як зчитувати дані з блокчейн-мережі Solana. Цей посібник охоплює
  отримання акаунтів гаманців, програмних акаунтів і акаунтів випуску токенів за
  допомогою JavaScript/TypeScript із практичними прикладами на основі бібліотеки
  Solana web3.js.
---

Давайте розглянемо, як зчитувати дані з мережі Solana. Ми отримаємо кілька
різних акаунтів, щоб зрозуміти структуру акаунта Solana.

У Solana всі дані містяться у так званих "акаунтах". Ви можете думати про дані в
Solana як про загальнодоступну базу даних із єдиною таблицею "Accounts", де
кожен запис у цій таблиці є окремим акаунтом.

Акаунти Solana можуть містити "стан" або виконувані програми, які можна
розглядати як записи в одній таблиці "Accounts". Кожен акаунт має "адресу"
(публічний ключ), яка є унікальним ідентифікатором для доступу до відповідних
даних у блокчейні.

Акаунти Solana можуть містити:

- **Стан**: Дані, які призначені для зчитування і зберігання. Це може бути
  інформація про токени, дані користувачів або будь-які інші дані, визначені у
  програмі.
- **Виконувані програми**: Акаунти, які містять фактичний код програм Solana.
  Вони включають інструкції, які можна виконувати у мережі.

Цей поділ програмного коду та стану програми є ключовою особливістю Моделі
Акаунтів Solana. Для отримання додаткової інформації відвідайте сторінку
[Модель Акаунтів Solana](/docs/uk/core/accounts).

## Отримання Гаманця Playground

Почнемо з розгляду знайомого акаунта — вашого власного гаманця Playground! Ми
отримаємо цей акаунт і розглянемо його структуру, щоб зрозуміти, як виглядає
базовий акаунт Solana.

<Steps>

### Відкриття Прикладу 1

Натисніть це [посилання](https://beta.solpg.io/6671c5e5cffcf4b13384d198), щоб
відкрити приклад у Solana Playground. Ви побачите такий код:

```ts filename="client.ts"
const address = pg.wallet.publicKey;
const accountInfo = await pg.connection.getAccountInfo(address);

console.log(JSON.stringify(accountInfo, null, 2));
```

<Accordion>
<AccordionItem title="Explanation">

Цей код виконує три прості дії:

- Отримує адресу вашого гаманця Playground:

  ```ts
  const address = pg.wallet.publicKey;
  ```

- Отримує `AccountInfo` для акаунта за цією адресою:

  ```ts
  const accountInfo = await pg.connection.getAccountInfo(address);
  ```

- Виводить `AccountInfo` у термінал Playground:

  ```ts
  console.log(JSON.stringify(accountInfo, null, 2));
  ```

</AccordionItem>
</Accordion>

### Запуск Прикладу 1

У терміналі Playground введіть команду `run` і натисніть Enter:

```shell filename="Terminal"
run
```

Ви повинні побачити деталі вашого акаунта гаманця, включаючи його баланс у
лампортах, із результатом, схожим на наступний:

<Accordion>
<AccordionItem title="Output">

```shell filename="Terminal"
$ run
Running client...
  client.ts:
    {
  "data": {
    "type": "Buffer",
    "data": []
  },
  "executable": false,
  "lamports": 5000000000,
  "owner": "11111111111111111111111111111111",
  "rentEpoch": 18446744073709552000,
  "space": 0
}
```

</AccordionItem>
<AccordionItem title="Explanation">

Ваш гаманець насправді є лише акаунтом, яким керує Системна програма. Основна
мета акаунта гаманця — зберігати баланс SOL (значення у полі `lamports`).

---

В основі всі акаунти Solana представлені у стандартному форматі, який
називається `AccountInfo`. Тип даних
[AccountInfo](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/account_info.rs#L19-L36)
є базовою структурою даних для всіх акаунтів Solana.

Розберемо поля у виведених даних:

- `data` — Це поле містить те, що ми зазвичай називаємо "даними" акаунта. Для
  гаманця воно порожнє (0 байтів), але інші акаунти використовують це поле для
  зберігання будь-яких довільних даних у вигляді серіалізованого буфера байтів.

> Коли дані "буферизуються" таким чином, вони зберігають свою цілісність і
> можуть пізніше бути десеріалізовані назад у свій початковий вигляд для
> використання у програмах. Цей процес широко використовується в блокчейні для
> ефективної обробки даних.

- `executable` — Прапорець, який вказує, чи є акаунт виконуваною програмою. Для
  гаманців та будь-яких акаунтів, які зберігають стан, значення `false`.
- `owner` — Це поле показує, яка програма контролює акаунт. Для гаманців це
  завжди Системна програма з адресою `11111111111111111111111111111111`.
- `lamports` — Баланс акаунта у лампортах (1 SOL = 1,000,000,000 лампортів).
- `rentEpoch` — Поле, пов’язане зі старим механізмом збору оренди Solana (наразі
  не використовується).
- `space` — Вказує ємність (довжину) поля `data`, але не є полем типу
  `AccountInfo`.

</AccordionItem>
</Accordion>

</Steps>

## Отримання Програми Token Program

Далі ми розглянемо програму Token Extensions, яка є виконуваною програмою для
взаємодії з токенами на Solana.

<Steps>

### Відкриття Прикладу 2

Натисніть це [посилання](https://beta.solpg.io/6671c6e7cffcf4b13384d199), щоб
відкрити приклад у Solana Playground. Ви побачите такий код:

```ts filename="client.ts" {3}
import { PublicKey } from "@solana/web3.js";

const address = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
const accountInfo = await pg.connection.getAccountInfo(address);

console.log(JSON.stringify(accountInfo, null, 2));
```

Замість отримання вашого гаманця Playground, тут ми отримуємо адресу акаунта
програми Token Extensions.

### Запуск Прикладу 2

Запустіть код, виконавши команду `run` у терміналі.

```shell filename="Terminal"
run
```

Ознайомтеся з виведеними даними та тим, чим цей акаунт програми відрізняється
від вашого акаунта гаманця.

<Accordion>
<AccordionItem title="Output">

```shell filename="Terminal" {15, 17}
$ run
Running client...
  client.ts:
    {
  "data": {
    "type": "Buffer",
    "data": [
      2,
      0,
      //... additional bytes
      86,
      51
    ]
  },
  "executable": true,
  "lamports": 1141440,
  "owner": "BPFLoaderUpgradeab1e11111111111111111111111",
  "rentEpoch": 18446744073709552000,
  "space": 36
}
```

</AccordionItem>
<AccordionItem title="Explanation">

Програма Token Extensions є виконуваним акаунтом програми, але має таку ж
структуру `AccountInfo`.

Основні відмінності в `AccountInfo`:

- **`executable`** — Встановлено у `true`, що вказує на те, що цей акаунт є
  виконуваною програмою.
- **`data`** — Містить серіалізовані дані (на відміну від порожніх даних у
  акаунті гаманця). Дані для акаунта програми зберігають адресу іншого акаунта
  (Program Executable Data Account), який містить байт-код програми.
- **`owner`** — Акаунт належить завантажувачу Upgradable BPF Loader
  (`BPFLoaderUpgradeab1e11111111111111111111111`), спеціальній програмі, яка
  управляє виконуваними акаунтами.

---

Ви можете перевірити Solana Explorer для
[акаунта програми Token Extensions](https://explorer.solana.com/address/TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb)
та його відповідного
[Program Executable Data Account](https://explorer.solana.com/address/DoU57AYuPFu2QU514RktNPG22QhApEjnKxnBcu4BHDTY).

Program Executable Data Account містить скомпільований байт-код програми Token
Extensions
[вихідний код](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program-2022/src).

</AccordionItem>
</Accordion>

</Steps>

## Отримання Акаунта Mint

На цьому етапі ми розглянемо акаунт Mint, який представляє унікальний токен у
мережі Solana.

<Steps>

### Відкриття Прикладу 3

Натисніть це [посилання](https://beta.solpg.io/6671c9aecffcf4b13384d19a), щоб
відкрити приклад у Solana Playground. Ви побачите такий код:

```ts filename="client.ts" {3}
import { PublicKey } from "@solana/web3.js";

const address = new PublicKey("C33qt1dZGZSsqTrHdtLKXPZNoxs6U1ZBfyDkzmj6mXeR");
const accountInfo = await pg.connection.getAccountInfo(address);

console.log(JSON.stringify(accountInfo, null, 2));
```

У цьому прикладі ми отримаємо адресу існуючого акаунта Mint у devnet.

### Запуск Прикладу 3

Запустіть код, виконавши команду `run`.

```shell filename="Terminal"
run
```

<Accordion>
<AccordionItem title="Output">

```shell filename="Terminal" {17}
$ run
Running client...
  client.ts:
    {
  "data": {
    "type": "Buffer",
    "data": [
      1,
      0,
      //... additional bytes
      0,
      0
    ]
  },
  "executable": false,
  "lamports": 4176000,
  "owner": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  "rentEpoch": 18446744073709552000,
  "space": 430
}
```

</AccordionItem>
<AccordionItem title="Explanation">

Основні відмінності в `AccountInfo`:

- **`owner`** — Акаунт mint належить програмі Token Extensions
  (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`).
- **`executable`** — Встановлено у `false`, оскільки цей акаунт зберігає стан, а
  не виконуваний код.
- **`data`** — Містить серіалізовані дані про токен (авторитет випуску, загальну
  кількість, кількість знаків після коми тощо).

</AccordionItem>
</Accordion>

### Десеріалізація Даних Акаунта Mint

Щоб зчитати поле `data` з будь-якого акаунта, потрібно десеріалізувати буфер
даних у очікуваний тип даних. Це часто виконується за допомогою допоміжних
функцій клієнтських бібліотек для конкретної програми.

**Десеріалізація** — це процес перетворення даних зі збереженого формату
(наприклад, необроблених байтів або JSON) назад у використовуваний
структурований формат у програмі. У блокчейні це включає взяття необроблених,
закодованих даних із мережі та їх перетворення назад в об'єкти, класи або
читабельні структури, щоб розробники могли отримати доступ до конкретної
інформації та маніпулювати нею у програмі. Десеріалізація є важливою для
інтерпретації даних акаунтів або транзакцій, отриманих із мережі, у формі, яку
програма може обробляти і відображати осмислено.

Відкрийте цей [приклад](https://beta.solpg.io/6671cd8acffcf4b13384d19b) у Solana
Playground. Ви побачите такий код:

```ts filename="client.ts"
import { PublicKey } from "@solana/web3.js";
import { getMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

const address = new PublicKey("C33qt1dZGZSsqTrHdtLKXPZNoxs6U1ZBfyDkzmj6mXeR");
const mintData = await getMint(
  pg.connection,
  address,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);

console.log(mintData);
```

Цей приклад використовує функцію `getMint`, яка автоматично десеріалізує поле
`data` акаунта Mint.

Запустіть код, виконавши команду `run`.

```shell filename="Terminal"
run
```

Ви повинні побачити наступні десеріалізовані дані акаунта Mint.

<Accordion>
<AccordionItem title="Output">

```shell filename="Terminal"
Running client...
  client.ts:
  { address: { _bn: { negative: 0, words: [Object], length: 10, red: null } },
  mintAuthority: { _bn: { negative: 0, words: [Object], length: 10, red: null } },
  supply: {},
  decimals: 2,
  isInitialized: true,
  freezeAuthority: null,
  tlvData: <Buffer 12 00 40 00 2c 5b 90 b2 42 0c 89 a8 fc 3b 2f d6 15 a8 9d 1e 54 4f 59 49 e8 9e 35 8f ab 88 64 9f 5b db 9c 74 a3 f6 ee 9f 21 a9 76 43 8a ee c4 46 43 3d ... > }
```

</AccordionItem>
<AccordionItem title="Explanation">

Функція `getMint` десеріалізує дані акаунта у тип даних
[Mint](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/state.rs#L18-L32),
визначений у вихідному коді програми Token Extensions.

- **`address`** — Адреса акаунта Mint.
- **`mintAuthority`** — Авторитет, який може випускати нові токени.
- **`supply`** — Загальна кількість токенів в обігу.
- **`decimals`** — Кількість десяткових знаків для токена.
- **`isInitialized`** — Чи були дані Mint ініціалізовані.
- **`freezeAuthority`** — Авторитет, який має право заморожувати акаунти
  токенів.
- **`tlvData`** — Додаткові дані для Token Extensions (вимагають подальшої
  десеріалізації).

Ви можете переглянути повністю десеріалізовані
[дані акаунта Mint](https://explorer.solana.com/address/C33qt1dZGZSsqTrHdtLKXPZNoxs6U1ZBfyDkzmj6mXeR?cluster=devnet),
включаючи активовані Token Extensions, у Solana Explorer.

</AccordionItem>
</Accordion>

</Steps>
