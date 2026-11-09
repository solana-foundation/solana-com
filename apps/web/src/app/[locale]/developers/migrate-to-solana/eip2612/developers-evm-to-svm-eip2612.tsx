"use client";

import { useTranslations } from "next-intl";
import {
  DocsCode,
  DocsHtml,
  MigrationDocsLayout,
} from "../components/migration-docs-layout";
import {
  CODE_BLOCKS,
  NAV_BUTTONS,
  RESOURCE_CARD_DECK,
} from "@/data/developers/evm-to-svm/eip2612";

export function DevelopersEvmToSvmEip2612Page() {
  const t = useTranslations("developers-evm-to-svm-eip2612");

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
      activeUrl="/developers/migrate-to-solana/eip2612"
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
          url: "/developers/migrate-to-solana/erc20",
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
        <div>
          <p>{t("contentEditor.intro")}</p>
        </div>
      </div>
      <div
        id="key-characteristics"
        key="copy-1"
        className="min-w-0 max-w-full overflow-x-auto"
      >
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
      </div>
      <div
        id="why-eip-2612-is-unnecessary-on-solana"
        key="copy-2"
        className="min-w-0 max-w-full overflow-x-auto"
      >
        <div>
          <h2>
            <strong>{t("contentEditor.whyUnnecessary.title")}</strong>
          </h2>
          <p>{t("contentEditor.whyUnnecessary.body")}</p>
        </div>
      </div>
      <div
        id="token-approval-model"
        key="copy-3"
        className="min-w-0 max-w-full overflow-x-auto"
      >
        <div>
          <h3>
            <strong>{t("contentEditor.tokenApprovalModel.title")}</strong>
          </h3>
          <p>{t("contentEditor.tokenApprovalModel.body")}</p>
        </div>
      </div>
      <div
        id="fee-payer-(gas-delegation)-model"
        key="copy-4"
        className="min-w-0 max-w-full overflow-x-auto"
      >
        <div>
          <h3>
            <strong>{t("contentEditor.feePayerModel.title")}</strong>
          </h3>
          <p>{t("contentEditor.feePayerModel.body")}</p>
        </div>
      </div>
      <div
        id="how-to-do-eip-2612-on-solana"
        key="copy-5"
        className="min-w-0 max-w-full overflow-x-auto"
      >
        <div>
          <h2>
            <strong>{t("contentEditor.howTo.title")}</strong>
          </h2>
          <p>{t("contentEditor.howTo.body")}</p>
        </div>
      </div>
      <div
        id="1.-owner-pays-the-fee-(self-sponsored-transfer)"
        key="copy-6"
        className="min-w-0 max-w-full overflow-x-auto"
      >
        <div>
          <h3>
            <strong>{t("contentEditor.exampleOne.title")}</strong>
          </h3>
          <p>{t("contentEditor.exampleOne.body")}</p>
        </div>
      </div>
      <div key="code-7">
        <DocsCode
          code={CODE_BLOCKS[0].code}
          language={CODE_BLOCKS[0].language}
        />
      </div>
      <div
        id="2.-third-party-pays-the-fee-(relayed-transfer)"
        key="copy-8"
        className="min-w-0 max-w-full overflow-x-auto"
      >
        <div>
          <h3>
            <strong>{t("contentEditor.exampleTwo.title")}</strong>
          </h3>
          <p>{t("contentEditor.exampleTwo.body")}</p>
        </div>
      </div>
      <div key="code-9">
        <DocsCode
          code={CODE_BLOCKS[1].code}
          language={CODE_BLOCKS[1].language}
        />
      </div>
      <div className="md:hidden">
        <DocsHtml rawHtml={t.raw("nodeComparison")} />
      </div>
    </MigrationDocsLayout>
  );
}
