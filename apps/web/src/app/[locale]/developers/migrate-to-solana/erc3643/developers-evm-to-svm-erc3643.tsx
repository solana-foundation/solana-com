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
  TOKEN_EXTENSION_FEATURES_URL,
} from "@/data/developers/evm-to-svm/erc3643";

export function DevelopersEvmToSvmErc3643Page() {
  const t = useTranslations("developers-evm-to-svm-erc3643");

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
    children,
    styleKey,
  }: {
    children: React.ReactNode;
    styleKey?: string;
  }) => {
    if (!styleKey) {
      return children;
    }

    return <div className={BLOCK_CLASSES[styleKey]}>{children}</div>;
  };

  const renderCodeBlock = (index: number) => {
    const codeBlock = CODE_BLOCKS[index];

    return <DocsCode code={codeBlock.code} language={codeBlock.language} />;
  };

  return (
    <MigrationDocsLayout
      activeUrl="/developers/migrate-to-solana/erc3643"
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
          styleKey: "spacingWithMargins",
          children: <p>{t("contentEditor.intro")}</p>,
        })}
      </div>
      <div key="copy-1" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <>
              <h3>
                <strong>{t("contentEditor.keyCharacteristics.title")}</strong>
              </h3>
              <ul>
                <li>
                  <strong>
                    {t("contentEditor.keyCharacteristics.items.0.label")}
                  </strong>
                  : {t("contentEditor.keyCharacteristics.items.0.description")}
                </li>
                <li>
                  <strong>
                    {t("contentEditor.keyCharacteristics.items.1.label")}
                  </strong>
                  : {t("contentEditor.keyCharacteristics.items.1.description")}
                </li>
                <li>
                  <strong>
                    {t("contentEditor.keyCharacteristics.items.2.label")}
                  </strong>
                  : {t("contentEditor.keyCharacteristics.items.2.description")}
                </li>
              </ul>
            </>
          ),
        })}
      </div>
      <div key="copy-2" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <>
              <h3>
                <strong>{t("contentEditor.tokenExtensions.title")}</strong>
              </h3>
              <p>{t("contentEditor.tokenExtensions.body")}</p>
              <p>
                <strong>
                  {t("contentEditor.tokenExtensions.keyFeatures.prefix")}
                  <a
                    href={TOKEN_EXTENSION_FEATURES_URL}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t("contentEditor.tokenExtensions.keyFeatures.linkLabel")}
                  </a>
                  {t("contentEditor.tokenExtensions.keyFeatures.suffix")}
                </strong>
              </p>
              <ul>
                <li>
                  <strong>
                    {t("contentEditor.tokenExtensions.items.0.label")}
                  </strong>
                  : {t("contentEditor.tokenExtensions.items.0.description")}
                </li>
                <li>
                  <strong>
                    {t("contentEditor.tokenExtensions.items.1.label")}
                  </strong>
                  : {t("contentEditor.tokenExtensions.items.1.description")}
                </li>
                <li>
                  <strong>
                    {t("contentEditor.tokenExtensions.items.2.label")}
                  </strong>
                  : {t("contentEditor.tokenExtensions.items.2.description")}
                </li>
                <li>
                  <strong>
                    {t("contentEditor.tokenExtensions.items.3.label")}
                  </strong>
                  : {t("contentEditor.tokenExtensions.items.3.description")}
                </li>
              </ul>
            </>
          ),
        })}
      </div>
      <div key="copy-3" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacingNoBottom",
          children: (
            <>
              <h3>
                <strong>
                  {t("contentEditor.tokenExtensionProgram.title")}
                </strong>
              </h3>
              <p>{t("contentEditor.tokenExtensionProgram.body")}</p>
              <p>{t("contentEditor.tokenExtensionProgram.bodyTwo")}</p>
            </>
          ),
        })}
      </div>
      <div key="code-4">{renderCodeBlock(0)}</div>
      <div key="copy-5" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <>
              <h3>
                <strong>{t("contentEditor.kycWhitelisting.title")}</strong>
              </h3>
              <p>{t("contentEditor.kycWhitelisting.body")}</p>
            </>
          ),
        })}
      </div>
      <div key="copy-6" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <>
              <h3>
                <strong>{t("contentEditor.freezeEnforcement.title")}</strong>
              </h3>
              <p>{t("contentEditor.freezeEnforcement.body")}</p>
            </>
          ),
        })}
      </div>
      <div key="copy-7" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <>
              <h3>{t("contentEditor.transferHook.title")}</h3>
              <p>{t("contentEditor.transferHook.intro")}</p>
              <ul>
                <li>{t("contentEditor.transferHook.items.0")}</li>
                <li>{t("contentEditor.transferHook.items.1")}</li>
                <li>{t("contentEditor.transferHook.items.2")}</li>
              </ul>
              <p>{t("contentEditor.transferHook.outro")}</p>
            </>
          ),
        })}
      </div>
      <div key="copy-8" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <>
              <h3>
                <strong>{t("contentEditor.permanentDelegate.title")}</strong>
              </h3>
              <p>{t("contentEditor.permanentDelegate.body")}</p>
            </>
          ),
        })}
      </div>
      <div key="copy-9" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <h2>
              <strong>{t("contentEditor.howTo.title")}</strong>
            </h2>
          ),
        })}
      </div>
      <div key="copy-10" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <h3>
              <strong>{t("contentEditor.conceptualMap.title")}</strong>
            </h3>
          ),
        })}
      </div>
      <div key="table-11">
        <div className="min-w-0 max-w-full overflow-x-auto">
          <DocsHtml rawHtml={t.raw("contentEditor.conceptualMapTable")} />
        </div>
      </div>
      <div key="copy-12" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <h3>
              <strong>{t("contentEditor.callFlow.title")}</strong>
            </h3>
          ),
        })}
      </div>
      <div key="code-13">{renderCodeBlock(1)}</div>
      <div key="copy-14" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: <p>{t("contentEditor.callFlow.body")}</p>,
        })}
      </div>
      <div key="copy-15" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <>
              <h3>
                <strong>{t("contentEditor.minimalTransferHook.title")}</strong>
              </h3>
              <p>{t("contentEditor.minimalTransferHook.body")}</p>
            </>
          ),
        })}
      </div>
      <div key="code-16">{renderCodeBlock(2)}</div>
      <div key="copy-17" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <>
              <h3>
                <strong>{t("contentEditor.cliQuickstart.title")}</strong>
              </h3>
              <p>{t("contentEditor.cliQuickstart.body")}</p>
            </>
          ),
        })}
      </div>
      <div key="code-18">{renderCodeBlock(3)}</div>
      <div className="md:hidden">
        <DocsHtml rawHtml={t.raw("nodeComparison")} />
      </div>
    </MigrationDocsLayout>
  );
}
