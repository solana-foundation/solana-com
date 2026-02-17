const CONTENT_BLOCK_STYLE_KEYS = {
  tocBox: "tocBox",
  columnImage: "columnImage",
  spacingWithMargins: "spacingWithMargins",
  spacing: "spacing",
  codeBlock: "codeBlock",
  codeBlockSpacing: "codeBlockSpacing",
  smallOnly: "smallOnly",
  tableWrapper: "tableWrapper",
  imageFull: "imageFull",
  imageMax400: "imageMax400",
  imageMax500: "imageMax500",
  imageMax700: "imageMax700",
  cardDeckWrapper: "cardDeckWrapper",
};

export const BLOCK_STYLES = {
  [CONTENT_BLOCK_STYLE_KEYS.tocBox]: {
    large: {
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
  },
  [CONTENT_BLOCK_STYLE_KEYS.columnImage]: {
    large: {
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
  [CONTENT_BLOCK_STYLE_KEYS.spacingWithMargins]: {
    large: { paddingTop: "20px", marginTop: "auto", marginBottom: "auto" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacing]: {
    large: { paddingTop: "20px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.codeBlock]: {
    // large: {
    //   paddingTop: "20px",
    //   paddingLeft: "40px",
    //   paddingRight: "40px",
    //   paddingBottom: "20px",
    //   backgroundColor: "rgba(169, 11, 120, 0.3)",
    //   borderRadius: "30px",
    // },
  },
  [CONTENT_BLOCK_STYLE_KEYS.codeBlockSpacing]: {
    // large: { paddingTop: "20px", paddingBottom: "20px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.smallOnly]: {
    large: { display: "none" },
    medium: { display: "none" },
    small: { display: "flex" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.tableWrapper]: {
    large: {
      paddingRight: "50px",
      paddingLeft: "50px",
      paddingTop: "20px",
    },
  },
  [CONTENT_BLOCK_STYLE_KEYS.imageFull]: {
    large: {
      width: "100%",
      minHeight: "20px",
      minWidth: "20px",
      overflow: "hidden",
    },
  },
  [CONTENT_BLOCK_STYLE_KEYS.imageMax400]: {
    large: {
      width: "100%",
      maxWidth: "400px",
      marginLeft: "auto",
      marginRight: "auto",
      minHeight: "20px",
      minWidth: "20px",
      overflow: "hidden",
    },
  },
  [CONTENT_BLOCK_STYLE_KEYS.imageMax500]: {
    large: {
      width: "100%",
      maxWidth: "500px",
      marginLeft: "auto",
      marginRight: "auto",
      minHeight: "20px",
      minWidth: "20px",
      overflow: "hidden",
    },
  },
  [CONTENT_BLOCK_STYLE_KEYS.imageMax700]: {
    large: {
      width: "100%",
      maxWidth: "700px",
      marginLeft: "auto",
      marginRight: "auto",
      minHeight: "20px",
      minWidth: "20px",
      overflow: "hidden",
    },
  },
  [CONTENT_BLOCK_STYLE_KEYS.cardDeckWrapper]: {
    large: { paddingTop: "0px", marginTop: "-3px" },
  },
};

export const META = {
  seoImage: "",
};

export const IMAGE_ASSETS = {
  toc: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Ff1d4c0384bf94fd4bd51807305310e9e.png",
    width: 1314,
    height: 1500,
    sizes: "(max-width: 998px) 47vw, 43vw",
    fit: "contain",
    alt: "Table of contents for EVM to Solana developer guide",
  },
  accountModel: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fc213f02517a64dfbadfb56e05c51128c.png",
    width: 1200,
    height: 675,
    sizes: "(max-width: 638px) 95vw, (max-width: 998px) 96vw, 87vw",
    fit: "cover",
    alt: "Diagram comparing EVM and Solana account model",
  },
  tokenProgram: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F67649c6ad3464fa1b07b3bdabce52c8c.png",
    width: 1200,
    height: 675,
    sizes: "(max-width: 638px) 95vw, (max-width: 998px) 96vw, 87vw",
    fit: "cover",
    alt: "Solana Token Program architecture diagram",
  },
  upgradeFlow: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F169d65c59d4443ff9229e76bbcf69697.png",
    width: 277,
    height: 59,
    sizes: "(max-width: 638px) 63vw, (max-width: 998px) 41vw, 29vw",
    fit: "contain",
    alt: "Solana program upgrade flow diagram",
  },
  playgroundInit: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F0ca7cec6395f41a6b6f8314fd3c3c1e9.png",
    width: 724,
    height: 650,
    sizes: "(max-width: 638px) 79vw, (max-width: 998px) 51vw, 36vw",
    fit: "contain",
    alt: "Solana Playground initialization screenshot",
  },
  playgroundLogs: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F7f382a94721e484aa57ae08c2f4391b9.png",
    width: 1210,
    height: 416,
    sizes: "(max-width: 638px) 95vw, (max-width: 998px) 71vw, 50vw",
    fit: "contain",
    alt: "Solana Playground console logs output",
  },
  playgroundVote: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F914ca3ebc38945be808993711af801e6.png",
    width: 1212,
    height: 344,
    sizes: "(max-width: 638px) 95vw, (max-width: 998px) 71vw, 50vw",
    fit: "contain",
    alt: "Solana Playground vote transaction example",
  },
  playgroundResults: {
    src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F4930bf05e3e9451b93bd895750065759.png",
    width: 610,
    height: 824,
    sizes: "(max-width: 638px) 79vw, (max-width: 998px) 51vw, 36vw",
    fit: "contain",
    alt: "Solana Playground execution results",
  },
};

export const NAV_BUTTONS = [
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

export const RESOURCE_CARD_DECK = {
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
