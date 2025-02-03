---
title: Початок роботи з Anchor
description:
  Дізнайтесь, як будувати програми для Solana за допомогою фреймворку Anchor.
  Цей детальний посібник охоплює створення, збірку, тестування та розгортання
  смарт-контрактів Solana з використанням Anchor.
sidebarLabel: Фреймворк Anchor
sidebarSortOrder: 0
altRoutes:
  - /docs/programs/debugging
  - /docs/programs/lang-c
  - /docs/programs/overview
---

Фреймворк Anchor — це інструмент, який спрощує процес створення програм для
Solana. Неважливо, чи ви новачок у блокчейн-розробці, чи досвідчений програміст,
Anchor спрощує процес написання, тестування та розгортання програм для Solana.

У цьому розділі ми розглянемо:

- Створення нового проекту Anchor
- Збірка та тестування вашої програми
- Розгортання на кластерах Solana
- Розуміння структури файлів проекту

## Попередні вимоги

Для детальних інструкцій по установці відвідайте сторінку
[встановлення](/docs/intro/installation).

Перед тим, як почати, переконайтесь, що у вас встановлено наступне:

- Rust: Мова програмування для створення програм для Solana.
- Solana CLI: Інструмент командного рядка для розробки на Solana.
- Anchor CLI: Інструмент командного рядка для фреймворку Anchor.

Щоб перевірити встановлення Anchor CLI, відкрийте термінал і виконайте:

```shell filename="Terminal"
anchor --version
```

Очікуваний результат:

```shell filename="Terminal"
anchor-cli 0.30.1
```

## Початок роботи

Цей розділ охоплює основні кроки для створення, зборки та тестування вашої
першої локальної програми на Anchor.

<Steps>

### Створення нового проекту

Щоб почати новий проект, використовуйте команду `anchor init`, після якої
вкажіть назву вашого проекту. Ця команда створює нову директорію з вказаним
ім'ям і налаштовує стандартну програму та тестовий файл.

```shell filename="Terminal"
anchor init my-project
```

Перейдіть до нової директорії проекту та відкрийте її у вашому редакторі коду.

```shell filename="Terminal" copy
cd my-project
```

Стандартна програма Anchor знаходиться за адресою
`programs/my-project/src/lib.rs`.

<Accordion>
<AccordionItem title="Стандартна програма">

Значення в макросі `declare_id!` є ID програми, унікальним ідентифікатором для
вашої програми.

За замовчуванням це публічний ключ ключової пари, згенерованої в
`/target/deploy/my_project-keypair.json`.

```rs filename="lib.rs"
use anchor_lang::prelude::*;

declare_id!("3ynNB373Q3VAzKp7m4x238po36hjAGFXFJB4ybN2iTyg");

#[program]
pub mod my_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
```

</AccordionItem>
</Accordion>

Стандартний тестовий файл TypeScript знаходиться за адресою
`/tests/my-project.ts`.

<Accordion>
<AccordionItem title="Стандартний тестовий файл">

Цей файл демонструє, як викликати інструкцію `initialize` стандартної програми в
TypeScript.

```ts filename="my-project.ts"
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MyProject } from "../target/types/my_project";

describe("my-project", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MyProject as Program<MyProject>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
```

</AccordionItem>
</Accordion>

Якщо ви віддаєте перевагу Rust для тестування, ініціалізуйте свій проект за
допомогою прапорця `--test-template rust`.

```shell
anchor init --test-template rust my-project
```

Тестовий файл Rust буде знаходитися за адресою `/tests/src/test_initialize.rs`.

<Accordion>
<AccordionItem title="Rust Test File">

```rust filename="test_initialize.rs"
use std::str::FromStr;

use anchor_client::{
    solana_sdk::{
        commitment_config::CommitmentConfig, pubkey::Pubkey, signature::read_keypair_file,
    },
    Client, Cluster,
};

#[test]
fn test_initialize() {
    let program_id = "3ynNB373Q3VAzKp7m4x238po36hjAGFXFJB4ybN2iTyg";
    let anchor_wallet = std::env::var("ANCHOR_WALLET").unwrap();
    let payer = read_keypair_file(&anchor_wallet).unwrap();

    let client = Client::new_with_options(Cluster::Localnet, &payer, CommitmentConfig::confirmed());
    let program_id = Pubkey::from_str(program_id).unwrap();
    let program = client.program(program_id).unwrap();

    let tx = program
        .request()
        .accounts(my_program::accounts::Initialize {})
        .args(my_program::instruction::Initialize {})
        .send()
        .expect("");

    println!("Your transaction signature {}", tx);
}
```

</AccordionItem>
</Accordion>

### Збірка програми

Зібрати програму можна, виконавши команду `anchor build`.

```shell filename="Terminal" copy
anchor build
```

Зкомпільована програма буде знаходитися за адресою
`/target/deploy/my_project.so`. Вміст цього файлу буде збережено в мережі Solana
(як виконуваний акаунт) під час розгортання вашої програми.

### Тестування програми

