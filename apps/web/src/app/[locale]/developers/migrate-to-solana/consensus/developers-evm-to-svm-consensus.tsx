"use client";

import { ChainMigrationHero } from "@/components/developers/chain-migration-hero";
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
} from "@/data/developers/evm-to-svm/consensus";

export function DevelopersEvmToSvmConsensusPage() {
  const t = useTranslations("developers-evm-to-svm-consensus");
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
        <div key="eth-original" id="ethereums-original-consensus">
          <HtmlParser rawHtml={t.raw("ethereumsOriginalConsensus")} />
        </div>
        <div key="eth-current" id="ethereums-current-consensus">
          <HtmlParser rawHtml={t.raw("ethereumsCurrentConsensus")} />
        </div>
        <div key="sol-heading" id="solanas-consensus">
          <HtmlParser rawHtml={t.raw("solanasConsensusHeading")} />
        </div>
        <div key="sol-body">
          <HtmlParser rawHtml={t.raw("solanasConsensusBody")} />
        </div>
        <div key="comparison" className="tw-html_parser">
          {renderTable(comparisonTable)}
        </div>
        <div key="summary" id="summary">
          <HtmlParser rawHtml={t.raw("summary")} />
        </div>
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
