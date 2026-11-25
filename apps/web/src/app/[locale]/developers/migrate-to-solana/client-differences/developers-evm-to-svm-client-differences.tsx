"use client";

import { useTranslations } from "next-intl";
import {
  DocsHtml,
  MigrationDocsLayout,
} from "../components/migration-docs-layout";
import {
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/client-differences";

export function DevelopersEvmToSvmClientDifferencesPage() {
  const t = useTranslations("developers-evm-to-svm-client-differences");
  const tableOfContents = t.raw("tableOfContents") as {
    title: string;
    items: string[];
  };
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
      activeUrl="/developers/migrate-to-solana/client-differences"
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
        <div id="types-clients">
          <DocsHtml rawHtml={t.raw("typesOfClients")} />
        </div>
      </div>

      <div>
        <div className="min-w-0 max-w-full overflow-x-auto">
          {renderTable(executionClientsTable)}
        </div>
      </div>

      <div>
        <DocsHtml rawHtml={t.raw("consensusClientsIntro")} />
      </div>

      <div>
        <div className="min-w-0 max-w-full overflow-x-auto">
          {renderTable(consensusClientsTable)}
        </div>
      </div>

      <div>
        <DocsHtml rawHtml={t.raw("solanaClientsIntro")} />
      </div>

      <div>
        <div className="min-w-0 max-w-full overflow-x-auto">
          {renderTable(solanaClientsTable)}
        </div>
      </div>

      <div>
        <div id="number">
          <DocsHtml rawHtml={t.raw("numberOfNodes")} />
        </div>
      </div>

      <div>
        <div id="types-node">
          <DocsHtml rawHtml={t.raw("typesOfNode")} />
        </div>
      </div>

      <div className="md:hidden">
        <div className="min-w-0 max-w-full overflow-x-auto">
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
      </div>

      <div className="hidden md:block">
        <div className="min-w-0 max-w-full overflow-x-auto">
          {renderTable(nodeComparisonTable)}
        </div>
      </div>

      <div>
        <div id="rpc">
          <DocsHtml rawHtml={t.raw("rpcServices")} />
        </div>
      </div>

      <div>
        <div id="summary">
          <div className="min-w-0 max-w-full overflow-x-auto">
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
      </div>
    </MigrationDocsLayout>
  );
}