Для тестування програми виконайте команду `anchor test`.

```shell filename="Terminal" copy
anchor test
```

За замовчуванням конфігураційний файл `Anchor.toml` вказує на кластер
`localnet`. При розробці на `localnet`, команда `anchor test` автоматично:

1. Запускає локальний валідатор Solana
2. Створює та розгортає вашу програму на локальному кластері
3. Виконує тести з папки `tests`
4. Зупиняє локальний валідатор Solana

Альтернативно, ви можете вручну запустити локальний валідатор Solana та
виконувати тести проти нього. Це корисно, якщо ви хочете, щоб валідатор
працював, поки ви працюєте над програмою. Це дозволяє вам перевіряти акаунти та
журнали транзакцій на
[Solana Explorer](https://explorer.solana.com/?cluster=custom) під час розробки
локально.

Відкрийте новий термінал і запустіть локальний валідатор Solana, виконуючи
команду `solana-test-validator`.

```shell filename="Terminal" copy
solana-test-validator
```

У окремому терміналі виконайте тести проти локального кластера. Використовуйте
прапорець `--skip-local-validator`, щоб пропустити запуск локального валідатора,
оскільки він уже працює.

```shell filename="Terminal" copy
anchor test --skip-local-validator
```

### Розгортання на Devnet

За замовчуванням конфігураційний файл `Anchor.toml` у проекті Anchor вказує на
кластер localnet.

```toml filename="Anchor.toml" {14}
[toolchain]

[features]
resolution = true
skip-lint = false

[programs.localnet]
my_program = "3ynNB373Q3VAzKp7m4x238po36hjAGFXFJB4ybN2iTyg"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

Щоб розгорнути вашу програму на devnet, змініть значення `cluster` на `Devnet`.
Зверніть увагу, що для цього ваш гаманець повинен мати достатньо SOL на Devnet
для покриття вартості розгортання.

```diff
-cluster = "Localnet"
+cluster = "Devnet"
```

```toml filename="Anchor.toml"
[provider]
cluster = "Devnet"
wallet = "~/.config/solana/id.json"
```

Тепер, коли ви виконаєте команду `anchor deploy`, ваша програма буде розгорнута
на кластері devnet. Команда `anchor test` також використовуватиме кластер,
вказаний у файлі `Anchor.toml`.

```shell
anchor deploy
```

Щоб розгорнути на mainnet, просто оновіть файл `Anchor.toml`, вказавши кластер
mainnet.

```toml filename="Anchor.toml"
[provider]
cluster = "Mainnet"
wallet = "~/.config/solana/id.json"
```

### Оновлення програми

Програми Solana можна оновити, повторно розгорнувши програму з тим самим ID
програми.

Щоб оновити програму, просто внесіть зміни в код вашої програми і виконайте
команду `anchor build` для генерації оновленого файлу `.so`.

```shell
anchor build
```

Потім виконайте команду `anchor deploy`, щоб повторно розгорнути оновлену
програму.

```shell
anchor deploy
```

### Закриття програми

Щоб повернути SOL, виділені на акаунт програми, ви можете закрити вашу програму
Solana.

Для закриття програми використовуйте команду
`solana program close <PROGRAM_ID>`. Наприклад:

```shell
solana program close 3ynNB373Q3VAzKp7m4x238po36hjAGFXFJB4ybN2iTyg --bypass-warning
```

Зверніть увагу, що після закриття програми, ID програми не можна буде
використовувати для розгортання нової програми.

</Steps>

## Структура файлів проекту

Нижче наведено огляд стандартної структури файлів у робочому просторі Anchor:

```
.
├── .anchor
│   └── program-logs
├── app
├── migrations
├── programs
│   └── [project-name]
│       └── src
│           ├── lib.rs
│           ├── Cargo.toml
│           └── Xargo.toml
├── target
│   ├── deploy
│   │   └── [project-name]-keypair.json
│   ├── idl
│   │   └── [project-name].json
│   └── types
│       └── [project-name].ts
├── tests
│   └── [project-name].ts
├── Anchor.toml
├── Cargo.toml
└── package.json
```

### Папка Programs

Папка `/programs` містить програми Anchor вашого проекту. Один робочий простір
може містити кілька програм.

### Папка Tests

Папка `/tests` містить тестові файли для вашого проекту. Стандартний тестовий
файл створюється автоматично під час створення вашого проекту.

### Папка Target

Папка `/target` містить результати збірки. Основні підпапки включають:

- `/deploy`: Містить ключову пару та бінарний файл програми для ваших програм.
- `/idl`: Містить JSON IDL для ваших програм.
- `/types`: Містить TypeScript тип для IDL.

### Файл Anchor.toml

Файл `Anchor.toml` налаштовує параметри робочого простору для вашого проекту.

### Папка .anchor

Містить файл `program-logs`, що містить журнали транзакцій з останнього
виконання тестових файлів.

### Папка App

Папка `/app` є порожньою і може бути опційно використана для вашого
фронтенд-коду.
