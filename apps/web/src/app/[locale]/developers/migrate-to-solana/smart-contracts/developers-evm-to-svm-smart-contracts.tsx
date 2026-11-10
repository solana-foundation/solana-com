"use client";

import { useTranslations } from "next-intl";
import {
  BLOCK_CLASSES,
  DocsHtml,
  MigrationDocsLayout,
} from "../components/migration-docs-layout";
import {
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/smart-contracts";

export function DevelopersEvmToSvmSmartContractsPage() {
  const t = useTranslations("developers-evm-to-svm-smart-contracts");
  const contentBlocks = t.raw("content.blocks") as string[];
  const tableOfContents = t.raw("tableOfContents") as {
    title: string;
    items: string[];
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

  const renderCopyBlock = ({
    index,
    id,
    styleKey,
  }: {
    index: number;
    id?: string;
    styleKey?: string;
  }) => {
    const html = contentBlocks[index];
    const content = (
      <div className="min-w-0 max-w-full overflow-x-auto" id={id}>
        <DocsHtml rawHtml={html} />
      </div>
    );

    if (!styleKey) {
      return content;
    }

    return <div className={BLOCK_CLASSES[styleKey]}>{content}</div>;
  };

  const renderHtmlBlock = ({
    html,
    styleKey,
  }: {
    html: string;
    styleKey?: string;
  }) => {
    const content = (
      <div className="min-w-0 max-w-full overflow-x-auto">
        <DocsHtml rawHtml={html} />
      </div>
    );

    if (!styleKey) {
      return content;
    }

    return <div className={BLOCK_CLASSES[styleKey]}>{content}</div>;
  };

  return (
    <MigrationDocsLayout
      activeUrl="/developers/migrate-to-solana/smart-contracts"
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
      {renderCopyBlock({ index: 0 })}
      <div key="copy-1">
        {renderCopyBlock({ index: 1, styleKey: "spacing" })}
      </div>
      <div key="copy-2">
        {renderCopyBlock({ index: 2, id: "SPL", styleKey: "spacing" })}
      </div>
      <div key="copy-3">
        {renderCopyBlock({
          index: 3,
          styleKey: "spacing",
        })}
      </div>
      <div key="table-4">
        {renderHtmlBlock({
          html: t.raw("tables.programArchitecture"),
          styleKey: "tableWrapper",
        })}
      </div>
      <div key="copy-5">
        {renderCopyBlock({ index: 4, styleKey: "spacing" })}
      </div>
      <div key="table-6">
        {renderHtmlBlock({
          html: t.raw("tables.clusterEnvironments"),
          styleKey: "tableWrapper",
        })}
      </div>
      <div key="copy-7">
        {renderCopyBlock({ index: 5, styleKey: "spacing" })}
      </div>
      <div key="copy-8">
        {renderCopyBlock({
          index: 6,
          styleKey: "spacing",
        })}
      </div>
      <div key="copy-9">
        {renderCopyBlock({ index: 7, styleKey: "codeBlock" })}
      </div>
      <div key="copy-10">
        {renderCopyBlock({ index: 8, styleKey: "spacing" })}
      </div>
      <div key="copy-11">
        {renderCopyBlock({ index: 9, styleKey: "spacing" })}
      </div>
    </MigrationDocsLayout>
  );
}
