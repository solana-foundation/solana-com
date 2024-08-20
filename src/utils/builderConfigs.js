import {
  BuilderAPIs,
  getEndpointsForBuilderAPI,
} from "@solana-foundation/solana-lib";

// For Usage inside Other Configs
export const ButtonConfig = {
  name: "Button",
  inputs: [
    {
      name: "label",
      type: "text",
      defaultValue: "Button CTA",
      localized: true,
    },
    {
      name: "hierarchy",
      type: "text",
      enum: [
        "primary",
        "link",
        "secondary",
        "tertiary",
        "outline",
        "purpleGradient",
        "greenGradient",
      ],
      defaultValue: "primary",
    },
    {
      name: "size",
      type: "text",
      enum: ["sm", "md", "lg", "xl"],
      defaultValue: "md",
    },
    {
      name: "url",
      type: "url",
    },
    {
      name: "startIcon",
      type: "text",
      enum: [
        "none",
        "arrow-down-left",
        "arrow-down-right",
        "arrow-right",
        "arrow-up-right",
        "carbon-for-ibm",
        "check-circle",
        "chevron",
        "circle",
        "content-delivery-network",
        "discord-green",
        "discord",
        "facebook-share",
        "github",
        "home",
        "link",
        "linkedin-share",
        "menu-01",
        "play",
        "reddit",
        "slash",
        "solana-green",
        "solana",
        "star",
        "sub-volume-carbon",
        "telegram-share",
        "telegram",
        "twitter-share",
        "twitter",
        "x-close",
        "youtube",
      ],
    },
    {
      name: "endIcon",
      type: "text",
      enum: [
        "none",
        "arrow-down-left",
        "arrow-down-right",
        "arrow-right",
        "arrow-up-right",
        "carbon-for-ibm",
        "check-circle",
        "chevron",
        "circle",
        "content-delivery-network",
        "discord-green",
        "discord",
        "facebook-share",
        "github",
        "home",
        "link",
        "linkedin-share",
        "menu-01",
        "play",
        "reddit",
        "slash",
        "solana-green",
        "solana",
        "star",
        "sub-volume-carbon",
        "telegram-share",
        "telegram",
        "twitter-share",
        "twitter",
        "x-close",
        "youtube",
      ],
    },
    {
      name: "iconSize",
      type: "text",
      enum: ["sm", "md", "lg", "xl"],
      defaultValue: "md",
      showIf: "options.get('endIcon') || options.get('startIcon')",
    },
  ],
};

const statValue = {
  name: "statValue",
  inputs: [
    {
      name: "statType",
      type: "string",
      enum: ["none", "static", "dynamic"],
      defaultValue: "static",
      localized: false,
    },
    {
      name: "staticValue",
      type: "string",
      defaultValue: "3,751",
      showIf: "options.get('statType') === 'static'",
    },
    {
      name: "dynamicValueSource",
      type: "string",
      enum: Object.values(BuilderAPIs),
      defaultValue: BuilderAPIs.ExplorerAPI,
      showIf: "options.get('statType') === 'dynamic'",
      localized: false,
    },
    {
      name: "dynamicValueEndpoint",
      type: "string",
      enum: getEndpointsForBuilderAPI(BuilderAPIs.ExplorerAPI),
      localized: false,
      showIf: `options.get('statType') === 'dynamic' && options.get('dynamicValueSource') === '${BuilderAPIs.ExplorerAPI}'`,
    },
  ],
};

const FeatureCard = {
  name: "Feature Card",
  inputs: [
    {
      name: "variant",
      type: "text",
      enum: ["logo", "none"],
    },
    {
      name: "color",
      type: "text",
      enum: ["aqua", "orange", "purple", "green"],
    },
    {
      name: "feature",
      type: "text",
      defaultValue: "FAST",
      localized: true,
    },
    {
      name: "body",
      type: "text",
      localized: true,
      defaultValue:
        "Don’t keep your users waiting. Solana has block times of 400 milliseconds — and as hardware gets faster, so will the network.",
    },
    {
      name: "stat",
      type: "object",
      subFields: [
        {
          name: "value",
          type: "object",
          subFields: statValue.inputs,
          defaultValue: {
            statType: "static",
            staticValue: "3,751",
          },
        },
        {
          name: "description",
          type: "text",
          localized: true,
          defaultValue: "Transactions per second",
        },
      ],
      defaultValue: {
        value: {
          statType: "static",
          staticValue: "3,751",
        },
        description: "Transactions per second",
      },
    },
    {
      name: "eyebrow",
      type: "text",
      localized: true,
      defaultValue: "Optional Eyebrow",
    },
    {
      name: "button",
      type: "object",
      subFields: ButtonConfig.inputs,
      defaultValue: {
        label: "Button CTA",
      },
    },
    {
      name: "logo",
      type: "object",
      subFields: [
        {
          name: "src",
          type: "file",
        },
        {
          name: "alt",
          type: "text",
        },
      ],
      showIf: "options.get('variant') === 'logo'",
    },
  ],
};

