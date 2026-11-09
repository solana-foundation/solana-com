"use client";

import { useTranslations } from "next-intl";
import {
  CODE_BLOCKS,
  CONTENT_EDITOR_CTA,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/erc20";
import {
  DocsCode,
  DocsHtml,
  MigrationDocsLayout,
} from "../components/migration-docs-layout";

const CONTENT = [
  "intro",
  "tokenProgram",
  "tokensNoContractAddress",
  "noApprovalFlow",
  "tokenProgramLookLike",
  0,
  "tokenProgramExplanation",
  "tokenMetadata",
  "tradeoffs",
  "highLevelComparison",
  "table",
  "mintGuideNote",
  "howToErc20",
  "howToName",
  1,
  "nameExplanation",
  2,
  "howToSymbol",
  3,
  "symbolExplanation",
  4,
  "howToDecimals",
  5,
  "decimalsExplanation",
  6,
  "howToBalanceOf",
  7,
  8,
  "balanceOfExplanation",
  "howToTotalSupply",
  9,
  "totalSupplyExplanation",
  10,
  "howToTransfer",
  11,
  "transferExplanation",
  12,
  "transferAccountExplanation",
  13,
  "moreFeaturesNote",
] as const;

export function DevelopersEvmToSvmErc20Page() {
  const t = useTranslations("developers-evm-to-svm-erc20");

  return (
    <MigrationDocsLayout
      activeUrl="/developers/migrate-to-solana/erc20"
      eyebrow={t("hero.eyebrow")}
      headline={t("hero.headline")}
      bodyHtml={t.raw("hero.body")}
      buttons={NAV_BUTTONS.map((button, index) => ({
        url: button.url,
        label: t(`navHeading.buttons.${index}.label`),
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
      resourceCards={RESOURCE_CARD_DECK.cards.map((card, index) => ({
        heading: t(`resourceCardDeck.cards.${index}.heading`),
        url: card.callToAction.url,
        ctaLabel: t(`resourceCardDeck.cards.${index}.callToAction.label`),
      }))}
    >
      {CONTENT.map((item) => {
        if (typeof item === "number") {
          const block = CODE_BLOCKS[item];
          return (
            <DocsCode
              key={`code-${item}`}
              code={block.code}
              language={block.language}
            />
          );
        }
        if (item === "table") {
          return (
            <DocsHtml
              key={item}
              rawHtml={t.raw("contentEditor.comparisonTable")}
            />
          );
        }
        return (
          <DocsHtml
            key={item}
            rawHtml={t.raw(`contentEditor.blocks.${item}`)}
          />
        );
      })}
      <div className="md:hidden">
        <DocsHtml rawHtml={t.raw("nodeComparison")} />
      </div>
    </MigrationDocsLayout>
  );
}
