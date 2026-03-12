"use client";

import { Columns } from "@/component-library/columns";
import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  ConversionPanel,
  Heading,
  Hero,
  HtmlParser,
  Section,
} from "@solana-foundation/solana-lib";
import {
  CARD_DECK_OFFSET_STYLES,
  COPY_OFFSET_STYLES,
  HERO_IMAGE,
  HERO_RIGHT_IMAGE,
  SECTION_OFFSET_STYLES,
  VIDEO_SOURCES,
  VIDEO_STYLES,
} from "@/data/wallets";

interface WalletsPageProps {
  translations: {
    heroEyebrow: string;
    heroHeadline: string;
    heroBody: string;
    unlockProgrammableMoneyHeading: string;
    unlockProgrammableMoneyBody: string;
    complianceHeadline: string;
    complianceBody: string;
    oneClickCommerceHeadline: string;
    oneClickCommerceBody: string;
    feelessTransactionsHeadline: string;
    feelessTransactionsBody: string;
    unrivaledSecurityHeading: string;
    unrivaledSecurityBody: string;
    keyManagementHeadline: string;
    keyManagementBody: string;
    advancedMultisigHeadline: string;
    advancedMultisigBody: string;
    poweredBySvmHeading: string;
    poweredBySvmBody: string;
    svmBulletListBody: string;
    buildHeadline: string;
    buildBody: string;
    buyHeadline: string;
    buyBody: string;
    exploreOptionsHeading: string;
    exploreOptionsBody: string;
    developerResourcesHeadline: string;
    developerResourcesBody: string;
    applyForGrantHeading: string;
    applyForGrantBody: string;
  };
  heroButtons: React.ComponentProps<typeof Hero>["buttons"];
  buildCards: React.ComponentProps<typeof CardDeck>["cards"];
  buyCards: React.ComponentProps<typeof CardDeck>["cards"];
  developerCards: React.ComponentProps<typeof CardDeck>["cards"];
  compareWalletsButton: React.ComponentProps<
    typeof ConversionPanel
  >["buttons"][number];
  applyForGrantButton: React.ComponentProps<
    typeof ConversionPanel
  >["buttons"][number];
}

