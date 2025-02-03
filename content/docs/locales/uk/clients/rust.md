---
sidebarLabel: Rust
title: Rust Клієнт для Solana
sidebarSortOrder: 1
description: Дізнайтеся, як використовувати Rust пакети для розробки в Solana.
---

Rust пакети для Solana
[опубліковані на crates.io](https://crates.io/search?q=solana-) і доступні на
[docs.rs](https://docs.rs/releases/search?query=solana-) з префіксом `solana-`.

<Callout title="Hello World: Початок роботи з розробкою Solana">

Щоб швидко почати розробку в Solana і створити вашу першу програму на Rust,
ознайомтеся з цими детальними посібниками для швидкого старту:

- [Створіть і розгорніть вашу першу програму Solana, використовуючи тільки ваш браузер](/content/guides/getstarted/hello-world-in-your-browser.md).
  Інсталяція не потрібна.
- [Налаштуйте ваше локальне середовище](/docs/uk/intro/installation) і
  використовуйте локальний тестовий валідатор.

</Callout>

## Rust Пакети

Нижче наведено найважливіші та найчастіше використовувані Rust пакети для
розробки в Solana:

- [`solana-program`] &mdash; Імпортується програмами, що працюють у Solana, і
  компілюється до SBF. Цей пакет містить багато фундаментальних типів даних і
  реекспортується з [`solana-sdk`], який не можна імпортувати у програму Solana.

- [`solana-sdk`] &mdash; Базовий SDK для роботи поза мережею, реекспортує
  [`solana-program`] і додає більше API на додаток до цього. Більшість програм
  Solana, що не працюють у мережі, імпортують цей пакет.

- [`solana-client`] &mdash; Для взаємодії з вузлом Solana через
  [JSON RPC API](/docs/uk/rpc).

- [`solana-cli-config`] &mdash; Завантаження та збереження конфігураційного
  файлу Solana CLI.

- [`solana-clap-utils`] &mdash; Рутини для налаштування CLI, використовуючи
  [`clap`], як у основному CLI Solana. Включає функції для завантаження всіх
  типів підписантів, підтримуваних CLI.

[`solana-program`]: https://docs.rs/solana-program
[`solana-sdk`]: https://docs.rs/solana-sdk
[`solana-client`]: https://docs.rs/solana-client
[`solana-cli-config`]: https://docs.rs/solana-cli-config
[`solana-clap-utils`]: https://docs.rs/solana-clap-utils
[`clap`]: https://docs.rs/clap
