const CONTENT_BLOCK_STYLE_KEYS = {
  tocBox: "tocBox",
  columnCopy: "columnCopy",
  spacing: "spacing",
  tableWrapper: "tableWrapper",
  codeBlock: "codeBlock",
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
    medium: { display: "flex" },
    small: { display: "flex" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.columnCopy]: {
    large: { paddingTop: "20px", marginTop: "auto", marginBottom: "auto" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacing]: {
    large: { paddingTop: "20px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.tableWrapper]: {
    large: {
      paddingRight: "50px",
      paddingLeft: "50px",
      paddingTop: "20px",
    },
  },
  [CONTENT_BLOCK_STYLE_KEYS.codeBlock]: {
    large: {
      paddingTop: "20px",
      paddingLeft: "40px",
      paddingRight: "40px",
      paddingBottom: "20px",
      backgroundColor: "rgba(169, 11, 120, 0.3)",
      borderRadius: "30px",
    },
  },
  [CONTENT_BLOCK_STYLE_KEYS.cardDeckWrapper]: {
    large: { paddingTop: "0px", marginTop: "-3px" },
  },
};

export const META = {
  seoImage:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F44332879cab2417692e5975137cb0e27.png",
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
  {
    label: "",
    hierarchy: "outline",
    size: "md",
    iconSize: "md",
    endIcon: "arrow-right",
    url: "/developers/evm-to-svm/client-differences",
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

export const TABLE_OF_CONTENTS_ANCHORS = [
  "#SPL",
  "#writing-programs",
  "#deploying-programs",
  "#summary",
];
