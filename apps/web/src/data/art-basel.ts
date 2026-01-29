export const META = {
  seoImage:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F2e0fd340e3ff4300a3c039e3d74ca38f.png",
};

export const HERO_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F8c01d3605f824c06af5617fd390db375.png";

export const HERO_MOBILE_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F7c1d61c8c4ad4a72833e0e8a9d9a253e.png";

export const ARTIST_VIDEO =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fc47d00bdac004e3bbd0833c00176ef8d_2Fcompressed.mp4";

export const LAURA_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F7a95ee5e42f64dfe95b933a747535da7.png";

export const CULTURE_HACKER_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F85901a7b89c4487781c417f9654d8880.png";

export const SWITCHBACK_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F23574a515ef7457599630bc2a8babdc7.png";

export const CONVERSION_PANEL_IMAGE =
  "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F5779693873fa454aaf581ae3cda126a4.png";

export const CARD_DECK_CARDS = [
  {
    type: "standard",
    headingAs: "h3",
    body: "",
    backgroundGradient: "pink",
    callToAction: {
      hierarchy: "outline",
      size: "lg",
      iconSize: "lg",
      startIcon: "none",
      endIcon: "arrow-right",
      url: "https://solana.com/possible",
    },
    backgroundImage: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F9c637a7f25044a358b89ddb3658fabd9.png",
    },
    mobileBackgroundImage: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F3b67028eddbc41229a2fd62081507673.png",
    },
  },
  {
    type: "standard",
    headingAs: "h3",
    body: "",
    backgroundGradient: "pink",
    callToAction: {
      hierarchy: "outline",
      size: "lg",
      endIcon: "arrow-right",
      url: "https://solana.com/community",
    },
    backgroundImage: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F4dac5c4562724a54af6956e01823923b.png",
    },
    mobileBackgroundImage: {
      src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fbcb06f4e7bd649b5827827d4d5c26db5.png",
    },
  },
];

export const CARD_DECK_COLUMNS = 2;

export const SWITCHBACK = {
  assetSide: "left",
  image: {
    alt: "",
    src: SWITCHBACK_IMAGE,
  },
  buttons: [
    {
      hierarchy: "outline",
      size: "lg",
      url: "https://solana.com/solutions/artists-creators",
      endIcon: "none",
    },
  ],
};

export const MINTING_PANEL = {
  variant: "offset",
  desktopImage: {
    src: CONVERSION_PANEL_IMAGE,
  },
  mobileImage: {
    src: CONVERSION_PANEL_IMAGE,
  },
  buttons: [
    {
      hierarchy: "secondary",
      size: "md",
      endIcon: "arrow-up-right",
      iconSize: "sm",
      url: "https://primitives.xyz/home",
    },
  ],
};

export const CONTACT_PANEL = {
  buttons: [
    {
      hierarchy: "secondary",
      size: "lg",
      url: "mailto:bd-social@solana.org",
    },
    {
      hierarchy: "outline",
      size: "lg",
      url: "https://solana.com/news/tag/case-studies",
    },
  ],
};
