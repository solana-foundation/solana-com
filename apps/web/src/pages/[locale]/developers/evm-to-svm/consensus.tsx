import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import { Columns } from "@/component-library/columns";
import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  Heading,
  Hero,
  HtmlParser,
  Section,
} from "@solana-foundation/solana-lib";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import {
  META,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
  TABLE_OF_CONTENTS_ANCHORS,
} from "@/data/developers/evm-to-svm/consensus";

const DevelopersEvmToSvmConsensusPage = () => {
  const t = useTranslations("developers-evm-to-svm-consensus");
  const tableOfContents = t.raw("tableOfContents") as {
    title: string;
    items: string[];
  };
  const comparisonTable = t.raw("comparisonTable") as {
    headers: string[];
    rows: { cells: string[] }[];
  };

  const tableCellStyle = { padding: "8px 10px", border: "1px solid #414141" };
  const tableHeaderStyle = { ...tableCellStyle, fontWeight: 600 };

  const navButtons = NAV_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`navHeading.buttons.${index}.label`),
  }));

  const resourceCards = RESOURCE_CARD_DECK.cards.map((card, index) => ({
    ...card,
    heading: t(`resourceCardDeck.cards.${index}.heading`),
    callToAction: {
      ...card.callToAction,
      label: t(`resourceCardDeck.cards.${index}.callToAction.label`),
    },
  }));

  const renderTable = (table: {
    headers: string[];
    rows: { cells: string[] }[];
  }) => (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          {table.headers.map((header) => (
            <td key={header} style={tableHeaderStyle}>
              {header}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, rowIndex) => (
          <tr key={`${row.cells[0]}-${rowIndex}`}>
            {row.cells.map((cell, cellIndex) => (
              <td key={cellIndex} style={tableCellStyle}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        socialShare={META.seoImage}
      />

      <Hero
        headingAs="h1"
        centered={false}
        newsLetter={false}
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body")}
      />

      <Section>
        <Columns space={30} stackColumnsAt="tablet">
          <ResponsiveBox
            responsiveStyles={{
              large: {
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingBottom: "20px",
                paddingRight: "20px",
                backgroundColor: "rgba(21, 21, 21, 1)",
                borderRadius: "20px",
              },
              medium: { display: "flex" },
              small: { display: "flex" },
            }}
          >
            <p>
              <strong>{tableOfContents.title}</strong>
            </p>
            {tableOfContents.items.map((item, index) => {
              const href = TABLE_OF_CONTENTS_ANCHORS[index] ?? "#";
              return (
                <p key={item} style={{ textIndent: "2em" }}>
                  <a href={href} rel="noopener noreferrer">
                    {item}
                  </a>
                </p>
              );
            })}
          </ResponsiveBox>
          <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
            <HtmlParser rawHtml={t.raw("intro")} />
          </ResponsiveBox>
        </Columns>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="ethereums-original-consensus">
            <HtmlParser rawHtml={t.raw("ethereumsOriginalConsensus")} />
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="ethereums-current-consensus">
            <HtmlParser rawHtml={t.raw("ethereumsCurrentConsensus")} />
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="solanas-consensus">
            <HtmlParser rawHtml={t.raw("solanasConsensusHeading")} />
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <HtmlParser rawHtml={t.raw("solanasConsensusBody")} />
        </ResponsiveBox>

        <ResponsiveBox
          responsiveStyles={{
            large: {
              paddingRight: "50px",
              paddingLeft: "50px",
              paddingTop: "20px",
            },
          }}
        >
          <div className="tw-html_parser">{renderTable(comparisonTable)}</div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="summary">
            <HtmlParser rawHtml={t.raw("summary")} />
          </div>
        </ResponsiveBox>

        <Heading
          variant="centered"
          eyebrow={t("navHeading.eyebrow")}
          headline=""
          body=""
          buttons={
            navButtons as React.ComponentProps<typeof Heading>["buttons"]
          }
        />

        <Heading eyebrow="" headline={t("resourceHeading.headline")} body="" />

        <ResponsiveBox
          responsiveStyles={{ large: { paddingTop: "0px", marginTop: "-3px" } }}
        >
          <CardDeck
            cards={
              resourceCards as React.ComponentProps<typeof CardDeck>["cards"]
            }
            numCols={
              RESOURCE_CARD_DECK.numCols as React.ComponentProps<
                typeof CardDeck
              >["numCols"]
            }
            featured={RESOURCE_CARD_DECK.featured}
          />
        </ResponsiveBox>
      </Section>
    </Layout>
  );
};

export default DevelopersEvmToSvmConsensusPage;

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
