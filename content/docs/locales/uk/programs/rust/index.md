---
title: Розробка програм на Rust
description:
  Дізнайтеся, як розробляти програми для Solana, використовуючи Rust, включаючи
  покрокові інструкції для створення, збірки, тестування та розгортання
  смарт-контрактів на блокчейні Solana.
sidebarLabel: Програми на Rust
sidebarSortOrder: 1
altRoutes:
  - /docs/programs/lang-rust
---

Програми для Solana в основному розробляються за допомогою мови програмування
Rust. Ця сторінка зосереджена на написанні програм для Solana на Rust без
використання фреймворку Anchor, метод, який часто називають написанням "рідних
програм на Rust".

Розробка рідних програм на Rust дає розробникам повний контроль над їхніми
програмами для Solana. Однак цей підхід вимагає більше ручної налаштування та
шаблонного коду порівняно з використанням фреймворку Anchor. Цей метод
рекомендований для розробників, які:

- Шукають детальний контроль над логікою програми та оптимізаціями
- Хочуть зрозуміти основні концепції, перш ніж переходити до фреймворків вищого
  рівня

Для початківців ми рекомендуємо почати з фреймворку Anchor. Для отримання
додаткової інформації див. розділ [Anchor](/docs/programs/anchor).

## Попередні вимоги

Для детальних інструкцій по установці відвідайте сторінку
[встановлення](/docs/intro/installation).

Перед тим, як почати, переконайтесь, що у вас встановлено наступне:

- Rust: Мова програмування для створення програм для Solana.
- Solana CLI: Інструмент командного рядка для розробки на Solana.

## Початок роботи

Наведений приклад охоплює основні кроки для створення вашої першої програми для
Solana, написаної на Rust. Ми створимо мінімальну програму, яка виводить "Hello,
world!" в журнали програми.

<Steps>

### Створення нової програми

Спочатку створіть новий проект на Rust, використовуючи стандартну команду
`cargo init` з прапорцем `--lib`.

```shell filename="Terminal"
cargo init hello_world --lib
```

Перейдіть до директорії проекту. Ви повинні побачити стандартні файли
`src/lib.rs` та `Cargo.toml`.

```shell filename="Terminal"
cd hello_world
```

Далі додайте залежність `solana-program`. Це мінімальна залежність, необхідна
для побудови програми Solana.

```shell filename="Terminal"
cargo add solana-program@1.18.26
```

Далі додайте наступний фрагмент до файлу `Cargo.toml`. Якщо ви не включите цю
конфігурацію, директорія `target/deploy` не буде згенерована під час збірки
програми.

```toml filename="Cargo.toml"
[lib]
crate-type = ["cdylib", "lib"]
```

Ваш файл `Cargo.toml` повинен виглядати наступним чином:

```toml filename="Cargo.toml"
[package]
name = "hello_world"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
solana-program = "1.18.26"
```

Далі замініть вміст файлу `src/lib.rs` на наступний код. Це мінімальна програма
для Solana, яка виводить "Hello, world!" в журнал програми, коли програма
викликається.

Макрос `msg!` використовується в програмах Solana для виведення повідомлення в
журнал програми.

```rs filename="lib.rs"
use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("Hello, world!");
    Ok(())
}
```

### Збірка програми

Далі побудуйте програму за допомогою команди `cargo build-sbf`.

```shell filename="Terminal"
cargo build-sbf
```

Ця команда генерує директорію `target/deploy`, що містить два важливі файли:

1. Файл `.so` (наприклад, `hello_world.so`): Це зкомпільована програма Solana,
   яка буде розгорнута в мережі як "смарт-контракт".
2. Файл ключової пари (наприклад, `hello_world-keypair.json`): Публічний ключ
   цієї ключової пари використовується як ID програми при розгортанні програми.

Щоб переглянути ID програми, виконайте наступну команду у вашому терміналі. Ця
команда виводить публічний ключ ключової пари за вказаним шляхом до файлу:

```shell filename="Terminal"
solana address -k ./target/deploy/hello_world-keypair.json
```

Example output:

```
4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz
```

### Тестування програми

Далі протестуйте програму за допомогою crate `solana-program-test`. Додайте
наступні залежності до файлу `Cargo.toml`.

```shell filename="Terminal"
cargo add solana-program-test@1.18.26 --dev
cargo add solana-sdk@1.18.26 --dev
cargo add tokio --dev
```

Додайте наступний тест до файлу `src/lib.rs`, під кодом програми. Це тестовий
модуль, який викликає програму hello world.

