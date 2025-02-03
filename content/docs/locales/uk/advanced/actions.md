---
sidebarLabel: "Дії та Блінки"
title: "Дії та Блінки"
seoTitle: "Дії та Блінки"
description:
  "Дії Solana — це API, які повертають транзакції для попереднього перегляду і
  підпису користувачами. Посилання на блокчейн — або блінки — перетворюють дії в
  зручні, багаті на метадані посилання для спільного використання."
altRoutes:
  - /docs/actions
  - /docs/blinks
  - /docs/advanced/blinks
---

[Дії Solana](#actions) — це API, які відповідають специфікації і повертають
транзакції в блокчейні Solana для попереднього перегляду, підпису та відправки.
Вони можуть використовуватися в різних контекстах, таких як QR-коди, кнопки,
віджети та вебсайти. Дії дозволяють розробникам легко інтегрувати функціонал
екосистеми Solana у свій додаток, дозволяючи виконувати блокчейн-транзакції без
необхідності переходу на інші сторінки або додатки.

[Посилання на блокчейн](#blinks) — або блінки — перетворюють будь-яку дію Solana
в зручне посилання, багате метаданими. Блінки дозволяють клієнтам, які
підтримують їх, (таким як гаманці або боти) відображати додаткові функціональні
можливості. Наприклад, на вебсайті блінк може негайно відкрити попередній
перегляд транзакції у гаманці, а в Discord бот може перетворити блінк на
інтерактивні кнопки. Це забезпечує взаємодію з блокчейном на будь-якій
платформі, що підтримує URL.

## Початок роботи

Щоб швидко почати створювати власні дії Solana:

```shell
npm install @solana/actions
```

- встановіть [Solana Actions SDK](https://www.npmjs.com/package/@solana/actions)
  у вашому додатку
- створіть API-ендпойнт для [GET-запиту](#get-request), який повертає метадані
  про вашу дію
- створіть API-ендпойнт для [POST-запиту](#post-request), який повертає
  транзакцію для підпису користувачем

> Перегляньте цей відеоурок про
> [створення дії Solana](https://www.youtube.com/watch?v=kCht01Ycif0) за
> допомогою `@solana/actions` SDK.
>
> Ви також можете знайти
> [вихідний код дії](https://github.com/solana-developers/solana-actions/blob/main/examples/next-js/src/app/api/actions/transfer-sol/route.ts),
> яка виконує нативний переказ SOL, а також інші приклади дій у
> [цьому репозиторії](https://github.com/solana-developers/solana-actions/tree/main/examples).

Під час розгортання власних дій Solana у продакшн:

- переконайтеся, що ваш додаток має дійсний файл [actions.json](#actionsjson) у
  корені вашого домену
- переконайтеся, що ваш додаток відповідає
  [необхідним заголовкам CORS](#options-response) для всіх ендпойнтів дій,
  включаючи файл `actions.json`
- тестуйте та налагоджуйте свої блінки/дії за допомогою
  [Blinks Inspector](https://www.blinks.xyz/inspector)

Якщо ви шукаєте натхнення для створення дій та блінків, перегляньте
[Awesome Blinks](https://github.com/solana-developers/awesome-blinks) —
репозиторій із прикладами створених спільнотою блінків та
[ідеями для нових](https://github.com/solana-developers/awesome-blinks/discussions/categories/ideas-for-blinks).

## Дії

Специфікація дій Solana використовує набір стандартних API для передачі
транзакцій (та, зрештою, повідомлень) для підпису безпосередньо користувачам. Ці
API доступні за публічними URL, які можуть взаємодіяти з будь-якими клієнтами.

> Дії можна уявити як API-ендпойнт, який повертає метадані та об'єкт для підпису
> користувачем (транзакцію або повідомлення для аутентифікації) за допомогою їх
> блокчейн-гаманця.

API дій складається з простих `GET` і `POST` запитів до URL-ендпойнтів дій та
обробки відповідей, які відповідають інтерфейсу дій.

1. [GET-запит](#get-request) повертає метадані, які надають клієнту інформацію
   про доступні дії за цим URL, а також список пов’язаних дій (за бажанням).
2. [POST-запит](#post-request) повертає транзакцію або повідомлення для підпису,
   які клієнт відображає в гаманці користувача для підпису та виконання у
   блокчейні або іншому офчейн-сервісі.

### Виконання дії та життєвий цикл

На практиці взаємодія з діями нагадує роботу зі стандартним REST API:

- клієнт надсилає початковий `GET`-запит до URL дії для отримання метаданих про
  доступні дії
- ендпойнт повертає відповідь, яка включає метадані (наприклад, заголовок
  програми та іконку) і перелік доступних дій
- клієнтський додаток (наприклад, мобільний гаманець, чат-бот або вебсайт)
  відображає інтерфейс для виконання однієї з дій
- після вибору дії користувачем (натискання кнопки) клієнт надсилає `POST`-запит
  до ендпойнта, щоб отримати транзакцію для підпису
- гаманець допомагає користувачеві підписати транзакцію і зрештою надсилає її в
  блокчейн для підтвердження

![Життєвий цикл виконання дій Solana](/public/assets/docs/action-execution-and-lifecycle.png)

Під час отримання транзакцій із URL дій клієнти повинні обробляти надсилання цих
транзакцій у блокчейн і управляти їхнім станом.

Дії також підтримують певний рівень недійсності перед виконанням. `GET`- та
`POST`-запити можуть повертати метадані, які вказують, чи можливо виконати дію
(наприклад, через поле `disabled`).

Наприклад, якщо ендпойнт дії підтримує голосування за пропозицію DAO, термін
голосування за якою закінчився, початковий [GET-запит](#get-request) може
повернути повідомлення про помилку "Цю пропозицію більше не можна обговорювати",
а кнопки "Проголосувати за" та "Проголосувати проти" — як "вимкнені".

## Блінки

Блінки (посилання на блокчейн) — це клієнтські програми, які аналізують API дій
і створюють інтерфейси користувача для взаємодії з діями та їх виконання.

Клієнтські програми, що підтримують блінки, виявляють URL, сумісні з діями,
аналізують їх і дозволяють користувачам взаємодіяти з ними у стандартизованих
інтерфейсах.

> Будь-яка клієнтська програма, яка повністю аналізує API дій для створення
> повноцінного інтерфейсу, є _блінком_. Отже, не всі клієнти, які використовують
> API дій, є блінками.

### Специфікація URL блінків

URL блінка описує клієнтську програму, яка дозволяє користувачеві завершити
повний [життєвий цикл виконання дії](#action-execution-and-lifecycle), включаючи
підписання у гаманці.

```text
https://example.domain/?action=<action_url>
```

Для того, щоб будь-яка клієнтська програма могла стати блінком:

- URL блінка повинен містити параметр запиту `action`, значення якого має бути
  [URL-кодованим](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
  [URL дії](#url-scheme). Це значення має бути закодоване, щоб уникнути
  конфліктів з іншими параметрами протоколу.

- Клієнтська програма повинна
  [декодувати URL](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
  параметр запиту `action` і аналізувати наданий посилання API дій (див.
  [Схему URL дії](#url-scheme)).

- Клієнт повинен відобразити багатий інтерфейс користувача, який дозволяє
  завершити повний
  [життєвий цикл виконання дії](#action-execution-and-lifecycle), включаючи
  підписання у гаманці.

> Не всі клієнтські програми-блінки (наприклад, вебсайти або децентралізовані
> додатки) підтримуватимуть усі дії. Розробники додатків можуть обирати, які дії
> вони хочуть підтримувати у своїх інтерфейсах блінків.

Наступний приклад демонструє дійсний URL блінка зі значенням параметра `action`
`solana-action:https://actions.alice.com/donate`, яке закодовано у форматі URL:

```text
https://example.domain/?action=solana-action%3Ahttps%3A%2F%2Factions.alice.com%2Fdonate
```

### Виявлення дій через блінки

Блінки можуть бути пов’язані з діями щонайменше трьома способами:

1. Поширення явного URL дії: `solana-action:https://actions.alice.com/donate`

   У цьому випадку лише клієнти, які підтримують блінки, можуть відобразити
   блінк. Не буде доступного попереднього перегляду посилання або сайту, який
   можна відвідати поза клієнтами, що не підтримують блінки.

2. Поширення посилання на вебсайт, пов’язаний із API дій через файл
   [`actions.json`](#actionsjson) у кореневій директорії домену вебсайту.

   Наприклад, `https://alice.com/actions.json` зіставляє
   `https://alice.com/donate`, URL вебсайту, на якому користувачі можуть зробити
   пожертву для Alice, з API URL `https://actions.alice.com/donate`, на якому
   хостяться дії для пожертвування Alice.

3. Вбудовування URL дії у "перехідний" URL сайту, який розуміє, як аналізувати
   дії.

   ```text
   https://example.domain/?action=<action_url>
   ```

Клієнти, які підтримують блінки, повинні мати можливість працювати з будь-яким
із зазначених форматів і правильно відображати інтерфейс для виконання дії
безпосередньо в клієнті.

Для клієнтів, які не підтримують блінки, повинен бути доступний основний
вебсайт, що робить браузер універсальним варіантом резервного доступу.

Якщо користувач натискає на будь-яку область клієнта, яка не є кнопкою дії або
полем для введення тексту, він повинен бути перенаправлений на основний сайт.

### Тестування та перевірка блінків

Хоча Solana Actions і блінки є протоколом/специфікацією без дозволів, клієнтські
додатки та гаманці повинні забезпечити можливість користувачам підписувати
транзакцію.

> Використовуйте інструмент [Blinks Inspector](https://www.blinks.xyz/inspector)
> для перевірки, налагодження та тестування ваших блінків і дій безпосередньо в
> браузері. Ви можете переглядати GET і POST відповіді, заголовки та тестувати
> всі введення для кожної з ваших пов'язаних дій.

Кожен клієнтський додаток або гаманець може мати різні вимоги щодо того, які
ендпойнти дій будуть автоматично розгортатися й негайно відображатися
користувачам на платформах соціальних мереж.

Наприклад, деякі клієнти можуть працювати за підходом "список дозволених" і
вимагати верифікації перед розгортанням дії для користувачів, як це робить
реєстр дій Dialect (докладно описано нижче).

Усі блінки все одно будуть відображатися й дозволять підписання на сайті Dialect
[dial.to](https://dial.to), де їхній статус у реєстрі буде показаний у блінку.

### Реєстр дій Dialect

Як загальне благо для екосистеми Solana, [Dialect](https://dialect.to) підтримує
публічний реєстр — разом із допомогою Solana Foundation та інших членів
спільноти — для посилань на блокчейн, які попередньо перевірені й походять із
відомих джерел. На момент запуску лише дії, зареєстровані в реєстрі Dialect,
будуть автоматично розгортатися у Twitter, коли їх публікують.

Клієнтські програми та гаманці можуть вільно використовувати цей публічний
реєстр або інші рішення, щоб забезпечити безпеку користувачів. Якщо посилання на
блокчейн не верифіковане через реєстр Dialect, воно не оброблятиметься клієнтом
блінків і буде відображатися як звичайне URL.

Розробники можуть подати заявку на верифікацію у Dialect тут:
[dial.to/register](https://dial.to/register)

## Специфікація

Специфікація Solana Actions складається з ключових розділів, які є частиною
процесу взаємодії запит/відповідь:

- Схема URL [Solana Action](#url-scheme), яка надає URL дії
- [OPTIONS-відповідь](#options-response) на URL дії для відповідності вимогам
  CORS
- [GET-запит](#get-request) до URL дії
- [GET-відповідь](#get-response) із сервера
- [POST-запит](#post-request) до URL дії
- [POST-відповідь](#post-response) із сервера

Кожен із цих запитів надсилається _клієнтом дій_ (наприклад, гаманець,
розширення для браузера, децентралізований додаток, вебсайт тощо) для збору
специфічних метаданих для багатого інтерфейсу користувача та забезпечення вводу
користувачем до API дій.

Кожна з відповідей створюється додатком (наприклад, вебсайтом, серверним
додатком тощо) і повертається _клієнту дій_. Зрештою, це забезпечує транзакцію
або повідомлення для підпису гаманцем, щоб користувач міг підтвердити, підписати
та надіслати їх до блокчейну.

> Типи та інтерфейси, описані в цьому файлі readme, часто спрощені для
> полегшення читання.
>
> Для кращої безпеки типів і покращеного досвіду розробників пакет
> `@solana/actions-spec` містить більш складні визначення типів. Ви можете
> знайти
> [вихідний код тут](https://github.com/solana-developers/solana-actions/blob/main/packages/actions-spec/index.d.ts).

### Схема URL

URL дії Solana описує інтерактивний запит на підписання транзакції або
повідомлення в Solana за допомогою протоколу `solana-action`.

Запит є інтерактивним, оскільки параметри в URL використовуються клієнтом для
надсилання серії стандартизованих HTTP-запитів для складання транзакції або
повідомлення для підписання користувачем у його гаманці.

```text
solana-action:<link>
```

- Єдине поле `link` обов’язкове як шлях. Значення повинно бути
  [URL-кодованим](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
  абсолютним HTTPS URL.

- Якщо URL містить параметри запиту, він повинен бути закодований у форматі URL.
  Це допомагає уникнути конфліктів із будь-якими параметрами протоколу дій, які
  можуть бути додані через специфікацію протоколу.

- Якщо URL не містить параметрів запиту, він не повинен бути закодованим у
  форматі URL. Це забезпечує коротший URL і менш щільний QR-код.

У будь-якому випадку клієнти повинні
[декодувати URL](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
значення. Це не матиме жодного ефекту, якщо значення вже не було закодовано.
Якщо декодоване значення не є абсолютним HTTPS URL, гаманець повинен відхилити
його як **пошкоджене**.

### OPTIONS-відповідь

Для забезпечення крос-доменного доступу (CORS) у клієнтах дій (включаючи
блінки), усі ендпойнти дій повинні відповідати на HTTP-запити методу `OPTIONS` з
дійсними заголовками, які дозволять клієнтам проходити CORS-перевірки для всіх
подальших запитів із їхнього домену.

Клієнт дій може виконувати
"[префлайт-запити](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests)"
до ендпойнта URL дії, щоб перевірити, чи пройде наступний GET-запит до цього URL
всі CORS-перевірки. Ці перевірки виконуються за допомогою HTTP-методу `OPTIONS`
і повинні відповідати з усіма необхідними HTTP-заголовками, які дозволяють
клієнтам дій (наприклад, блінкам) правильно виконувати всі подальші запити.

Мінімальний набір обов’язкових HTTP-заголовків:

- `Access-Control-Allow-Origin` зі значенням `*`
  - забезпечує можливість усім клієнтам дій безпечно проходити CORS-перевірки
    для виконання всіх необхідних запитів.
- `Access-Control-Allow-Methods` зі значенням `GET,POST,PUT,OPTIONS`
  - забезпечує підтримку всіх необхідних HTTP-методів запитів для дій.
- `Access-Control-Allow-Headers` з мінімальним значенням
  `Content-Type, Authorization, Content-Encoding, Accept-Encoding`.

Для спрощення розробникам слід розглянути можливість повернення однакової
відповіді та заголовків на запити `OPTIONS`, що і для їхнього
[GET-відповіді](#get-response).

<Callout type="caution" title="Крос-доменні заголовки для actions.json">

Відповідь файлу `actions.json` також повинна повертати дійсні заголовки
крос-доменного доступу для запитів `GET` і `OPTIONS`, зокрема заголовок
`Access-Control-Allow-Origin` зі значенням `*`.

Докладніше дивіться у розділі [actions.json](#actionsjson).

</Callout>

### GET-запит

Клієнт дій (наприклад, гаманець, розширення браузера тощо) повинен надсилати
HTTP `GET` JSON-запит до URL-ендпойнта дії.

- Запит не повинен ідентифікувати гаманець або користувача.
- Клієнт повинен виконувати запит із заголовком
  [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding).
- Клієнт повинен відображати домен URL під час виконання запиту.

### GET-відповідь

URL-ендпойнт дії (наприклад, додаток або серверний бекенд) повинен відповідати
HTTP `OK` JSON-відповіддю (з дійсним вмістом у тілі) або відповідною помилкою
HTTP.

- Клієнт повинен обробляти HTTP
  [помилки клієнта](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses),
  [помилки сервера](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses)
  та
  [редиректи](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages).
- Ендпойнт повинен відповідати із заголовком
  [`Content-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
  для HTTP-компресії.
- Ендпойнт повинен відповідати із заголовком
  [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
  зі значенням `application/json`.

- Клієнт не повинен кешувати відповідь, окрім випадків, коли це вказано у
  [HTTP-заголовках кешування](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching).
- Клієнт повинен відображати `title` і рендерити іконку `icon` для користувача.

Помилкові відповіді (тобто статуси HTTP 4xx та 5xx) повинні повертати JSON-тіло
відповіді, яке відповідає `ActionError`, щоб представити користувачам корисне
повідомлення про помилку. Дивіться [Помилки дій](#action-errors).

#### Тіло GET-відповіді

`GET`-відповідь зі статусом HTTP `OK` повинна включати тіло з вмістом, що
відповідає специфікації інтерфейсу:

```ts filename="ActionGetResponse"
export type ActionType = "action" | "completed";

export type ActionGetResponse = Action<"action">;

export interface Action<T extends ActionType> {
  /** type of Action to present to the user */
  type: T;
  /** image url that represents the source of the action request */
  icon: string;
  /** describes the source of the action request */
  title: string;
  /** brief summary of the action to be performed */
  description: string;
  /** button text rendered to the user */
  label: string;
  /** UI state for the button being rendered to the user */
  disabled?: boolean;
  links?: {
    /** list of related Actions a user could perform */
    actions: LinkedAction[];
  };
  /** non-fatal error message to be displayed to the user */
  error?: ActionError;
}
```

- `type` - Тип дії, що надається користувачеві. За замовчуванням встановлено
  значення `action`. Початковий `ActionGetResponse` повинен мати тип `action`.

  - `action` - Стандартна дія, яка дозволяє користувачеві взаємодіяти з
    будь-якими `LinkedActions`.
  - `completed` - Використовується для позначення стану "завершено" у ланцюжку
    дій.

- `icon` - Значення має бути абсолютним HTTP або HTTPS URL іконки. Файл повинен
  бути формату SVG, PNG або WebP, інакше клієнт/гаманець повинен відхилити його
  як **пошкоджений**.

- `title` - Значення має бути рядком UTF-8, що представляє джерело запиту дії.
  Наприклад, це може бути назва бренду, магазину, програми або особи, яка робить
  запит.

- `description` - Значення має бути рядком UTF-8, що надає інформацію про дію.
  Опис повинен бути відображений користувачеві.

- `label` - Значення має бути рядком UTF-8, який буде відображено на кнопці для
  натискання користувачем. Усі мітки не повинні перевищувати 5 слів і повинні
  починатися з дієслова, щоб закріпити дію, яку ви хочете, щоб користувач
  виконав. Наприклад, "Mint NFT", "Vote Yes" або "Stake 1 SOL".

- `disabled` - Значення має бути логічним (boolean), щоб представляти стан
  вимкнення кнопки (яка відображає рядок `label`). Якщо значення не надано,
  `disabled` має за замовчуванням бути `false` (тобто увімкнено). Наприклад,
  якщо кінцева точка дії використовується для голосування, яке вже закрите,
  встановіть `disabled=true`, а мітка може бути "Vote Closed".

- `error` - Необов'язковий індикатор помилки для нефатальних помилок. Якщо
  присутній, клієнт повинен відобразити це користувачеві. Якщо встановлено, це
  не повинно заважати клієнту інтерпретувати дію або відображати її
  користувачеві (див. [Помилки дій](#action-errors)). Наприклад, помилка може
  використовуватися разом із `disabled`, щоб показати причину, як-от
  бізнес-обмеження, авторизація, стан або помилка зовнішнього ресурсу.

- `links.actions` - Необов'язковий масив пов'язаних дій для кінцевої точки.
  Користувачам повинен бути відображений інтерфейс для кожної зі вказаних дій, і
  очікується, що вони виконають лише одну. Наприклад, кінцева точка дії для
  голосування в управлінні DAO може повернути три варіанти для користувача:
  "Vote Yes", "Vote No" і "Abstain from Vote".

  - Якщо `links.actions` не надано, клієнт повинен відобразити одну кнопку,
    використовуючи кореневий рядок `label`, і виконати POST-запит до тієї самої
    кінцевої точки URL дії, що й початковий GET-запит.

  - Якщо будь-які `links.actions` надані, клієнт повинен відображати лише кнопки
    та поля введення на основі елементів, перелічених у полі `links.actions`.
    Клієнт не повинен відображати кнопку для вмісту кореневого `label`.

```ts filename="LinkedAction"
export interface LinkedAction {
  /** URL endpoint for an action */
  href: string;
  /** button text rendered to the user */
  label: string;
  /**
   * Parameters to accept user input within an action
   * @see {ActionParameter}
   * @see {ActionParameterSelectable}
   */
  parameters?: Array<TypedActionParameter>;
}
```

`ActionParameter` дозволяє визначити, яке саме введення API дій запитує у
користувача:

```ts filename="ActionParameter"
/**
 * Parameter to accept user input within an action
 * note: for ease of reading, this is a simplified type of the actual
 */
export interface ActionParameter {
  /** input field type */
  type?: ActionParameterType;
  /** parameter name in url */
  name: string;
  /** placeholder text for the user input field */
  label?: string;
  /** declare if this field is required (defaults to `false`) */
  required?: boolean;
  /** regular expression pattern to validate user input client side */
  pattern?: string;
  /** human-readable description of the `type` and/or `pattern`, represents a caption and error, if value doesn't match */
  patternDescription?: string;
  /** the minimum value allowed based on the `type` */
  min?: string | number;
  /** the maximum value allowed based on the `type` */
  max?: string | number;
}
```

`pattern` повинен бути рядком, еквівалентним дійсному регулярному виразу. Цей
регулярний вираз має використовуватися клієнтами-блінками для перевірки введення
користувача перед виконанням POST-запиту. Якщо `pattern` не є дійсним регулярним
виразом, клієнт повинен його ігнорувати.

`patternDescription` — це опис, зрозумілий для людини, який пояснює очікуване
введення користувача. Якщо надано `pattern`, то `patternDescription` також
обов’язково має бути надано.

Значення `min` та `max` дозволяють встановити нижню та/або верхню межу введення,
запитуваного у користувача (наприклад, мінімальне/максимальне число або
мінімальну/максимальну довжину рядка). Вони повинні використовуватися для
клієнтської валідації. Для типів введення `date` або `datetime-local` ці
значення мають бути рядками, що представляють дати. Для інших типів введення на
основі рядків значення повинні бути числами, що представляють їх
мінімальну/максимальну довжину символів.

Якщо введене значення користувача не відповідає `pattern`, користувач має
отримати повідомлення про помилку на стороні клієнта, що вказує на недійсність
поля введення, і відображати рядок `patternDescription`.

Поле `type` дозволяє API дій визначати більш конкретні поля введення
користувача, забезпечуючи кращу валідацію на стороні клієнта та покращуючи
користувацький досвід. У багатьох випадках цей тип буде подібний до стандартного
[елемента введення HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).

Тип `ActionParameterType` можна спростити до такого формату:

```ts filename="ActionParameterType"
/**
 * Input field type to present to the user
 * @default `text`
 */
export type ActionParameterType =
  | "text"
  | "email"
  | "url"
  | "number"
  | "date"
  | "datetime-local"
  | "checkbox"
  | "radio"
  | "textarea"
  | "select";
```

Кожне зі значень `type` зазвичай має відповідати полю введення користувача, яке
нагадує стандартний HTML-елемент `input` відповідного типу (наприклад,
`<input type="email" />`), щоб забезпечити кращу валідацію на стороні клієнта та
покращити користувацький досвід:

- `text` - еквівалент HTML
  [елемента введення типу "text"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text)
- `email` - еквівалент HTML
  [елемента введення типу "email"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email)
- `url` - еквівалент HTML
  [елемента введення типу "url"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url)
- `number` - еквівалент HTML
  [елемента введення типу "number"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number)
- `date` - еквівалент HTML
  [елемента введення типу "date"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
- `datetime-local` - еквівалент HTML
  [елемента введення типу "datetime-local"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local)
- `checkbox` - еквівалент групи стандартних HTML
  [елементів введення типу "checkbox"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox).
  API дій має повертати `options`, як описано нижче. Користувач повинен мати
  змогу вибрати кілька запропонованих варіантів.
- `radio` - еквівалент групи стандартних HTML
  [елементів введення типу "radio"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio).
  API дій має повертати `options`, як описано нижче. Користувач повинен мати
  змогу вибрати лише один із запропонованих варіантів.
- Інші еквіваленти HTML-типів введення, не зазначені вище (`hidden`, `button`,
  `submit`, `file` тощо), наразі не підтримуються.

Окрім елементів, схожих на HTML-типи введення, також підтримуються наступні
елементи введення користувача:

- `textarea` - еквівалент HTML
  [елемента "textarea"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea),
  що дозволяє користувачеві вводити багаторядковий текст.
- `select` - еквівалент HTML
  [елемента "select"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select),
  що надає користувачеві досвід вибору з випадаючого списку. API дій має
  повертати `options`, як описано нижче.

Коли `type` встановлено як `select`, `checkbox` або `radio`, API дій має
включати масив `options`, кожен із яких надає `label` та `value` принаймні.
Кожна опція також може мати значення `selected`, яке інформує клієнт-блінк, яка
опція має бути обрана за замовчуванням для користувача (див. відмінності для
`checkbox` і `radio`).

Цей `ActionParameterSelectable` можна спростити до такого визначення типу:

```ts filename="ActionParameterSelectable"
/**
 * note: for ease of reading, this is a simplified type of the actual
 */
interface ActionParameterSelectable extends ActionParameter {
  options: Array<{
    /** displayed UI label of this selectable option */
    label: string;
    /** value of this selectable option */
    value: string;
    /** whether or not this option should be selected by default */
    selected?: boolean;
  }>;
}
```

Якщо `type` не встановлено або задано невідоме/непідтримуване значення,
клієнти-блінки мають за замовчуванням використовувати `text` і відображати
просте текстове поле введення.

API дій все одно відповідає за валідацію та санітизацію всіх даних, отриманих
від параметрів введення користувача, забезпечуючи виконання всіх обов’язкових
("required") полів введення за необхідності.

Для платформ, які не базуються на HTML/веб (наприклад, для нативних мобільних
додатків), слід використовувати еквівалентні нативні компоненти введення, щоб
забезпечити аналогічний досвід та валідацію на стороні клієнта, як описано для
HTML/веб.

#### Приклад відповіді на GET-запит

Наступний приклад відповіді забезпечує єдину "кореневу" дію, яка очікує, що
користувачеві буде представлена одна кнопка з міткою "Отримати токен доступу":

```json
{
  "title": "HackerHouse Events",
  "icon": "<url-to-image>",
  "description": "Claim your Hackerhouse access token.",
  "label": "Claim Access Token" // button text
}
```

Наступний приклад відповіді забезпечує 3 пов’язані посилання на дії, що
дозволяють користувачеві натиснути одну з трьох кнопок для голосування за
пропозицію DAO:

```json
{
  "title": "Realms DAO Platform",
  "icon": "<url-to-image>",
  "description": "Vote on DAO governance proposals #1234.",
  "label": "Vote",
  "links": {
    "actions": [
      {
        "label": "Vote Yes", // button text
        "href": "/api/proposal/1234/vote?choice=yes"
      },
      {
        "label": "Vote No", // button text
        "href": "/api/proposal/1234/vote?choice=no"
      },
      {
        "label": "Abstain from Vote", // button text
        "href": "/api/proposal/1234/vote?choice=abstain"
      }
    ]
  }
}
```

#### Приклад відповіді на GET-запит з параметрами

Наступні приклади відповіді демонструють, як приймати текстове введення від
користувача (через `parameters`) і включати це введення у кінцеву кінцеву точку
запиту `POST` (через поле `href` у `LinkedAction`):

Наступний приклад відповіді забезпечує користувачеві 3 пов’язані дії для
стейкінгу SOL: кнопку з міткою "Stake 1 SOL", іншу кнопку з міткою "Stake 5 SOL"
та текстове поле введення, яке дозволяє користувачеві ввести конкретне значення
"amount", що буде надіслано до API дій:

```json
{
  "title": "Stake-o-matic",
  "icon": "<url-to-image>",
  "description": "Stake SOL to help secure the Solana network.",
  "label": "Stake SOL", // not displayed since `links.actions` are provided
  "links": {
    "actions": [
      {
        "label": "Stake 1 SOL", // button text
        "href": "/api/stake?amount=1"
        // no `parameters` therefore not a text input field
      },
      {
        "label": "Stake 5 SOL", // button text
        "href": "/api/stake?amount=5"
        // no `parameters` therefore not a text input field
      },
      {
        "label": "Stake", // button text
        "href": "/api/stake?amount={amount}",
        "parameters": [
          {
            "name": "amount", // field name
            "label": "SOL amount" // text input placeholder
          }
        ]
      }
    ]
  }
}
```

Наступний приклад відповіді забезпечує одне поле введення для користувача, щоб
ввести `amount`, яке буде надіслано з запитом `POST` (може бути використано як
параметр запиту або як підшлях):

```json
{
  "icon": "<url-to-image>",
  "label": "Donate SOL",
  "title": "Donate to GoodCause Charity",
  "description": "Help support this charity by donating SOL.",
  "links": {
    "actions": [
      {
        "label": "Donate", // button text
        "href": "/api/donate/{amount}", // or /api/donate?amount={amount}
        "parameters": [
          // {amount} input field
          {
            "name": "amount", // input field name
            "label": "SOL amount" // text input placeholder
          }
        ]
      }
    ]
  }
}
```

### POST Запит

Наступний приклад відповіді забезпечує одне поле введення для користувача, щоб
ввести `amount`, яке буде надіслано з запитом `POST` (може бути використано як
параметр запиту або як підшлях):

```json
{
  "account": "<account>"
}
```

- `account` - Значення повинно бути відкритим ключем облікового запису у форматі
  base58, який може підписувати транзакцію.

Клієнт має виконати запит із заголовком
[Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding),
а застосунок може відповісти заголовком
[Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
для HTTP-компресії.

Клієнт повинен відобразити домен URL дії під час виконання запиту. Якщо був
виконаний `GET`-запит, клієнт також повинен відобразити `title` та відрендерити
зображення `icon` з відповіді GET.

### Відповідь на POST-запит

Кінцева точка `POST` для дії повинна відповідати HTTP-відповіддю `OK` у форматі
JSON (з дійсним тілом відповіді) або відповідною HTTP-помилкою.

- Клієнт повинен обробляти
  [помилки клієнта](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses),
  [помилки сервера](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses),
  та
  [відповіді-перенаправлення](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages).
- Кінцева точка повинна відповідати з заголовком
  [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
  значенням `application/json`.

Помилкові відповіді (тобто HTTP-коди стану 4xx і 5xx) повинні повертати
JSON-відповідь, що відповідає структурі `ActionError`, для відображення
корисного повідомлення про помилку користувачам. Див.
[Помилки дій](#action-errors).

#### Тіло відповіді на POST-запит

Відповідь `POST` з HTTP-відповіддю `OK` у форматі JSON повинна включати тіло
відповіді наступного вигляду:

```ts filename="ActionPostResponse"
/**
 * Response body payload returned from the Action POST Request
 */
export interface ActionPostResponse<T extends ActionType = ActionType> {
  /** base64 encoded serialized transaction */
  transaction: string;
  /** describes the nature of the transaction */
  message?: string;
  links?: {
    /**
     * The next action in a successive chain of actions to be obtained after
     * the previous was successful.
     */
    next: NextActionLink;
  };
}
```

- `transaction` - Значення повинно бути серіалізованою транзакцією, закодованою
  в base64
  ([документація](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#serialize)).
  Клієнт повинен декодувати транзакцію з base64 і
  [десеріалізувати її](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#from).

- `message` - Значення повинно бути рядком у форматі UTF-8, який описує суть
  транзакції, включеної у відповідь. Клієнт повинен відобразити це значення
  користувачу. Наприклад, це може бути назва товару, який купується, застосована
  знижка, або подяка.

- `links.next` - Необов'язкове значення, яке використовується для "зчеплення"
  кількох дій у послідовності. Після підтвердження включеної `transaction` у
  блокчейні клієнт може отримати та відобразити наступну дію. Дивіться
  [Зчеплення дій](#action-chaining) для отримання додаткової інформації.

- Клієнт та застосунок повинні дозволяти додаткові поля у тілі запиту та
  відповіді, які можуть бути додані у майбутніх оновленнях специфікацій.

> Застосунок може відповідати частково або повністю підписаною транзакцією.
> Клієнт та гаманець повинні перевіряти транзакцію як **ненадійну**.

#### Відповідь POST - Транзакція

Якщо у транзакції
[`signatures`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#signatures)
відсутні або транзакція ще не підписана частково:

- Клієнт повинен ігнорувати
  [`feePayer`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#feePayer)
  у транзакції та встановити `feePayer` як `account` з запиту.
- Клієнт повинен ігнорувати
  [`recentBlockhash`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#recentBlockhash)
  у транзакції та встановити `recentBlockhash` на
  [останній blockhash](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html#getLatestBlockhash).
- Клієнт повинен серіалізувати та десеріалізувати транзакцію перед її
  підписанням. Це забезпечує послідовний порядок ключів облікових записів як
  рішення для
  [цієї проблеми](https://github.com/solana-labs/solana/issues/21722).

Якщо транзакція вже частково підписана:

- Клієнт не повинен змінювати
  [`feePayer`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#feePayer)
  або
  [`recentBlockhash`](https://solana-labs.github.io/solana-web3.js/v1.x/classes/Transaction.html#recentBlockhash),
  оскільки це зробить існуючі підписи недійсними.
- Клієнт повинен перевірити існуючі підписи, і якщо будь-який з них недійсний,
  клієнт повинен відхилити транзакцію як **пошкоджену**.

Клієнт повинен підписати транзакцію лише за допомогою `account`, зазначеного у
запиті, і зробити це лише у випадку, якщо очікується підпис для цього `account`.

Якщо очікується будь-який підпис, окрім підпису для `account` у запиті, клієнт
повинен відхилити транзакцію як **шкідливу**.

### Помилки дій

API для дій повинні повертати помилки у форматі `ActionError`, щоб надати
корисні повідомлення про помилки для користувачів. Залежно від контексту, ця
помилка може бути фатальною або нефатальною.

```ts filename="ActionError"
export interface ActionError {
  /** simple error message to be displayed to the user */
  message: string;
}
```

Коли API для дій відповідає HTTP-кодом помилки (тобто 4xx і 5xx), тіло відповіді
має бути JSON-навантаженням, яке відповідає формату `ActionError`. Помилка
вважається фатальною, і повідомлення, яке міститься в ній, має бути представлене
користувачеві.

Для відповідей API, які підтримують необов'язковий атрибут `error` (наприклад,
[`ActionGetResponse`](#get-response)), помилка вважається нефатальною, і
повідомлення, яке міститься в ній, також має бути представлене користувачеві.

## Зчеплення дій

Дії Solana можуть бути "зчеплені" разом у послідовну серію. Після підтвердження
транзакції дії у блокчейні можна отримати наступну дію та представити її
користувачеві.

Зчеплення дій дозволяє розробникам створювати більш складний і динамічний досвід
у рамках blinks, включаючи:

- надання декількох транзакцій (і в майбутньому повідомлень для підпису)
  користувачу;
- налаштування метаданих дії залежно від адреси гаманця користувача;
- оновлення метаданих blink після успішної транзакції;
- отримання API-зворотного виклику з підписом транзакції для додаткової
  перевірки та логіки на сервері API для дій;
- налаштовані повідомлення про успіх, шляхом оновлення відображуваних метаданих
  (наприклад, нове зображення або опис).

Для зчеплення кількох дій разом, у будь-якому `ActionPostResponse` включіть
`links.next` одного з наступних типів:

- `PostNextActionLink` — Посилання POST-запиту з URL зворотного виклику того
  самого походження для отримання `signature` і `account` користувача у тілі.
  Цей URL зворотного виклику повинен відповідати `NextAction`.
- `InlineNextActionLink` — Вбудовані метадані для наступної дії, які мають бути
  представлені користувачеві негайно після підтвердження транзакції. Ніякий
  зворотний виклик не буде виконано.

```ts
export type NextActionLink = PostNextActionLink | InlineNextActionLink;

/** @see {NextActionPostRequest} */
export interface PostNextActionLink {
  /** Indicates the type of the link. */
  type: "post";
  /** Relative or same origin URL to which the POST request should be made. */
  href: string;
}

/**
 * Represents an inline next action embedded within the current context.
 */
export interface InlineNextActionLink {
  /** Indicates the type of the link. */
  type: "inline";
  /** The next action to be performed */
  action: NextAction;
}
```

### NextAction

Після того як транзакція, включена в `ActionPostResponse`, підписана
користувачем і підтверджена у блокчейні, blink-клієнт повинен або:

- виконати запит зворотного виклику, щоб отримати і відобразити `NextAction`,
  або
- якщо `NextAction` вже надана через `links.next`, blink-клієнт повинен оновити
  відображувані метадані і не робити запит зворотного виклику.

Якщо URL зворотного виклику не має того ж походження, що і початковий
POST-запит, запит зворотного виклику не повинен виконуватися. Blink-клієнти
повинні відобразити помилку, що повідомляє користувача.

```ts filename="NextAction"
/** The next action to be performed */
export type NextAction = Action<"action"> | CompletedAction;

/** The completed action, used to declare the "completed" state within action chaining. */
export type CompletedAction = Omit<Action<"completed">, "links">;
```

### Відповідно до `type`, наступна дія повинна бути представлена користувачеві через blink-клієнти одним із наступних способів:

- `action` - (за замовчуванням) Стандартна дія, яка дозволяє користувачеві
  переглядати включені метадані Action, взаємодіяти з наданими `LinkedActions` і
  продовжувати виконувати будь-які наступні дії в ланцюжку.

- `completed` - Завершальний стан ланцюжка дій, який може оновлювати інтерфейс
  blink із включеними метаданими Action, але не дозволяє користувачеві
  виконувати подальші дії.

Якщо `links.next` не надано, blink-клієнти повинні припустити, що поточна дія є
фінальною у ланцюжку, і представити свій інтерфейс "завершеної" дії після
підтвердження транзакції.

## actions.json

Файл [`actions.json`](#actionsjson) використовується для того, щоб додаток міг
інструктувати клієнтів про те, які URL-адреси вебсайту підтримують Solana
Actions, і надавати мапінг, який може бути використаний для виконання
[GET запитів](#get-request) до серверу API дій.

<Callout type="caution" title="Потрібні заголовки Cross-Origin">

Відповідь файлу `actions.json` також повинна повертати дійсні заголовки
Cross-Origin для запитів `GET` і `OPTIONS`, зокрема заголовок
`Access-Control-Allow-Origin` із значенням `*`.

Детальніше див. у розділі [OPTIONS response](#options-response) вище.

</Callout>

Файл `actions.json` повинен бути збережений і загальнодоступний у кореневій
директорії домену.

Наприклад, якщо ваш вебдодаток розгорнуто на `my-site.com`, тоді файл
`actions.json` має бути доступний за адресою `https://my-site.com/actions.json`.
Цей файл також має бути доступний через будь-який браузер за допомогою заголовка
`Access-Control-Allow-Origin` із значенням `*`.

### Правила

Поле `rules` дозволяє додатку мапувати набір відносних маршрутів вебсайту на
інші шляхи.

**Тип:** `Array` з `ActionRuleObject`.

```ts filename="ActionRuleObject"
interface ActionRuleObject {
  /** relative (preferred) or absolute path to perform the rule mapping from */
  pathPattern: string;
  /** relative (preferred) or absolute path that supports Action requests */
  apiPath: string;
}
```

- [`pathPattern`](#rules-pathpattern) - Шаблон, який відповідає кожному вхідному
  шляху.

- [`apiPath`](#rules-apipath) - Місце призначення, визначене як абсолютний шлях
  або зовнішній URL.

#### Правила - pathPattern

Шаблон, який відповідає кожному вхідному шляху. Це може бути абсолютний або
відносний шлях, який підтримує наступні формати:

- **Точне співпадіння**: Відповідає точному URL-шляху.

  - Приклад: `/exact-path`
  - Приклад: `https://website.com/exact-path`

- **Співпадіння з використанням шаблону**: Використовує символи підстановки для
  відповідності будь-якій послідовності символів у шляху URL. Це може
  відповідати одному (за допомогою `*`) або кільком сегментам (за допомогою
  `**`). (Див. [Path Matching](#rules-path-matching) нижче).

  - Приклад: `/trade/*` відповідатиме `/trade/123` і `/trade/abc`, захоплюючи
    лише перший сегмент після `/trade/`.
  - Приклад: `/category/*/item/**` відповідатиме `/category/123/item/456` і
    `/category/abc/item/def`.
  - Приклад: `/api/actions/trade/*/confirm` відповідатиме
    `/api/actions/trade/123/confirm`.

#### Правила - apiPath

Шлях призначення для запиту дії. Він може бути визначений як абсолютний шлях або
зовнішній URL.

- Приклад: `/api/exact-path`
- Приклад: `https://api.example.com/v1/donate/*`
- Приклад: `/api/category/*/item/*`
- Приклад: `/api/swap/**`

#### Правила - Query Parameters

Параметри запиту з оригінального URL завжди зберігаються та додаються до
мапованого URL.

#### Правила - Path Matching

Наступна таблиця описує синтаксис для шаблонів відповідності шляхів:

| Оператор | Відповідає                                                                                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `*`      | Один сегмент шляху, що не включає оточуючі символи розділювача шляху `/`.                                                                                                                            |
| `**`     | Відповідає нулю або більшій кількості символів, включаючи будь-які символи розділювача шляху `/` між декількома сегментами шляху. Якщо включені інші оператори, оператор `**` повинен бути останнім. |
| `?`      | Непідтримуваний шаблон.                                                                                                                                                                              |

### Приклади Правил

Наступний приклад демонструє правило точного співпадіння для мапування запитів
до `/buy` з кореня вашого сайту на точний шлях `/api/buy`, відносно кореня
вашого сайту:

```json filename="actions.json"
{
  "rules": [
    {
      "pathPattern": "/buy",
      "apiPath": "/api/buy"
    }
  ]
}
```

Наступний приклад використовує шаблонне співставлення шляху для відображення
запитів до будь-якого шляху (за винятком підкаталогів) під `/actions/` від
кореня вашого сайту до відповідного шляху під `/api/actions/`, відносно кореня
вашого сайту:

```json filename="actions.json"
{
  "rules": [
    {
      "pathPattern": "/actions/*",
      "apiPath": "/api/actions/*"
    }
  ]
}
```

Наступний приклад використовує зіставлення шляхів із використанням символів
підстановки для перенаправлення запитів до будь-якого шляху (за винятком
підкаталогів) під `/donate/` у кореневій директорії вашого сайту до відповідного
абсолютного шляху `https://api.dialect.com/api/v1/donate/` на зовнішньому сайті:

```json filename="actions.json"
{
  "rules": [
    {
      "pathPattern": "/donate/*",
      "apiPath": "https://api.dialect.com/api/v1/donate/*"
    }
  ]
}
```

Наступний приклад використовує зіставлення шляхів із використанням символів
підстановки для ідемпотентного правила, щоб перенаправляти запити до будь-якого
шляху (включаючи підкаталоги) під `/api/actions/` у кореневій директорії вашого
сайту до самого себе:

> Ідемпотентні правила дозволяють клієнтам blink легше визначати, чи підтримує
> даний шлях запити API дій, без необхідності:
>
> - додавання префіксу `solana-action:` URI,
> - виконання додаткового тестування відповіді,
> - або будь-яких інших спеціальних перевірок.

```json filename="actions.json"
{
  "rules": [
    {
      "pathPattern": "/api/actions/**",
      "apiPath": "/api/actions/**"
    }
  ]
}
```

## Ідентифікація Дії (Action Identity)

Кінцеві точки дій (Action endpoints) можуть включати _Ідентифікацію Дії_ у
транзакціях, які повертаються у [POST-відповіді](#post-response) для підпису
користувачем. Це дозволяє індексаторам та аналітичним платформам легко та
достовірно приписувати активність у блокчейні конкретному провайдеру дій (тобто
сервісу).

[Ідентифікація Дії](#action-identity) — це пара ключів (keypair), яка
використовується для підпису спеціально форматованого повідомлення, що
включається до транзакції за допомогою інструкції Memo. Це _Повідомлення
Ідентифікатора_ (_Identifier Message_) може бути достовірно приписане до
конкретної Ідентифікації Дії, а отже, до конкретного провайдера дій.

Пара ключів не вимагається для підписання самої транзакції. Це дозволяє гаманцям
та додаткам покращити доставку транзакції, якщо у транзакції, поверненій
користувачу, немає інших підписів (див.
[POST-відповідь транзакції](#post-response-transaction)).

Якщо сценарій використання провайдера дій вимагає, щоб їх бекенд-сервіси
попередньо підписували транзакцію перед тим, як це зробить користувач, вони
мають використовувати цю пару ключів як Ідентифікацію Дії. Це дозволить зменшити
кількість облікових записів у транзакції, скоротивши її загальний розмір на 32
байти.

### Повідомлення Ідентифікатора Дії (Action Identifier Message)

Повідомлення Ідентифікатора Дії — це UTF-8 рядок, розділений двокрапками, який
включається до транзакції за допомогою однієї
[інструкції SPL Memo](https://spl.solana.com/memo).

```shell
protocol:identity:reference:signature
```

- `protocol` - Значення протоколу, який використовується (встановлено як
  `solana-action` відповідно до [URL-схеми](#url-scheme) вище).
- `identity` - Значення має бути публічним ключем у форматі base58, який
  відповідає парі ключів Ідентифікації Дії.
- `reference` - Значення має бути масивом байтів довжиною 32 у форматі base58.
  Це можуть бути як публічні ключі, так і інші дані, які можуть або не можуть
  відповідати обліковим записам у Solana.
- `signature` - Підпис у форматі base58, створений парою ключів Ідентифікації
  Дії, що підписує лише значення `reference`.

Значення `reference` має використовуватися тільки один раз і в одній транзакції.
Для приписування транзакцій провайдеру дій, лише перше використання значення
`reference` вважається дійсним.

Транзакції можуть містити кілька інструкцій Memo. Під час виконання
[`getSignaturesForAddress`](https://solana.com/docs/rpc/http/getsignaturesforaddress)
поле `memo` у результатах повертає повідомлення кожної інструкції Memo як єдиний
рядок, розділений крапкою з комою.

Жодні інші дані не повинні включатися до інструкції Memo Повідомлення
Ідентифікатора.

Облікові записи `identity` та `reference` повинні бути включені як доступні
тільки для читання, але без можливості підпису
([ключі](https://solana-labs.github.io/solana-web3.js/v1.x/classes/TransactionInstruction.html#keys))
у транзакції в інструкції, яка не є Інструкцією Memo Повідомлення
Ідентифікатора.

Інструкція Memo Повідомлення Ідентифікатора не повинна містити жодних облікових
записів. Якщо облікові записи надаються, програма Memo вимагає, щоб ці облікові
записи були дійсними підписувачами. Це обмежує гнучкість і може погіршити досвід
користувача, тому це вважається антипатерном і має бути уникнуто.

### Перевірка Ідентифікації Дії (Action Identity Verification)

Будь-яка транзакція, що включає обліковий запис `identity`, може бути достовірно
пов'язана з провайдером дій за допомогою багатоступінчастого процесу:

1. Отримайте всі транзакції для заданого `identity`.
2. Розберіть і перевірте рядок memo кожної транзакції, переконавшись, що підпис
   `signature` дійсний для збереженого значення `reference`.
3. Перевірте, чи є ця транзакція першим випадком використання `reference` у
   блокчейні:
   - Якщо ця транзакція є першим випадком, вона вважається підтвердженою і може
     бути достовірно приписана провайдеру дій.
   - Якщо ця транзакція НЕ є першим випадком, вона вважається недійсною і,
     відповідно, не може бути приписана провайдеру дій.

Оскільки валідатори Solana індексують транзакції за обліковими записами, метод
RPC
[`getSignaturesForAddress`](https://solana.com/docs/rpc/http/getsignaturesforaddress)
може бути використаний для визначення всіх транзакцій, що включають обліковий
запис `identity`.

Відповідь цього методу RPC включає всі дані Memo у полі `memo`. Якщо в
транзакції було використано кілька інструкцій Memo, кожне повідомлення Memo буде
включено в це поле `memo` і має бути відповідним чином розібране перевіряючою
стороною для отримання _Повідомлення Ідентифікації_.

Ці транзакції спочатку мають вважатися **НЕПЕРЕВІРЕНИМИ**. Це пов'язано з тим,
що `identity` не вимагається для підписання транзакції, що дозволяє будь-якій
транзакції включати цей обліковий запис як не-підписувач. Це потенційно може
штучно збільшити статистику приписування та використання.

Повідомлення Ідентифікації має бути перевірене для забезпечення того, що
`signature` було створено `identity`, підписуючи `reference`. Якщо ця перевірка
підпису не вдається, транзакція вважається недійсною.

Якщо перевірка підпису успішна, перевіряюча сторона має забезпечити, що ця
транзакція є першим випадком використання `reference`. Якщо це не так,
транзакція вважається недійсною.
