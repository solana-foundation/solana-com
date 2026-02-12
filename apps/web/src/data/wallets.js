export const META = {
  seoImage: "",
};

export const HERO_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F66ae8c1674f64fd7b130787680851470.png";

export const HERO_RIGHT_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F4e7450bbc1114943b89ef51ea59fb791.png";

export const VIDEO_SOURCES = {
  compliance:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F90e8070ca6994080836ec5abe46a40e1_2Fcompressed.mp4",
  oneClickCommerce:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F84b1a021d5e5400397b3ce5cd551a56c_2Fcompressed.mp4",
  feelessTransactions:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F0e2f08aacdc9463585517273101eae3a_2Fcompressed.mp4",
  keyManagement:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F30042b2227264383a694d37ebbaa0991_2Fcompressed.mp4",
};

export const HERO_BUTTONS = [
  {
    labelKey: "buttons.startBuilding",
    hierarchy: "primary",
    size: "md",
    iconSize: "md",
    url: "https://solana.com/docs/intro/wallets",
  },
  {
    labelKey: "buttons.chooseWallet",
    hierarchy: "outline",
    size: "md",
    iconSize: "md",
    url: "/solana-wallets",
  },
];

export const COMPARE_WALLETS_BUTTON = {
  labelKey: "buttons.compareWallets",
  hierarchy: "primary",
  size: "md",
  iconSize: "md",
  url: "https://solana.com/solana-wallets",
};

export const APPLY_FOR_GRANT_BUTTON = {
  labelKey: "buttons.applyForGrant",
  hierarchy: "primary",
  size: "md",
  iconSize: "md",
  url: "https://share.hsforms.com/1GE1hYdApQGaDiCgaiWMXHA5lohw",
};

export const CARD_DECKS = {
  build: [
    {
      headingKey: "cardDecks.build.cards.0.heading",
      bodyKey: "cardDecks.build.cards.0.body",
      callToAction: {
        url: "https://www.notion.so/solanafoundation/Wallet-Builder-s-Starter-Kit-615b61c2fe5d4109be71ec74a91e2034",
        labelKey: "buttons.learnMore",
      },
      headingAs: "h3",
      type: "standard",
      eyebrow: "",
    },
    {
      headingKey: "cardDecks.build.cards.1.heading",
      bodyKey: "cardDecks.build.cards.1.body",
      callToAction: {
        url: "https://solana.com/docs/intro/wallets",
        labelKey: "buttons.learnMore",
      },
      headingAs: "h3",
      type: "standard",
      eyebrow: "",
    },
    {
      headingKey: "cardDecks.build.cards.2.heading",
      bodyKey: "cardDecks.build.cards.2.body",
      callToAction: {
        url: "https://backpack.app/",
        labelKey: "buttons.learnMore",
      },
      headingAs: "h3",
      type: "standard",
      eyebrow: "",
    },
  ],
  buy: [
    {
      headingKey: "cardDecks.buy.cards.0.heading",
      bodyKey: "cardDecks.buy.cards.0.body",
      callToAction: {
        url: "https://www.circle.com/en/programmable-wallets",
        labelKey: "buttons.learnMore",
      },
      type: "standard",
      eyebrow: "",
    },
    {
      headingKey: "cardDecks.buy.cards.1.heading",
      bodyKey: "cardDecks.buy.cards.1.body",
      callToAction: {
        url: "https://www.dynamic.xyz/ecosystems/solana",
        labelKey: "buttons.learnMore",
      },
      type: "standard",
      eyebrow: "",
    },
    {
      headingKey: "cardDecks.buy.cards.2.heading",
      bodyKey: "cardDecks.buy.cards.2.body",
      callToAction: {
        url: "https://www.exodus.com/solana-wallet",
        labelKey: "buttons.learnMore",
      },
      type: "standard",
      eyebrow: "",
    },
  ],
  developerResources: [
    {
      headingKey: "cardDecks.developerResources.cards.0.heading",
      bodyKey: "cardDecks.developerResources.cards.0.body",
      callToAction: {
        url: "https://github.com/ZYJLiu/axum-solana-transfer",
        labelKey: "buttons.learnMore",
      },
      type: "standard",
      eyebrow: "",
    },
    {
      headingKey: "cardDecks.developerResources.cards.1.heading",
      bodyKey: "cardDecks.developerResources.cards.1.body",
      callToAction: {
        url: "https://github.com/kilogold/solana-rust-client/tree/kelvin",
        labelKey: "buttons.learnMore",
      },
      type: "standard",
      eyebrow: "",
    },
    {
      headingKey: "cardDecks.developerResources.cards.2.heading",
      bodyKey: "cardDecks.developerResources.cards.2.body",
      callToAction: {
        url: "https://github.com/ZYJLiu/axum-solana-transfer",
        labelKey: "buttons.learnMore",
      },
      type: "standard",
      eyebrow: "",
    },
  ],
};