```rs filename="lib.rs"
#[cfg(test)]
mod test {
    use super::*;
    use solana_program_test::*;
    use solana_sdk::{signature::Signer, transaction::Transaction};

    #[tokio::test]
    async fn test_hello_world() {
        let program_id = Pubkey::new_unique();
        let (mut banks_client, payer, recent_blockhash) =
            ProgramTest::new("hello_world", program_id, processor!(process_instruction))
                .start()
                .await;

        // Create the instruction to invoke the program
        let instruction =
            solana_program::instruction::Instruction::new_with_borsh(program_id, &(), vec![]);

        // Add the instruction to a new transaction
        let mut transaction = Transaction::new_with_payer(&[instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer], recent_blockhash);

        // Process the transaction
        let transaction_result = banks_client.process_transaction(transaction).await;
        assert!(transaction_result.is_ok());
    }
}
```

Запустіть тест за допомогою команди `cargo test-sbf`. У журналі програми буде
виведено "Hello, world!".

```shell filename="Terminal"
cargo test-sbf
```

Example output:

```shell filename="Terminal" {4} /Program log: Hello, world!/
running 1 test
[2024-10-18T21:24:54.889570000Z INFO  solana_program_test] "hello_world" SBF program from /hello_world/target/deploy/hello_world.so, modified 35 seconds, 828 ms, 268 µs and 398 ns ago
[2024-10-18T21:24:54.974294000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM invoke [1]
[2024-10-18T21:24:54.974814000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Hello, world!
[2024-10-18T21:24:54.976848000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM consumed 140 of 200000 compute units
[2024-10-18T21:24:54.976868000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM success
test test::test_hello_world ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.13s
```

### Розгортання програми

Далі розгорніть програму. Під час локальної розробки ми можемо використовувати
`solana-test-validator`.

Спочатку налаштуйте Solana CLI для використання локального кластера Solana.

```shell filename="Terminal"
solana config set -ul
```

Example output:

```
Config File: /.config/solana/cli/config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: /.config/solana/id.json
Commitment: confirmed
```

Відкрийте новий термінал і виконайте команду `solana-test-validator`, щоб
запустити локальний валідатор.

```shell filename="Terminal"
solana-test-validator
```

Поки тестовий валідатор працює, виконайте команду `solana program deploy` в
окремому терміналі, щоб розгорнути програму на локальному валідаторі.

```shell filename="Terminal"
solana program deploy ./target/deploy/hello_world.so
```

Example output:

```
Program Id: 4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz
Signature:
5osMiNMiDZGM7L1e2tPHxU8wdB8gwG8fDnXLg5G7SbhwFz4dHshYgAijk4wSQL5cXiu8z1MMou5kLadAQuHp7ybH
```

