"use client";

import { useTranslations } from "next-intl";
import {
  BLOCK_CLASSES,
  DocsCode,
  DocsHtml,
  MigrationDocsLayout,
} from "../components/migration-docs-layout";
import {
  CODE_BLOCKS,
  CONTENT_EDITOR_CTA,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/erc721";

export function DevelopersEvmToSvmErc721Page() {
  const t = useTranslations("developers-evm-to-svm-erc721");

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

  const renderCodeBlock = (index: number) => {
    const codeBlock = CODE_BLOCKS[index];

    return <DocsCode code={codeBlock.code} language={codeBlock.language} />;
  };

  return (
    <MigrationDocsLayout
      activeUrl="/developers/migrate-to-solana/erc721"
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
          contentKey: "tokenProgram",
          styleKey: "spacing",
        })}
      </div>
      <div key="copy-2" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "mintAddresses",
          styleKey: "spacing",
        })}
      </div>
      <div key="copy-3" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "approvalFlow",
          styleKey: "spacing",
        })}
      </div>
      <div key="copy-4" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "tokenProgramIntro",
          styleKey: "spacing",
        })}
      </div>
      <div key="code-5">{renderCodeBlock(0)}</div>
      <div key="copy-6" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "tokenProgramSummary",
          styleKey: "spacing",
        })}
      </div>
      <div key="copy-7" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "metadata",
          styleKey: "spacing",
        })}
      </div>
      <div key="copy-8" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "tradeoffs",
          styleKey: "spacing",
        })}
      </div>
      <div key="copy-9" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "comparisonIntro",
          styleKey: "spacing",
        })}
      </div>
      <div key="table-10">
        <div className="min-w-0 max-w-full overflow-x-auto">
          <DocsHtml rawHtml={t.raw("contentEditor.blocks.comparisonTable")} />
        </div>
      </div>
      <div key="copy-11" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "mintGuide",
          styleKey: "spacing",
        })}
      </div>
      <div key="copy-12" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "howToIntro",
          styleKey: "spacing",
        })}
      </div>
      <div key="copy-13" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "howToName",
          styleKey: "spacing",
        })}
      </div>
      <div key="code-14">{renderCodeBlock(1)}</div>
      <div key="copy-15" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "nameDescription",
          styleKey: "spacing",
        })}
      </div>
      <div key="code-16">{renderCodeBlock(2)}</div>
      <div key="copy-17" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "howToSymbol",
          styleKey: "spacing",
        })}
      </div>
      <div key="code-18">{renderCodeBlock(3)}</div>
      <div key="copy-19" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "symbolDescription",
          styleKey: "spacing",
        })}
      </div>
      <div key="code-20">{renderCodeBlock(4)}</div>
      <div key="copy-21" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "howToTokenUri",
          styleKey: "spacing",
        })}
      </div>
      <div key="code-22">{renderCodeBlock(5)}</div>
      <div key="copy-23" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "tokenUriDescription",
          styleKey: "spacing",
        })}
      </div>
      <div key="code-24">{renderCodeBlock(6)}</div>
      <div key="copy-25" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "howToOwnerOf",
          styleKey: "spacing",
        })}
      </div>
      <div key="code-26">{renderCodeBlock(7)}</div>
      <div key="copy-27" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "ownerOfDescription",
          styleKey: "spacing",
        })}
      </div>
      <div key="code-28">{renderCodeBlock(8)}</div>
      <div key="copy-29" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "howToTransferFrom",
          styleKey: "spacingWithOffset",
        })}
      </div>
      <div key="code-30">{renderCodeBlock(9)}</div>
      <div key="copy-31" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "transferFromIntro",
          styleKey: "spacing",
        })}
      </div>
      <div key="code-32">{renderCodeBlock(10)}</div>
      <div key="copy-33" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "transferFromAta",
          styleKey: "spacing",
        })}
      </div>
      <div key="code-34">{renderCodeBlock(11)}</div>
      <div key="copy-35" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          contentKey: "exploreMore",
          styleKey: "spacing",
        })}
      </div>
      <div className="md:hidden">
        <DocsHtml rawHtml={t.raw("nodeComparison")} />
      </div>
    </MigrationDocsLayout>
  );
}
