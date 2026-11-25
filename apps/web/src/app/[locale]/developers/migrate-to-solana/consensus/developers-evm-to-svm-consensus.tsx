"use client";

import { useTranslations } from "next-intl";
import {
  DocsHtml,
  MigrationDocsLayout,
} from "../components/migration-docs-layout";
import {
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/consensus";

export function DevelopersEvmToSvmConsensusPage() {
  const t = useTranslations("developers-evm-to-svm-consensus");
  const tableOfContents = t.raw("tableOfContents") as {
    title: string;
    items: string[];
  };
  const comparisonTable = t.raw("comparisonTable") as {
    headers: string[];
    rows: { cells: string[] }[];
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

  const renderTable = (table: {
    headers: string[];
    rows: { cells: string[] }[];
  }) => (
    <table>
      <thead>
        <tr>
          {table.headers.map((header) => (
            <td key={header}>{header}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, rowIndex) => (
          <tr key={`${row.cells[0]}-${rowIndex}`}>
            {row.cells.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <MigrationDocsLayout
      activeUrl="/developers/migrate-to-solana/consensus"
      eyebrow={t("hero.eyebrow")}
      headline={t("hero.headline")}
      bodyHtml={t.raw("hero.body")}
      buttons={navButtons.map((button) => ({
        url: button.url,
        label: button.label,
      }))}
      tocHeadline={tableOfContents.title}
      resourceHeadline={t("resourceHeading.headline")}
      resourceCards={resourceCards.map((card) => ({
        heading: card.heading,
        url: card.callToAction.url,
        ctaLabel: card.callToAction.label,
      }))}
    >
      <DocsHtml rawHtml={t.raw("intro")} />

      <div>
        <div id="ethereums-original-consensus">
          <DocsHtml rawHtml={t.raw("ethereumsOriginalConsensus")} />
        </div>
      </div>

      <div>
        <div id="ethereums-current-consensus">
          <DocsHtml rawHtml={t.raw("ethereumsCurrentConsensus")} />
        </div>
      </div>

      <div>
        <div id="solanas-consensus">
          <DocsHtml rawHtml={t.raw("solanasConsensusHeading")} />
        </div>
      </div>

      <div>
        <DocsHtml rawHtml={t.raw("solanasConsensusBody")} />
      </div>

      <div>
        <div className="min-w-0 max-w-full overflow-x-auto">
          {renderTable(comparisonTable)}
        </div>
      </div>

      <div>
        <div>
          <DocsHtml rawHtml={t.raw("summary")} />
        </div>
      </div>
    </MigrationDocsLayout>
  );
}
