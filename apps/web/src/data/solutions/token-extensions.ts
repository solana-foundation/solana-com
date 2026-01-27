export const META = {
  title: "/solutions/token-extensions",
  seoTitle: "Token Extensions | Solana",
  seoDescription:
    "Using token extensions built in collaboration with large institutions, new token standards unlock rich native functionality designed for complex behaviors without compromising on security or scalability. Businesses can get started today.",
  seoImage:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fa898174340b34faeb6c95c40cfcaa4a0.png",
};

export const HERO = {
  eyebrow: "Token Extensions",
  headline: "Permissioned tokens on a permissionless network",
  body: "<p>Built in collaboration with large institutions, token extensions unlock rich native functionality designed for complex behaviors, without compromising on security or scalability. Get started today.</p>",
};

export const BUTTONS = {
  startBuilding: "Start building",
  getInTouch: "Get in Touch",
  read: "Read",
  contactUs: "Contact US",
  seeDocs: "See the Docs",
  learnMore: "Learn More",
};

export const CONVERSION_PANEL = {
  technicalPaper: {
    heading: "Read the technical paper",
    body: "Token extensions represent a leap forward for the Solana protocol. Dig into the technical explanation, a look at specific token extensions, and potential use cases.",
  },
  cta: {
    heading:
      "Token extensions unlocks new business standards and use cases on the Solana blockchain.",
    body: "Want to build? Get in touch.",
  },
};

export const HEADINGS = {
  features:
    "Get native support for enterprise features — without third party tooling.",
  digIn: "Dig into token extensions",
  faq: {
    headline: "Learn more about token extensions",
    eyebrow: "Frequently ASked Questions",
  },
};

export const SWITCHBACKS = [
  {
    headline: "Build a better stablecoin",
    body: "<p>Token extensions make it easier to issue a stablecoin for your project by providing for native support for stablecoins and monetization options.</p>",
  },
  {
    headline: "Simplify payments with native metadata",
    body: "<p>Transactions no longer have to occur in a vacuum. Using token extensions to couple metadata with transactions, institutions can enable simplified payment reconciliation.</p>",
  },
  {
    headline: "Guide consumers with permanent delegation",
    body: "<p>Create an ideal user experience. Using permanent delegation, token transfers can be gated by digital assets like NFTs or loyalty cards, and make it easier to update tokens that are tied to ownership of real-world assets.</p>",
  },
  {
    headline: "Protect privacy with native support",
    body: "<p>Issuers on Solana can create token extensions that natively promote the preservation of user privacy by masking account balances and transfer amounts, how much is sent in a transaction — while preserving auditing rights to ensure regulatory compliance.</p>",
  },
];

export const CARDS = [
  {
    heading:
      "Token Extensions Enable Native Support for Enterprise-Grade Use Cases",
  },
  { heading: "A Developer's Guide to Token Extensions on Solana" },
  { heading: "Getting Started with Token Extensions" },
  { heading: "Token Extensions Video Workshop" },
];

export const FAQ = [
  {
    title: "What are token extensions?",
    body: "<p>Token extensions are new token program-level features, enabled by the new open-source token minting program available on the Solana blockchain. Token extensions enable the next generation of features for digital assets and stablecoins on the Solana blockchain by imbuing the assets with a native set of rich features ranging from confidentiality to token-gated access to required metadata. Assets minted using this program can bring to life the promise of true programmability of money and assets on the blockchain</p>",
  },
  {
    title: "How is this different from Token-2022?",
    body: "<p>Token-2022 is the technical name and GitHub repository for the new SPL token program, as released by Solana Labs. <em>Token extensions</em>, on the other hand, are what the new token standard enables. Think of them as a list of new features and functions that can now function at the token program level.</p>",
  },
  {
    title:
      "What are the benefits of using token extensions versus the legacy Solana token standard?",
    body: `<p>Token extensions takes the core functionality of tokens on Solana and imbues them with an entirely new, native set of features that open up a whole new set of use cases for digital assets. In the past, application developers had to rely on a mix of ad-hoc protocols, code bases and projects to enable true programmability. Minting tokens that have token extensions enabled allows the developer to natively have access to all of those programmability features, with the flexibility to decide which features to enable or disable.</p><p>A few examples of what is possible natively with token extensions:</p><ul><li>Confidential transfers: The ability to mask token balances and the amounts of token transfers, with auditability from the issuer of the token</li><li>Token gated transfers: The ability to control which wallets can receive tokens based on KYC identifiers</li><li>Transfer Fees: The issuer of the token can charge transfer fees to assist in monetization of transactions</li><li>Required metadata: Metadata about transfers can be mandatory, allowing payment attribution data to be bound to the transaction itself.&nbsp;</li></ul><p>There are several other extensions that enable additional rich functionality for digital asset issuers.</p>`,
  },
  {
    title:
      "Are tokens minted using token extensions backwards compatible with dApps that support Solana tokens today?",
    body: "<p>Tokens minted with token extensions belong to a new protocol. While the protocol is backwards compatible with the existing SPL Token standard, dApps must be upgraded to handle tokens minted with specific extensions.</p>",
  },
  {
    title: "Have token extensions been audited?",
    body: "<p>Yes, the program has gone through 5 audits from the following security firms: Halborn, Zellic, NCC, Trail of Bits, and OtterSec.</p>",
  },
  {
    title:
      "Are there examples of stablecoins or digital assets that have been created using this new token standard?",
    body: "<p>There are several projects about to launch RWA and stablecoins using this program. Paxos recently launched USDP on Solana leveraging token extensions, GMO Trust plans to launch a regulated stablecoin and several other major enterprises are planning on launching throughout the course of 2024.</p>",
  },
  {
    title: "Can I use multiple extensions?",
    body: `<p>Yes — however, some combinations are not yet ready to work in tandem. For example, transfer hooks and confidential transfers do not currently work together. For that particular case, a fix is being developed and can be tracked <a href="https://github.com/solana-labs/solana-program-library/pull/6098" rel="noopener noreferrer" target="_blank">here</a>,</p>`,
  },
  {
    title: "Are all of the extensions available today?",
    body: "<p>With the exception of confidential transfers, all of the extensions are available for use today. Confidential transfers will be available once version 2.0 of the core Agave validator client is released and has been adopted by the network, which is expected to happen by EOY 2024.</p>",
  },
  {
    title:
      "Can the program used for transfer hooks / permanent mint delegation be changed after mint initialization?",
    body: "<p>Yes! As long as the requisite authority is reserved, the program used for both or either of those extensions can be updated to new PDAs.</p>",
  },
  {
    title: "Can I create the destination ATA for a confidential transfer?",
    body: "<p>While you can create the destination ATA for public transfers, the owner of that account needs to set up an encryption key, thus meaning that the owner must configure their account to accept confidential transfers before receiving confidential transfers.</p>",
  },
  {
    title:
      "Can multiple auditors be set for the confidential transfer authority?",
    body: "<p>&nbsp;No. Only a single ElGamal public key (derivable from an ed25519 private key) can be set, and without a fancy key-sharing implementation that single key is the only one capable of auditing transfer amounts.</p>",
  },
  {
    title:
      "I am a developer for a wallet or dApp. What do I need to know to integrate token extensions?",
    body: `<p>Developer documents can be found <a href="https://spl.solana.com/token-2022" rel="noopener noreferrer" target="_blank">here</a>. </p>`,
  },
];