const featuredCompany = {
  name: "Featured Company",
  inputs: [
    {
      name: "name",
      type: "text",
      localized: true,
      defaultValue: "Solana",
    },
    {
      name: "website",
      type: "text",
    },
    {
      name: "logo",
      type: "object",
      subFields: [
        {
          name: "src",
          type: "file",
        },
        {
          name: "alt",
          type: "text",
          localized: true,
          defaultValue: "",
        },
      ],
      defaultValue: {
        alt: "",
      },
    },
  ],
};

export const AccordionConfig = {
  name: "Accordion",
  inputs: [
    {
      name: "headline",
      type: "text",
      defaultValue: "Frequently asked questions",
      localized: true,
    },
    {
      name: "eyebrow",
      type: "text",
      defaultValue: "Solana FAQ",
      localized: true,
    },
    {
      name: "accordions",
      type: "list",
      defaultValue: [
        {
          title: "Accordion item question",
          body: "<p>Accordion item body</p>",
        },
      ],
      subFields: [
        {
          name: "title",
          type: "text",
          defaultValue: "Accordion item question",
          localized: true,
        },
        {
          name: "body",
          type: "richText",
          defaultValue: "<p>Accordion item body</p>",
          localized: true,
        },
      ],
    },
  ],
};

export const AnnouncementBarConfig = {
  name: "Announcement Bar",
  inputs: [
    {
      name: "color",
      type: "text",
      enum: ["green", "purple"],
      defaultValue: "green",
    },
    {
      name: "text",
      type: "text",
      defaultValue: "Announcement bar text",
      localized: true,
    },
    {
      name: "cta",
      type: "object",
      subFields: [
        {
          name: "label",
          type: "text",
          defaultValue: "Build the next generation of nft brands on Solana",
          localized: true,
        },
        {
          name: "url",
          type: "url",
        },
      ],
      defaultValue: {
        label: "Build the next generation of nft brands on Solana",
      },
    },
    {
      name: "dismissable",
      type: "boolean",
      defaultValue: true,
      localized: false,
    },
  ],
};

export const CardDeckConfig = {
  name: "Card Deck",
  inputs: [
    {
      name: "cards",
      type: "list",
      defaultValue: [
        {
          eyebrow: "Eyebrow Text",

          heading: "Heading Text",

          body: "Body Text",

          callToAction: {
            label: "Button CTA",
          },
        },
      ],
      subFields: [
        {
          name: "type",
          type: "text",
          enum: ["standard", "gradient", "image", "cta", "blog", "tall"],
        },
        {
          name: "eyebrow",
          type: "text",
          defaultValue: "Eyebrow Text",
          localized: true,
        },
        {
          name: "heading",
          type: "text",
          defaultValue: "Heading Text",
          localized: true,
        },
        {
          name: "headingAs",
          type: "text",
          enum: ["h2", "h3", "h4", "h5", "h6"],
        },
        {
          name: "body",
          type: "longtext",
          defaultValue: "Body Text",
          localized: true,
        },
        {
          name: "callToAction",
          type: "object",
          subFields: ButtonConfig.inputs,
          defaultValue: {
            label: "Button CTA",
          },
        },
        {
          name: "backgroundGradient",
          type: "text",
          enum: ["none", "pink", "purple", "blue", "green"],
        },
        {
          name: "backgroundImage",
          type: "object",
          subFields: [
            {
              name: "src",
              type: "file",
              allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
            },
            {
              name: "alt",
              type: "text",
            },
          ],
        },
        {
          name: "mobileBackgroundImage",
          type: "object",
          subFields: [
            {
              name: "src",
              type: "file",
              allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
            },
            {
              name: "alt",
              type: "text",
            },
          ],
          showIf:
            "options.get('type') === 'image' || options.get('type') === 'tall'",
        },
        {
          name: "isFeatured",
          type: "boolean",
        },
        {
          name: "hiddenOnDesktop",
          type: "boolean",
        },
      ],
    },
    {
      name: "featured",
      type: "boolean",
    },
    {
      name: "numCols",
      type: "number",
      helperText: "Provide a number between 1 to 3",
    },
  ],
};

export const CarouselConfig = {
  name: "Carousel",
  defaults: {
    responsiveStyles: {
      large: {
        marginBottom: "64px",
      },
      medium: {
        marginBottom: "64px",
      },
      small: {
        marginBottom: "32px",
      },
    },
  },
  inputs: [
    {
      name: "autoplay",
      type: "boolean",
      defaultValue: true,
      required: true,
    },
    {
      name: "autoplaySpeed",
      type: "number",
      defaultValue: 4000,
      helperText: "Value is in milliseconds",
      showIf: (options) => options.get("autoplay") === true,
      localized: false,
    },
    {
      name: "slides",
      type: "list",
      defaultValue: [
        {
          image: {
            src: "", // Assuming a placeholder or validation for image upload is handled elsewhere.
            alt: "Default Alt Text",
          },
          label: "Slide Label",

          headline: "Slide Headline",

          body: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut diam vel ligula dictum ornare. Maecenas accumsan tristique ornare. Proin volutpat quis ipsum et auctor. Nunc nec vulputate magna.</p>",

          button: {
            label: "Button CTA",
            hierarchy: "outline",
            size: "md",
            url: "https://solana.com/",
            endIcon: "arrow-up-right",
          },
        },
      ],
      subFields: [
        {
          name: "image",
          type: "object",
          subFields: [
            {
              name: "src",
              type: "file",
              allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
            },
            {
              name: "alt",
              type: "text",
              localized: true,
              defaultValue: "Default Alt Text",
            },
          ],
        },
        {
          name: "label",
          type: "text",
          localized: true,
          defaultValue: "Slide Label",
        },
        {
          name: "headline",
          type: "text",
          localized: true,
          defaultValue: "Slide Headline",
        },
        {
          name: "body",
          type: "richText",
          localized: true,
          defaultValue:
            "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut diam vel ligula dictum ornare. Maecenas accumsan tristique ornare. Proin volutpat quis ipsum et auctor. Nunc nec vulputate magna.</p>",
        },
        {
          name: "button",
          type: "object",
          subFields: ButtonConfig.inputs,
          defaultValue: {
            label: "Button CTA",
            hierarchy: "outline",
            size: "md",
            url: "https://solana.com/",
            endIcon: "arrow-up-right",
          },
        },
      ],
    },
  ],
};

