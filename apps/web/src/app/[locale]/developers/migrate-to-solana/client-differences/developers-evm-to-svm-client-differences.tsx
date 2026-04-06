"use client";

import { ChainMigrationHero } from "@/components/developers/chain-migration-hero";
import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  ContentEditor,
  Heading,
  HtmlParser,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import { ResourceList } from "@/components/solutions/resource-list";
import {
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/client-differences";

export function DevelopersEvmToSvmClientDifferencesPage() {
  const t = useTranslations("developers-evm-to-svm-client-differences");
  const executionClientsTable = t.raw("executionClientsTable") as {
    headers: string[];
    rows: { cells: string[] }[];
  };
  const consensusClientsTable = t.raw("consensusClientsTable") as {
    headers: string[];
    rows: { cells: string[] }[];
  };
  const solanaClientsTable = t.raw("solanaClientsTable") as {
    headers: string[];
    rows: { cells: string[] }[];
  };
  const nodeTypeSummary = t.raw("nodeTypeSummary") as {
    sections: { title: string; items: string[] }[];
  };
  const nodeComparisonTable = t.raw("nodeComparisonTable") as {
    headers: string[];
    rows: { cells: string[] }[];
  };
  const summary = t.raw("summary") as { title: string; items: string[] };

  const tableCellStyle = { padding: "8px 10px", border: "1px solid #414141" };
  const tableHeaderStyle = { ...tableCellStyle, fontWeight: 600 };

  const navButtons = NAV_BUTTONS.map((button, index) => ({
    ...button,
    label: t(`navHeading.buttons.${index}.label`),
  }));

  const resourceItems = RESOURCE_CARD_DECK.cards.map((card, index) => ({
    title: t(`resourceCardDeck.cards.${index}.heading`),
    href: card.callToAction.url,
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
    <>
      <ChainMigrationHero
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        body={t.raw("hero.body") as string}
      />

      <ContentEditor tocHeadline="Contents">
        <div key="intro">
          <HtmlParser rawHtml={t.raw("intro")} />
        </div>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="types-clients">
            <HtmlParser rawHtml={t.raw("typesOfClients")} />
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
            {renderTable(executionClientsTable)}
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <HtmlParser rawHtml={t.raw("consensusClientsIntro")} />
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
            {renderTable(consensusClientsTable)}
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <HtmlParser rawHtml={t.raw("solanaClientsIntro")} />
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
            {renderTable(solanaClientsTable)}
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="number">
            <HtmlParser rawHtml={t.raw("numberOfNodes")} />
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="types-node">
            <HtmlParser rawHtml={t.raw("typesOfNode")} />
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
            {nodeTypeSummary.sections.map((section) => (
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
            {renderTable(nodeComparisonTable)}
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="rpc">
            <HtmlParser rawHtml={t.raw("rpcServices")} />
          </div>
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={{ large: { paddingTop: "20px" } }}>
          <div id="summary">
            <div className="tw-html_parser">
              <h2>
                <strong>{summary.title}</strong>
              </h2>
              <ul>
                {summary.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </ResponsiveBox>
      </ContentEditor>

      <Heading
        variant="centered"
        eyebrow={t("navHeading.eyebrow")}
        headline=""
        body=""
        buttons={navButtons as React.ComponentProps<typeof Heading>["buttons"]}
      />

      <ResourceList
        title={t("resourceHeading.headline")}
        items={resourceItems}
      />
    </>
  );
}
