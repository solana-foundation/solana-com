"use client";

import {
  CardDeck,
  ConversionPanel,
  Heading,
  Hero,
  HtmlParser,
  RichTextQuote,
  Section,
  Switchback,
} from "@solana-foundation/solana-lib";
import { ResponsiveBox } from "@/component-library/responsive-box";
import { Columns } from "@/component-library/columns";
import Image from "next/image";
import {
  ARTIST_VIDEO,
  CARD_DECK_CARDS,
  CARD_DECK_COLUMNS,
  CONTACT_PANEL,
  CULTURE_HACKER_IMAGE,
  HERO_IMAGE,
  HERO_MOBILE_IMAGE,
  LAURA_IMAGE,
  MINTING_PANEL,
  SWITCHBACK,
} from "@/data/art-basel";

interface ArtBaselPageProps {
  translations: {
    heroEyebrow: string;
    heroHeadline: string;
    heroBody: string;
    headingEyebrow: string;
    headingHeadline: string;
    headingBody: string;
    leoQuote: string;
    leoCopy: string;
    leoAuthorName: string;
    leoAuthorRole: string;
    lauraQuote: string;
    lauraCopy: string;
    lauraAuthorName: string;
    lauraAuthorRole: string;
    cultureHackerQuote: string;
    cultureHackerCopy: string;
    cultureHackerAuthorName: string;
    cultureHackerAuthorRole: string;
    switchbackHeadline: string;
    switchbackBody: string;
    switchbackButtons: string[];
    mintingPanelHeading: string;
    mintingPanelBody: string;
    mintingPanelButtons: string[];
    whySolanaEyebrow: string;
    whySolanaHeadline: string;
    whySolanaBody: string;
    cardDeckHeadings: string[];
    cardDeckBodies: string[];
    cardDeckCtaLabels: string[];
    contactPanelHeading: string;
    contactPanelBody: string;
    contactPanelButtons: string[];
  };
}

