---
title: Структура програми на Rust
sidebarLabel: Структура програми
description:
  Дізнайтесь, як структуровані програми Solana на Rust, включаючи точки входу,
  управління станом, обробку інструкцій та тестування.
sidebarSortOrder: 1
---

Програми Solana, написані на Rust, мають мінімальні вимоги до структури, що дає
гнучкість у тому, як організовувати код. Єдина вимога — програма повинна мати
`entrypoint`, який визначає точку початку виконання програми.

## Структура програми

Хоча немає строгих правил для структури файлів, програми Solana зазвичай
дотримуються загального шаблону:

- `entrypoint.rs`: Визначає точку входу, яка маршрутизує вхідні інструкції.
- `state.rs`: Визначає стан програми (дані акаунтів).
- `instructions.rs`: Визначає інструкції, які програма може виконувати.
- `processor.rs`: Визначає обробники інструкцій (функції), які реалізують
  бізнес-логіку для кожної інструкції.
- `error.rs`: Визначає користувацькі помилки, які програма може повернути.

Приклади можна знайти в
[Solana Program Library](https://github.com/solana-labs/solana-program-library/tree/master/token/program/src).

## Приклад програми

Щоб продемонструвати, як побудувати рідну програму на Rust з кількома
інструкціями, ми розглянемо просту програму лічильника, яка реалізує дві
інструкції:

1. `InitializeCounter`: Створює і ініціалізує новий акаунт з початковим
   значенням.
2. `IncrementCounter`: Збільшує значення, що зберігається в існуючому акаунті.

Для простоти програма буде реалізована в одному файлі `lib.rs`, хоча на практиці
вам, можливо, захочеться розділити більші програми на кілька файлів.

<Accordion>
<AccordionItem title="Повний код програми">

```rs filename="lib.rs"
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};

// Program entrypoint
entrypoint!(process_instruction);

// Function to route instructions to the correct handler
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Unpack instruction data
    let instruction = CounterInstruction::unpack(instruction_data)?;

    // Match instruction type
    match instruction {
        CounterInstruction::InitializeCounter { initial_value } => {
            process_initialize_counter(program_id, accounts, initial_value)?
        }
        CounterInstruction::IncrementCounter => process_increment_counter(program_id, accounts)?,
    };
    Ok(())
}

// Instructions that our program can execute
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum CounterInstruction {
    InitializeCounter { initial_value: u64 }, // variant 0
    IncrementCounter,                         // variant 1
}

impl CounterInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // Get the instruction variant from the first byte
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        // Match instruction type and parse the remaining bytes based on the variant
        match variant {
            0 => {
                // For InitializeCounter, parse a u64 from the remaining bytes
                let initial_value = u64::from_le_bytes(
                    rest.try_into()
                        .map_err(|_| ProgramError::InvalidInstructionData)?,
                );
                Ok(Self::InitializeCounter { initial_value })
            }
            1 => Ok(Self::IncrementCounter), // No additional data needed
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}

// Initialize a new counter account
fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let counter_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Size of our counter account
    let account_space = 8; // Size in bytes to store a u64

    // Calculate minimum balance for rent exemption
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(account_space);

    // Create the counter account
    invoke(
        &system_instruction::create_account(
            payer_account.key,    // Account paying for the new account
            counter_account.key,  // Account to be created
            required_lamports,    // Amount of lamports to transfer to the new account
            account_space as u64, // Size in bytes to allocate for the data field
            program_id,           // Set program owner to our program
        ),
        &[
            payer_account.clone(),
            counter_account.clone(),
            system_program.clone(),
        ],
    )?;

    // Create a new CounterAccount struct with the initial value
    let counter_data = CounterAccount {
        count: initial_value,
    };

    // Get a mutable reference to the counter account's data
    let mut account_data = &mut counter_account.data.borrow_mut()[..];

    // Serialize the CounterAccount struct into the account's data
    counter_data.serialize(&mut account_data)?;

    msg!("Counter initialized with value: {}", initial_value);

    Ok(())
}

// Update an existing counter's value
fn process_increment_counter(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let counter_account = next_account_info(accounts_iter)?;

    // Verify account ownership
    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Mutable borrow the account data
    let mut data = counter_account.data.borrow_mut();

    // Deserialize the account data into our CounterAccount struct
    let mut counter_data: CounterAccount = CounterAccount::try_from_slice(&data)?;

    // Increment the counter value
    counter_data.count = counter_data
        .count
        .checked_add(1)
        .ok_or(ProgramError::InvalidAccountData)?;

    // Serialize the updated counter data back into the account
    counter_data.serialize(&mut &mut data[..])?;

    msg!("Counter incremented to: {}", counter_data.count);
    Ok(())
}

// Struct representing our counter account's data
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CounterAccount {
    count: u64,
}

#[cfg(test)]
mod test {
    use super::*;
    use solana_program_test::*;
    use solana_sdk::{
        instruction::{AccountMeta, Instruction},
        signature::{Keypair, Signer},
        system_program,
        transaction::Transaction,
    };

    #[tokio::test]
    async fn test_counter_program() {
        let program_id = Pubkey::new_unique();
        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "counter_program",
            program_id,
            processor!(process_instruction),
        )
        .start()
        .await;

        // Create a new keypair to use as the address for our counter account
        let counter_keypair = Keypair::new();
        let initial_value: u64 = 42;

        // Step 1: Initialize the counter
        println!("Testing counter initialization...");

        // Create initialization instruction
        let mut init_instruction_data = vec![0]; // 0 = initialize instruction
        init_instruction_data.extend_from_slice(&initial_value.to_le_bytes());

        let initialize_instruction = Instruction::new_with_bytes(
            program_id,
            &init_instruction_data,
            vec![
                AccountMeta::new(counter_keypair.pubkey(), true),
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
        );

        // Send transaction with initialize instruction
        let mut transaction =
            Transaction::new_with_payer(&[initialize_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Check account data
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Failed to get counter account");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Failed to deserialize counter data");
            assert_eq!(counter.count, 42);
            println!(
                "✅ Counter initialized successfully with value: {}",
                counter.count
            );
        }

        // Step 2: Increment the counter
        println!("Testing counter increment...");

        // Create increment instruction
        let increment_instruction = Instruction::new_with_bytes(
            program_id,
            &[1], // 1 = increment instruction
            vec![AccountMeta::new(counter_keypair.pubkey(), true)],
        );

        // Send transaction with increment instruction
        let mut transaction =
            Transaction::new_with_payer(&[increment_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Check account data
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Failed to get counter account");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Failed to deserialize counter data");
            assert_eq!(counter.count, 43);
            println!("✅ Counter incremented successfully to: {}", counter.count);
        }
    }
}
```

```toml filename="Cargo.toml"
[package]
name = "counter_program"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
borsh = "1.5.1"
solana-program = "1.18.26"

[dev-dependencies]
solana-program-test = "1.18.26"
solana-sdk = "1.18.26"
tokio = "1.41.0"
```

</AccordionItem>
</Accordion>

<Steps>

### Створення нової програми

Спочатку створіть новий проект на Rust, використовуючи стандартну команду
`cargo init` з прапорцем `--lib`.

```shell filename="Terminal"
cargo init counter_program --lib
```

Перейдіть до директорії проекту. Ви повинні побачити стандартні файли
`src/lib.rs` та `Cargo.toml`.

```shell filename="Terminal"
cd counter_program
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
name = "counter_program"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
solana-program = "1.18.26"
```

### Точка входу програми

Точка входу програми Solana — це функція, яка викликається, коли програма
активується. Точка входу має наступне сире визначення, і розробники можуть
створювати власну реалізацію функції точки входу.

Для простоти використовуйте макрос
[`entrypoint!`](https://github.com/solana-labs/solana/blob/v2.0/sdk/program/src/entrypoint.rs#L124-L140)
з бібліотеки `solana_program` для визначення точки входу у вашій програмі.

```rs
#[no_mangle]
pub unsafe extern "C" fn entrypoint(input: *mut u8) -> u64;
```

Замініть стандартний код у файлі `lib.rs` на наступний код. Цей фрагмент:

1. Імпортує необхідні залежності з `solana_program`
2. Визначає точку входу програми за допомогою макросу `entrypoint!`
3. Реалізує функцію `process_instruction`, яка маршрутизує інструкції до
   відповідних функцій обробників

```rs filename="lib.rs" {13} /process_instruction/
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Your program logic
    Ok(())
}
```

Макрос `entrypoint!` вимагає функцію з наступним
[типом підпису](https://github.com/solana-labs/solana/blob/v2.0/sdk/program/src/entrypoint.rs#L28-L29)
як аргумент:

```rs
pub type ProcessInstruction =
    fn(program_id: &Pubkey, accounts: &[AccountInfo], instruction_data: &[u8]) -> ProgramResult;
```

Коли програма Solana викликається, точка входу
[десеріалізує](https://github.com/solana-labs/solana/blob/v2.0/sdk/program/src/entrypoint.rs#L277)
[вхідні дані](https://github.com/solana-labs/solana/blob/v2.0/sdk/program/src/entrypoint.rs#L129-L131)
(надані як байти) у три значення та передає їх до функції
[`process_instruction`](https://github.com/solana-labs/solana/blob/v2.0/sdk/program/src/entrypoint.rs#L132):

- `program_id`: Публічний ключ викликаної програми (поточна програма)
- `accounts`: `AccountInfo` для акаунтів, необхідних для викликаної інструкції
- `instruction_data`: Додаткові дані, передані програмі, які вказують інструкцію
  для виконання та її необхідні аргументи

Ці три параметри безпосередньо відповідають даним, які клієнти повинні надати
при побудові інструкції для виклику програми.

### Визначення стану програми

При створенні програми Solana зазвичай починають з визначення стану програми —
даних, які будуть зберігатися в акаунтах, створених і належних вашій програмі.

Стан програми визначається за допомогою структур Rust, які представляють макет
даних акаунтів програми. Ви можете визначити кілька структур для представлення
різних типів акаунтів вашої програми.

При роботі з акаунтами вам потрібен спосіб перетворювати типи даних вашої
програми в і з сирих байтів, що зберігаються в полі даних акаунту:

- Серіалізація: Перетворення ваших типів даних у байти для збереження в полі
  даних акаунту
- Десеріалізація: Перетворення байтів, збережених в акаунті, назад у ваші типи
  даних

Хоча ви можете використовувати будь-який формат серіалізації для розробки
програм Solana, [Borsh](https://borsh.io/) є загальноприйнятим. Щоб
використовувати Borsh у вашій програмі Solana:

1. Додайте crate `borsh` як залежність до вашого `Cargo.toml`:

```shell filename="Terminal"
cargo add borsh
```

2. Імпортуйте трейди Borsh і використовуйте макрос `derive`, щоб реалізувати
   трейди для ваших структур:

```rust
use borsh::{BorshSerialize, BorshDeserialize};

// Define struct representing our counter account's data
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CounterAccount {
    count: u64,
}
```

Додайте структуру `CounterAccount` до файлу `lib.rs` для визначення стану
програми. Ця структура буде використовуватися як в інструкції ініціалізації, так
і в інструкції збільшення.

```rs filename="lib.rs" {12} {25-29}
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};
use borsh::{BorshSerialize, BorshDeserialize};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Your program logic
    Ok(())
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CounterAccount {
    count: u64,
}
```

### Визначення інструкцій

Інструкції позначають різні операції, які ваша програма Solana може виконувати.
Вважайте їх публічними API вашої програми — вони визначають, які дії користувачі
можуть виконувати при взаємодії з вашою програмою.

Інструкції зазвичай визначаються за допомогою enum на Rust, де:

- Кожен варіант enum представляє різну інструкцію
- Payload варіанту представляє параметри інструкції

Зверніть увагу, що варіанти enum на Rust автоматично нумеруються, починаючи з 0.

Нижче наведено приклад enum, що визначає дві інструкції:

```rust
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum CounterInstruction {
    InitializeCounter { initial_value: u64 }, // variant 0
    IncrementCounter,                         // variant 1
}
```

Коли клієнт викликає вашу програму, він повинен надати дані інструкції (як буфер
байтів), де:

- Перший байт вказує, який варіант інструкції потрібно виконати (0, 1 і т.д.)
- Решта байтів містить серіалізовані параметри інструкції (якщо це необхідно)

Для перетворення даних інструкції (байтів) у варіант enum зазвичай реалізують
допоміжний метод. Цей метод:

1. Розділяє перший байт, щоб отримати варіант інструкції
2. Зіставляє варіант і парсить будь-які додаткові параметри з решти байтів
3. Повертає відповідний варіант enum

Наприклад, метод `unpack` для enum `CounterInstruction`:

```rust
impl CounterInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // Get the instruction variant from the first byte
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        // Match instruction type and parse the remaining bytes based on the variant
        match variant {
            0 => {
                // For InitializeCounter, parse a u64 from the remaining bytes
                let initial_value = u64::from_le_bytes(
                    rest.try_into()
                        .map_err(|_| ProgramError::InvalidInstructionData)?
                );
                Ok(Self::InitializeCounter { initial_value })
            }
            1 => Ok(Self::IncrementCounter), // No additional data needed
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
```

Додайте наступний код до файлу `lib.rs` для визначення інструкцій для програми
лічильника.

```rs filename="lib.rs" {18-46}
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg,
    program_error::ProgramError, pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Your program logic
    Ok(())
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum CounterInstruction {
    InitializeCounter { initial_value: u64 }, // variant 0
    IncrementCounter,                         // variant 1
}

impl CounterInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // Get the instruction variant from the first byte
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        // Match instruction type and parse the remaining bytes based on the variant
        match variant {
            0 => {
                // For InitializeCounter, parse a u64 from the remaining bytes
                let initial_value = u64::from_le_bytes(
                    rest.try_into()
                        .map_err(|_| ProgramError::InvalidInstructionData)?,
                );
                Ok(Self::InitializeCounter { initial_value })
            }
            1 => Ok(Self::IncrementCounter), // No additional data needed
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
```

### Обробники інструкцій

Обробники інструкцій — це функції, які містять бізнес-логіку для кожної
інструкції. Зазвичай функції обробників називаються як
`process_<instruction_name>`, але ви вільні вибрати будь-яку конвенцію
найменувань.

Додайте наступний код до файлу `lib.rs`. Цей код використовує enum
`CounterInstruction` та метод `unpack`, визначений на попередньому кроці, для
маршрутизації вхідних інструкцій до відповідних функцій обробників:

```rs filename="lib.rs" {8-17} {20-32} /process_initialize_counter/1 /process_increment_counter/1
entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Unpack instruction data
    let instruction = CounterInstruction::unpack(instruction_data)?;

    // Match instruction type
    match instruction {
        CounterInstruction::InitializeCounter { initial_value } => {
            process_initialize_counter(program_id, accounts, initial_value)?
        }
        CounterInstruction::IncrementCounter => process_increment_counter(program_id, accounts)?,
    };
}

fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    // Implementation details...
    Ok(())
}

fn process_increment_counter(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    // Implementation details...
    Ok(())
}
```

Далі додайте реалізацію функції `process_initialize_counter`. Цей обробник
інструкції:

1. Створює і виділяє місце для нового акаунту для збереження даних лічильника
2. Ініціалізує дані акаунту з `initial_value`, переданим в інструкцію

<Accordion>
<AccordionItem title="Пояснення">

Функція `process_initialize_counter` вимагає три акаунти:

1. Акаунт лічильника, який буде створено та ініціалізовано
2. Акаунт платника, який профінансує створення нового акаунту
3. System Program, який ми викликаємо для створення нового акаунту

Для визначення акаунтів, необхідних для інструкції, ми створюємо ітератор по
масиву `accounts` та використовуємо функцію `next_account_info`, щоб отримати
кожен акаунт. Кількість акаунтів, яку ви визначаєте, є кількістю акаунтів,
необхідних для інструкції.

Порядок акаунтів має значення — при побудові інструкції на стороні клієнта,
акаунти повинні надаватися в тому ж порядку, в якому вони визначені в програмі,
щоб інструкція виконалася успішно.

Хоча змінні імена акаунтів не впливають на функціональність програми,
рекомендується використовувати описові імена.

```rs filename="lib.rs" {6-10}
fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let counter_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    Ok(())
}
```

Перед створенням акаунту нам потрібно:

1. Вказати простір (у байтах), який потрібно виділити для поля даних акаунту.
   Оскільки ми зберігаємо значення типу u64 (`count`), нам потрібно 8 байтів.

2. Обчислити мінімальний баланс "ренту", необхідний для акаунту. На Solana
   акаунти повинні підтримувати мінімальний баланс лампортів (ренту), що
   залежить від кількості даних, що зберігаються в акаунті.

```rs filename="lib.rs" {12-17}
fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let counter_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Size of our counter account
    let account_space = 8; // Size in bytes to store a u64

    // Calculate minimum balance for rent exemption
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(account_space);

    Ok(())
}
```

Після того, як простір визначено і рент обчислений, створіть акаунт, викликавши
інструкцію `create_account` з System Program.

На Solana нові акаунти можуть бути створені тільки через System Program. При
створенні акаунту ми вказуємо кількість байтів для виділення та
програму-власника нового акаунту. System Program:

1. Створює новий акаунт
2. Виділяє вказаний простір для поля даних акаунту
3. Передає право власності на вказану програму

Цей перехід права власності важливий, оскільки тільки власник акаунту може
змінювати дані акаунту. У цьому випадку ми встановлюємо нашу програму як
власника, що дозволить нам змінювати дані акаунту для збереження значення
лічильника.

Щоб викликати System Program з інструкції нашої програми, ми робимо Cross
Program Invocation (CPI) через функцію `invoke`. CPI дозволяє одній програмі
викликати інструкції інших програм — в цьому випадку інструкцію `create_account`
з System Program.

```rs filename="lib.rs" {19-33}
fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let counter_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Size of our counter account
    let account_space = 8; // Size in bytes to store a u64

    // Calculate minimum balance for rent exemption
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(account_space);

    // Create the counter account
    invoke(
        &system_instruction::create_account(
            payer_account.key,    // Account paying for the new account
            counter_account.key,  // Account to be created
            required_lamports,    // Amount of lamports to transfer to the new account
            account_space as u64, // Size in bytes to allocate for the data field
            program_id,           // Set program owner to our program
        ),
        &[
            payer_account.clone(),
            counter_account.clone(),
            system_program.clone(),
        ],
    )?;

    Ok(())
}
```

Після того, як акаунт створено, ми ініціалізуємо дані акаунту за допомогою:

1. Створення нової структури `CounterAccount` з переданим значенням
   `initial_value`.
2. Отримання змінної посилання на поле даних нового акаунту.
3. Серіалізації структури `CounterAccount` в поле даних акаунту, що ефективно
   зберігає значення `initial_value` в акаунті.

```rs filename="lib.rs" {35-44} /initial_value/
fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let counter_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Size of our counter account
    let account_space = 8; // Size in bytes to store a u64

    // Calculate minimum balance for rent exemption
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(account_space);

    // Create the counter account
    invoke(
        &system_instruction::create_account(
            payer_account.key,    // Account paying for the new account
            counter_account.key,  // Account to be created
            required_lamports,    // Amount of lamports to transfer to the new account
            account_space as u64, // Size in bytes to allocate for the data field
            program_id,           // Set program owner to our program
        ),
        &[
            payer_account.clone(),
            counter_account.clone(),
            system_program.clone(),
        ],
    )?;

    // Create a new CounterAccount struct with the initial value
    let counter_data = CounterAccount {
        count: initial_value,
    };

    // Get a mutable reference to the counter account's data
    let mut account_data = &mut counter_account.data.borrow_mut()[..];

    // Serialize the CounterAccount struct into the account's data
    counter_data.serialize(&mut account_data)?;

    msg!("Counter initialized with value: {}", initial_value);

    Ok(())
}
```

</AccordionItem>
</Accordion>

```rs filename="lib.rs"
// Initialize a new counter account
fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let counter_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Size of our counter account
    let account_space = 8; // Size in bytes to store a u64

    // Calculate minimum balance for rent exemption
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(account_space);

    // Create the counter account
    invoke(
        &system_instruction::create_account(
            payer_account.key,    // Account paying for the new account
            counter_account.key,  // Account to be created
            required_lamports,    // Amount of lamports to transfer to the new account
            account_space as u64, // Size in bytes to allocate for the data field
            program_id,           // Set program owner to our program
        ),
        &[
            payer_account.clone(),
            counter_account.clone(),
            system_program.clone(),
        ],
    )?;

    // Create a new CounterAccount struct with the initial value
    let counter_data = CounterAccount {
        count: initial_value,
    };

    // Get a mutable reference to the counter account's data
    let mut account_data = &mut counter_account.data.borrow_mut()[..];

    // Serialize the CounterAccount struct into the account's data
    counter_data.serialize(&mut account_data)?;

    msg!("Counter initialized with value: {}", initial_value);

    Ok(())
}
```

Далі додайте реалізацію функції `process_increment_counter`. Ця інструкція
збільшує значення існуючого акаунту лічильника.

<Accordion>
<AccordionItem title="Пояснення">

Так само, як і в функції `process_initialize_counter`, ми починаємо з створення
ітератора по акаунтах. У цьому випадку ми очікуємо лише один акаунт, який є
акаунтом, що має бути оновлений.

Зверніть увагу, що на практиці розробник повинен реалізувати різні перевірки
безпеки для валідності акаунтів, переданих до програми. Оскільки всі акаунти
надаються викликачем інструкції, немає гарантії, що надані акаунти — це саме ті
акаунти, які програма очікує. Відсутність перевірок валідності акаунтів є
поширеним джерелом вразливостей програми.

Наведений приклад містить перевірку для того, щоб переконатися, що акаунт, на
який ми посилаємось як `counter_account`, належить виконуючій програмі.

```rs filename="lib.rs" {6-9}
// Update an existing counter's value
fn process_increment_counter(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let counter_account = next_account_info(accounts_iter)?;

    // Verify account ownership
    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    Ok(())
}
```

Щоб оновити дані акаунту, ми:

- Змінно позичаємо поле даних існуючого акаунту
- Десеріалізуємо сирі байти в нашу структуру `CounterAccount`
- Оновлюємо значення `count`
- Серіалізуємо змінену структуру назад у поле даних акаунту

```rs filename="lib.rs" {11-24}
// Update an existing counter's value
fn process_increment_counter(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let counter_account = next_account_info(accounts_iter)?;

    // Verify account ownership
    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Mutable borrow the account data
    let mut data = counter_account.data.borrow_mut();

    // Deserialize the account data into our CounterAccount struct
    let mut counter_data: CounterAccount = CounterAccount::try_from_slice(&data)?;

    // Increment the counter value
    counter_data.count = counter_data
        .count
        .checked_add(1)
        .ok_or(ProgramError::InvalidAccountData)?;

    // Serialize the updated counter data back into the account
    counter_data.serialize(&mut &mut data[..])?;

    msg!("Counter incremented to: {}", counter_data.count);
    Ok(())
}
```

</AccordionItem>
</Accordion>

```rs filename="lib.rs"
// Update an existing counter's value
fn process_increment_counter(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let counter_account = next_account_info(accounts_iter)?;

    // Verify account ownership
    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Mutable borrow the account data
    let mut data = counter_account.data.borrow_mut();

    // Deserialize the account data into our CounterAccount struct
    let mut counter_data: CounterAccount = CounterAccount::try_from_slice(&data)?;

    // Increment the counter value
    counter_data.count = counter_data
        .count
        .checked_add(1)
        .ok_or(ProgramError::InvalidAccountData)?;

    // Serialize the updated counter data back into the account
    counter_data.serialize(&mut &mut data[..])?;

    msg!("Counter incremented to: {}", counter_data.count);
    Ok(())
}
```

### Тестування інструкцій

Для тестування інструкцій програми додайте наступні залежності до файлу
`Cargo.toml`.

```shell filename="Terminal"
cargo add solana-program-test@1.18.26 --dev
cargo add solana-sdk@1.18.26 --dev
cargo add tokio --dev
```

Далі додайте наступний тестовий модуль до файлу `lib.rs` і виконайте команду
`cargo test-sbf` для запуску тестів. За бажанням, використовуйте прапорець
`--nocapture`, щоб побачити виведені дані в результатах.

```shell filename="Термінал"
cargo test-sbf -- --nocapture
```

<Accordion>
<AccordionItem title="Explanation">

Спочатку налаштуйте тестовий модуль і імпортуйте необхідні залежності:

```rs filename="lib.rs"
#[cfg(test)]
mod test {
    use super::*;
    use solana_program_test::*;
    use solana_sdk::{
        instruction::{AccountMeta, Instruction},
        signature::{Keypair, Signer},
        system_program,
        transaction::Transaction,
    };

    #[tokio::test]
    async fn test_counter_program() {
        // Test code will go here
    }
}
```

Далі налаштуйте тест за допомогою `ProgramTest`. Потім створіть нову ключову
пару, яку будемо використовувати як адресу для акаунту лічильника, який ми
ініціалізуємо, і визначте початкове значення, яке встановимо для лічильника.

```rs filename="lib.rs"
#[cfg(test)]
mod test {
    use super::*;
    use solana_program_test::*;
    use solana_sdk::{
        instruction::{AccountMeta, Instruction},
        signature::{Keypair, Signer},
        system_program,
        transaction::Transaction,
    };

    #[tokio::test]
    async fn test_counter_program() {
        let program_id = Pubkey::new_unique();
        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "counter_program",
            program_id,
            processor!(process_instruction),
        )
        .start()
        .await;

        // Create a new keypair to use as the address for our counter account
        let counter_keypair = Keypair::new();
        let initial_value: u64 = 42;
    }
}
```

При побудові інструкції кожен акаунт повинен бути наданий як
[`AccountMeta`](https://github.com/solana-labs/solana/blob/v2.0/sdk/program/src/instruction.rs#L539-L545),
який вказує:

- Публічний ключ акаунту (`Pubkey`)
- `is_writable`: Чи будуть змінюватися дані акаунту
- `is_signer`: Чи повинен акаунт підписати транзакцію

```rs
AccountMeta::new(account1_pubkey, true),           // writable, signer
AccountMeta::new(account2_pubkey, false),          // writable, not signer
AccountMeta::new_readonly(account3_pubkey, false), // not writable, not signer
AccountMeta::new_readonly(account4_pubkey, true),  // writable, signer
```

Для тестування інструкції ініціалізації:

- Створіть дані інструкції з варіантом 0 (`InitializeCounter`) та початковим
  значенням
- Побудуйте інструкцію з ID програми, даними інструкції та необхідними акаунтами
- Відправте транзакцію з інструкцією ініціалізації
- Перевірте, що акаунт був створений з правильним початковим значенням

```rs filename="lib.rs" {16-53}
    #[tokio::test]
    async fn test_counter_program() {
        let program_id = Pubkey::new_unique();
        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "counter_program",
            program_id,
            processor!(process_instruction),
        )
        .start()
        .await;

        // Create a new keypair to use as the address for our counter account
        let counter_keypair = Keypair::new();
        let initial_value: u64 = 42;

        // Step 1: Initialize the counter
        println!("Testing counter initialization...");

        // Create initialization instruction
        let mut init_instruction_data = vec![0]; // 0 = initialize instruction
        init_instruction_data.extend_from_slice(&initial_value.to_le_bytes());

        let initialize_instruction = Instruction::new_with_bytes(
            program_id,
            &init_instruction_data,
            vec![
                AccountMeta::new(counter_keypair.pubkey(), true),
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
        );

        // Send transaction with initialize instruction
        let mut transaction =
            Transaction::new_with_payer(&[initialize_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Check account data
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Failed to get counter account");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Failed to deserialize counter data");
            assert_eq!(counter.count, 42);
            println!(
                "✅ Counter initialized successfully with value: {}",
                counter.count
            );
        }
    }
```

Для тестування інструкції збільшення:

- Побудуйте інструкцію з ID програми, даними інструкції та необхідними акаунтами
- Відправте транзакцію з інструкцією збільшення
- Перевірте, що акаунт був збільшений до правильного значення

Зверніть увагу, що дані інструкції для інструкції збільшення — це `[1]`, що
відповідає варіанту 1 (`IncrementCounter`). Оскільки інструкція збільшення не
має додаткових параметрів, дані — це просто варіант інструкції.

```rs filename="lib.rs" {55-82}
    #[tokio::test]
    async fn test_counter_program() {
        let program_id = Pubkey::new_unique();
        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "counter_program",
            program_id,
            processor!(process_instruction),
        )
        .start()
        .await;

        // Create a new keypair to use as the address for our counter account
        let counter_keypair = Keypair::new();
        let initial_value: u64 = 42;

        // Step 1: Initialize the counter
        println!("Testing counter initialization...");

        // Create initialization instruction
        let mut init_instruction_data = vec![0]; // 0 = initialize instruction
        init_instruction_data.extend_from_slice(&initial_value.to_le_bytes());

        let initialize_instruction = Instruction::new_with_bytes(
            program_id,
            &init_instruction_data,
            vec![
                AccountMeta::new(counter_keypair.pubkey(), true),
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
        );

        // Send transaction with initialize instruction
        let mut transaction =
            Transaction::new_with_payer(&[initialize_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Check account data
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Failed to get counter account");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Failed to deserialize counter data");
            assert_eq!(counter.count, 42);
            println!(
                "✅ Counter initialized successfully with value: {}",
                counter.count
            );
        }

        // Step 2: Increment the counter
        println!("Testing counter increment...");

        // Create increment instruction
        let increment_instruction = Instruction::new_with_bytes(
            program_id,
            &[1], // 1 = increment instruction
            vec![AccountMeta::new(counter_keypair.pubkey(), true)],
        );

        // Send transaction with increment instruction
        let mut transaction =
            Transaction::new_with_payer(&[increment_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Check account data
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Failed to get counter account");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Failed to deserialize counter data");
            assert_eq!(counter.count, 43);
            println!("✅ Counter incremented successfully to: {}", counter.count);
        }
    }
```

</AccordionItem>
</Accordion>

```rs filename="lib.rs"
#[cfg(test)]
mod test {
    use super::*;
    use solana_program_test::*;
    use solana_sdk::{
        instruction::{AccountMeta, Instruction},
        signature::{Keypair, Signer},
        system_program,
        transaction::Transaction,
    };

    #[tokio::test]
    async fn test_counter_program() {
        let program_id = Pubkey::new_unique();
        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "counter_program",
            program_id,
            processor!(process_instruction),
        )
        .start()
        .await;

        // Create a new keypair to use as the address for our counter account
        let counter_keypair = Keypair::new();
        let initial_value: u64 = 42;

        // Step 1: Initialize the counter
        println!("Testing counter initialization...");

        // Create initialization instruction
        let mut init_instruction_data = vec![0]; // 0 = initialize instruction
        init_instruction_data.extend_from_slice(&initial_value.to_le_bytes());

        let initialize_instruction = Instruction::new_with_bytes(
            program_id,
            &init_instruction_data,
            vec![
                AccountMeta::new(counter_keypair.pubkey(), true),
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
        );

        // Send transaction with initialize instruction
        let mut transaction =
            Transaction::new_with_payer(&[initialize_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Check account data
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Failed to get counter account");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Failed to deserialize counter data");
            assert_eq!(counter.count, 42);
            println!(
                "✅ Counter initialized successfully with value: {}",
                counter.count
            );
        }

        // Step 2: Increment the counter
        println!("Testing counter increment...");

        // Create increment instruction
        let increment_instruction = Instruction::new_with_bytes(
            program_id,
            &[1], // 1 = increment instruction
            vec![AccountMeta::new(counter_keypair.pubkey(), true)],
        );

        // Send transaction with increment instruction
        let mut transaction =
            Transaction::new_with_payer(&[increment_instruction], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Check account data
        let account = banks_client
            .get_account(counter_keypair.pubkey())
            .await
            .expect("Failed to get counter account");

        if let Some(account_data) = account {
            let counter: CounterAccount = CounterAccount::try_from_slice(&account_data.data)
                .expect("Failed to deserialize counter data");
            assert_eq!(counter.count, 43);
            println!("✅ Counter incremented successfully to: {}", counter.count);
        }
    }
}
```

Example output:

```shell filename="Terminal" {6} {10}
running 1 test
[2024-10-29T20:51:13.783708000Z INFO  solana_program_test] "counter_program" SBF program from /counter_program/target/deploy/counter_program.so, modified 2 seconds, 169 ms, 153 µs and 461 ns ago
[2024-10-29T20:51:13.855204000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM invoke [1]
[2024-10-29T20:51:13.856052000Z DEBUG solana_runtime::message_processor::stable_log] Program 11111111111111111111111111111111 invoke [2]
[2024-10-29T20:51:13.856135000Z DEBUG solana_runtime::message_processor::stable_log] Program 11111111111111111111111111111111 success
[2024-10-29T20:51:13.856242000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Counter initialized with value: 42
[2024-10-29T20:51:13.856285000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM consumed 3791 of 200000 compute units
[2024-10-29T20:51:13.856307000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM success
[2024-10-29T20:51:13.860038000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM invoke [1]
[2024-10-29T20:51:13.860333000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Counter incremented to: 43
[2024-10-29T20:51:13.860355000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM consumed 756 of 200000 compute units
[2024-10-29T20:51:13.860375000Z DEBUG solana_runtime::message_processor::stable_log] Program 1111111QLbz7JHiBTspS962RLKV8GndWFwiEaqKM success
test test::test_counter_program ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.08s
```

</Steps>
