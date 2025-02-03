---
title: "Токени на Solana"
sidebarSortOrder: 7
description:
  Дізнайтеся про токени Solana (SPL Tokens), включаючи взаємозамінні та
  невзаємозамінні токени, Програму Токенів, Програму Розширень Токенів, облікові
  записи випуску токенів, токен-облікові записи, а також практичні приклади
  створення і управління токенами на Solana.
---

Токени — це цифрові активи, які представляють право власності на різні категорії
активів. Токенізація дозволяє цифровізувати права власності, виступаючи як
фундаментальний компонент для управління взаємозамінними та невзаємозамінними
активами.

- **Взаємозамінні токени** представляють активи, які можна замінювати і ділити
  (наприклад, USDC).
- **Невзаємозамінні токени (NFT)** представляють право власності на неподільні
  активи (наприклад, витвори мистецтва).

У цьому розділі буде розглянуто основи представлення токенів у Solana. Ці токени
називаються SPL
([Solana Program Library](https://github.com/solana-labs/solana-program-library)).

- [Програма Токенів](#token-program) містить всю логіку інструкцій для взаємодії
  з токенами в мережі (як взаємозамінними, так і невзаємозамінними).

- [Обліковий запис випуску токенів](#mint-account) представляє певний тип токена
  і зберігає глобальні метадані, такі як загальна кількість токенів і авторитет
  випуску (адреса, уповноважена створювати нові одиниці токенів).

- [Токен-обліковий запис](#token-account) відстежує індивідуальну власність на
  певну кількість токенів конкретного типу (облікового запису випуску токенів).

> Наразі існує дві версії Програми Токенів: оригінальна
> [Програма Токенів](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program)
> і
> [Програма Розширень Токенів](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program-2022)
> (Token2022). Програма Розширень Токенів працює так само, як і оригінальна
> Програма Токенів, але з додатковими функціями і покращеннями. Для створення
> нових токенів рекомендовано використовувати Програму Розширень Токенів.

## Основні моменти

- Токени представляють право власності на взаємозамінні (змінні) або
  невзаємозамінні (унікальні) активи.

- Програма Токенів містить усі інструкції для взаємодії з токенами в мережі.

- Програма Розширень Токенів — це нова версія Програми Токенів, яка включає
  додаткові функції, зберігаючи основну функціональність.

- Обліковий запис випуску токенів представляє унікальний токен у мережі і
  зберігає глобальні метадані, такі як загальна кількість токенів.

- Токен-обліковий запис відстежує індивідуальну власність на токени для певного
  облікового запису випуску токенів.

- Асоційований Токен-обліковий запис — це токен-обліковий запис, створений із
  адреси, отриманої із адреси власника та адреси облікового запису випуску
  токенів.

## Програма Токенів

[Програма Токенів](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program)
містить всю логіку інструкцій для взаємодії з токенами в мережі (як
взаємозамінними, так і невзаємозамінними). Усі токени на Solana фактично є
[даними облікових записів](/docs/uk/core/accounts.md#data-account), якими
володіє Програма Токенів.

Повний список інструкцій Програми Токенів можна знайти
[тут](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/instruction.rs).

![Програма Токенів](/assets/docs/core/tokens/token-program.svg)

Кілька найчастіше використовуваних інструкцій включають:

- [`InitializeMint`](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/processor.rs#L29):
  Створення нового облікового запису випуску токенів для представлення нового
  типу токена.
- [`InitializeAccount`](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/processor.rs#L84):
  Створення нового токен-облікового запису для зберігання одиниць певного типу
  токенів (випуску).
- [`MintTo`](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/processor.rs#L522):
  Створення нових одиниць певного типу токенів і додавання їх до
  токен-облікового запису. Це збільшує кількість токенів і може виконуватися
  лише авторитетом випуску облікового запису випуску токенів.
- [`Transfer`](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/processor.rs#L228):
  Передача одиниць певного типу токенів із одного токен-облікового запису в
  інший.

### Обліковий запис випуску токенів

Токени на Solana унікально ідентифікуються за адресою
[Облікового запису випуску токенів](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/state.rs#L18-L32),
яким володіє Програма Токенів. Цей обліковий запис фактично є глобальним
лічильником для певного токена і зберігає дані, такі як:

- Загальна кількість: Загальна кількість токенів.
- Десяткові знаки: Точність токена у десяткових знаках.
- Авторитет випуску: Обліковий запис, уповноважений створювати нові одиниці
  токенів, таким чином збільшуючи кількість.
- Авторитет замороження: Обліковий запис, уповноважений заморожувати токени, щоб
  їх не можна було передати із "токен-облікових записів".

![Обліковий запис випуску токенів](/assets/docs/core/tokens/mint-account.svg)

Повна інформація, яка зберігається в кожному обліковому записі випуску токенів,
включає:

```rust
pub struct Mint {
    /// Optional authority used to mint new tokens. The mint authority may only
    /// be provided during mint creation. If no mint authority is present
    /// then the mint has a fixed supply and no further tokens may be
    /// minted.
    pub mint_authority: COption<Pubkey>,
    /// Total supply of tokens.
    pub supply: u64,
    /// Number of base 10 digits to the right of the decimal place.
    pub decimals: u8,
    /// Is `true` if this structure has been initialized
    pub is_initialized: bool,
    /// Optional authority to freeze token accounts.
    pub freeze_authority: COption<Pubkey>,
}
```

Для довідки, ось посилання на Solana Explorer для
[Облікового запису випуску USDC](https://explorer.solana.com/address/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v).

### Токен-обліковий запис

Для відстеження індивідуальної власності на кожну одиницю певного токена має
бути створений інший тип облікового запису даних, яким володіє Програма Токенів.
Цей обліковий запис називається
[Токен-обліковий запис](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/state.rs#L89-L110).

Найчастіше згадувані дані, які зберігаються в Токен-обліковому записі,
включають:

- **Випуск (Mint)**: Тип токена, одиниці якого зберігаються в Токен-обліковому
  записі.
- **Власник (Owner)**: Обліковий запис, уповноважений передавати токени з
  Токен-облікового запису.
- **Кількість (Amount)**: Кількість одиниць токена, які наразі зберігаються в
  Токен-обліковому записі.

![Токен-обліковий запис](/assets/docs/core/tokens/token-account.svg)

Повна інформація, яка зберігається в кожному Токен-обліковому записі, включає:

```rust
pub struct Account {
    /// The mint associated with this account
    pub mint: Pubkey,
    /// The owner of this account.
    pub owner: Pubkey,
    /// The amount of tokens this account holds.
    pub amount: u64,
    /// If `delegate` is `Some` then `delegated_amount` represents
    /// the amount authorized by the delegate
    pub delegate: COption<Pubkey>,
    /// The account's state
    pub state: AccountState,
    /// If is_native.is_some, this is a native token, and the value logs the
    /// rent-exempt reserve. An Account is required to be rent-exempt, so
    /// the value is used by the Processor to ensure that wrapped SOL
    /// accounts do not drop below this threshold.
    pub is_native: COption<u64>,
    /// The amount delegated
    pub delegated_amount: u64,
    /// Optional authority to close the account.
    pub close_authority: COption<Pubkey>,
}
```

Щоб гаманець міг володіти одиницями певного токена, потрібно створити
токен-обліковий запис для конкретного типу токена (випуску), який призначає
гаманець власником цього токен-облікового запису. Гаманець може створювати
кілька токен-облікових записів для одного і того ж типу токена, але кожен
токен-обліковий запис може належати лише одному гаманцю і зберігати одиниці лише
одного типу токена.

![Взаємозв'язок облікових записів](/assets/docs/core/tokens/token-account-relationship.svg)

> Зверніть увагу, що дані кожного Токен-облікового запису містять поле `owner`,
> яке використовується для визначення того, хто має авторитет над цим
> Токен-обліковим записом. Це окремо від власника програми, зазначеного у
> [AccountInfo](/docs/uk/core/accounts.md#accountinfo), яким є Програма Токенів
> для всіх Токен-облікових записів.

### Асоційований токен-обліковий запис

Щоб спростити процес визначення адреси токен-облікового запису для конкретного
випуску і власника, ми часто використовуємо Асоційовані Токен-облікові Записи.

Асоційований токен-обліковий запис — це токен-обліковий запис, чия адреса
визначається детерміновано з використанням адреси власника і адреси облікового
запису випуску. Можна розглядати Асоційований токен-обліковий запис як
"стандартний" токен-обліковий запис для певного випуску і власника.

Важливо розуміти, що Асоційований токен-обліковий запис не є окремим типом
токен-облікового запису. Це просто токен-обліковий запис із певною адресою.

![Асоційований токен-обліковий запис](/assets/docs/core/tokens/associated-token-account.svg)

Це вводить ключове поняття в розробці Solana:
[Програмно Виведена Адреса (PDA)](/docs/uk/core/pda.md). Концептуально PDA надає
детермінований спосіб генерації адреси з використанням заздалегідь визначених
вхідних даних. Це дозволяє нам легко знайти адресу облікового запису в
майбутньому.

Ось
[приклад на Solana Playground](https://beta.solpg.io/656a2dd0fb53fa325bfd0c41),
який виводить адресу і власника Асоційованого токен-облікового запису USDC. Він
завжди генерує
[одну й ту саму адресу](https://explorer.solana.com/address/4kokFKCFMxpCpG41yLYkLEqXW8g1WPfCt2NC9KGivY6N)
для одного і того ж випуску і власника.

```ts
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
  USDC_MINT_ADDRESS,
  OWNER_ADDRESS,
);
```

Зокрема, адреса для Асоційованого токен-облікового запису виводиться за
допомогою наступних вхідних даних. Ось
[приклад на Solana Playground](https://beta.solpg.io/656a31d0fb53fa325bfd0c42),
який генерує ту саму адресу, що й у попередньому прикладі.

```ts
import { PublicKey } from "@solana/web3.js";

const [PDA, bump] = PublicKey.findProgramAddressSync(
  [
    OWNER_ADDRESS.toBuffer(),
    TOKEN_PROGRAM_ID.toBuffer(),
    USDC_MINT_ADDRESS.toBuffer(),
  ],
  ASSOCIATED_TOKEN_PROGRAM_ID,
);
```

Щоб два гаманці могли зберігати одиниці одного і того ж типу токена, кожен
гаманець потребує свого токен-облікового запису для конкретного облікового
запису випуску токенів. Зображення нижче демонструє, як виглядає ця структура
взаємозв'язку облікових записів.

![Розширений взаємозв'язок облікових записів](/assets/docs/core/tokens/token-account-relationship-ata.svg)

## Приклади роботи з токенами

CLI [`spl-token`](https://docs.anza.xyz/cli) можна використовувати для
експериментів з SPL токенами. У прикладах нижче ми використовуватимемо
[Solana Playground](https://beta.solpg.io/) для виконання CLI-команд прямо в
браузері без необхідності встановлення CLI локально.

Створення токенів і облікових записів вимагає SOL для депозитів за оренду
облікових записів та оплати транзакційних комісій. Якщо ви вперше використовуєте
Solana Playground, створіть гаманець у Playground і виконайте команду
`solana airdrop` у терміналі Playground. Ви також можете отримати SOL для
devnet, використовуючи публічний [веб-фасет](https://faucet.solana.com/).

```sh
solana airdrop 2
```

Run `spl-token --help` for a full description of available commands.

```sh
spl-token --help
```

Крім того, ви можете встановити CLI `spl-token` локально, використовуючи
наступну команду. Для цього спочатку потрібно
[встановити Rust](https://rustup.rs/).

> У наступних розділах адреси облікових записів, які відображаються під час
> виконання CLI-команд, можуть відрізнятися від прикладів, наведених нижче. Будь
> ласка, використовуйте адреси, які відображаються у вашому терміналі
> Playground, під час виконання команд. Наприклад, адреса, отримана в результаті
> виконання `create-token`, є обліковим записом випуску токенів, де ваш гаманець
> Playground призначений авторитетом випуску.

### Створення нового токена

Щоб створити новий токен ([обліковий запис випуску токенів](#mint-account)),
виконайте наступну команду в терміналі Solana Playground.

```sh
spl-token create-token
```

Ви повинні побачити результат, подібний до наведеного нижче. Ви можете
переглянути деталі як токена, так і транзакції у
[Solana Explorer](https://explorer.solana.com/?cluster=devnet), використовуючи
`Address` (адресу) та `Signature` (підпис).

У прикладі результату нижче унікальний ідентифікатор (адреса) нового токена —
`99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg`.

```shell filename="Terminal Output" /99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg/
Creating token 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg

Address:  99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg
Decimals:  9

Signature: 44fvKfT1ezBUwdzrCys3fvCdFxbLMnNvBstds76QZyE6cXag5NupBprSXwxPTzzjrC3cA6nvUZaLFTvmcKyzxrm1
```

Нові токени спочатку мають нульовий запас. Ви можете перевірити поточний запас
токена, використовуючи наступну команду:

```sh
spl-token supply <TOKEN_ADDRESS>
```

Запуск команди `supply` для новоствореного токена поверне значення `0`:

```sh /99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg/
spl-token supply 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg
```

У своїй основі створення нового облікового запису випуску токенів (Mint Account)
вимагає надсилання транзакції з двома інструкціями. Ось приклад на Javascript у
[Solana Playground](https://beta.solpg.io/660ce32ecffcf4b13384d00f).

1. Виклик Системної Програми для створення нового облікового запису з достатнім
   обсягом пам'яті для даних облікового запису випуску токенів, а потім передача
   власності Програмі Токенів.

2. Виклик Програми Токенів для ініціалізації даних нового облікового запису як
   облікового запису випуску токенів.

### Створення Токен-облікового запису

Щоб зберігати одиниці певного токена, вам потрібно спочатку створити
[токен-обліковий запис](#token-account). Для створення нового токен-облікового
запису скористайтеся наступною командою:

```sh
spl-token create-account [OPTIONS] <TOKEN_ADDRESS>
```

Наприклад, виконання наступної команди в терміналі Solana Playground:

````sh /99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg/
spl-token create-account 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg
```:
Виведе наступний результат
- `AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9`це адреса токен-облікового запису, створеного для зберігання одиниць токена,
вказаного в команді `create-account`.

```shell filename="Terminal Output" /AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9/
Creating account AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9

Signature: 2BtrynuCLX9CNofFiaw6Yzbx6hit66pup9Sk7aFjwU2NEbFz7NCHD9w9sWhrCfEd73XveAGK1DxFpJoQZPXU9tS1
````

За замовчуванням команда `create-account` створює
[асоційований токен-обліковий запис](#associated-token-account) з адресою вашого
гаманця як власника токен-облікового запису.

Ви можете створити токен-обліковий запис з іншим власником, використовуючи
наступну команду:

```sh
spl-token create-account --owner <OWNER_ADDRESS> <TOKEN_ADDRESS>
```

Наприклад, виконання наступної команди:

```sh /2i3KvjDCZWxBsqcxBHpdEaZYQwQSYE6LXUMx5VjY5XrR/
spl-token create-account --owner 2i3KvjDCZWxBsqcxBHpdEaZYQwQSYE6LXUMx5VjY5XrR 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg
```

Виведе наступний результат:

- `Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt` — це адреса токен-облікового
  запису, створеного для зберігання одиниць токена, вказаного в команді
  `create-account` (`99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg`), і який
  належить адресі, вказаній після прапора `--owner`
  (`2i3KvjDCZWxBsqcxBHpdEaZYQwQSYE6LXUMx5VjY5XrR`). Це корисно, коли вам
  потрібно створити токен-обліковий запис для іншого користувача.

```shell filename="Terminal Output" /Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt/
Creating account Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt

Signature: 44vqKdfzspT592REDPY4goaRJH3uJ3Ce13G4BCuUHg35dVUbHuGTHvqn4ZjYF9BGe9QrjMfe9GmuLkQhSZCBQuEt
```

За лаштунками створення Асоційованого токен-облікового запису потребує однієї
інструкції, яка викликає
[Програму Асоційованих Токенів](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/associated-token-account/program/src).
Ось приклад на Javascript у
[Solana Playground](https://beta.solpg.io/660ce868cffcf4b13384d011).

Програма Асоційованих Токенів використовує
[Перехресні Виклики Програм (CPI)](/docs/uk/core/cpi.md) для виконання
наступного:

- [Виклик Системної Програми](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/associated-token-account/program/src/tools/account.rs#L19)
  для створення нового облікового запису, використовуючи надану PDA як адресу
  нового облікового запису.
- [Виклик Програми Токенів](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/associated-token-account/program/src/processor.rs#L138-L161)
  для ініціалізації даних токен-облікового запису для нового облікового запису.

Крім того, створення нового токен-облікового запису за допомогою випадково
згенерованої пари ключів (не Асоційованого токен-облікового запису) потребує
надсилання транзакції з двома інструкціями. Ось приклад на Javascript у
[Solana Playground](https://beta.solpg.io/660ce716cffcf4b13384d010).

1. Виклик Системної Програми для створення нового облікового запису з достатнім
   обсягом пам'яті для даних токен-облікового запису, а потім передача власності
   Програмі Токенів.

2. Виклик Програми Токенів для ініціалізації даних нового облікового запису як
   токен-облікового запису.

### Випуск токенів

Щоб створити нові одиниці токена, використовуйте наступну команду:

```sh
spl-token mint [OPTIONS] <TOKEN_ADDRESS> <TOKEN_AMOUNT> [--] [RECIPIENT_TOKEN_ACCOUNT_ADDRESS]
```

Наприклад, виконання наступної команди:

```sh
spl-token mint 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg 100
```

Виведе наступний результат:

- `99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg` — це адреса облікового запису
  випуску токенів, для якого випускаються токени (збільшуючи загальну
  кількість).

- `AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9` — це адреса токен-облікового
  запису вашого гаманця, до якого випускаються одиниці токена (збільшуючи
  кількість).

```shell filename="Terminal Output" /99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg/ /AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9/
Minting 100 tokens
  Token: 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg
  Recipient: AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9

Signature: 2NJ1m7qCraPSBAVxbr2ssmWZmBU9Jc8pDtJAnyZsZJRcaYCYMqq1oRY1gqA4ddQno3g3xcnny5fzr1dvsnFKMEqG
```

Щоб випустити токени до іншого токен-облікового запису, вкажіть адресу
потрібного облікового запису одержувача токенів.

Наприклад, виконання наступної команди:

```sh /Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt/
spl-token mint 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg 100 -- Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt
```

Повертає наступний результат:

- 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg — це адреса облікового запису
  випуску токенів, для якого випускаються токени (збільшуючи загальну
  кількість).

- Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt — це адреса токен-облікового
  запису, до якого випускаються одиниці токена (збільшуючи кількість).

```shell filename="Terminal Output" /99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg/ /Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt/
Minting 100 tokens
  Token: 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg
  Recipient: Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt

Signature: 3SQvNM3o9DsTiLwcEkSPT1Edr14RgE2wC54TEjonEP2swyVCp2jPWYWdD6RwXUGpvDNUkKWzVBZVFShn5yntxVd7
```

За лаштунками створення нових одиниць токена потребує виклику інструкції
`MintTo` у Програмі Токенів. Ця інструкція повинна бути підписана авторитетом
випуску. Інструкція випускає нові одиниці токена до Токен-облікового запису та
збільшує загальну кількість у Обліковому записі випуску токенів. Ось приклад на
Javascript у
[Solana Playground](https://beta.solpg.io/660cea45cffcf4b13384d012).

### Передача токенів

Щоб передати одиниці токена між двома токен-обліковими записами, використовуйте
наступну команду:

```sh
spl-token transfer [OPTIONS] <TOKEN_ADDRESS> <TOKEN_AMOUNT> <RECIPIENT_ADDRESS
or RECIPIENT_TOKEN_ACCOUNT_ADDRESS>
```

Наприклад, виконання наступної команди:

```sh
spl-token transfer 99zqUzQGohamfYxyo8ykTEbi91iom3CLmwCA75FK5zTg 100 Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt
```

Повертає наступний результат:

- `AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9` — це адреса токен-облікового
  запису, з якого передаються токени. Це буде адреса вашого токен-облікового
  запису для вказаного токена, який передається.

- `Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt` — це адреса токен-облікового
  запису, до якого передаються токени.

```shell filename="Terminal Output" /AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9/ /Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt/
Transfer 100 tokens
  Sender: AfB7uwBEsGtrrBqPTVqEgzWed5XdYfM1psPNLmf7EeX9
  Recipient: Hmyk3FSw4cfsuAes7sanp2oxSkE9ivaH6pMzDzbacqmt

Signature: 5y6HVwV8V2hHGLTVmTmdySRiEUCZnWmkasAvJ7J6m7JR46obbGKCBqUFgLpZu5zQGwM4Xy6GZ4M5LKd1h6Padx3o
```

За лаштунками, передача токенів потребує виклику інструкції `Transfer` у
Програмі Токенів. Ця інструкція повинна бути підписана власником
токен-облікового запису відправника. Інструкція передає одиниці токена з одного
Токен-облікового запису до іншого. Ось приклад на Javascript у
[Solana Playground](https://beta.solpg.io/660ced84cffcf4b13384d013).

Важливо розуміти, що як у відправника, так і у одержувача повинні існувати
токен-облікові записи для конкретного типу токена, який передається. Відправник
може додати додаткові інструкції до транзакції для створення токен-облікового
запису одержувача, який, як правило, є Асоційованим Токен-обліковим записом.

### Створення метаданих токенів

Програма Розширень Токенів дозволяє додавати настроювані метадані (наприклад,
назву, символ, посилання на зображення) безпосередньо до Облікового запису
випуску токенів.

<Callout>
   Щоб використовувати параметри CLI для розширень токенів, переконайтеся, що ви маєте 
   локально встановлений CLI, версії 3.4.0 або пізнішої:
   
   `cargo install --version 3.4.0 spl-token-cli`
</Callout>

Щоб створити новий токен із увімкненим розширенням метаданих, скористайтеся
наступною командою:

```sh
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
--enable-metadata
```

Команда повертає наступний результат:

- `BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP` — це адреса нового токена,
  створеного з увімкненим розширенням метаданих.

```shell filename="Terminal Output" /BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP/
Creating token BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP under program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
To initialize metadata inside the mint, please run `spl-token initialize-metadata BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP <YOUR_TOKEN_NAME> <YOUR_TOKEN_SYMBOL> <YOUR_TOKEN_URI>`, and sign with the mint authority.

Address:  BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP
Decimals:  9

Signature: 5iQofFeXdYhMi9uTzZghcq8stAaa6CY6saUwcdnELST13eNSifiuLbvR5DnRt311frkCTUh5oecj8YEvZSB3wfai
```

Після створення нового токена з увімкненим розширенням метаданих використовуйте
наступну команду для ініціалізації метаданих:

```sh
spl-token initialize-metadata <TOKEN_MINT_ADDRESS> <YOUR_TOKEN_NAME>
<YOUR_TOKEN_SYMBOL> <YOUR_TOKEN_URI>
```

Токен URI зазвичай є посиланням на позаблокові метадані, які ви хочете
асоціювати з токеном. Приклад формату JSON можна знайти
[тут](https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json).

Наприклад, виконання наступної команди дозволить зберегти додаткові метадані
безпосередньо в зазначеному обліковому записі випуску токенів:

```sh /BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP/
spl-token initialize-metadata BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP "TokenName" "TokenSymbol" "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json"
```

Ви можете знайти адресу облікового запису випуску токенів у експлорері, щоб
переглянути метадані. Наприклад, ось токен, створений із увімкненим розширенням
метаданих, у експлорері
[SolanaFm](https://solana.fm/address/BdhzpzhTD1MFqBiwNdrRy4jFo2FHFufw3n9e8sVjJczP?cluster=devnet-solana).

Дізнатися більше можна у
[Посібнику з Розширення Метаданих](https://solana.com/developers/guides/token-extensions/metadata-pointer).
Деталі щодо різних Розширень Токенів ви знайдете у
[Посібнику Початківця з Розширень Токенів](https://solana.com/developers/guides/token-extensions/getting-started)
та [документації SPL](https://spl.solana.com/token-2022/extensions).
