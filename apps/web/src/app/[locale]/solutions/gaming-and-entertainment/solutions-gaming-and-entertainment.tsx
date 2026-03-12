"use client";

import { useTranslations } from "next-intl";
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
  HERO_IMAGE,
  TRUSTBAR_LOGOS,
  SWITCHBACK_IMAGES,
} from "@/data/solutions/gaming-and-entertainment";

export function SolutionsGamingAndEntertainmentPage() {
  const t = useTranslations("gaming-and-entertainment-solution");

  const stats = Array.from({ length: 3 }, (_, index) => ({
    stat: t(`stats.${index}.stat`),
    description: t(`stats.${index}.description`),
  }));

  return (
    <>
      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
        buttons={[
          {
            label: t("buttons.getStarted"),
            hierarchy: "primary",
            size: "lg",
            url: "https://solanacookbook.com/gaming/hello-world.html",
          },
          {
            label: t("buttons.getInTouch"),
            hierarchy: "outline",
            size: "lg",
            url: "mailto:games@solana.org",
          },
        ]}
        image={{
          src: HERO_IMAGE,
          alt: t("hero.headline"),
        }}
      />

      <Stats
        stats={stats}
        buttons={[
          {
            label: t("buttons.getInTouch"),
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
        headline={t("headings.singleState.headline")}
        body={t("headings.singleState.body")}
        variant="centered"
      />

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-120px" },
          medium: { marginBottom: "-45px" },
        }}
      >
        <Heading
          headline={t("headings.launchAndSync.headline")}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: t("launchCards.metaplexNFTs.heading"),
            body: t("launchCards.metaplexNFTs.body"),
            callToAction: {
              label: t("buttons.learnHow"),
              url: "https://developers.metaplex.com/",
            },
          },
          {
            type: "standard",
            heading: t("launchCards.gamesLaunchers.heading"),
            body: t("launchCards.gamesLaunchers.body"),
            callToAction: {
              label: t("buttons.seeLaunchers"),
              url: "https://www.notion.so/solanafoundation/Games-Lunchers-cd0a86f30cea4264b9710624e5b624b1",
            },
          },
          {
            type: "standard",
            heading: t("launchCards.sdks.heading"),
            body: t("launchCards.sdks.body"),
            callToAction: {
              label: t("buttons.seeSDKs"),
              url: "https://www.notion.so/solanafoundation/Game-Engine-SDKs-0c7e0dc1bc4a44bead31dc0723668987",
            },
          },
          {
            type: "standard",
            heading: t("launchCards.gamingSync.heading"),
            body: t("launchCards.gamingSync.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "https://www.notion.so/solanafoundation/Gaming-Sync-6cc362c4372046e09244ed6bf1fcebc9?pvs=4",
            },
          },
          {
            type: "standard",
            heading: t("launchCards.listenersWebhooks.heading"),
            body: t("launchCards.listenersWebhooks.body"),
            callToAction: {
              label: t("buttons.seeProviders"),
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
          headline={t("headings.upgradingAssets.headline")}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: t("upgradingCards.guide.heading"),
            body: t("upgradingCards.guide.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "https://www.notion.so/solanafoundation/Upgrading-Game-Assets-6826e35cfcc747b89d5d69cb8d76d01d?pvs=4",
            },
          },
          {
            type: "standard",
            heading: t("upgradingCards.getInTouch.heading"),
            body: t("upgradingCards.getInTouch.body"),
            callToAction: {
              label: t("buttons.contactUs"),
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
          headline={t("headings.fullStackMiddleware.headline")}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: t("middlewareCards.gameShift.heading"),
            body: t("middlewareCards.gameShift.body"),
            callToAction: {
              label: t("buttons.gameShift"),
              url: "https://gameshift.solanalabs.com/",
            },
          },
          {
            type: "standard",
            heading: t("middlewareCards.beamable.heading"),
            body: t("middlewareCards.beamable.body"),
            callToAction: {
              label: t("buttons.beamable"),
              url: "https://beamable.com/marketplace/solana-integration",
            },
          },
          {
            type: "standard",
            heading: t("middlewareCards.getInTouch.heading"),
            body: t("middlewareCards.getInTouch.body"),
            callToAction: {
              label: t("buttons.contactUs"),
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
          headline={t("headings.solanaToolkit.headline")}
          variant="floatingButton"
        />
      </ResponsiveBox>

      <CardDeck
        numCols={3}
        cards={[
          {
            type: "standard",
            heading: t("toolkitCards.gamesTooling.heading"),
            headingAs: "h3",
            body: t("toolkitCards.gamesTooling.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "/solutions/games-tooling",
            },
          },
          {
            type: "standard",
            heading: t("toolkitCards.loyaltyPrograms.heading"),
            headingAs: "h3",
            body: t("toolkitCards.loyaltyPrograms.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "https://docs.solana.com/",
            },
          },
          {
            type: "standard",
            heading: t("toolkitCards.userManagement.heading"),
            headingAs: "h3",
            body: t("toolkitCards.userManagement.body"),
            callToAction: {
              label: t("buttons.learnMore"),
              url: "https://docs.solana.com/",
            },
          },
          {
            type: "standard",
            heading: t("toolkitCards.token22.heading"),
            headingAs: "h3",
            body: t("toolkitCards.token22.body"),
            callToAction: {
              label: t("buttons.learnMore"),
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
            eyebrow: "",
            headline: t("switchbacks.0.headline"),
            body: t.raw("switchbacks.0.body"),
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://staratlas.com/",
                label: t("buttons.playStarAtlas"),
              },
            ],
            image: {
              src: SWITCHBACK_IMAGES[0],
              alt: t("switchbacks.0.headline"),
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            eyebrow: "",
            headline: t("switchbacks.1.headline"),
            body: t.raw("switchbacks.1.body"),
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://solana.com/ecosystem/aurory",
                label: t("buttons.learnHowAuroryWorks"),
              },
            ],
            image: {
              src: SWITCHBACK_IMAGES[1],
              alt: t("switchbacks.1.headline"),
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
          {
            assetSide: "right",
            eyebrow: "",
            headline: t("switchbacks.2.headline"),
            body: t.raw("switchbacks.2.body"),
            buttons: [
              {
                hierarchy: "primary",
                size: "md",
                url: "https://www.billboard.com/pro/def-jam-signs-virtual-nft-band-whales-major-label-web3-deal/",
                label: t("buttons.learnMore"),
              },
            ],
            image: {
              src: SWITCHBACK_IMAGES[2],
              alt: t("switchbacks.2.headline"),
            },
            placeholder: "",
            emailError: "",
            submitError: "",
            successMessage: "",
          },
        ]}
      />

      <ConversionPanel
        heading={t("conversionPanel.heading")}
        body={t("conversionPanel.body")}
        buttons={[
          {
            label: t("buttons.contactUs"),
            hierarchy: "secondary",
            size: "lg",
            url: "mailto:games@solana.org",
          },
          {
            label: t("buttons.seeCaseStudies"),
            hierarchy: "outline",
            size: "lg",
            url: "/news/tag/case-studies",
          },
        ]}
      />
    </>
  );
}
