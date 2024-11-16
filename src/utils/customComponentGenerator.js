import { Builder, withChildren } from "@builder.io/react";
import dynamic from "next/dynamic";

import {
  AccordionConfig,
  AnnouncementBarConfig,
  BreakpointCardConfig,
  BreakpointHeroConfig,
  BreakpointSpeakersConfig,
  BreakpointTitleConfig,
  AccelerateSpeakersConfig,
  AccelerateTitleConfig,
  AccelerateHeroConfig,
  AccelerateCardConfig,
  ButtonConfig,
  CardDeckConfig,
  CarouselConfig,
  CommunityGalleryConfig,
  ContentEditorConfig,
  ConversionPanelConfig,
  FeatureHighlightConfig,
  HeadingConfig,
  HeroConfig,
  HtmlParserConfig,
  NewsletterFormConfig,
  NewsletterMultipleListsFormConfig,
  RichTextQuoteConfig,
  RichStatsConfig,
  SectionConfig,
  SliderConfig,
  StatsConfig,
  SwitchbackConfig,
  SwitchbackChainConfig,
  SwitcherConfig,
  TipConfig,
  TrustbarConfig,
  QuoteConfig,
  QuoteSliderConfig,
  YoutubeConfig,
  CodeBlockConfig,
  DetailsHeroConfig,
} from "./builderConfigs";

export const richTextDataModels = [
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.Button),
    ),
    config: ButtonConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.HtmlParser),
    ),
    config: HtmlParserConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.Tip),
    ),
    config: TipConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.YoutubeVideo),
    ),
    config: YoutubeConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.RichTextStat),
    ),
    config: RichStatsConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.RichTextQuote),
    ),
    config: RichTextQuoteConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.CodeBlock),
    ),
    config: CodeBlockConfig,
  },
];

const breakpointDataModels = [
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then(
        (lib) => lib.BreakpointSpeakers,
      ),
    ),
    config: BreakpointSpeakersConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then(
        (lib) => lib.BreakpointTitle,
      ),
    ),
    config: BreakpointTitleConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.BreakpointHero),
    ),
    config: BreakpointHeroConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.BreakpointCard),
    ),
    config: BreakpointCardConfig,
  },
];

const accelerateDataModels = [
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then(
        (lib) => lib.AccelerateSpeakers,
      ),
    ),
    config: AccelerateSpeakersConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then(
        (lib) => lib.AccelerateTitle,
      ),
    ),
    config: AccelerateTitleConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.AccelerateHero),
    ),
    config: AccelerateHeroConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.AccelerateCard),
    ),
    config: AccelerateCardConfig,
  },
];

const componentDataModel = [
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.Accordion),
    ),
    config: AccordionConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then(
        (lib) => lib.AnnouncementBar,
      ),
    ),
    config: AnnouncementBarConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.CardDeck),
    ),
    config: CardDeckConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.Carousel),
    ),
    config: CarouselConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then(
        (lib) => lib.CommunityGallery,
      ),
    ),
    config: CommunityGalleryConfig,
  },
  {
    component: withChildren(
      dynamic(() =>
        import("@solana-foundation/solana-lib").then(
          (lib) => lib.ContentEditor,
        ),
      ),
    ),
    config: ContentEditorConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then(
        (lib) => lib.ConversionPanel,
      ),
    ),
    config: ConversionPanelConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then(
        (lib) => lib.FeatureHighlight,
      ),
    ),
    config: FeatureHighlightConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.Heading),
    ),
    config: HeadingConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.Hero),
    ),
    config: HeroConfig,
  },
  {
    component: withChildren(
      dynamic(() =>
        import("@solana-foundation/solana-lib").then((lib) => lib.Section),
      ),
    ),
    config: SectionConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.NewsletterForm),
    ),
    config: NewsletterFormConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then(
        (lib) => lib.NewsletterMultipleListsForm,
      ),
    ),
    config: NewsletterMultipleListsFormConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.Slider),
    ),
    config: SliderConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.Stats),
    ),
    config: StatsConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.Switchback),
    ),
    config: SwitchbackConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then(
        (lib) => lib.SwitchbackChain,
      ),
    ),
    config: SwitchbackChainConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.Switcher),
    ),
    config: SwitcherConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.Trustbar),
    ),
    config: TrustbarConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.Quote),
    ),
    config: QuoteConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.QuoteSlider),
    ),
    config: QuoteSliderConfig,
  },
  {
    component: dynamic(() =>
      import("@solana-foundation/solana-lib").then((lib) => lib.DetailsHero),
    ),
    config: DetailsHeroConfig,
  },
  ...richTextDataModels,
  ...breakpointDataModels,
  ...accelerateDataModels,
];

const customComponentsRegistration = () => {
  componentDataModel.map((component) =>
    Builder.registerComponent(component.component, component.config),
  );

  Builder.register("insertMenu", {
    name: "Content Editor Components",
    items: richTextDataModels.map((model) => ({ name: model.config.name })),
  });

  Builder.register("insertMenu", {
    name: "Breakpoint Components",
    items: breakpointDataModels.map((model) => ({ name: model.config.name })),
  });

  Builder.register("insertMenu", {
    name: "Accelerate Components",
    items: accelerateDataModels.map((model) => ({ name: model.config.name })),
  });
};

export default customComponentsRegistration;
