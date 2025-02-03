---
title: Installation
seoTitle: Install the Solana CLI and Anchor
sidebarSortOrder: 1
description:
  Покроковий посібник з налаштування локального середовища розробки для Solana.
  Дізнайтеся, як встановити Rust, Solana CLI та Anchor Framework на Windows
  (WSL), Linux і Mac. Включає інструкції зі створення гаманців, запиту airdrop і
  запуску локального валідатора.
altRoutes:
  - /developers/guides/getstarted/setup-local-development
  - /docs/uk/install
  - /install
  - /setup
---

Цей розділ охоплює етапи налаштування локального середовища для розробки на
Solana.

## Встановлення Залежностей

- Користувачі Windows повинні спочатку встановити WSL (Windows Subsystem for
  Linux), а потім встановити залежності, зазначені в розділі Linux нижче.
- Користувачі Linux повинні спочатку встановити залежності, зазначені в розділі
  Linux нижче.
- Користувачі Mac повинні почати з інструкцій з установки Rust нижче.

<Accordion>
<AccordionItem title="Windows Subsystem for Linux (WSL)">

Для розробки програм Solana на Windows **необхідно використовувати
[WSL](https://learn.microsoft.com/en-us/windows/wsl/install)** (Windows
Subsystem for Linux). Усі додаткові залежності необхідно встановлювати через
термінал Linux.

Після встановлення WSL встановіть залежності, зазначені в розділі Linux нижче,
перш ніж переходити до установки Rust, Solana CLI та Anchor CLI.

Щоб встановити WSL, виконайте наступну команду у Windows PowerShell:

```shell
wsl --install
```

Процес встановлення запропонує вам створити обліковий запис користувача за
замовчуванням.

![WSL Install](/assets/docs/intro/installation/wsl-install.png)

За замовчуванням WSL встановлює Ubuntu. Ви можете відкрити термінал Linux,
ввівши "Ubuntu" у пошуковому рядку.

![WSL Ubuntu](/assets/docs/intro/installation/wsl-ubuntu-search.png)

Якщо ваш термінал Ubuntu виглядає так, як на зображенні нижче, ви можете
зіткнутися з проблемою, коли комбінація `ctrl + v` (вставити) не працює у
терміналі.

![Ubuntu Terminal](/assets/docs/intro/installation/wsl-ubuntu-terminal-1.png)

Якщо виникла ця проблема, відкрийте Windows Terminal, ввівши "Terminal" у
пошуковому рядку.

![Windows Terminal](/assets/docs/intro/installation/wsl-windows-terminal.png)

Далі закрийте Windows Terminal і знову відкрийте термінал Linux, ввівши "Ubuntu"
у пошуку. Тепер термінал має виглядати так, як на зображенні нижче, і комбінація
`ctrl + v` (вставити) має працювати.

![Ubuntu Terminal](/assets/docs/intro/installation/wsl-ubuntu-terminal-2.png)