Ви можете перевірити ID програми та підпис транзакції на
[Solana Explorer](https://explorer.solana.com/?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899).
Зверніть увагу, що кластер на Solana Explorer також повинен бути localhost.
Опція "Custom RPC URL" на Solana Explorer за замовчуванням встановлюється на
`http://localhost:8899`.

### Виклик програми

Далі ми продемонструємо, як викликати програму, використовуючи Rust клієнт.

Спочатку створіть директорію `examples` та файл `client.rs`.

```shell filename="Terminal"
mkdir -p examples
touch examples/client.rs
```

Додати натсупне до `Cargo.toml`.

```toml filename="Cargo.toml"
[[example]]
name = "client"
path = "examples/client.rs"
```

Додати `solana-client` залежність.

```shell filename="Terminal"
cargo add solana-client@1.18.26 --dev
```

Додайте наступний код до файлу `examples/client.rs`. Це Rust клієнтський скрипт,
який фінансує нову ключову пару для оплати зборів за транзакцію і потім викликає
програму hello world.

```rs filename="example/client.rs"
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    instruction::Instruction,
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    transaction::Transaction,
};
use std::str::FromStr;

#[tokio::main]
async fn main() {
    // Program ID (replace with your actual program ID)
    let program_id = Pubkey::from_str("4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz").unwrap();

    // Connect to the Solana devnet
    let rpc_url = String::from("http://127.0.0.1:8899");
    let client = RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed());

    // Generate a new keypair for the payer
    let payer = Keypair::new();

    // Request airdrop
    let airdrop_amount = 1_000_000_000; // 1 SOL
    let signature = client
        .request_airdrop(&payer.pubkey(), airdrop_amount)
        .expect("Failed to request airdrop");

    // Wait for airdrop confirmation
    loop {
        let confirmed = client.confirm_transaction(&signature).unwrap();
        if confirmed {
            break;
        }
    }

    // Create the instruction
    let instruction = Instruction::new_with_borsh(
        program_id,
        &(),    // Empty instruction data
        vec![], // No accounts needed
    );

    // Add the instruction to new transaction
    let mut transaction = Transaction::new_with_payer(&[instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer], client.get_latest_blockhash().unwrap());

    // Send and confirm the transaction
    match client.send_and_confirm_transaction(&transaction) {
        Ok(signature) => println!("Transaction Signature: {}", signature),
        Err(err) => eprintln!("Error sending transaction: {}", err),
    }
}
```

Перед виконанням скрипту замініть ID програми в наведеному коді на той, що
відповідає вашій програмі.

Ви можете отримати свій ID програми, виконавши наступну команду.

```shell filename="Terminal"
solana address -k ./target/deploy/hello_world-keypair.json
```

```diff
#[tokio::main]
async fn main() {
-     let program_id = Pubkey::from_str("4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz").unwrap();
+     let program_id = Pubkey::from_str("YOUR_PROGRAM_ID).unwrap();
    }
}
```

Run the client script.

```shell filename="Terminal"
cargo run --example client
```

Example output:

```
Transaction Signature: 54TWxKi3Jsi3UTeZbhLGUFX6JQH7TspRJjRRFZ8NFnwG5BXM9udxiX77bAACjKAS9fGnVeEazrXL4SfKrW7xZFYV
```

Ви можете перевірити підпис транзакції на
[Solana Explorer](https://explorer.solana.com/?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899)
(локальний кластер), щоб побачити "Hello, world!" в журналі програми.

### Оновлення програми

Програми Solana можна оновити, повторно розгорнувши їх на той самий ID програми.
Оновіть програму в `src/lib.rs`, щоб виводити "Hello, Solana!" замість "Hello,
world!".

```diff filename="lib.rs"
pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
-   msg!("Hello, world!");
+   msg!("Hello, Solana!");
    Ok(())
}
```

Протестуйте оновлену програму, виконавши команду `cargo test-sbf`.

```shell filename="Terminal"
cargo test-sbf
```

Ви повинні побачити "Hello, Solana!" в журналі програми.

```shell filename="Terminal" {4}
running 1 test
[2024-10-23T19:28:28.842639000Z INFO  solana_program_test] "hello_world" SBF program from /code/misc/delete/hello_world/target/deploy/hello_world.so, modified 4 minutes, 31 seconds, 435 ms, 566 µs and 766 ns ago
[2024-10-23T19:28:28.934854000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM invoke [1]
[2024-10-23T19:28:28.936735000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Hello, Solana!
[2024-10-23T19:28:28.938774000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM consumed 140 of 200000 compute units
[2024-10-23T19:28:28.938793000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM success
test test::test_hello_world ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.14s
```

Виконайте команду `cargo build-sbf`, щоб згенерувати оновлений файл `.so`.

```shell filename="Terminal"
cargo build-sbf
```

Повторно розгорніть програму за допомогою команди `solana program deploy`.

```shell filename="Terminal"
solana program deploy ./target/deploy/hello_world.so
```

Знову виконайте клієнтський код і перевірте підпис транзакції на Solana
Explorer, щоб побачити "Hello, Solana!" в журналі програми.

```shell filename="Terminal"
cargo run --example client
```

### Закриття програми

Ви можете закрити свою програму Solana, щоб повернути SOL, виділені для акаунту.
Закриття програми є незворотним, тому це слід робити обережно.

Щоб закрити програму, використовуйте команду
`solana program close <PROGRAM_ID>`. Наприклад:

```shell filename="Terminal"
solana program close 4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz
--bypass-warning
```

Example output:

```
Closed Program Id 4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz, 0.1350588 SOL
reclaimed
```

Зверніть увагу, що після закриття програми її ID програми не можна буде
використовувати знову. Спроба розгорнути програму з раніше закритим ID програми
призведе до помилки.

```
Error: Program 4Ujf5fXfLx2PAwRqcECCLtgDxHKPznoJpa43jUBxFfMz has been closed, use
a new Program Id
```

Якщо вам потрібно повторно розгорнути програму з тим самим вихідним кодом після
закриття програми, ви повинні згенерувати новий ID програми. Щоб згенерувати
нову ключову пару для програми, виконайте наступну команду:

```shell filename="Terminal"
solana-keygen new -o ./target/deploy/hello_world-keypair.json --force
```

Альтернативно, ви можете видалити існуючий файл ключової пари (наприклад,
`./target/deploy/hello_world-keypair.json`) і знову виконати команду
`cargo build-sbf`, що згенерує новий файл ключової пари.

</Steps>
