"use client";

import { useTranslations } from "next-intl";
import {
  BLOCK_CLASSES,
  DocsHtml,
  MigrationDocsLayout,
} from "../components/migration-docs-layout";
import {
  CONTENT_EDITOR_CTA,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/erc4337";

export function DevelopersEvmToSvmErc4337Page() {
  const t = useTranslations("developers-evm-to-svm-erc4337");

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
    contentKey,
    styleKey,
  }: {
    contentKey: string;
    styleKey?: string;
  }) => {
    const content = (
      <DocsHtml rawHtml={t.raw(`contentEditor.blocks.${contentKey}`)} />
    );

    if (!styleKey) {
      return content;
    }

    return <div className={BLOCK_CLASSES[styleKey]}>{content}</div>;
  };

  return (
    <MigrationDocsLayout
      activeUrl="/developers/migrate-to-solana/erc4337"
      eyebrow={t("hero.eyebrow")}
      headline={t("hero.headline")}
      bodyHtml={t.raw("hero.body")}
      buttons={navButtons.map((button) => ({
        url: button.url,
        label: button.label,
      }))}
      tocHeadline={t("contentEditor.tocHeadline")}
      callToAction={{
        eyebrow: t("contentEditor.callToAction.eyebrow"),
        headline: t("contentEditor.callToAction.headline"),
        description: t("contentEditor.callToAction.description"),
        button: {
          label: t("contentEditor.callToAction.button.label"),
          url: CONTENT_EDITOR_CTA.button.url,
        },
      }}
      resourceHeadline={t("resourceHeading.headline")}
      resourceCards={resourceCards.map((card) => ({
        heading: card.heading,
        url: card.callToAction.url,
        ctaLabel: card.callToAction.label,
      }))}
    >
      <div key="copy-0" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "intro",
          styleKey: "spacingWithMargins",
        })}
      </div>
      <div key="copy-1" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "solanaSolved",
          styleKey: "spacing",
        })}
      </div>
      <div key="copy-2" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "allAccounts",
          styleKey: "spacing",
        })}
      </div>
      <div key="copy-3" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "programsExecutable",
          styleKey: "spacingNoBottom",
        })}
      </div>
      <div key="copy-4" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({ contentKey: "pdasCore", styleKey: "spacing" })}
      </div>
      <div key="copy-5" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({ contentKey: "cpiSupport", styleKey: "spacing" })}
      </div>
      <div key="copy-6" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "comparisonIntro",
          styleKey: "spacing",
        })}
      </div>
      <div key="table-7">
        <div className="min-w-0 max-w-full overflow-x-auto">
          <DocsHtml rawHtml={t.raw("contentEditor.blocks.comparisonTable")} />
        </div>
      </div>
      <div key="copy-8" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "comparisonOutro",
          styleKey: "spacing",
        })}
      </div>
      <div className="md:hidden">
        <DocsHtml rawHtml={t.raw("nodeComparison")} />
      </div>
    </MigrationDocsLayout>
  );
}
