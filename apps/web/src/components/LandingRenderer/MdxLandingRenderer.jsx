import { MDXRemote } from "next-mdx-remote";
import dynamic from "next/dynamic";

// Dynamically import all available components from solana-lib
const components = {
  Hero: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Hero),
  ),
  Switchback: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Switchback),
  ),
  SwitchbackChain: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.SwitchbackChain),
  ),
  CardDeck: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.CardDeck),
  ),
  Stats: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Stats),
  ),
  Accordion: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Accordion),
  ),
  ConversionPanel: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.ConversionPanel),
  ),
  Trustbar: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Trustbar),
  ),
  FeatureHighlight: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.FeatureHighlight),
  ),
  Quote: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Quote),
  ),
  QuoteSlider: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.QuoteSlider),
  ),
  Heading: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Heading),
  ),
  Slider: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Slider),
  ),
  Carousel: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Carousel),
  ),
  CommunityGallery: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.CommunityGallery),
  ),
  Switcher: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Switcher),
  ),
  ContentEditor: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.ContentEditor),
  ),
  Section: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Section),
  ),
  NewsletterForm: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.NewsletterForm),
  ),
  NewsletterMultipleListsForm: dynamic(() =>
    import("@solana-foundation/solana-lib").then(
      (lib) => lib.NewsletterMultipleListsForm,
    ),
  ),
  Button: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Button),
  ),
  Tip: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.Tip),
  ),
  Youtube: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.YoutubeVideo),
  ),
  YoutubeVideo: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.YoutubeVideo),
  ),
  RichTextStat: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.RichTextStat),
  ),
  RichTextQuote: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.RichTextQuote),
  ),
  CodeBlock: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.CodeBlock),
  ),
  AnnouncementBar: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.AnnouncementBar),
  ),
  DetailsHero: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.DetailsHero),
  ),
  HtmlParser: dynamic(() =>
    import("@solana-foundation/solana-lib").then((lib) => lib.HtmlParser),
  ),
  Columns: dynamic(() =>
    import("@/component-library/columns").then((lib) => lib.Columns),
  ),
  ResponsiveBox: dynamic(() =>
    import("@/component-library/responsive-box").then(
      (lib) => lib.ResponsiveBox,
    ),
  ),
  Image: dynamic(() => import("next/image").then((lib) => lib.default)),
};

/**
 * Renders MDX content with solana-lib components
 */
export default function MdxLandingRenderer({ mdxSource }) {
  if (!mdxSource) {
    return null;
  }

  return <MDXRemote {...mdxSource} components={components} />;
}
