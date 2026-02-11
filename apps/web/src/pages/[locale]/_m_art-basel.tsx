import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
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
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
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
  META,
  MINTING_PANEL,
  SWITCHBACK,
} from "@/data/art-basel";

const ArtBaselPage = () => {
  const t = useTranslations("art-basel");

  const cardDeckCards = CARD_DECK_CARDS.map((card, index) => ({
    ...card,
    heading: t(`cardDeck.headings.${index}`),
    body: t(`cardDeck.bodies.${index}`),
    callToAction: {
      ...card.callToAction,
      label: t(`cardDeck.ctaLabels.${index}`),
    },
  }));

  const switchbackButtons = SWITCHBACK.buttons.map((button, index) => ({
    ...button,
    label: t(`switchback.buttons.${index}`),
  }));

  const mintingButtons = MINTING_PANEL.buttons.map((button, index) => ({
    ...button,
    label: t(`mintingPanel.buttons.${index}`),
  }));

  const contactButtons = CONTACT_PANEL.buttons.map((button, index) => ({
    ...button,
    label: t(`contactPanel.buttons.${index}`),
  }));

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        socialShare={META.seoImage}
      />

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
          alt={t("hero.headline")}
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
            image={{ alt: t("hero.headline"), src: HERO_IMAGE }}
            eyebrow={t("hero.eyebrow")}
            headline={t("hero.headline")}
            body={t.raw("hero.body")}
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
          eyebrow={t("heading.eyebrow")}
          headline={t("heading.headline")}
          body={t("heading.body")}
        />
      </ResponsiveBox>

      <Section>
        <Columns space={20} stackColumnsAt="tablet">
          <div>
            <HtmlParser rawHtml={t.raw("artists.leo.copy")} />
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
              quote={t.raw("artists.leo.quote")}
              author={{
                name: t("artists.leo.author.name"),
                role: t("artists.leo.author.role"),
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
              quote={t.raw("artists.laura.quote")}
              author={{
                name: t("artists.laura.author.name"),
                role: t("artists.laura.author.role"),
                company: "",
              }}
            />
          </ResponsiveBox>
          <div>
            <ResponsiveBox responsiveStyles={{ large: { marginTop: "20px" } }}>
              <HtmlParser rawHtml={t.raw("artists.laura.copy")} />
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
                alt={t("artists.laura.author.name")}
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
              <HtmlParser rawHtml={t.raw("artists.cultureHacker.copy")} />
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
                alt={t("artists.cultureHacker.author.name")}
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
              quote={t.raw("artists.cultureHacker.quote")}
              author={{
                name: t("artists.cultureHacker.author.name"),
                role: t("artists.cultureHacker.author.role"),
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
          headline={t("switchback.headline")}
          body={t.raw("switchback.body")}
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
          heading={t("mintingPanel.heading")}
          body={t("mintingPanel.body")}
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
          eyebrow={t("whySolana.eyebrow")}
          headline={t("whySolana.headline")}
          body={t("whySolana.body")}
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
        heading={t("contactPanel.heading")}
        body={t("contactPanel.body")}
        buttons={contactButtons as any}
      />
    </Layout>
  );
};

export default ArtBaselPage;

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
