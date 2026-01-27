import { withLocales } from "@workspace/i18n/routing";
import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  Hero,
  Stats,
  Trustbar,
  Heading,
  SwitchbackChain,
  CardDeck,
  ConversionPanel,
} from "@solana-foundation/solana-lib";
import { ResponsiveBox } from "@/component-library/responsive-box";

import {
  META,
  HERO,
  BUTTONS,
  STATS,
  TRUSTBAR_LOGOS,
  HEADINGS,
  LAUNCH_CARDS,
  UPGRADING_CARDS,
  MIDDLEWARE_CARDS,
  TOOLKIT_CARDS,
  SWITCHBACKS,
  CONVERSION_PANEL,
} from "@/data/solutions/gaming-and-entertainment";

const GamingAndEntertainmentPage = () => {
  return (
    <Layout>
      <HTMLHead
        title={META.seoTitle}
        description={META.seoDescription}
        socialShare={META.seoImage}
      />

      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={HERO.eyebrow}
        headline={HERO.headline}
        body={HERO.body}
        buttons={[
          {
            label: BUTTONS.getStarted,
            hierarchy: "primary",
            size: "lg",
            url: "https://solanacookbook.com/gaming/hello-world.html",
          },
          {
            label: BUTTONS.getInTouch,
            hierarchy: "outline",
            size: "lg",
            url: "mailto:games@solana.org",
          },
        ]}
        image={{
          src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fc78a3ad482b04046937e69793765f789.png",
        }}
      />

      <Stats
        stats={STATS}
        buttons={[
          {
            label: BUTTONS.getInTouch,
            hierarchy: "link",
            size: "md",
            endIcon: "arrow-up-right",
          },
        ]}
        contained
      />

      <Trustbar
        variant="grid"
        logos={TRUSTBAR_LOGOS as { url: string; src: string; alt: string }[]}
      />

      <Heading
        headline={HEADINGS.singleState.headline}
        body={HEADINGS.singleState.body}
        variant="centered"
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading
          headline={HEADINGS.launchAndSync.headline}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: LAUNCH_CARDS.metaplexNFTs.heading,
            body: LAUNCH_CARDS.metaplexNFTs.body,
            callToAction: {
              label: BUTTONS.learnHow,
              url: "https://developers.metaplex.com/",
            },
          },
          {
            type: "standard",
            heading: LAUNCH_CARDS.gamesLaunchers.heading,
            body: LAUNCH_CARDS.gamesLaunchers.body,
            callToAction: {
              label: BUTTONS.seeLaunchers,
              url: "https://www.notion.so/solanafoundation/Games-Lunchers-cd0a86f30cea4264b9710624e5b624b1",
            },
          },
          {
            type: "standard",
            heading: LAUNCH_CARDS.sdks.heading,
            body: LAUNCH_CARDS.sdks.body,
            callToAction: {
              label: BUTTONS.seeSDKs,
              url: "https://www.notion.so/solanafoundation/Game-Engine-SDKs-0c7e0dc1bc4a44bead31dc0723668987",
            },
          },
          {
            type: "standard",
            heading: LAUNCH_CARDS.gamingSync.heading,
            body: LAUNCH_CARDS.gamingSync.body,
            callToAction: {
              label: BUTTONS.learnMore,
              url: "https://www.notion.so/solanafoundation/Gaming-Sync-6cc362c4372046e09244ed6bf1fcebc9?pvs=4",
            },
          },
          {
            type: "standard",
            heading: LAUNCH_CARDS.listenersWebhooks.heading,
            body: LAUNCH_CARDS.listenersWebhooks.body,
            callToAction: {
              label: BUTTONS.seeProviders,
              url: "https://www.notion.so/solanafoundation/Webhooks-RPCs-55b715df0a5c47ea8be2cded8089f544?pvs=4",
            },
          },
        ]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading
          headline={HEADINGS.upgradingAssets.headline}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: UPGRADING_CARDS.guide.heading,
            body: UPGRADING_CARDS.guide.body,
            callToAction: {
              label: BUTTONS.learnMore,
              url: "https://www.notion.so/solanafoundation/Upgrading-Game-Assets-6826e35cfcc747b89d5d69cb8d76d01d?pvs=4",
            },
          },
          {
            type: "standard",
            heading: UPGRADING_CARDS.getInTouch.heading,
            body: UPGRADING_CARDS.getInTouch.body,
            callToAction: {
              label: BUTTONS.contactUs,
              url: "mailto:games@solana.org",
            },
          },
        ]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading
          headline={HEADINGS.fullStackMiddleware.headline}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: MIDDLEWARE_CARDS.gameShift.heading,
            body: MIDDLEWARE_CARDS.gameShift.body,
            callToAction: {
              label: BUTTONS.gameShift,
              url: "https://gameshift.solanalabs.com/",
            },
          },
          {
            type: "standard",
            heading: MIDDLEWARE_CARDS.beamable.heading,
            body: MIDDLEWARE_CARDS.beamable.body,
            callToAction: {
              label: BUTTONS.beamable,
              url: "https://beamable.com/marketplace/solana-integration",
            },
          },
          {
            type: "standard",
            heading: MIDDLEWARE_CARDS.getInTouch.heading,
            body: MIDDLEWARE_CARDS.getInTouch.body,
            callToAction: {
              label: BUTTONS.contactUs,
              url: "mailto:games@solana.org",
            },
          },
        ]}
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading
          headline={HEADINGS.solanaToolkit.headline}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: TOOLKIT_CARDS.gamesTooling.heading,
            headingAs: "h3",
            body: TOOLKIT_CARDS.gamesTooling.body,
            callToAction: {
              label: BUTTONS.learnMore,
              url: "/solutions/games-tooling",
            },
          },
          {
            type: "standard",
            heading: TOOLKIT_CARDS.loyaltyPrograms.heading,
            headingAs: "h3",
            body: TOOLKIT_CARDS.loyaltyPrograms.body,
            callToAction: {
              label: BUTTONS.learnMore,
              url: "https://docs.solana.com/",
            },
          },
          {
            type: "standard",
            heading: TOOLKIT_CARDS.userManagement.heading,
            headingAs: "h3",
            body: TOOLKIT_CARDS.userManagement.body,
            callToAction: {
              label: BUTTONS.learnMore,
              url: "https://docs.solana.com/",
            },
          },
          {
            type: "standard",
            heading: TOOLKIT_CARDS.token22.heading,
            headingAs: "h3",
            body: TOOLKIT_CARDS.token22.body,
            callToAction: {
              label: BUTTONS.learnMore,
              url: "/solutions/token22",
            },
          },
        ]}
      />

      <SwitchbackChain
        hideBackground={true}
        switchbacks={[
          {
            assetSide: "right",
            eyebrow: SWITCHBACKS[0].eyebrow,
            headline: SWITCHBACKS[0].headline,
            body: SWITCHBACKS[0].body,
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://staratlas.com/",
                label: BUTTONS.playStarAtlas,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F0b4c36a1725a455e81fcf98300a8865f.png",
              alt: "",
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            eyebrow: SWITCHBACKS[1].eyebrow,
            headline: SWITCHBACKS[1].headline,
            body: SWITCHBACKS[1].body,
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://solana.com/ecosystem/aurory",
                label: BUTTONS.learnHowAuroryWorks,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F073ec297175a47de8de27a54e2d1721b.png",
              alt: "",
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            eyebrow: SWITCHBACKS[2].eyebrow,
            headline: SWITCHBACKS[2].headline,
            body: SWITCHBACKS[2].body,
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://www.billboard.com/pro/def-jam-signs-virtual-nft-band-whales-major-label-web3-deal/",
                label: BUTTONS.learnMore,
              },
            ],
            image: {
              src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F8883371d952e41149af4d693e07217ff.png",
              alt: "",
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
        ]}
      />

      <ConversionPanel
        heading={CONVERSION_PANEL.heading}
        body={CONVERSION_PANEL.body}
        buttons={[
          {
            label: BUTTONS.contactUs,
            hierarchy: "secondary",
            size: "lg",
            url: "mailto:games@solana.org",
          },
          {
            label: BUTTONS.seeCaseStudies,
            hierarchy: "outline",
            size: "lg",
            url: "/news/tag/case-studies",
          },
        ]}
      />
    </Layout>
  );
};

export default GamingAndEntertainmentPage;

export async function getStaticProps({
  params,
}: {
  params: { locale: string };
}) {
  const { locale = "en" } = params;
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  return {
    props: {
      locale,
      messages,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