export const FeatureHighlightConfig = {
  name: "Feature Highlight",
  inputs: [
    {
      name: "eyebrow",
      type: "text",
      localized: true,
      defaultValue: "Join the nft showdown - ",
    },
    {
      name: "headline",
      type: "text",
      defaultValue: "Join the nft showdown - ",

      localized: true,
    },
    {
      name: "body",
      type: "text",
      defaultValue: "Join the nft showdown - ",

      localized: true,
    },
    {
      name: "mobileBackground",
      type: "object",
      subFields: [{ name: "src", type: "file" }],
    },
    {
      name: "desktopBackground",
      type: "object",
      subFields: [{ name: "src", type: "file" }],
    },
    {
      name: "headingAs",
      type: "text",
      enum: ["h2", "h3", "h4", "h5", "h6"],
    },
    {
      name: "buttons",
      type: "list",
      subFields: ButtonConfig.inputs,
    },
    {
      name: "color",
      type: "text",
      enum: ["green", "purple"],
    },
    {
      name: "cards",
      type: "list",
      subFields: FeatureCard.inputs,
      defaultValue: [
        {
          feature: "FAST",

          body: "Don’t keep your users waiting. Solana has block times of 400 milliseconds — and as hardware gets faster, so will the network.",

          stat: {
            value: "3,751",

            description: "Transactions per second",
          },
          eyebrow: "Optional Eyebrow",

          button: {
            label: "Button CTA",
          },
        },
      ],
    },
    {
      name: "dynamicDataFootnote",
      type: "text",
      helperText:
        "This text will be displayed below the left column when any dynamic data is selected.",
      defaultValue: "Live data",

      advanced: true,
      localized: true,
    },
  ],
};

export const HeadingConfig = {
  name: "Heading",
  inputs: [
    {
      name: "eyebrow",
      type: "text",
      defaultValue: "optional eyebrow",

      localized: true,
    },
    {
      name: "headline",
      type: "text",
      defaultValue: "Go to the source.",

      localized: true,
    },
    {
      name: "body",
      type: "text",
      defaultValue: "Read the documentation for Solana and popular tools.",

      localized: true,
    },
    {
      name: "buttons",
      type: "list",
      subFields: ButtonConfig.inputs,
    },
    {
      name: "variant",
      type: "text",
      enum: ["standard", "floatingButton", "centered"],
      defaultValue: "standard",
    },
  ],
};

export const SliderCard = {
  name: "SliderCard",
  inputs: [
    {
      name: "image",
      type: "object",
      subFields: [
        {
          name: "src",
          type: "file",
        },
        {
          name: "alt",
          type: "text",
          defaultValue: "",
          localized: true,
        },
      ],
      defaultValue: {
        alt: "",
      },
    },
    {
      name: "title",
      type: "text",
      defaultValue: "Solana Core Concepts",

      localized: true,
    },
    {
      name: "body",
      type: "richText",
      defaultValue: "<p>by Solana</p>",

      localized: true,
    },
    {
      name: "url",
      type: "text",
    },
    {
      name: "button",
      type: "object",
      subFields: ButtonConfig.inputs,
      defaultValue: {
        label: "Button CTA",
      },
    },
  ],
};

export const SliderConfig = {
  name: "Slider",
  inputs: [
    {
      name: "cards",
      type: "list",
      subFields: SliderCard.inputs,
    },
  ],
};

export const StatsConfig = {
  name: "Stats",
  inputs: [
    {
      name: "stats",
      type: "list",
      defaultValue: [
        {
          stat: "11.5M+",
          description: "active accounts",
        },
      ],
      subFields: [
        {
          name: "value",
          type: "object",
          subFields: statValue.inputs,
        },
        {
          name: "description",
          type: "text",
          localized: true,
          defaultValue: "active accounts",
        },
      ],
    },
    {
      name: "contained",
      type: "boolean",
      helperText: "If true, only the stats will show (no left column)",
    },
    {
      name: "eyebrow",
      type: "text",
      localized: true,
      defaultValue: "Eyebrow Text",
      showIf: (options) => options.get("contained") === false,
    },
    {
      name: "headline",
      type: "text",
      localized: true,
      defaultValue: "Headline Text",
      showIf: (options) => options.get("contained") === false,
    },
    {
      name: "headingAs",
      type: "text",
      enum: ["h2", "h3", "h4", "h5", "h6"],
      showIf: (options) => options.get("contained") === false,
    },
    {
      name: "buttons",
      type: "list",
      subFields: ButtonConfig.inputs,
      showIf: (options) => options.get("contained") === false,
    },
  ],
};