export function ArtBaselPage({ translations }: ArtBaselPageProps) {
  const cardDeckCards = CARD_DECK_CARDS.map((card, index) => ({
    ...card,
    heading: translations.cardDeckHeadings[index],
    body: translations.cardDeckBodies[index],
    callToAction: {
      ...card.callToAction,
      label: translations.cardDeckCtaLabels[index],
    },
  }));

  const switchbackButtons = SWITCHBACK.buttons.map((button, index) => ({
    ...button,
    label: translations.switchbackButtons[index],
  }));

  const mintingButtons = MINTING_PANEL.buttons.map((button, index) => ({
    ...button,
    label: translations.mintingPanelButtons[index],
  }));

  const contactButtons = CONTACT_PANEL.buttons.map((button, index) => ({
    ...button,
    label: translations.contactPanelButtons[index],
  }));

  return (
    <>
      <ResponsiveBox
        responsiveStyles={{
          large: { display: "none" },
          medium: { display: "flex", marginBottom: "0px" },
          small: { display: "flex", marginBottom: "0px" },
        }}
      >
        <Image
          src={HERO_MOBILE_IMAGE}
          width={2000}
          height={1333}
          sizes="100vw"
          alt={translations.heroHeadline}
          style={{ objectFit: "cover", width: "100%" }}
          loading="eager"
        />
      </ResponsiveBox>

      <Columns space={30} stackColumnsAt="tablet">
        <ResponsiveBox
          responsiveStyles={{
            large: { marginBottom: "-65px", paddingBottom: "0px" },
            medium: { marginBottom: "-50px" },
            small: { marginBottom: "-40px" },
          }}
        >
          <Hero
            headingAs="h1"
            centered={false}
            newsLetter={false}
            image={{ alt: translations.heroHeadline, src: HERO_IMAGE }}
            eyebrow={translations.heroEyebrow}
            headline={translations.heroHeadline}
            body={translations.heroBody}
            buttons={[]}
          />
        </ResponsiveBox>
      </Columns>

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-78px" },
          small: { marginBottom: "-57px" },
        }}
      >
        <Heading
          variant="centered"
          eyebrow={translations.headingEyebrow}
          headline={translations.headingHeadline}
          body={translations.headingBody}
        />
      </ResponsiveBox>

      <Section>
        <Columns space={20} stackColumnsAt="tablet">
          <div>
            <HtmlParser rawHtml={translations.leoCopy} />
            <div style={{ aspectRatio: "1 / 0.7004048583" }}>
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              >
                <source src={ARTIST_VIDEO} type="video/mp4" />
              </video>
            </div>
          </div>
          <ResponsiveBox
            responsiveStyles={{
              large: { marginTop: "auto", marginBottom: "auto" },
            }}
          >
            <RichTextQuote
              quote={translations.leoQuote}
              author={{
                name: translations.leoAuthorName,
                role: translations.leoAuthorRole,
                company: "",
              }}
            />
          </ResponsiveBox>
        </Columns>
      </Section>

      <Section>
        <Columns space={20} stackColumnsAt="tablet" reverseColumnsWhenStacked>
          <ResponsiveBox
            responsiveStyles={{
              large: { marginTop: "auto", marginBottom: "auto" },
            }}
          >
            <RichTextQuote
              quote={translations.lauraQuote}
              author={{
                name: translations.lauraAuthorName,
                role: translations.lauraAuthorRole,
                company: "",
              }}
            />
          </ResponsiveBox>
          <div>
            <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
              <HtmlParser rawHtml={translations.lauraCopy} />
            </ResponsiveBox>
            <ResponsiveBox
              responsiveStyles={{
                large: { marginTop: "auto", marginBottom: "auto" },
              }}
            >
              <Image
                src={LAURA_IMAGE}
                width={1200}
                height={1500}
                sizes="(max-width: 638px) 95vw, (max-width: 998px) 47vw, 43vw"
                alt={translations.lauraAuthorName}
                style={{ objectFit: "cover", width: "100%" }}
                loading="eager"
              />
            </ResponsiveBox>
          </div>
        </Columns>
      </Section>

      <Section>
        <Columns space={20} stackColumnsAt="tablet">
          <div>
            <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
              <HtmlParser rawHtml={translations.cultureHackerCopy} />
            </ResponsiveBox>
            <ResponsiveBox
              responsiveStyles={{
                large: { marginTop: "auto", marginBottom: "auto" },
              }}
            >
              <Image
                src={CULTURE_HACKER_IMAGE}
                width={1898}
                height={1500}
                sizes="(max-width: 638px) 95vw, (max-width: 998px) 47vw, 43vw"
                alt={translations.cultureHackerAuthorName}
                style={{ objectFit: "cover", width: "100%" }}
                loading="eager"
              />
            </ResponsiveBox>
          </div>
          <ResponsiveBox
            responsiveStyles={{
              large: {
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "auto",
                marginBottom: "auto",
              },
            }}
          >
            <RichTextQuote
              quote={translations.cultureHackerQuote}
              author={{
                name: translations.cultureHackerAuthorName,
                role: translations.cultureHackerAuthorRole,
                company: "",
              }}
            />
          </ResponsiveBox>
        </Columns>
      </Section>

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "2px", paddingTop: "0px" },
          small: { paddingBottom: "3px", marginBottom: "-30px" },
        }}
      >
        <Switchback
          assetSide={SWITCHBACK.assetSide as "left" | "right"}
          image={SWITCHBACK.image}
          headline={translations.switchbackHeadline}
          body={translations.switchbackBody}
          buttons={switchbackButtons as any}
        />
      </ResponsiveBox>

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-88px" },
          medium: { marginBottom: "-191px" },
          small: { marginBottom: "-161px" },
        }}
      >
        <ConversionPanel
          variant={MINTING_PANEL.variant as "offset"}
          heading={translations.mintingPanelHeading}
          body={translations.mintingPanelBody}
          buttons={mintingButtons as any}
          desktopImage={MINTING_PANEL.desktopImage}
          mobileImage={MINTING_PANEL.mobileImage}
        />
      </ResponsiveBox>

      <ResponsiveBox
        responsiveStyles={{
          large: { paddingTop: "84px", marginBottom: "-72px" },
        }}
      >
        <Heading
          variant="centered"
          eyebrow={translations.whySolanaEyebrow}
          headline={translations.whySolanaHeadline}
          body={translations.whySolanaBody}
        />
      </ResponsiveBox>

      <ResponsiveBox
        responsiveStyles={{
          large: { marginBottom: "-150px", zIndex: 2 },
          medium: { marginBottom: "-100px" },
          small: { marginBottom: "-83px" },
        }}
      >
        <CardDeck cards={cardDeckCards as any} numCols={CARD_DECK_COLUMNS} />
      </ResponsiveBox>

      <ConversionPanel
        heading={translations.contactPanelHeading}
        body={translations.contactPanelBody}
        buttons={contactButtons as any}
      />
    </>
  );
}