export function WalletsPage({
  translations,
  heroButtons,
  buildCards,
  buyCards,
  developerCards,
  compareWalletsButton,
  applyForGrantButton,
}: WalletsPageProps) {
  const videoProps = {
    autoPlay: true,
    controls: false,
    muted: true,
    loop: true,
    playsInline: true,
    preload: "metadata" as const,
  };

  return (
    <>
      <Hero
        headingAs="h1"
        newsLetter={false}
        centered={true}
        eyebrow={translations.heroEyebrow}
        headline={translations.heroHeadline}
        body={translations.heroBody}
        buttons={heroButtons}
        image={{
          alt: translations.heroHeadline,
          src: HERO_IMAGE,
        }}
        rightImage={{
          alt: translations.heroHeadline,
          src: HERO_RIGHT_IMAGE,
        }}
        leftImage={{
          alt: translations.heroHeadline,
          src: HERO_RIGHT_IMAGE,
        }}
      />

      <ConversionPanel
        heading={translations.unlockProgrammableMoneyHeading}
        body={translations.unlockProgrammableMoneyBody}
        variant="inline-centered"
      />

      <ResponsiveBox responsiveStyles={SECTION_OFFSET_STYLES}>
        <Section>
          <Columns space={20} stackColumnsAt="tablet">
            <div className="!flex-grow-[2] self-start">
              <Heading headline={translations.complianceHeadline} />
              <ResponsiveBox responsiveStyles={COPY_OFFSET_STYLES}>
                <HtmlParser rawHtml={translations.complianceBody} />
              </ResponsiveBox>
            </div>
            <video style={VIDEO_STYLES} {...videoProps}>
              <source src={VIDEO_SOURCES.compliance} type="video/mp4" />
            </video>
          </Columns>
        </Section>
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={SECTION_OFFSET_STYLES}>
        <Section>
          <Columns
            space={20}
            stackColumnsAt="tablet"
            reverseColumnsWhenStacked={true}
          >
            <video style={VIDEO_STYLES} {...videoProps}>
              <source src={VIDEO_SOURCES.oneClickCommerce} type="video/mp4" />
            </video>
            <div className="!flex-grow-[2] self-start">
              <Heading headline={translations.oneClickCommerceHeadline} />
              <ResponsiveBox responsiveStyles={COPY_OFFSET_STYLES}>
                <HtmlParser rawHtml={translations.oneClickCommerceBody} />
              </ResponsiveBox>
            </div>
          </Columns>
        </Section>
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={SECTION_OFFSET_STYLES}>
        <Section>
          <Columns space={30} stackColumnsAt="tablet">
            <div className="!flex-grow-[2] self-start">
              <Heading headline={translations.feelessTransactionsHeadline} />
              <ResponsiveBox responsiveStyles={COPY_OFFSET_STYLES}>
                <HtmlParser rawHtml={translations.feelessTransactionsBody} />
              </ResponsiveBox>
            </div>
            <video style={VIDEO_STYLES} {...videoProps}>
              <source
                src={VIDEO_SOURCES.feelessTransactions}
                type="video/mp4"
              />
            </video>
          </Columns>
        </Section>
      </ResponsiveBox>

      <ConversionPanel
        heading={translations.unrivaledSecurityHeading}
        body={translations.unrivaledSecurityBody}
        variant="inline-centered"
      />

      <Section>
        <Columns
          space={20}
          stackColumnsAt="tablet"
          reverseColumnsWhenStacked={true}
        >
          <video style={VIDEO_STYLES} {...videoProps}>
            <source src={VIDEO_SOURCES.keyManagement} type="video/mp4" />
          </video>
          <div className="!flex-grow-[2] self-start">
            <Heading headline={translations.keyManagementHeadline} />
            <ResponsiveBox responsiveStyles={COPY_OFFSET_STYLES}>
              <HtmlParser rawHtml={translations.keyManagementBody} />
            </ResponsiveBox>
          </div>
        </Columns>
      </Section>

      <ResponsiveBox responsiveStyles={SECTION_OFFSET_STYLES}>
        <Section>
          <Heading headline={translations.advancedMultisigHeadline} />
          <ResponsiveBox responsiveStyles={COPY_OFFSET_STYLES}>
            <HtmlParser rawHtml={translations.advancedMultisigBody} />
          </ResponsiveBox>
        </Section>
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={SECTION_OFFSET_STYLES}>
        <ConversionPanel
          heading={translations.poweredBySvmHeading}
          body={translations.poweredBySvmBody}
          variant="inline-centered"
        />
      </ResponsiveBox>

      <ResponsiveBox responsiveStyles={SECTION_OFFSET_STYLES}>
        <Section>
          <HtmlParser rawHtml={translations.svmBulletListBody} />
        </Section>
      </ResponsiveBox>

      <Heading
        headline={translations.buildHeadline}
        body={translations.buildBody}
      />
      <ResponsiveBox responsiveStyles={CARD_DECK_OFFSET_STYLES}>
        <CardDeck cards={buildCards} numCols={3} />
      </ResponsiveBox>

      <Heading
        headline={translations.buyHeadline}
        body={translations.buyBody}
      />
      <ResponsiveBox responsiveStyles={CARD_DECK_OFFSET_STYLES}>
        <CardDeck cards={buyCards} numCols={3} />
      </ResponsiveBox>

      <ConversionPanel
        heading={translations.exploreOptionsHeading}
        body={translations.exploreOptionsBody}
        variant="centered"
        buttons={[compareWalletsButton]}
      />

      <Heading
        headline={translations.developerResourcesHeadline}
        body={translations.developerResourcesBody}
      />
      <ResponsiveBox responsiveStyles={CARD_DECK_OFFSET_STYLES}>
        <CardDeck cards={developerCards} numCols={3} />
      </ResponsiveBox>

      <ConversionPanel
        heading={translations.applyForGrantHeading}
        body={translations.applyForGrantBody}
        buttons={[applyForGrantButton]}
      />
    </>
  );
}
