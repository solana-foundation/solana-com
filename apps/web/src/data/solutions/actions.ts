export const META = {
  title: "/solutions/actions",
  seoTitle: "Blockchain Links and Solana Actions",
  seoDescription:
    "Bring your app everywhere with Solana Actions. Interface with users anywhere you can post a link.",
  seoImage:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F567b4abec41445208b6196b426ee599d.png",
};

export const HERO = {
  eyebrow: "Solana Actions",
  headline:
    "Bring Crypto to the People with Solana Actions and Blockchain Links",
  body: "<p><strong>It's time to connect Solana to the entire internet.</strong></p><p>Traditional onchain transactions have been locked away in apps or complex interfaces, making it significantly harder for people to use crypto products. With Solana Actions and blockchain links, or blinks, transactions can open up to anywhere on the internet — no dApp required.</p>",
};

export const BUTTONS = {
  startBuilding: "Start Building",
  developerDashboard: "Developer Dashboard",
  dialectDocs: "Dialect Docs",
  moreFromDialect: "More from Dialect",
  makeProposal: "Make a Proposal",
  applyMicrogrant: "Apply for Microgrant",
};

export const HEADINGS = {
  featuredAction: {
    eyebrow: "Featured Action",
    headline: "Blockchain Links, or Blinks",
  },
  meetUsers: "Meet users where they are, with blinks.",
  withActions: "With Solana Actions, request transactions with…",
  aboutSolana: {
    headline: "About Solana",
    body: "Solana is a blockchain built for mass adoption. The high-performance network acts as a single global state machine — it's open, interoperable, and decentralized. ",
  },
};

export const CONTENT = {
  blinksDescription:
    "Using Solana Actions, you can turn any transaction into a blockchain link that can be shared anywhere on the internet — no third party application required. Request a payment in a text message. Vote on governance in a chatroom. Buy an NFT on social media. It's all possible.",
  meetUsersCaption:
    "<p>Make a donation with <strong>Sphere</strong>. Purchase an NFT with <strong>Tensor.</strong> Vote on proposals with<strong> Realms. </strong></p>",
  interfaceNote:
    "Blockchain links are an interface. Solana Actions are the APIs to deliver transactions on many surfaces.",
};

export const SWITCHBACK = {
  dialect: {
    headline: "Get Started with Dialect",
    body: "<p>Build, test, and deploy blinks quickly with Dialect's suite of developer tools.</p>",
  },
};

export const CONVERSION_PANEL = {
  grants: {
    heading: "Got a big idea?",
    body: "Apply for a grant to help bring your idea for a Solana Action or blink integration to life.",
  },
};

export const SLIDER_CARDS = [
  { title: "A link " },
  { title: "A QR Code" },
  { title: "A push notification" },
  { title: "A messaging app " },
  { title: "A button" },
  { title: "Anywhere you can place a URL" },
];

export const FEATURE_HIGHLIGHT = {
  cards: [
    {
      feature: "FAST",
      body: "Solana has slot times of 400 milliseconds.",
      stat: { description: "Transactions per second" },
    },
    {
      feature: "SCALABLE",
      body: "Solana processes more transactions than every other major blockchain combined.",
      stat: { description: "Average fee", staticValue: "$0.0025" },
    },
    {
      feature: "INNOVATIVE",
      body: "Thousands of developers are building unique tools — from enterprise-friendly token extensions to highly scalable state compression.",
      stat: { description: "Active Developers", staticValue: "3000+" },
    },
    {
      feature: "EFFICIENT",
      body: "Each Solana transaction uses about the same energy as a few Google searches.",
      stat: { description: "Net Carbon Impact", staticValue: "0" },
    },
  ],
};