export const SECTION_PADDING_STYLES = {
  large: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "20px",
    paddingBottom: "20px",
    marginTop: "0px",
    minHeight: "100px",
  },
};

export const COPY_OFFSET_STYLES = {
  large: {
    marginTop: "-50px",
  },
  small: {
    marginTop: "-30px",
  },
};

export const SECTION_OFFSET_STYLES = {
  large: {
    marginTop: "-100px",
  },
  small: {
    marginTop: "-45px",
  },
};

export const CARD_DECK_OFFSET_STYLES = {
  large: {
    marginTop: "-100px",
  },
};

export const VIDEO_STYLES = {
  borderRadius: "30px",
  borderWidth: "2px",
  borderStyle: "solid",
  borderColor: "#14f195",
  width: "33%",
  minWidth: "260px",
};

export const EVM_TO_SVM_BLOCK_STYLES = {
  spacing: {
    large: { paddingTop: "20px" },
  },
  codeBlock: {
    large: {
      marginTop: "-50px",
    },
    small: {
      marginTop: "-20px",
    },
    // large: {
    //   paddingTop: "20px",
    //   paddingLeft: "40px",
    //   paddingRight: "40px",
    //   paddingBottom: "20px",
    //   backgroundColor: "rgba(169, 11, 120, 0.3)",
    //   borderRadius: "30px",
    // },
  },
  codeBlockBare: {
    // large: {
    //   paddingTop: "20px",
    //   paddingBottom: "20px",
    // },
  },
  smallOnly: {
    large: { display: "none" },
    medium: { display: "none" },
    small: { display: "flex" },
  },
  tokenTable: {
    large: {
      paddingRight: "50px",
      paddingLeft: "50px",
      paddingTop: "20px",
    },
  },
};

export const EVM_TO_SVM_META = {
  seoImage:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdcec953384914384853a2faf467f6c10.png",
};

export const EVM_TO_SVM_NAV_BUTTONS = [
  {
    label: "",
    hierarchy: "outline",
    size: "md",
    iconSize: "md",
    startIcon: "none",
    endIcon: "none",
    url: "https://solana.com/developers/evm-to-svm",
  },
];

export const EVM_TO_SVM_RESOURCE_CARD_DECK = {
  numCols: 3,
  featured: true,
  cards: [
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "/developers/guides/getstarted/hello-world-in-your-browser",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://www.soldev.app/course",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://youtu.be/0P8JeL3TURU?feature=shared",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "/developers",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
  ],
};

export const EVM_TO_SVM_RESOURCE_CARD_DECK_WRAPPER_STYLES = {
  large: { paddingTop: "0px", marginTop: "-3px" },
};

export const EVM_TO_SVM_TABLE_OF_CONTENTS_ANCHORS = [
  "#account-model",
  "#benefits",
  "#local-fee-markets",
  "#fees-solana",
  "#transactions-solana",
  "#transaction-limitations",
  "#mempool",
  "#where-smart-contract-code",
  "#developer-environment",
  "#languages",
  "#tools",
  "#differences-smart-contract",
  "#building",
];

export const EVM_TO_SVM_TABLE_OF_CONTENTS_INDENTS = [
  "1em",
  "1em",
  "1em",
  "3em",
  "3em",
  "3em",
  "3em",
  "3em",
  "1em",
  "3em",
  "3em",
  "3em",
  "1em",
];

export const EVM_TO_SVM_TABLE_OF_CONTENTS_BOX_STYLES = {
  large: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    flexShrink: "0",
    boxSizing: "border-box",
    lineHeight: "normal",
    height: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingBottom: "20px",
    paddingRight: "20px",
    backgroundColor: "rgba(21, 21, 21, 1)",
    borderRadius: "20px",
  },
  medium: { display: "flex" },
  small: { display: "flex" },
};