export const SwitchbackConfig = {
  name: "Switchback",
  inputs: [
    {
      name: "assetSide",
      type: "text",
      enum: ["left", "right"],
      defaultValue: "right",
    },
    {
      name: "eyebrow",
      type: "text",
      localized: true,
      defaultValue: "OPTIONAL EYEBROW",
    },
    {
      name: "headline",
      type: "text",
      localized: true,
      defaultValue: "Build the future together",
    },
    {
      name: "body",
      type: "richText",
      localized: true,
      defaultValue:
        "<p>Lorem ipsum dolor sit amet consectetur. Ipsum nunc quam tellus tincidunt egestas pharetra nibh. Pharetra et felis imperdiet eget in pharetra interdum malesuada. A tortor massa morbi sed purus vitae elit nullam porta. In amet pharetra orci cras sit sit massa dignissim.</p>",
    },
    {
      name: "buttons",
      type: "list",
      subFields: ButtonConfig.inputs,
    },
    {
      name: "image",
      type: "object",
      subFields: [
        {
          name: "src",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
        },
        {
          name: "alt",
          type: "text",
          localized: true,
          defaultValue: "",
        },
      ],
      defaultValue: {
        alt: "",
      },
    },
    {
      name: "newsLetter",
      type: "boolean",
      helperText: "Toggle to show the NewsLetter Form",
    },
    {
      name: "formId",
      type: "text",
      helperText: "Required for Form to render.",
    },
    {
      name: "placeholder",
      type: "text",
      helperText: "Placeholder text for the input field",
      localized: true,
      defaultValue: "",
    },
    {
      name: "emailError",
      type: "text",
      localized: true,
      defaultValue: "",
    },
    {
      name: "submitError",
      type: "text",
      localized: true,
      defaultValue: "",
    },
    {
      name: "successMessge",
      type: "text",
      localized: true,
      defaultValue: "",
    },
  ],
};

export const TrustbarConfig = {
  name: "Trustbar",
  inputs: [
    {
      name: "variant",
      type: "text",
      enum: ["standard", "standardPurple", "grid"],
      defaultValue: "standard",
    },
    {
      name: "eyebrow",
      type: "text",
      defaultValue:
        "Powering tools and integrations from companies all around the world",

      localized: true,
    },
    {
      name: "logos",
      type: "list",
      defaultValue: [
        {
          alt: "",
        },
      ],
      subFields: [
        {
          name: "src",
          type: "file",
        },
        {
          name: "alt",
          type: "text",
          localized: true,
          defaultValue: "",
        },
        {
          name: "url",
          type: "text",
        },
      ],
    },
  ],
};

export const QuoteConfig = {
  name: "Quote",
  inputs: [
    {
      name: "eyebrow",
      type: "text",
      localized: true,
      defaultValue: "why solana",
    },
    {
      name: "quote",
      type: "text",
      localized: true,
      defaultValue:
        "Get started with the best reference implementations. Ecosystem projects provide resources to launch your NFT on Solana in record speed.",
    },
    {
      name: "author",
      type: "object",
      subFields: [
        {
          name: "name",
          type: "text",
        },
        {
          name: "role",
          type: "text",
          localized: true,
          defaultValue: "",
        },
        {
          name: "company",
          type: "text",
          localized: true,
          defaultValue: "",
        },
        {
          name: "thumbnail",
          type: "object",
          subFields: [
            {
              name: "src",
              type: "file",
            },
            {
              name: "alt",
              type: "text",
              localized: true,
              defaultValue: "",
            },
          ],
          defaultValue: {
            alt: "",
          },
        },
      ],
      defaultValue: {
        name: "",
        role: "",
        company: "",
        thumbnail: {
          src: "",
          alt: "",
        },
      },
    },
    {
      name: "image",
      type: "object",
      subFields: [
        {
          name: "src",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
        },
        {
          name: "alt",
          type: "text",
          localized: true,
          defaultValue: "",
        },
      ],
      defaultValue: {
        src: "",
        alt: "",
      },
    },
  ],
};

