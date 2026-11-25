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
  CONCEPTUAL_MAP_TABLE,
  CONTENT_EDITOR_CTA,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/erc4626";

export function DevelopersEvmToSvmErc4626Page() {
  const t = useTranslations("developers-evm-to-svm-erc4626");

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

  const renderConceptualMapTable = () => (
    <table>
      <thead>
        <tr>
          {CONCEPTUAL_MAP_TABLE.headers.map((header) => (
            <th key={header}>{t(header)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {CONCEPTUAL_MAP_TABLE.rows.map((row, rowIndex) => (
          <tr key={`${row.labelKey}-${rowIndex}`}>
            <td>
              <strong>{t(row.labelKey)}</strong>
            </td>
            <td>{t(row.objectKey)}</td>
            <td>
              {"purposeParts" in row && row.purposeParts ? (
                row.purposeParts.map((part, partIndex) => {
                  if (part.type === "code") {
                    return (
                      <code key={`${row.labelKey}-code-${partIndex}`}>
                        {part.value}
                      </code>
                    );
                  }

                  return (
                    <span key={`${row.labelKey}-text-${partIndex}`}>
                      {t(part.key)}
                    </span>
                  );
                })
              ) : "purposeKey" in row ? (
                <span>{t(row.purposeKey)}</span>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <MigrationDocsLayout
      activeUrl="/developers/migrate-to-solana/erc4626"
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
                  : {t("contentEditor.keyCharacteristics.items.0.body")}
                </li>
                <li>
                  <strong>
                    {t("contentEditor.keyCharacteristics.items.1.label")}
                  </strong>
                  : {t("contentEditor.keyCharacteristics.items.1.body")}
                </li>
                <li>
                  <strong>
                    {t("contentEditor.keyCharacteristics.items.2.label")}
                  </strong>
                  : {t("contentEditor.keyCharacteristics.items.2.body")}
                </li>
                <li>
                  <strong>
                    {t("contentEditor.keyCharacteristics.items.3.label")}
                  </strong>
                  : {t("contentEditor.keyCharacteristics.items.3.body")}
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
              <h2>
                <strong>{t("contentEditor.programAccount.title")}</strong>
              </h2>
              <h3>{t("contentEditor.programAccount.subtitle")}</h3>
              <p>{t("contentEditor.programAccount.body")}</p>
            </>
          ),
        })}
      </div>
      <div key="code-3">{renderCodeBlock(0)}</div>
      <div key="copy-4" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: <p>{t("contentEditor.deploymentFeel")}</p>,
        })}
      </div>
      <div key="copy-5" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacingNoBottom",
          children: (
            <>
              <h3>{t("contentEditor.accountsStorage.title")}</h3>
              <p>{t("contentEditor.accountsStorage.body")}</p>
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
                <strong>{t("contentEditor.pda.title")}</strong>
              </h3>
              <p>{t("contentEditor.pda.body")}</p>
            </>
          ),
        })}
      </div>
      <div key="copy-7" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <>
              <h3>{t("contentEditor.cpi.title")}</h3>
              <p>{t("contentEditor.cpi.body")}</p>
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
                <strong>{t("contentEditor.authoritativeFlow.title")}</strong>
              </h3>
              <p>
                <strong>
                  {t("contentEditor.authoritativeFlow.deposit.title")}
                </strong>
              </p>
              <ul>
                <li>{t("contentEditor.authoritativeFlow.deposit.items.0")}</li>
                <li>{t("contentEditor.authoritativeFlow.deposit.items.1")}</li>
              </ul>
              <p>
                <strong>
                  {t("contentEditor.authoritativeFlow.withdraw.title")}
                </strong>
              </p>
              <ul>
                <li>{t("contentEditor.authoritativeFlow.withdraw.items.0")}</li>
              </ul>
              <p>
                <strong>
                  {t("contentEditor.authoritativeFlow.stateUpdate")}
                </strong>
              </p>
              <p>{t("contentEditor.authoritativeFlow.preview")}</p>
            </>
          ),
        })}
      </div>
      <div key="copy-9" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <>
              <h2>
                <strong>
                  {t("contentEditor.tokenExtensionProgram.title")}
                </strong>
              </h2>
              <p>{t("contentEditor.tokenExtensionProgram.body")}</p>
              <p>{t("contentEditor.tokenExtensionProgram.bodyTwo")}</p>
              <p>{t("contentEditor.tokenExtensionProgram.bodyThree")}</p>
            </>
          ),
        })}
      </div>
      <div key="code-10">{renderCodeBlock(1)}</div>
      <div key="copy-11" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <>
              <h2>
                <strong>{t("contentEditor.howTo.title")}</strong>
              </h2>
              <h3>
                <strong>{t("contentEditor.howTo.conceptualMap")}</strong>
              </h3>
            </>
          ),
        })}
      </div>
      <div key="table-12">
        <div className="min-w-0 max-w-full overflow-x-auto">
          {renderConceptualMapTable()}
        </div>
      </div>
      <div key="copy-13" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: <p>{t("contentEditor.oneTxSummary")}</p>,
        })}
      </div>
      <div key="copy-14" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <>
              <h3>
                <strong>{t("contentEditor.callFlow.title")}</strong>
              </h3>
              <p>
                <strong>{t("contentEditor.callFlow.steps.0")}</strong>
              </p>
              <p>
                <strong>{t("contentEditor.callFlow.steps.1")}</strong>
              </p>
              <ul>
                <li>{t("contentEditor.callFlow.stepTwo.items.0")}</li>
                <li>{t("contentEditor.callFlow.stepTwo.items.1")}</li>
              </ul>
              <p>
                <strong>{t("contentEditor.callFlow.steps.2")}</strong>
              </p>
              <ul>
                <li>{t("contentEditor.callFlow.stepThree.items.0")}</li>
                <li>{t("contentEditor.callFlow.stepThree.items.1")}</li>
                <li>{t("contentEditor.callFlow.stepThree.items.2")}</li>
                <li>{t("contentEditor.callFlow.stepThree.items.3")}</li>
                <li>{t("contentEditor.callFlow.stepThree.items.4")}</li>
              </ul>
              <p>
                <strong>{t("contentEditor.callFlow.steps.3")}</strong>
              </p>
              <p>
                <strong>{t("contentEditor.callFlow.steps.4")}</strong>
              </p>
            </>
          ),
        })}
      </div>
      <div key="copy-15" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: (
            <h3>
              <strong>{t("contentEditor.writeProgram.title")}</strong>
            </h3>
          ),
        })}
      </div>
      <div key="copy-16" className="min-w-0 max-w-full overflow-x-auto">
        {renderCopyBlock({
          styleKey: "spacing",
          children: <p>{t("contentEditor.writeProgram.body")}</p>,
        })}
      </div>
      <div key="code-17">{renderCodeBlock(2)}</div>
      <div className="md:hidden">
        <DocsHtml rawHtml={t.raw("nodeComparison")} />
      </div>
    </MigrationDocsLayout>
  );
}