export const FAQ = [
  {
    title: "What are Solana Actions and blockchain links (blinks)?",
    body: "<p>Solana Actions are specification-compliant APIs that return transactions on the Solana blockchain to be previewed, signed, and sent across various contexts, including QR codes, buttons + widgets in mobile and desktop applications, and websites across the internet. Actions make it simple for developers to integrate the things you can do throughout the Solana ecosystem right into your environment, allowing you to perform blockchain transactions without needing to navigate away to a different app or webpage.</p><p>Blockchain links – or blinks – turn any Solana Action into a shareable, metadata-rich link. Blinks allow Action-aware clients (browser extension wallets, bots) to display additional capabilities for the user. On a website, a blink might immediately trigger a transaction preview in a wallet without going to a decentralized app; in Discord, a bot might expand the blink into an interactive set of buttons. This pushes the ability to interact on-chain to any web surface capable of displaying a URL.</p>",
  },
  {
    title: "What is the difference between Actions and blinks?",
    body: "<p>Actions are APIs that allow complex business logic (both on and off-chain) to be used to construct transaction messages that are previewed, signed, and sent by the client. Native buttons, QR codes, or URLs (blinks) can initiate an Action.</p><p>Blinks are one way to interact with an Action. Blinks allow users to execute blockchain transactions directly from URLs, making decentralized applications accessible from any platform or device.</p>",
  },
  {
    title: "How is Solana Pay different from Actions?",
    body: "<p>Solana Pay transactions are now called Actions. Actions are not specific to payments – there are many other types of Actions, such as voting, staking, swapping, minting and more.</p><p>The goal with Actions is to apply the Solana Pay specification to many more use cases. By using the Solana Pay primitive as inspiration, Actions will change how users interact with blockchain in everyday environments.</p><p>In short, the Solana Pay spec isn't changing. But what you can do with Actions expands the scope from payments to anything you can do onchain.</p>",
  },
  {
    title: "What are some examples of how Actions and blinks can be used?",
    body: "<p>Some examples of Actions might include:</p><ul><li>Staking SOL to help secure the Solana network, including liquid staking tokens</li><li>Allowing customers to pay at a retail store using a QR code scan</li><li>Token-gated minting experiences</li><li>Enabling e-commerce websites to accept cryptocurrency payments directly from product pages</li><li>Topping up a trading account before a margin call</li><li>Integrating blockchain functionality into gaming platforms for in-game asset purchases and trades</li></ul><p>Some examples of blinks might include:</p><ul><li>Tipping content creators on social media without the need for complex wallet setups</li><li>Minting custom NFTs or participating in governance votes directly from URLs</li><li>Letting users vote on community policies via links in newsletters</li></ul>",
  },
  {
    title: "What are some key benefits of using Actions and blinks?",
    body: "<p>Key benefits include:</p><ul><li>Enhancing user experiences by bringing signable transactions to users where they already are.</li><li>Increasing accessibility to Web3 applications from any platform.</li><li>Eliminating the friction of many clicks on many websites to send an on-chain transaction.</li><li>Simplifying the integration of on-chain actions into existing platforms, websites, or applications for developers.</li></ul>",
  },
  {
    title:
      "How can developers integrate Actions and blinks into their applications?",
    body: '<p>Developers create actions as standalone APIs that conform to the Solana Actions Specification, and then may link them to their existing site URLs using an actions.json file.</p><p>Blinks are fully-qualified URLs. An actions.json file must be published at the root of the domain (e.g., solanapay.com/actions.json) in order to self-register as a blink.</p><p>As of launch, all three extensions (Phantom, Backpack, Dialect) will <em>only</em> unfurl registered ("trusted") Actions URLs on <a href="http://x.com" rel="noopener noreferrer" target="_blank">X</a>. To enable this, developers must register their Actions in the <a href="http://dial.to/register" rel="noopener noreferrer" target="_blank">Dialect Actions Registry</a>.</p><p>Developers can test the entire end-to-end flow, including what the blink will look like, on <a href="http://dial.to" rel="noopener noreferrer" target="_blank">dial.to</a> by inputting their Actions URL.</p><p>Additionally, there are a host of libraries and SDKs for developers who wish to build clients that support blinks, or wallet chrome extensions that add blinks to existing sites like <a href="https://x.com/" rel="noopener noreferrer" target="_blank">X</a>. These libraries make it possible to build applications that render and style blinks with minimal work.</p><p>For more information about Actions and blinks, visit the <a href="https://solana.com/docs/advanced/actions" rel="noopener noreferrer" target="_blank">official Solana documentation</a> and recorded <a href="https://youtu.be/kCht01Ycif0" rel="noopener noreferrer" target="_blank">developer workshop</a>.</p>',
  },
  {
    title: "Are Actions and blinks secure?",
    body: '<p>Actions and blinks are similar to "connecting" your wallet to dApps - trust the sites you know and use, just as you trust the dApps you know and use.</p><p>The first time a wallet attempts to retrieve a transaction from an unknown API, users should be shown a familiar "connect to site" prompt. If the site domain has connected to the wallet in the past, the site domain is more likely to be trustworthy. As with dApps, Action transactions are always simulated prior to execution.</p><p>Note: blinks are executed on a different origin (X, Reddit, etc.) than their Action, so some caution should be exercised.</p>',
  },
  {
    title: "What does the safety roadmap look like?",
    body: '<p>As of launch, users can opt-in to wallet support for Actions and blinks. Launch partner domains are currently whitelisted. Whitelisted site domains are run by launch partners of Solana; however, users should take all the security precautions that they ordinarily would when connecting to a new site domain. If you attempt to connect to a site domain that is not whitelisted, you will be prompted to confirm that you trust this site domain and wish to proceed. Regardless of whether a site domain is whitelisted, transaction simulations / previews still occur in wallets as expected, allowing users to view transaction details before signing.</p><p>In the future, wallets may have a feature that allows them to "infer" trustworthiness based upon whether or not you\'ve used a site before, and assertions may be required from wallets to safeguard users (agnostic of Actions).</p>',
  },
  {
    title:
      "What happens if I click on a blink but don't have a blockchain wallet set up?",
    body: "<p>Blinks are just regular links, with superpowers. If you don't have blink support through a wallet Chrome extension (like Phantom or Backpack), the underlying link will behave like links always do – it will take you to a website. That website is either:</p><ol><li>The existing website of the dApp you are engaging with, whether it be the swap page on Jupiter, an NFT collection on Tensor, or a DAO proposal. From that site you can then take action as you normally do.</li><li>A kind of popup – or \"interstitial\" interface – for independent developers without a pre-existing website or app. This may be a dedicated website, like actions.dialect.to, tiplink.io, or a signing experience in a mobile wallet, with secure, direct access to the user's signing keys.</li></ol><p>In other words, blinks support fallbacks to both familiar website experiences, as well as entirely new, web3-native ways for developers and creators to distribute experiences to their audience.</p><p><br></p>",
  },
  {
    title: "What happens if I don't have a Chrome extension?",
    body: '<p>When an Action is shared via a blink, the blink should provide an <a href="https://solana.com/docs/advanced/actions#blinks" rel="noopener noreferrer" target="_blank">interstitial signing page</a> whenever a Chrome extension is missing. These interstitial sites display the typical "connect to wallet" flow, along with access to embedded wallets associated with emails or phone numbers.</p>',
  },
  {
    title: "What happens if multiple wallets intercept the click?",
    body: "<p>As of launch, all wallet support is opt-in, so users can pick and choose which wallets to use. That said, the wallet whose extension code has been injected first receives priority (agnostic of Actions).</p>",
  },
  {
    title: "What is Dialect's involvement in Actions and blinks?",
    body: '<p><a href="http://dialect.to/" rel="noopener noreferrer" target="_blank">Dialect</a> is building developer tooling that powers Actions, such as forkable, self-hosted interstitial signing sites, SDKs, and analytics for Actions APIs. Other teams are free to build tooling, as well.</p>',
  },
];
