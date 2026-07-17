"use client";

import { ResponsiveBox } from "@/component-library/responsive-box";
import {
  CardDeck,
  CodeBlock,
  ContentEditor,
  Heading,
  Hero,
  HtmlParser,
  Section,
} from "@solana-foundation/solana-lib";
import { useTranslations } from "next-intl";
import {
  BLOCK_STYLES,
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
    styleKey?: keyof typeof BLOCK_STYLES;
  }) => {
    if (!styleKey) {
      return children;
    }

    return (
      <ResponsiveBox responsiveStyles={BLOCK_STYLES[styleKey]}>
        {children}
      </ResponsiveBox>
    );
  };

  const renderCodeBlock = (index: number) => {
    const codeBlock = CODE_BLOCKS[index];

    return (
      <CodeBlock
        code={codeBlock.code}
        language={
          codeBlock.language as React.ComponentProps<
            typeof CodeBlock
          >["language"]
        }
      />
    );
  };

  return (
    <>
      <Section>
        <Hero
          headingAs="h1"
          centered={false}
          newsLetter={false}
          eyebrow={t("hero.eyebrow")}
          headline={t("hero.headline")}
          body={t.raw("hero.body")}
        />

        <ContentEditor
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
        >
          <div key="copy-0" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacingWithMargins",
              children: <p>{t("contentEditor.intro")}</p>,
            })}
          </div>
          <div key="copy-1" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <>
                  <h3>
                    <strong>
                      {t("contentEditor.keyCharacteristics.title")}
                    </strong>
                  </h3>
                  <ul>
                    <li>
                      <strong>
                        {t("contentEditor.keyCharacteristics.items.0.label")}
                      </strong>
                      :{" "}
                      {t(
                        "contentEditor.keyCharacteristics.items.0.description",
                      )}
                    </li>
                    <li>
                      <strong>
                        {t("contentEditor.keyCharacteristics.items.1.label")}
                      </strong>
                      :{" "}
                      {t(
                        "contentEditor.keyCharacteristics.items.1.description",
                      )}
                    </li>
                    <li>
                      <strong>
                        {t("contentEditor.keyCharacteristics.items.2.label")}
                      </strong>
                      :{" "}
                      {t(
                        "contentEditor.keyCharacteristics.items.2.description",
                      )}
                    </li>
                  </ul>
                </>
              ),
            })}
          </div>
          <div key="copy-2" className="tw-html_parser">
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
                        {t(
                          "contentEditor.tokenExtensions.keyFeatures.linkLabel",
                        )}
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
          <div key="copy-3" className="tw-html_parser">
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
          <div key="copy-5" className="tw-html_parser">
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
          <div key="copy-6" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <>
                  <h3>
                    <strong>
                      {t("contentEditor.freezeEnforcement.title")}
                    </strong>
                  </h3>
                  <p>{t("contentEditor.freezeEnforcement.body")}</p>
                </>
              ),
            })}
          </div>
          <div key="copy-7" className="tw-html_parser">
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
          <div key="copy-8" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <>
                  <h3>
                    <strong>
                      {t("contentEditor.permanentDelegate.title")}
                    </strong>
                  </h3>
                  <p>{t("contentEditor.permanentDelegate.body")}</p>
                </>
              ),
            })}
          </div>
          <div key="copy-9" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <h2>
                  <strong>{t("contentEditor.howTo.title")}</strong>
                </h2>
              ),
            })}
          </div>
          <div key="copy-10" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <h3>
                  <strong>{t("contentEditor.conceptualMap.title")}</strong>
                </h3>
              ),
            })}
          </div>
          <ResponsiveBox
            key="table-11"
            responsiveStyles={BLOCK_STYLES.tableWrapper}
          >
            <div className="tw-html_parser">
              <HtmlParser rawHtml={t.raw("contentEditor.conceptualMapTable")} />
            </div>
          </ResponsiveBox>
          <div key="copy-12" className="tw-html_parser">
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
          <div key="copy-14" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: <p>{t("contentEditor.callFlow.body")}</p>,
            })}
          </div>
          <div key="copy-15" className="tw-html_parser">
            {renderCopyBlock({
              styleKey: "spacing",
              children: (
                <>
                  <h3>
                    <strong>
                      {t("contentEditor.minimalTransferHook.title")}
                    </strong>
                  </h3>
                  <p>{t("contentEditor.minimalTransferHook.body")}</p>
                </>
              ),
            })}
          </div>
          <div key="code-16">{renderCodeBlock(2)}</div>
          <div key="copy-17" className="tw-html_parser">
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
        </ContentEditor>

        <Heading
          variant="centered"
          eyebrow={t("navHeading.eyebrow")}
          headline=""
          body=""
          buttons={
            navButtons as React.ComponentProps<typeof Heading>["buttons"]
          }
        />

        <Heading eyebrow="" headline={t("resourceHeading.headline")} body="" />

        <ResponsiveBox responsiveStyles={BLOCK_STYLES.cardDeckWrapper}>
          <CardDeck
            cards={
              resourceCards as React.ComponentProps<typeof CardDeck>["cards"]
            }
            numCols={
              RESOURCE_CARD_DECK.numCols as React.ComponentProps<
                typeof CardDeck
              >["numCols"]
            }
            featured={RESOURCE_CARD_DECK.featured}
          />
        </ResponsiveBox>

        <ResponsiveBox responsiveStyles={BLOCK_STYLES.smallOnly}>
          <HtmlParser rawHtml={t.raw("nodeComparison")} />
        </ResponsiveBox>
      </Section>
    </>
  );
}
