"use client";

import { useTranslations } from "next-intl";
import { MigrationDocsLayout } from "../components/migration-docs-layout";
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
    <MigrationDocsLayout
      activeUrl="/developers/migrate-to-solana/accounts"
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
      <p>{t("intro")}</p>

      <div>
        <div id="account-ethereum">
          <div className="min-w-0 max-w-full overflow-x-auto">
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
      </div>

      <div>
        <div className="min-w-0 max-w-full overflow-x-auto">
          <table>
            <thead>
              <tr>
                {ethereumTable.headers.map((header) => (
                  <td key={header}>{renderInlineCode(header)}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {ethereumTable.rows.map((row, index) => (
                <tr key={`${row.cells[0]}-${index}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex}>{renderInlineCode(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="min-w-0 max-w-full overflow-x-auto">
          {contractAccount.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul>
            {contractAccount.relationships.map((relationship) => (
              <li key={relationship}>{relationship}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div id="account-solana">
          <div className="min-w-0 max-w-full overflow-x-auto">
            <h3>
              <strong>{accountSolana.title}</strong>
            </h3>
            {accountSolana.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="min-w-0 max-w-full overflow-x-auto">
          <table>
            <thead>
              <tr>
                {solanaTable.headers.map((header) => (
                  <td key={header}>{renderInlineCode(header)}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {solanaTable.rows.map((row, index) => (
                <tr key={`${row.cells[0]}-${index}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex}>{renderInlineCode(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="min-w-0 max-w-full overflow-x-auto">
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
      </div>

      <div>
        <div className="min-w-0 max-w-full overflow-x-auto">
          <table>
            <thead>
              <tr>
                {comparisonTable.headers.map((header) => (
                  <td key={header}>{renderInlineCode(header)}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonTable.rows.map((row, index) => (
                <tr key={`${row.cells[0]}-${index}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex}>{renderInlineCode(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden">
        <div className="min-w-0 max-w-full overflow-x-auto">
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
      </div>

      <div className="hidden md:block">
        <div className="min-w-0 max-w-full overflow-x-auto">
          <table>
            <tbody>
              {accountMappingTable.rows.map((row, index) => (
                <tr key={`${row.cells[0]}-${index}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div id="account-abstraction">
          <div className="min-w-0 max-w-full overflow-x-auto">
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
      </div>

      <div>
        <div id="account-abstraction-solana">
          <div className="min-w-0 max-w-full overflow-x-auto">
            <h3>
              <strong>{accountAbstractionSolana.title}</strong>
            </h3>
            <p>{accountAbstractionSolana.paragraph}</p>
          </div>
        </div>
      </div>

      <div>
        <div id="summary">
          <div className="min-w-0 max-w-full overflow-x-auto">
            <h3>{summary.title}</h3>
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
