export const META = {
  seoImage: "",
} as const;

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
} as const;

export const NAV_BUTTONS = [
  {
    label: "",
    hierarchy: "outline",
    size: "md",
    iconSize: "md",
    startIcon: "none",
    endIcon: "none",
    url: "/developers/migrate-to-solana/ethereum",
  },
] as const;

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
        url: "/docs/intro/quick-start",
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
} as const;
