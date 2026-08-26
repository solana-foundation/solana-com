"use client";

import { Columns } from "@/component-library/columns";
import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  Heading,
  Hero,
  Section,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/accounts";

export function DevelopersEvmToSvmAccountsPage() {
  const t = useTranslations("developers-evm-to-svm-accounts");
  const tableOfContents = t.raw("tableOfContents") as {
    title: string;
    items: string[];
  };
  const accountEthereum = t.raw("accountEthereum") as {
    title: string;
    intro: string;
    list: { label: string; body: string }[];
    notes: string[];
  };
  const ethereumTable = t.raw("ethereumTable") as {
    headers: string[];
    rows: { cells: string[] }[];
  };
  const contractAccount = t.raw("contractAccount") as {
    paragraphs: string[];
    relationships: string[];
  };
  const accountSolana = t.raw("accountSolana") as {
    title: string;
    paragraphs: string[];
  };
  const solanaTable = t.raw("solanaTable") as {
    headers: string[];
    rows: { cells: string[] }[];
  };
  const solanaAccountsNote = t.raw("solanaAccountsNote") as {
    paragraphs: string[];
    list: { label: string; body: string }[];
    notes: string[];
  };
  const comparisonTable = t.raw("comparisonTable") as {
    headers: string[];
    rows: { cells: string[] }[];
  };
  const accountMappingSmall = t.raw("accountMappingSmall") as {
    sections: { title: string; items: string[] }[];
  };
  const accountMappingTable = t.raw("accountMappingTable") as {
    rows: { cells: string[] }[];
  };
  const accountAbstraction = t.raw("accountAbstraction") as {
    title: string;
    intro: string;
    chartIntro: string;
    chart: string[];
    paragraphs: string[];
    benefitsIntro: string;
    benefits: string[];
  };
  const accountAbstractionSolana = t.raw("accountAbstractionSolana") as {
    title: string;
    paragraph: string;
  };
  const summary = t.raw("summary") as { title: string; items: string[] };

  const tableCellStyle = { padding: "8px 10px", border: "1px solid #414141" };
  const tableHeaderStyle = { ...tableCellStyle, fontWeight: 600 };
  const renderInlineCode = (text: string) => {
    return text.split(/`([^`]+)`/g).map((part, index) => {
      return index % 2 === 1 ? (
        <code key={index}>{part}</code>
      ) : (
        <span key={index}>{part}</span>
      );
    });
  };

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

  return (
    <>
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
            }}
          >
            <p>
              <strong>{tableOfContents.title}</strong>
            </p>
            {tableOfContents.items.map((item, index) => {
              const anchors = [
                "#account-ethereum",
                "#account-solana",
                "#account-abstraction",
                "#account-abstraction-solana",
                "#summary",
              ];
              const href = anchors[index] ?? "#";
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
            <div className="tw-html_parser">
              <p>{t("intro")}</p>
            </div>
          </ResponsiveBox>
        </Columns>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="account-ethereum">
            <div className="tw-html_parser">
              <h3>
                <strong>{accountEthereum.title}</strong>
              </h3>
              <p>{accountEthereum.intro}</p>
              <ul>
                {accountEthereum.list.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}: </strong>
                    {item.body}
                  </li>
                ))}
              </ul>
              {accountEthereum.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>
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
          <div className="tw-html_parser">
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  {ethereumTable.headers.map((header) => (
                    <td key={header} style={tableHeaderStyle}>
                      {renderInlineCode(header)}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ethereumTable.rows.map((row, index) => (
                  <tr key={`${row.cells[0]}-${index}`}>
                    {row.cells.map((cell, cellIndex) => (
                      <td key={cellIndex} style={tableCellStyle}>
                        {renderInlineCode(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div className="tw-html_parser">
            {contractAccount.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul>
              {contractAccount.relationships.map((relationship) => (
                <li key={relationship}>{relationship}</li>
              ))}
            </ul>
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="account-solana">
            <div className="tw-html_parser">
              <h3>
                <strong>{accountSolana.title}</strong>
              </h3>
              {accountSolana.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
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
          <div className="tw-html_parser">
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  {solanaTable.headers.map((header) => (
                    <td key={header} style={tableHeaderStyle}>
                      {renderInlineCode(header)}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {solanaTable.rows.map((row, index) => (
                  <tr key={`${row.cells[0]}-${index}`}>
                    {row.cells.map((cell, cellIndex) => (
                      <td key={cellIndex} style={tableCellStyle}>
                        {renderInlineCode(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div className="tw-html_parser">
            {solanaAccountsNote.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul>
              {solanaAccountsNote.list.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}: </strong>
                  {item.body}
                </li>
              ))}
            </ul>
            {solanaAccountsNote.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
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
          <div className="tw-html_parser">
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  {comparisonTable.headers.map((header) => (
                    <td key={header} style={tableHeaderStyle}>
                      {renderInlineCode(header)}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonTable.rows.map((row, index) => (
                  <tr key={`${row.cells[0]}-${index}`}>
                    {row.cells.map((cell, cellIndex) => (
                      <td key={cellIndex} style={tableCellStyle}>
                        {renderInlineCode(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ResponsiveBox>

        <ResponsiveBox
          responsiveStyles={{
            large: { display: "none" },
            medium: { display: "none" },
            small: { display: "flex" },
          }}
        >
          <div className="tw-html_parser">
            {accountMappingSmall.sections.map((section) => (
              <div key={section.title}>
                <p>
                  <strong>{section.title}</strong>
                </p>
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ResponsiveBox>

        <ResponsiveBox
          responsiveStyles={{
            large: {
              display: "flex",
              paddingRight: "50px",
              paddingLeft: "50px",
              paddingTop: "20px",
            },
            medium: { display: "flex" },
            small: { display: "none" },
          }}
        >
          <div className="tw-html_parser">
            <table style={{ width: "100%" }}>
              <tbody>
                {accountMappingTable.rows.map((row, index) => (
                  <tr key={`${row.cells[0]}-${index}`}>
                    {row.cells.map((cell, cellIndex) => (
                      <td key={cellIndex} style={tableCellStyle}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="account-abstraction">
            <div className="tw-html_parser">
              <h2>
                <strong>{accountAbstraction.title}</strong>
              </h2>
              <p>{accountAbstraction.intro}</p>
              <p>{accountAbstraction.chartIntro}</p>
              <ul>
                {accountAbstraction.chart.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {accountAbstraction.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>{accountAbstraction.benefitsIntro}</p>
              <ul>
                {accountAbstraction.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="account-abstraction-solana">
            <div className="tw-html_parser">
              <h3>
                <strong>{accountAbstractionSolana.title}</strong>
              </h3>
              <p>{accountAbstractionSolana.paragraph}</p>
            </div>
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="summary">
            <div className="tw-html_parser">
              <h3>{summary.title}</h3>
              <ul>
                {summary.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
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
      </Section>
    </>
  );
}