Якщо ви використовуєте VS Code, розширення
[WSL extension](https://code.visualstudio.com/docs/remote/wsl-tutorial) дозволяє
використовувати WSL та VS Code разом.

![WSL Setup in VS Code](/assets/docs/intro/installation/wsl-vscode.png)

У статусному рядку VS Code ви повинні побачити наступне:

![WSL: Ubuntu](/assets/docs/intro/installation/wsl-vscode-ubuntu.png)

Після налаштування WSL всі додаткові залежності потрібно встановлювати через
термінал Linux. Встановіть залежності, зазначені в розділі Linux нижче, перш ніж
переходити до встановлення Rust, Solana CLI та Anchor CLI.

</AccordionItem>
<AccordionItem title="Linux">

Для встановлення Anchor CLI необхідно виконати наступні залежності.

Спочатку виконайте наступну команду:

```shell
sudo apt-get update
```

Далі встановіть наступні залежності:

```shell
sudo apt-get install -y \
    build-essential \
    pkg-config \
    libudev-dev llvm libclang-dev \
    protobuf-compiler libssl-dev
```

Якщо під час встановлення `protobuf-compiler` ви зіткнетеся з такою помилкою,
спочатку переконайтеся, що виконали команду `sudo apt-get update`:

```
Package protobuf-compiler is not available, but is referred to by another package.
This may mean that the package is missing, has been obsoleted, or
is only available from another source
```

</AccordionItem>
</Accordion>

<Steps>

### Встановлення Rust

Програми Solana пишуться на
[мові програмування Rust](https://www.rust-lang.org/).

Рекомендований метод встановлення Rust — це
[rustup](https://www.rust-lang.org/tools/install).

Виконайте наступну команду для встановлення Rust:

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
```

Після завершення встановлення ви повинні побачити таке повідомлення:

<Accordion>
<AccordionItem title="Successful Rust Install Message">

```
Rust is installed now. Great!

To get started you may need to restart your current shell.
This would reload your PATH environment variable to include
Cargo's bin directory ($HOME/.cargo/bin).

To configure your current shell, you need to source
the corresponding env file under $HOME/.cargo.

This is usually done by running one of the following (note the leading DOT):
. "$HOME/.cargo/env"            # For sh/bash/zsh/ash/dash/pdksh
source "$HOME/.cargo/env.fish"  # For fish
```

</AccordionItem>
</Accordion>

Виконайте наступну команду, щоб оновити змінну середовища PATH і включити
директорію `bin` Cargo:

```shell
. "$HOME/.cargo/env"
```

Щоб перевірити, чи встановлення було успішним, перевірте версію Rust:

```shell
rustc --version
```

Ви повинні побачити результат, схожий на наступний:

```
rustc 1.80.1 (3f5fd8dd4 2024-08-06)
```

### Встановлення Solana CLI

Solana CLI надає всі необхідні інструменти для створення та розгортання програм
Solana.

Встановіть набір інструментів Solana CLI за допомогою офіційної команди
встановлення:

```shell
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

Ви можете замінити `stable` на тег релізу, який відповідає версії програмного
забезпечення потрібного релізу (наприклад, `v2.0.3`), або використовувати один
із трьох символічних назв каналів: `stable`, `beta` або `edge`.

Якщо ви встановлюєте Solana CLI вперше, ви можете побачити таке повідомлення із
запитом на додавання змінної середовища PATH:

```
Close and reopen your terminal to apply the PATH changes or run the following in your existing shell:

export PATH="/Users/test/.local/share/solana/install/active_release/bin:$PATH"
```

<Tabs groupId="language" items="Linux, Mac">
<Tab value="Linux">

Якщо ви використовуєте термінал Linux або WSL, ви можете додати змінну
середовища PATH у файл конфігурації вашої оболонки, виконавши команду, зазначену
під час встановлення, або перезапустивши термінал.

```shell
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

</Tab>
<Tab value="Mac">

Якщо ви використовуєте Mac із оболонкою `zsh`, виконання стандартної команди
`export PATH`, зазначеної під час встановлення, не зберігається після закриття
термінала.

Замість цього ви можете додати PATH у файл конфігурації оболонки, виконавши
наступну команду:

```shell
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.zshrc
```

Далі виконайте наступну команду, щоб оновити сесію термінала, або перезапустіть
термінал.

```shell
source ~/.zshrc
```

</Tab>
</Tabs>

Щоб перевірити, чи встановлення було успішним, перевірте версію Solana CLI:

```shell
solana --version
```

Ви повинні побачити результат, схожий на наступний:

```
solana-cli 1.18.22 (src:9efdd74b; feat:4215500110, client:Agave)
```

Ви можете переглянути всі доступні версії у
[репозиторії Agave на Github](https://github.com/anza-xyz/agave/releases).

<Callout>

Agave — це клієнт валідатора від [Anza](https://www.anza.xyz/), раніше відомий
як клієнт валідатора Solana Labs.

</Callout>

Щоб оновити Solana CLI до останньої версії, ви можете використати наступну
команду:

```shell
agave-install update
```

### Встановлення Anchor CLI

[Anchor](https://www.anchor-lang.com/) — це фреймворк для розробки програм на
Solana. Anchor використовує макроси Rust, щоб спростити процес написання програм
на Solana.

Існує два способи встановлення Anchor CLI та інструментів:

1. За допомогою Anchor Version Manager (AVM) — **рекомендований спосіб
   встановлення**, оскільки він спрощує оновлення версій Anchor у майбутньому.
2. Без AVM — вимагає більш ручного процесу для оновлення версій Anchor у
   майбутньому.

<Tabs groupId="anchor" items="AVM, Without AVM">
<Tab value="AVM">

Менеджер версій Anchor (AVM) дозволяє встановлювати та керувати різними версіями
Anchor на вашій системі, включаючи зручне оновлення версій у майбутньому.

Встановіть AVM за допомогою наступної команди:

```shell
cargo install --git https://github.com/coral-xyz/anchor avm --force
```

Перевірте, щоб переконатися, що AVM було встановлено та він доступний:

```shell
avm --version
```

Встановіть останню версію Anchor CLI за допомогою AVM:

```shell
avm install latest
avm use latest
```

Або встановіть конкретну версію Anchor CLI, вказавши бажану версію:

```shell
avm install 0.30.1
avm use 0.30.1
```

> Don't forget to run the `avm use` command to declare which Anchor CLI version
> should be used on your system.
>
> - If you installed the `latest` version, run `avm use latest`.
> - If you installed the version `0.30.1`, run `avm use 0.30.1`.

</Tab>

<Tab value="Without AVM">

Встановіть конкретну версію Anchor CLI за допомогою наступної команди:

```shell
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.1 anchor-cli
```

</Tab>
</Tabs>

Під час встановлення ви можете побачити таке попередження. Однак це не впливає
на процес встановлення.

<Accordion>
<AccordionItem title="warning: unexpected `cfg` condition name: `nightly`">

```
warning: unexpected `cfg` condition name: `nightly`
 --> cli/src/lib.rs:1:13
  |
1 | #![cfg_attr(nightly, feature(proc_macro_span))]
  |             ^^^^^^^
  |
  = help: expected names are: `clippy`, `debug_assertions`, `doc`, `docsrs`, `doctest`, `feature`, `miri`, `overflow_checks`, `panic`, `proc_macro`, `relocation_model`, `rustfmt`, `sanitize`, `sanitizer_cfi_generalize_pointers`, `sanitizer_cfi_normalize_integers`, `target_abi`, `target_arch`, `target_endian`, `target_env`, `target_family`, `target_feature`, `target_has_atomic`, `target_has_atomic_equal_alignment`, `target_has_atomic_load_store`, `target_os`, `target_pointer_width`, `target_thread_local`, `target_vendor`, `test`, `ub_checks`, `unix`, and `windows`
  = help: consider using a Cargo feature instead
  = help: or consider adding in `Cargo.toml` the `check-cfg` lint config for the lint:
           [lints.rust]
           unexpected_cfgs = { level = "warn", check-cfg = ['cfg(nightly)'] }
  = help: or consider adding `println!("cargo::rustc-check-cfg=cfg(nightly)");` to the top of the `build.rs`
  = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
  = note: `#[warn(unexpected_cfgs)]` on by default

warning: `anchor-cli` (lib) generated 1 warning
```

</AccordionItem>
</Accordion>

Щоб перевірити, чи встановлення було успішним, перевірте версію Anchor CLI:

```shell
anchor --version
```

Ви повинні побачити результат, схожий на наступний:

```
anchor-cli 0.30.1
```

Під час встановлення Anchor CLI на Linux або WSL ви можете зіткнутися з такою
помилкою:

```
error: could not exec the linker cc = note: Permission denied (os error 13)
```

Якщо ви бачите це повідомлення про помилку, виконайте наступні кроки:

1. Встановіть залежності, зазначені в розділі Linux на початку цієї сторінки.
2. Повторіть спробу встановлення Anchor CLI.

#### Node.js та Yarn

Node.js та Yarn необхідні для запуску тестового файлу (TypeScript), створеного
за допомогою команди `anchor init`. (Шаблон тестів на Rust також доступний за
допомогою `anchor init --test-template rust`)

<Accordion>
<AccordionItem title="Встановлення Node">

Рекомендований спосіб встановлення Node — використання
[Node Version Manager (nvm)](https://github.com/nvm-sh/nvm).

Встановіть nvm за допомогою наступної команди:

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

Перезапустіть ваш термінал і перевірте, чи встановлено nvm:

```shell
command -v nvm
```

Далі використовуйте `nvm`, щоб встановити Node.js:

```shell
nvm install node
```

Щоб перевірити, чи встановлення було успішним, перевірте версію Node.js:

```
node --version
```

Ви повинні побачити результат, схожий на наступний:

```
v22.7.0
```

</AccordionItem>
<AccordionItem title="Yarn Installation">

Встановіть Yarn:

```shell
npm install --global yarn
```

Щоб перевірити, чи встановлення було успішним, перевірте версію Yarn:

```
yarn --version
```

Ви повинні побачити наступний результат:

```
1.22.1
```

</AccordionItem>
</Accordion>

Під час виконання команди `anchor build`, якщо ви стикаєтеся з такими помилками:

<Accordion>
<AccordionItem title="error: not a directory">

```
error: not a directory: '.../solana-release/bin/sdk/sbf/dependencies/platform-tools/rust/lib'
```

Спробуйте ці рішення:

1. Примусове встановлення за допомогою наступної команди:

```shell
cargo build-sbf --force-tools-install
```

2. Якщо це не спрацювало, очистіть кеш Solana:

```shell
rm -rf ~/.cache/solana/*
```

</AccordionItem>

<AccordionItem title="lock file version 4 requires `-Znext-lockfile-bump">

Ви можете виправити це, змінивши поле версії у файлі `Cargo.lock`:

```
version = 3
```

Дивіться [це обговорення](https://github.com/coral-xyz/anchor/issues/3392) для
отримання додаткової інформації.

</AccordionItem>

</Accordion>

Після застосування будь-якого з рішень спробуйте знову виконати команду
`anchor build`.

Якщо ви використовуєте Linux або WSL і стикаєтеся з такими помилками під час
виконання команди `anchor test` після створення нового проєкту Anchor, це може
бути через відсутність Node.js або Yarn:

```
Permission denied (os error 13)
```

```
No such file or directory (os error 2)
```

</Steps>

## Основи Solana CLI

Цей розділ ознайомить вас із деякими поширеними командами Solana CLI для початку
роботи.

<Steps>

### Конфігурація Solana

Щоб переглянути вашу поточну конфігурацію:

```shell
solana config get
```

Ви повинні побачити результат, схожий на наступний:

```
Config File: /Users/test/.config/solana/cli/config.yml
RPC URL: https://api.mainnet-beta.solana.com
WebSocket URL: wss://api.mainnet-beta.solana.com/ (computed)
Keypair Path: /Users/test/.config/solana/id.json
Commitment: confirmed
```

RPC URL та Websocket URL вказують кластер Solana, до якого CLI надсилатиме
запити. За замовчуванням це буде mainnet-beta.

Ви можете оновити кластер Solana CLI за допомогою наступних команд:

```
solana config set --url mainnet-beta
solana config set --url devnet
solana config set --url localhost
solana config set --url testnet
```

Ви також можете використовувати наступні скорочені опції:

```
solana config set -um    # For mainnet-beta
solana config set -ud    # For devnet
solana config set -ul    # For localhost
solana config set -ut    # For testnet
```

Шлях до ключової пари (Keypair Path) вказує розташування гаманця за
замовчуванням, який використовується Solana CLI (для оплати комісій за
транзакції та розгортання програм). Шлях за замовчуванням:
`~/.config/solana/id.json`. У наступному кроці описано, як створити ключову пару
за цим шляхом.

### Створення Гаманця

Для взаємодії з мережею Solana за допомогою Solana CLI вам потрібен гаманець
Solana, поповнений SOL.

Щоб створити ключову пару за замовчуванням у Keypair Path, виконайте наступну
команду:

```shell
solana-keygen new
```

Ви повинні побачити результат, схожий на наступний:

```
Generating a new keypair

For added security, enter a BIP39 passphrase

NOTE! This passphrase improves security of the recovery seed phrase NOT the
keypair file itself, which is stored as insecure plain text

BIP39 Passphrase (empty for none):

Wrote new keypair to /Users/test/.config/solana/id.json
===========================================================================
pubkey: 8dBTPrjnkXyuQK3KDt9wrZBfizEZijmmUQXVHpFbVwGT
===========================================================================
Save this seed phrase and your BIP39 passphrase to recover your new keypair:
cream bleak tortoise ocean nasty game gift forget fancy salon mimic amazing
===========================================================================
```

<Callout type="note">

Якщо у вас вже є гаманець у файловій системі, збережений у місці за
замовчуванням, ця команда **НЕ** перезапише його, якщо ви явно не використаєте
прапорець `--force`.

</Callout>

Після створення ключової пари ви можете отримати адресу (публічний ключ) цієї
пари за допомогою наступної команди:

```shell
solana address
```

### Airdrop SOL

Після налаштування локального гаманця запросіть airdrop SOL для поповнення
вашого гаманця. SOL потрібні для оплати комісій за транзакції та розгортання
програм.

Встановіть ваш кластер на devnet:

```shell
solana config set -ud
```

Далі запросіть airdrop SOL у devnet:

```shell
solana airdrop 2
```

Щоб перевірити баланс SOL вашого гаманця, виконайте наступну команду:

```shell
solana balance
```

<Callout>

Команда `solana airdrop` наразі обмежена 5 SOL за запит у devnet. Помилки можуть
виникати через обмеження частоти запитів.

Як альтернативу, ви можете отримати SOL у devnet за допомогою
[Solana Web Faucet](https://faucet.solana.com).

</Callout>

### Запуск Локального Валідатора

Solana CLI постачається з вбудованим
[тестовим валідатором](https://docs.anza.xyz/cli/examples/test-validator).
Запуск локального валідатора дозволить вам розгортати та тестувати програми
локально.

У окремому терміналі виконайте наступну команду, щоб запустити локальний
валідатор:

```shell
solana-test-validator
```

<Callout>

У WSL вам може знадобитися спочатку перейти до папки, де у вас є права запису за
замовчуванням:

```shell
cd ~
mkdir validator
cd validator
solana-test-validator
```

</Callout>

Переконайтеся, що оновили конфігурацію Solana CLI до `localhost` перед
виконанням команд:

```shell
solana config set -ul
```

</Steps>