export const EVM_TO_SVM_TABLE_OF_CONTENTS_IMAGE = {
  src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Ff1d4c0384bf94fd4bd51807305310e9e.png",
  width: 1314,
  height: 1500,
  sizes: "(max-width: 998px) 47vw, 43vw",
  responsiveStyles: {
    large: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      flexShrink: "0",
      boxSizing: "border-box",
      width: "100%",
      minHeight: "20px",
      minWidth: "20px",
      overflow: "hidden",
      marginTop: "auto",
      marginBottom: "auto",
    },
    medium: { display: "flex" },
    small: { display: "none" },
  },
};

export const EVM_TO_SVM_CONTENT_IMAGES = {
  accountModel: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fc213f02517a64dfbadfb56e05c51128c.png",
    width: 1200,
    height: 675,
    sizes: "(max-width: 638px) 95vw, (max-width: 998px) 96vw, 87vw",
    responsiveStyles: {
      large: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        flexShrink: "0",
        boxSizing: "border-box",
        width: "100%",
        minHeight: "20px",
        minWidth: "20px",
        overflow: "hidden",
      },
    },
  },
  benefits: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F67649c6ad3464fa1b07b3bdabce52c8c.png",
    width: 1200,
    height: 675,
    sizes: "(max-width: 638px) 95vw, (max-width: 998px) 96vw, 87vw",
    responsiveStyles: {
      large: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        flexShrink: "0",
        boxSizing: "border-box",
        width: "100%",
        minHeight: "20px",
        minWidth: "20px",
        overflow: "hidden",
      },
    },
  },
  pdaDiagram: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F169d65c59d4443ff9229e76bbcf69697.png",
    width: 277,
    height: 59,
    sizes: "(max-width: 638px) 63vw, (max-width: 998px) 41vw, 29vw",
    responsiveStyles: {
      large: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        flexShrink: "0",
        boxSizing: "border-box",
        width: "100%",
        minHeight: "20px",
        minWidth: "20px",
        overflow: "hidden",
        maxWidth: "400px",
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
  },
  playground: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F0ca7cec6395f41a6b6f8314fd3c3c1e9.png",
    width: 724,
    height: 650,
    sizes: "(max-width: 638px) 79vw, (max-width: 998px) 51vw, 36vw",
    responsiveStyles: {
      large: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        flexShrink: "0",
        boxSizing: "border-box",
        width: "100%",
        minHeight: "20px",
        minWidth: "20px",
        overflow: "hidden",
        maxWidth: "500px",
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
  },
  playgroundLogs: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F7f382a94721e484aa57ae08c2f4391b9.png",
    width: 1210,
    height: 416,
    sizes: "(max-width: 638px) 95vw, (max-width: 998px) 71vw, 50vw",
    responsiveStyles: {
      large: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        flexShrink: "0",
        boxSizing: "border-box",
        width: "100%",
        minHeight: "20px",
        minWidth: "20px",
        overflow: "hidden",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "700px",
      },
    },
  },
  voteLogs: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F914ca3ebc38945be808993711af801e6.png",
    width: 1212,
    height: 344,
    sizes: "(max-width: 638px) 95vw, (max-width: 998px) 71vw, 50vw",
    responsiveStyles: {
      large: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        flexShrink: "0",
        boxSizing: "border-box",
        width: "100%",
        minHeight: "20px",
        minWidth: "20px",
        overflow: "hidden",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "700px",
      },
    },
  },
  candidateAccounts: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F4930bf05e3e9451b93bd895750065759.png",
    width: 610,
    height: 824,
    sizes: "(max-width: 638px) 79vw, (max-width: 998px) 51vw, 36vw",
    responsiveStyles: {
      large: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        flexShrink: "0",
        boxSizing: "border-box",
        width: "100%",
        minHeight: "20px",
        minWidth: "20px",
        overflow: "hidden",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "500px",
      },
    },
  },
};

export const EVM_TO_SVM_TOKEN_EXTENSION_LINKS = [
  "https://solana.com/developers/guides/token-extensions/mint-close-authority",
  "https://solana.com/developers/guides/token-extensions/transfer-fee",
  "https://solana.com/developers/guides/token-extensions/non-transferable",
  "https://solana.com/developers/guides/token-extensions/interest-bearing-tokens",
  "https://solana.com/developers/guides/token-extensions/permanent-delegate",
  null,
  null,
  null,
  null,
];