export const QuoteSliderConfig = {
  name: "Quote Slider",
  inputs: [
    {
      name: "cards",
      type: "list",
      defaultValue: [
        {
          quote:
            "Lorem ipsum dolor sit amet consectetur. Amet dis dolor in nunc turpis dolor convallis pulvinar nisi. Tristique id ipsum massa vel amet id. Dictum nulla dictum.",

          starCount: 5,
          author: {
            name: "Kelly Williams",
            role: "Head of Design",

            company: "Web3 Company",

            thumbnail: {
              src: "",
              alt: "",
            },
          },
        },
      ],
      subFields: [
        {
          name: "quote",
          type: "text",
          localized: true,
          defaultValue:
            "Lorem ipsum dolor sit amet consectetur. Amet dis dolor in nunc turpis dolor convallis pulvinar nisi. Tristique id ipsum massa vel amet id. Dictum nulla dictum.",
        },
        {
          name: "starCount",
          type: "number",
          defaultValue: 5,
          helperText: "Setting the Value to 0 will not render the Stars",
        },
        {
          name: "author",
          type: "object",
          subFields: [
            {
              name: "name",
              type: "text",
              defaultValue: "Kelly Williams",
            },
            {
              name: "role",
              type: "text",
              localized: true,
              defaultValue: "Head of Design",
            },
            {
              name: "company",
              type: "text",
              localized: true,
              defaultValue: "Web3 Company",
            },
            {
              name: "thumbnail",
              type: "object",
              subFields: [
                {
                  name: "src",
                  type: "file",
                  allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
                },
                {
                  name: "alt",
                  type: "text",
                  localized: true,
                  defaultValue: "",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const ConversionPanelConfig = {
  name: "Conversion Panel",
  inputs: [
    {
      name: "variant",
      type: "text",
      enum: ["centered", "inline-centered", "offset"],
    },
    {
      name: "mobileBackground",
      type: "object",
      subFields: [{ name: "src", type: "file" }],
      showIf: (options) => options.get("variant") === "centered",
    },
    {
      name: "desktopBackground",
      type: "object",
      subFields: [{ name: "src", type: "file" }],
      showIf: (options) => options.get("variant") === "centered",
    },
    {
      name: "heading",
      type: "text",
      localized: true,
      defaultValue: "Conversion panel headline",
    },
    {
      name: "body",
      type: "text",
      localized: true,
      defaultValue: "Conversion panel body",
    },
    {
      name: "buttons",
      type: "list",
      subFields: ButtonConfig.inputs,
    },
    {
      name: "mobileImage",
      type: "object",
      subFields: [
        {
          name: "src",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
        },
      ],
      showIf: (options) => options.get("variant") === "offset",
    },
    {
      name: "desktopImage",
      type: "object",
      subFields: [
        {
          name: "src",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
        },
      ],
      showIf: (options) => options.get("variant") === "offset",
    },
    {
      name: "showLogos",
      type: "boolean",
    },
    {
      name: "logos",
      type: "list",
      subFields: [
        {
          name: "src",
          type: "file",
        },
        {
          name: "alt",
          type: "text",
          localized: true,
          defaultValue: "",
        },
      ],
      defaultValue: [
        {
          alt: "",
        },
      ],
    },
    {
      name: "listItems",
      type: "list",
      subFields: ButtonConfig.inputs,
      showIf: (options) => options.get("variant") === "inline-centered",
      helperText:
        "Will only showcase if the value of the variant is set to inline-centered",
    },
    {
      name: "newsLetter",
      type: "boolean",
      helperText: "Toggle to show the NewsLetter Form",
      showIf: (options) => options.get("variant") === "centered",
    },
    {
      name: "formId",
      type: "text",
      helperText: "Required for Form to render.",
      showIf: (options) => options.get("variant") === "centered",
    },
    {
      name: "placeholder",
      type: "text",
      localized: true,
      defaultValue: "",

      helperText: "Placeholder text for the input field",
      showIf: (options) => options.get("variant") === "centered",
    },
    {
      name: "emailError",
      type: "text",
      localized: true,
      defaultValue: "",

      showIf: (options) => options.get("variant") === "centered",
    },
    {
      name: "submitError",
      type: "text",
      localized: true,
      defaultValue: "",

      showIf: (options) => options.get("variant") === "centered",
    },
    {
      name: "successMessge",
      type: "text",
      localized: true,
      defaultValue: "",

      showIf: (options) => options.get("variant") === "centered",
    },
  ],
};

export const HeroConfig = {
  name: "Hero",
  inputs: [
    {
      name: "eyebrow",
      type: "text",
      localized: true,
      defaultValue: "Optional Eyebrow",
    },
    {
      name: "headline",
      type: "text",
      localized: true,
      defaultValue: "Powerful for developers. Fast for everyone.",
    },
    {
      name: "headingAs",
      type: "text",
      enum: ["h1", "h2", "h3", "h4", "h5", "h6"],
      defaultValue: "h1",
    },
    {
      name: "body",
      type: "richText",
      localized: true,
      defaultValue:
        "<p>Bring blockchain to the people. Solana supports experiences for power users, new consumers, and everyone in between.</p>",
    },
    {
      name: "buttons",
      type: "list",
      subFields: ButtonConfig.inputs,
    },
    {
      name: "newsLetter",
      type: "boolean",
      defaultValue: false,
    },
    {
      name: "formId",
      type: "text",
      helperText: "Required for Form to render.",
      showIf: (options) => options.get("newsLetter") === true,
    },
    {
      name: "centered",
      type: "boolean",
      defaultValue: false,
    },
    {
      name: "image",
      type: "object",
      subFields: [
        {
          name: "src",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
        },
        {
          name: "alt",
          type: "text",
          localized: true,
          defaultValue: "",
        },
      ],
      defaultValue: {
        alt: "",
      },
      showIf: (options) => options.get("centered") === false,
      helperText:
        "Will only showcase if the value of the centered field is set to true",
    },
    {
      name: "rightImage",
      type: "object",
      subFields: [
        {
          name: "src",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
        },
        {
          name: "alt",
          type: "text",
          localized: true,
          defaultValue: "",
        },
      ],
      defaultValue: {
        alt: "",
      },
      showIf: (options) => options.get("centered") === true,
      helperText:
        "Will only showcase if the value of the centered field is set to true. Make sure leftImage fields are left empty.",
    },
    {
      name: "leftImage",
      type: "object",
      subFields: [
        {
          name: "src",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
        },
        {
          name: "alt",
          type: "text",
          localized: true,
          defaultValue: "",
        },
      ],
      defaultValue: {
        alt: "",
      },
      showIf: (options) => options.get("centered") === true,
      helperText:
        "Will only showcase if the value of the centered field is set to true. Make sure rightImage fields are left empty.",
    },
  ],
  defaults: {
    responsiveStyles: {
      large: {
        overflowX: "hidden",
      },
    },
  },
};

export const CommunityGalleryConfig = {
  name: "CommunityGallery",
  inputs: [
    {
      name: "square",
      type: "boolean",
      defaultValue: false,
    },
    {
      name: "cards",
      type: "list",
      copyOnAdd: false,
      helperText:
        "When a cardType stat or cardType image card with a small size is chosen, the subsequent card should be a stat card or a small image card. This helps avoid any layout gaps and ensures a seamless display. ",
      subFields: [
        {
          name: "cardType",
          type: "text",
          enum: ["image", "stat"],
        },
        {
          name: "heading",
          type: "text",
          localized: true,
          defaultValue: "",

          showIf: "options.get('cardType') === 'image'",
        },
        {
          name: "stat",
          type: "text",
          localized: true,
          defaultValue: "",

          showIf: "options.get('cardType') === 'stat'",
        },
        {
          name: "eyebrow",
          type: "text",
          localized: true,
          defaultValue: "",

          showIf: "options.get('cardType') === 'stat'",
        },
        {
          name: "body",
          type: "text",
          localized: true,
          defaultValue: "",
        },
        {
          name: "button",
          type: "object",
          subFields: ButtonConfig.inputs,
          defaultValue: {
            label: "Button CTA",
          },
        },
        {
          name: "size",
          type: "text",
          enum: ["small", "large", "skinny"],
          showIf: "options.get('cardType') === 'image'",
        },
        {
          name: "image",
          type: "object",
          subFields: [
            {
              name: "src",
              type: "file",
              allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
            },
            {
              name: "alt",
              type: "text",
              localized: true,
              defaultValue: "",
            },
          ],
          defaultValue: {
            alt: "",
          },
          showIf: "options.get('cardType') === 'image'",
        },
      ],
    },
  ],
};

export const SwitcherConfig = {
  name: "Switcher",
  inputs: [
    {
      name: "headline",
      type: "text",
      localized: true,
      defaultValue: "Build for growth.",
    },
    {
      name: "headingAs",
      type: "text",
      enum: ["h2", "h3", "h4", "h5", "h6"],
    },
    {
      name: "eyebrow",
      type: "text",
      localized: true,
      defaultValue: "Optional Eyebrow",
    },
    {
      name: "body",
      type: "text",
      localized: true,
      defaultValue: "Read the documentation for Solana and popular tools.",
    },
    {
      name: "switcherCards",
      type: "list",
      helperText: "Switcher Card Required to Render the Component",
      subFields: [
        {
          name: "category",
          type: "text",
          localized: true,
          defaultValue: "Gaming",
        },
        {
          name: "eyebrow",
          type: "text",
          localized: true,
          defaultValue: "Optional Eyebrow",
        },
        {
          name: "description",
          type: "text",
          localized: true,
          defaultValue: "Optional Description Text",
        },
        {
          name: "button",
          type: "object",
          subFields: ButtonConfig.inputs,
          defaultValue: {
            label: "Button CTA",
          },
        },
        {
          name: "image",
          type: "object",
          subFields: [
            {
              name: "src",
              type: "file",
              allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
            },
            {
              name: "alt",
              type: "text",
              localized: true,
              defaultValue: "",
            },
          ],
          defaultValue: {
            alt: "",
          },
        },
        {
          name: "featuredCompany",
          type: "object",
          subFields: featuredCompany.inputs,
          defaultValue: {
            name: "Solana",
          },
        },
        {
          name: "companies",
          type: "list",
          subFields: featuredCompany.inputs,
          defaultValue: {
            name: "Solana",
          },
        },
      ],
      defaultValue: [
        {
          category: "Gaming",
          eyebrow: "",
          description: "",
          button: {
            label: "Button CTA",
          },
        },
      ],
    },
  ],
};

export const SwitchbackChainConfig = {
  name: "Switchback Chain",
  inputs: [
    {
      name: "hideBackground",
      type: "boolean",
      defaultValue: true,
    },
    {
      name: "switchbacks",
      type: "list",
      subFields: [...SwitchbackConfig.inputs],
      defaultValue: [
        {
          assetSide: "right",
          headline: "Build for growth.",
          eyebrow: "Optional Eyebrow",
          body: "<p>Read the documentation for Solana and popular tools.</p>",
        },
      ],
    },
  ],
};

export const ContentEditorConfig = {
  name: "Content Editor",
  inputs: [
    {
      name: "tocHeadline",
      type: "string",
      localized: true,
      defaultValue: "In this article",
    },
    {
      name: "callToAction",
      type: "object",
      subFields: [
        {
          name: "eyebrow",
          type: "string",
          localized: true,
          defaultValue: "Eyebrow Text",
        },
        {
          name: "headline",
          type: "string",
          localized: true,
          defaultValue: "Headline Text",
        },
        {
          name: "description",
          type: "string",
          localized: true,
          defaultValue: "Description Text goes here",
        },
        {
          name: "button",
          type: "object",
          subFields: ButtonConfig.inputs,
          defaultValue: {
            label: "Button CTA",
          },
        },
      ],
      defaultValue: {
        eyebrow: "Eyebrow Text",

        headline: "Headline Text",

        description: "Description Text goes here",

        button: {
          label: "Button CTA",
        },
      },
    },
  ],
};

export const SectionConfig = {
  name: "Section Molecule",
  inputs: [
    {
      name: "noPadding",
      type: "text",
      enum: ["noPaddingY", "none"],
      defaultValue: "none",
    },
    {
      name: "sectionId",
      type: "text",
    },
  ],
};

export const HtmlParserConfig = {
  name: "Copy",
  inputs: [
    {
      name: "rawHtml",
      type: "richText",
      localized: true,
      defaultValue: "<p>Hello! Use the editor to add your copy!",
    },
  ],
};

export const TipConfig = {
  name: "Tip",
  inputs: [
    {
      name: "tip",
      type: "text",
      localized: true,
      defaultValue: "Hot Tip",
    },
    {
      name: "title",
      type: "text",
      localized: true,
      defaultValue:
        "Lorem ipsum dolor sit amet consectetur. Et enim sit donec semper viverra ac nisl enim in. Justo eget placerat consequat tristique. Vulputate lacinia felis orci pellentesque morbi eget cursus nulla. Turpis.",
    },
  ],
};

export const YoutubeConfig = {
  name: "Youtube",
  inputs: [
    {
      name: "url",
      type: "text",
      defaultValue:
        "https://www.youtube.com/watch?v=MQVa8Mgwygk&ab_channel=Solana",
    },
  ],
};

export const RichTextQuoteConfig = {
  name: "Rich Text Quote",
  inputs: [
    {
      name: "quote",
      type: "richText",
      localized: true,
      defaultValue:
        "<p>xNFTs take a radically practical approach to solving two of web3’s main problems today, decentralization and distribution, with profound implications.</p>",
    },
    {
      name: "author",
      type: "object",
      subFields: [
        {
          name: "name",
          type: "text",
          defaultValue: "Cliff Hutchinson",
        },
        {
          name: "role",
          type: "text",
          localized: true,
          defaultValue: "Attorney",
        },
        {
          name: "company",
          type: "text",
          localized: true,
          defaultValue: "Cerberus",
        },
      ],
      defaultValue: {
        name: "Cliff Hutchinson",
        role: "Attorney",
        company: "Cerberus",
      },
    },
  ],
};

export const RichStatsConfig = {
  name: "Rich Text Stats",
  inputs: [
    {
      name: "stats",
      type: "list",
      subFields: [
        {
          name: "stat",
          type: "text",
          localized: true,
          defaultValue: "10 million",
        },
        {
          name: "description",
          type: "text",
          localized: true,
          defaultValue: "This is a placeholder copy for this bullet-point",
        },
      ],
      defaultValue: [
        {
          stat: "10 million",
          description: "This is a placeholder copy for this bullet-point",
        },
      ],
    },
  ],
};

export const BreakpointSpeakersConfig = {
  name: "Breakpoint Speakers",
  inputs: [
    {
      name: "speakers",
      type: "list",
      subFields: [
        {
          name: "speakerName",
          type: "string",
          defaultValue: "",
        },
        {
          name: "title",
          type: "string",
          defaultValue: "",
        },
        {
          name: "image",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
          required: true,
        },
      ],
    },
  ],
};
export const CodeBlockConfig = {
  name: "Code Block",
  inputs: [
    {
      name: "code",
      type: "longText",
      defaultValue: "const helloWorld = () => console.log('Hello, world!');",
      required: true,
      helpText: "Enter your code snippet here.",
    },
    {
      name: "language",
      type: "text",
      enum: [
        "jsx",
        "typescript",
        "tsx",
        "rust",
        "solidity",
        "json",
        "bash",
        "latex",
      ],
      defaultValue: "javascript",
      required: true,
      helpText: "Select the programming language for syntax highlighting.",
    },
  ],
};

export const DetailsHeroConfig = {
  name: "Details Hero",
  inputs: [
    {
      name: "eyebrow",
      type: "text",
      helperText: "The eyebrow text above the title.",
    },
    {
      name: "headingAs",
      type: "text",
      enum: ["h1", "h2", "h3", "h4", "h5", "h6"],
      defaultValue: "h1",
      helperText: "The HTML tag to use for the heading (Title).",
    },
    {
      name: "title",
      type: "text",
      helperText: "The main title of the hero section.",
    },
    {
      name: "titleAsLink",
      type: "boolean",
      helperText: "Whether the title should be a link.",
      defaultValue: false,
    },
    {
      name: "image",
      type: "file",
      allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
      helperText: "The main image for the hero section.",
    },
    {
      name: "breadCrumbs",
      type: "list",
      subFields: [
        {
          name: "label",
          type: "text",
        },
        {
          name: "link",
          type: "url",
        },
      ],
      helperText:
        "The breadcrumbs for the hero section. The LAST one will not be clickable.",
    },
    {
      name: "publishedDate",
      type: "text",
      helperText:
        "The published date of the article or page. (e.g. '2021/02/25')",
    },
    {
      name: "author",
      type: "reference",
      model: "author",
      helperText: "Select an author from the pre-defined list in Builder.io.",
    },
    {
      name: "shareIcons",
      type: "boolean",
      defaultValue: true,
      helperText:
        "Whether to show social share icons (also requires that 'Slug' be filled out as well).",
    },
    {
      name: "slug",
      type: "text",
      helperText:
        "Needed to show the share icons. The URL slug for the current page. Copy the Value from the Landing Page Slug filed down below",
    },
    {
      name: "buttons",
      type: "list",
      subFields: ButtonConfig.inputs,
      helperText: "The buttons to display in the hero section.",
    },
  ],
};

export const BreakpointTitleConfig = {
  name: "Breakpoint Title",
  inputs: [
    {
      name: "title",
      type: "text",
      required: true,
      defaultValue: "Title",
      localized: true,
    },
    {
      name: "image",
      type: "file",
      allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
    },
    {
      name: "modifier",
      type: "text",
      enum: ["start", "end"],
      defaultValue: "start",
      helperText: "Background position to determine the node orientation",
    },
  ],
};

export const BreakpointHero = {
  name: "Breakpoint Hero",
  inputs: [
    {
      name: "title",
      type: "text",
      defaultValue: "Title",
      localized: true,
    },
    {
      name: "subtitle",
      type: "text",
      defaultValue: "Subtitle",
      localized: true,
    },
    {
      name: "description",
      type: "richText",
      defaultValue: "Description",
      localized: true,
    },
    {
      name: "logo",
      type: "file",
      allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
      required: true,
    },
    {
      name: "backgroundImage",
      type: "file",
      allowedFileTypes: ["jpeg", "jpg", "png", "svg", "webp"],
      required: true,
    },
  ],
};

export const BreakpointCard = {
  name: "Breakpoint Card",
  inputs: [
    {
      name: "heading",
      type: "string",
      defaultValue: "",
      localized: true,
    },
    {
      name: "content",
      type: "richText",
      defaultValue: "",
      localized: true,
    },
    {
      name: "buttons",
      type: "list",
      subFields: ButtonConfig.inputs,
    },
  ],
};

export const NewsletterForm = {
  name: "Newsletter Form",
  inputs: [
    {
      name: "separateOnMobile",
      type: "boolean",
      defaultValue: false,
      helperText:
        "Whether the submit button and input field should stack on mobile, allowing more placeholder text to show",
    },
    {
      name: "containerClass",
      type: "text",
      helperText: "Classes to that can be added to the container.",
    },
    {
      name: "formId",
      type: "text",
      helperText: "Required for Form to render.",
      required: true,
    },
    {
      name: "placeholder",
      type: "text",
      helperText: "Placeholder text for the input field",
    },
    {
      name: "emailError",
      type: "text",
    },
    {
      name: "submitError",
      type: "text",
    },
    {
      name: "successMessage",
      type: "text",
    },
  ],
};

export const NewsletterMultipleListsForm = {
  name: "Newsletter Multiple Lists Form",
  inputs: [
    {
      name: "placeholder",
      type: "text",
      helperText: "Placeholder text for the input field",
      defaultValue: "",
    },
    {
      name: "emailError",
      type: "text",
      defaultValue: "Please enter a valid email address",
    },
    {
      name: "submitError",
      type: "text",
      defaultValue: "Something went wrong, please try again",
    },
    {
      name: "successMessage",
      type: "text",
      defaultValue: "Success! Thank you for signing up!",
    },
    {
      name: "separateOnMobile",
      type: "boolean",
      defaultValue: false,
      helperText:
        "Whether the submit button and input field should stack on mobile, allowing more placeholder text to show",
    },
    {
      name: "containerClass",
      type: "text",
      helperText: "Classes to that can be added to the container.",
      defaultValue: "",
    },
    {
      name: "newsletterOption",
      type: "list",
      defaultValue: [
        {
          listName: "Newsletter",
          formId: "form-id",
        },
      ],
      subFields: [
        {
          name: "listName",
          type: "text",
          helperText: "The name of the Iterable audience list.",
          required: true,
          defaultValue: "Newsletter list",
        },
        {
          name: "formId",
          type: "text",
          helperText: "Iterable form ID - must be unique",
          required: true,
          defaultValue: "form-id",
        },
      ],
    },
  ],
};
