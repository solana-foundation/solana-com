---
title: "Приклади програм"
description:
  "Список прикладів програм для Solana на різних мовах і фреймворках, які можуть
  допомогти вам вивчити та використовувати їх як посилання для ваших власних
  проектів."
tags:
  - quickstart
  - program
  - anchor
  - javascript
  - native
  - rust
  - token22
  - token extensions
keywords:
  - rust
  - cargo
  - toml
  - program
  - tutorial
  - intro to solana development
  - blockchain developer
  - blockchain tutorial
  - web3 developer
  - anchor
sidebarSortOrder: 3
---

Репозиторій
[Solana Program Examples](https://github.com/solana-developers/program-examples)
на GitHub пропонує кілька підпапок, кожна з яких містить приклади коду для
різних парадигм програмування Solana та мов, створених, щоб допомогти
розробникам вивчати та експериментувати з розробкою на блокчейні Solana.

Ви можете знайти приклади в репозиторії `solana-developers/program-examples`
разом з файлами README, що пояснюють, як запускати різні приклади. Більшість
прикладів є самодостатніми та доступні на рідному Rust (тобто без використання
фреймворку) та [Anchor](https://www.anchor-lang.com/docs/installation). Також є
список прикладів, які ми з радістю б
[побачили як внески](https://github.com/solana-developers/program-examples?tab=readme-ov-file#examples-wed-love-to-see).

У репозиторії ви знайдете наступну підпапку, кожну з яких з різними прикладами
програм:

- [Основи](#basics)
- [Стиснення](#compression)
- [Оракули](#oracles)
- [Токени](#tokens)
- [Token 2022 (Розширення токенів)](#token-2022-token-extensions)
- [Перерва](#break)
  - [Збірка та запуск](#build-and-run)

## Основи

Містить серію прикладів, які демонструють основні кроки для створення програм
Solana, використовуючи рідні бібліотеки Rust. Ці приклади призначені для того,
щоб допомогти розробникам зрозуміти основні концепції програмування Solana.

| Назва прикладу                                                                                                                    | Опис                                                                                        | Мова                      |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------- |
| [Дані акаунта](https://github.com/solana-developers/program-examples/tree/main/basics/account-data)                               | Збереження адреси з ім'ям, номером будинку, вулицею та містом в акаунті.                    | Native, Anchor            |
| [Перевірка акаунтів](https://github.com/solana-developers/program-examples/tree/main/basics/checking-accounts)                    | Уроки безпеки, що показують, як виконувати перевірки акаунтів                               | Native, Anchor            |
| [Закриття акаунта](https://github.com/solana-developers/program-examples/tree/main/basics/close-account)                          | Показує, як закривати акаунти, щоб повернути оренду.                                        | Native, Anchor            |
| [Лічильник](https://github.com/solana-developers/program-examples/tree/main/basics/counter)                                       | Простий програмний лічильник на всіх різних архітектурах.                                   | Native, Anchor, mpl-stack |
| [Створення акаунта](https://github.com/solana-developers/program-examples/tree/main/basics/create-account)                        | Як створити системний акаунт в межах програми.                                              | Native, Anchor            |
| [Перехресний виклик програми](https://github.com/solana-developers/program-examples/tree/main/basics/cross-program-invocation)    | Використовуючи аналогію з рукою та важелем, показує, як викликати іншу програму з програми. | Native, Anchor            |
| [Hello Solana](https://github.com/solana-developers/program-examples/tree/main/basics/hello-solana)                               | Приклад "Hello world", який просто виводить hello world у журналах транзакцій.              | Native, Anchor            |
| [Pda Rent payer](https://github.com/solana-developers/program-examples/tree/main/basics/pda-rent-payer)                           | Показує, як можна використовувати лампорти з PDA для оплати нового акаунта.                 | Native, Anchor            |
| [Обробка інструкцій](https://github.com/solana-developers/program-examples/tree/main/basics/processing-instructions)              | Показує, як обробляти рядкові дані інструкцій та u32.                                       | Native, Anchor            |
| [Програма з похідними адресами](https://github.com/solana-developers/program-examples/tree/main/basics/program-derived-addresses) | Показує, як використовувати насіння для посилання на PDA та збереження даних в ньому.       | Native, Anchor            |
| [Перерозподіл](https://github.com/solana-developers/program-examples/tree/main/basics/realloc)                                    | Показує, як збільшувати та зменшувати розмір існуючого акаунта.                             | Native, Anchor            |
| [Оренда](https://github.com/solana-developers/program-examples/tree/main/basics/rent)                                             | Тут ви дізнаєтесь, як обчислювати вимоги оренди в межах програми.                           | Native, Anchor            |
| [Розташування репозиторію](https://github.com/solana-developers/program-examples/tree/main/basics/repository-layout)              | Рекомендації щодо структурування вашого макету програми.                                    | Native, Anchor            |
| [Передача SOL](https://github.com/solana-developers/program-examples/tree/main/basics/transfer-sol)                               | Різні методи передачі SOL для системних акаунтів та PDA.                                    | Native, Anchor, Seahorse  |

## Стиснення

Містить серію прикладів, які демонструють, як використовувати
[стиснення стану](/docs/advanced/state-compression.md) на Solana. Головним чином
фокусується на стиснених NFT (cNFT).

| Назва прикладу                                                                                              | Опис                                                                                     | Мова   |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------ |
| [cNFT-burn](https://github.com/solana-developers/program-examples/tree/main/compression/cnft-burn)          | Для знищення cNFT він може бути спалений. Цей приклад показує, як це зробити в програмі. | Anchor |
| [cNFT-Vault](https://github.com/solana-developers/program-examples/tree/main/compression/cnft-vault/anchor) | Як зберігати cNFT в програмі та відправляти його знову.                                  | Anchor |
| [cutils](https://github.com/solana-developers/program-examples/tree/main/compression/cutils)                | Набір утиліт для, наприклад, мінтування та перевірки cNFT в програмі.                    | Anchor |

## Оракули

Оракули дозволяють використовувати дані поза ланцюгом в програмах.

| Назва прикладу                                                                       | Опис                                                                      | Мова   |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | ------ |
| [Pyth](https://github.com/solana-developers/program-examples/tree/main/oracles/pyth) | Pyth надає дані про ціни токенів для використання в програмах на ланцюгу. | Anchor |

## Токени

Більшість токенів на Solana використовують стандарт токенів Solana Program
Library (SPL). Тут ви знайдете багато прикладів, як створювати, передавати,
спалювати токени та навіть як взаємодіяти з ними в програмах.

| Назва прикладу                                                                                                  | Опис                                                                                                     | Мова           |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------- |
| [Створення токена](https://github.com/solana-developers/program-examples/tree/main/tokens/create-token)         | Як створити токен та додати метадані метаплекса до нього.                                                | Anchor, Native |
| [NFT Minter](https://github.com/solana-developers/program-examples/tree/main/tokens/nft-minter)                 | Мінтування тільки однієї кількості токену, а потім видалення права на мінтинг.                           | Anchor, Native |
| [PDA Mint Authority](https://github.com/solana-developers/program-examples/tree/main/tokens/pda-mint-authority) | Показує, як змінити право на мінтинг токенів через PDA.                                                  | Anchor, Native |
| [SPL Token Minter](https://github.com/solana-developers/program-examples/tree/main/tokens/spl-token-minter)     | Пояснює, як використовувати Associated Token Accounts для відслідковування токен акаунтів.               | Anchor, Native |
| [Token Swap](https://github.com/solana-developers/program-examples/tree/main/tokens/token-swap)                 | Розширений приклад, який показує, як побудувати AMM (автоматизований маркет-мейкер) пул для SPL токенів. | Anchor         |
| [Передача токенів](https://github.com/solana-developers/program-examples/tree/main/tokens/transfer-tokens)      | Показує, як передавати SPL токени за допомогою CPIs у програму токенів.                                  | Anchor, Native |
| [Token-2022](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022)                 | Див. Token 2022 (Розширення токенів).                                                                    | Anchor, Native |

## Token 2022 (Розширення токенів)

Token 2022 — це новий стандарт для токенів на Solana. Це більш гнучкий стандарт,
який дозволяє додавати до токену 16 різних розширень для додавання більшої
функціональності.

| Назва прикладу                                                                                                                             | Опис                                                                                                            | Мова   |
| ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ------ |
| [Основи](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/basics/anchor)                                  | Як створити токен, мінтувати та передавати його.                                                                | Anchor |
| [Стандартний стан акаунта](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/default-account-state/native) | Це розширення дозволяє створювати акаунти токенів з певним станом, наприклад замороженими.                      | Native |
| [Право закриття мінта](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/mint-close-authority)             | З старою програмою токенів не було можливості закривати мінт. Тепер це можливо.                                 | Native |
| [Багато розширень](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/multiple-extensions)                  | Показує, як додавати кілька розширень до одного мінта                                                           | Native |
| [Вказівник метаданих NFT](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/nft-meta-data-pointer)         | Можна використовувати розширення метаданих для створення NFT та додавання динамічних метаданих на ланцюг.       | Anchor |
| [Не передаваємий](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/non-transferable/native)               | Корисно, наприклад, для досягнень, програм рефералів або будь-яких токенів, які не можна передавати.            | Native |
| [Плата за передачу](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/transfer-fees)                       | Кожна передача токенів утримує певну кількість токенів у акаунті токена, яку потім можна забрати.               | Native |
| [Transfer Hook](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/transfer-hook)                           | Чотири приклади для додавання додаткової функціональності до вашого токена за допомогою CPI з програми токенів. | Anchor |

## Break

[Break](https://break.solana.com/) — це додаток на React, який дає користувачам
можливість відчути, наскільки швидко і ефективно працює мережа Solana. Чи
зможете ви _зламати_ блокчейн Solana? Протягом 15 секунд кожне натискання кнопки
або клавіші відправляє нову транзакцію в кластер. Ударте по клавіатурі так
швидко, як можете, і дивіться, як ваші транзакції підтверджуються в реальному
часі, поки мережа справляється з усім!

Break можна грати на наших мережах Devnet, Testnet та Mainnet Beta. Ігри
безкоштовні на Devnet і Testnet, де сесія фінансується мережевим фонтаном. На
Mainnet Beta користувачі платять 0,08 SOL за гру. Сесійний акаунт можна
фінансувати через локальний гаманець keystore або скануючи QR-код з Trust Wallet
для переміщення токенів.

[Клацніть тут, щоб зіграти в Break](https://break.solana.com/)

### Збірка та запуск

Спочатку отримайте останню версію прикладів коду:

```shell
git clone https://github.com/solana-labs/break.git
cd break
```

Дотримуйтесь кроків у файлі
[README](https://github.com/solana-labs/break/blob/main/README.md) репозиторію.
