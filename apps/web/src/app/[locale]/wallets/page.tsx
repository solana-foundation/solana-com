import { WalletsPage } from "./wallets";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";
import { CardDeck, ConversionPanel, Hero } from "@solana-foundation/solana-lib";
import {
  CARD_DECKS,
  COMPARE_WALLETS_BUTTON,
  APPLY_FOR_GRANT_BUTTON,
  HERO_BUTTONS,
} from "@/data/wallets";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations("wallets-landing");

  const heroButtons = HERO_BUTTONS.map(({ labelKey, ...button }) => ({
    ...button,
    label: t(labelKey),
  })) as React.ComponentProps<typeof Hero>["buttons"];

  const buildCards = CARD_DECKS.build.map(
    ({ headingKey, bodyKey, callToAction: { labelKey, ...cta }, ...card }) => ({
      ...card,
      heading: t(headingKey),
      body: t(bodyKey),
      callToAction: {
        ...cta,
        label: t(labelKey),
      },
    }),
  ) as React.ComponentProps<typeof CardDeck>["cards"];

  const buyCards = CARD_DECKS.buy.map(
    ({ headingKey, bodyKey, callToAction: { labelKey, ...cta }, ...card }) => ({
      ...card,
      heading: t(headingKey),
      body: t(bodyKey),
      callToAction: {
        ...cta,
        label: t(labelKey),
      },
    }),
  ) as React.ComponentProps<typeof CardDeck>["cards"];

  const developerCards = CARD_DECKS.developerResources.map(
    ({ headingKey, bodyKey, callToAction: { labelKey, ...cta }, ...card }) => ({
      ...card,
      heading: t(headingKey),
      body: t(bodyKey),
      callToAction: {
        ...cta,
        label: t(labelKey),
      },
    }),
  ) as React.ComponentProps<typeof CardDeck>["cards"];

  const { labelKey: _cmpKey, ...cmpRest } = COMPARE_WALLETS_BUTTON;
  const compareWalletsButton = {
    ...cmpRest,
    label: t(COMPARE_WALLETS_BUTTON.labelKey),
  } as React.ComponentProps<typeof ConversionPanel>["buttons"][number];

  const { labelKey: _appKey, ...appRest } = APPLY_FOR_GRANT_BUTTON;
  const applyForGrantButton = {
    ...appRest,
    label: t(APPLY_FOR_GRANT_BUTTON.labelKey),
  } as React.ComponentProps<typeof ConversionPanel>["buttons"][number];

  const translations = {
    heroEyebrow: t("hero.eyebrow"),
    heroHeadline: t("hero.headline"),
    heroBody: t.raw("hero.body"),
    unlockProgrammableMoneyHeading: t(
      "conversionPanels.unlockProgrammableMoney.heading",
    ),
    unlockProgrammableMoneyBody: t(
      "conversionPanels.unlockProgrammableMoney.body",
    ),
    complianceHeadline: t("sections.compliance.headline"),
    complianceBody: t.raw("sections.compliance.body"),
    oneClickCommerceHeadline: t("sections.oneClickCommerce.headline"),
    oneClickCommerceBody: t.raw("sections.oneClickCommerce.body"),
    feelessTransactionsHeadline: t("sections.feelessTransactions.headline"),
    feelessTransactionsBody: t.raw("sections.feelessTransactions.body"),
    unrivaledSecurityHeading: t("conversionPanels.unrivaledSecurity.heading"),
    unrivaledSecurityBody: t("conversionPanels.unrivaledSecurity.body"),
    keyManagementHeadline: t("sections.keyManagement.headline"),
    keyManagementBody: t.raw("sections.keyManagement.body"),
    advancedMultisigHeadline: t("sections.advancedMultisig.headline"),
    advancedMultisigBody: t.raw("sections.advancedMultisig.body"),
    poweredBySvmHeading: t("conversionPanels.poweredBySvm.heading"),
    poweredBySvmBody: t("conversionPanels.poweredBySvm.body"),
    svmBulletListBody: t.raw("sections.svmBulletList.body"),
    buildHeadline: t("sections.build.headline"),
    buildBody: t("sections.build.body"),
    buyHeadline: t("sections.buy.headline"),
    buyBody: t("sections.buy.body"),
    exploreOptionsHeading: t("conversionPanels.exploreOptions.heading"),
    exploreOptionsBody: t("conversionPanels.exploreOptions.body"),
    developerResourcesHeadline: t("sections.developerResources.headline"),
    developerResourcesBody: t("sections.developerResources.body"),
    applyForGrantHeading: t("conversionPanels.applyForGrant.heading"),
    applyForGrantBody: t("conversionPanels.applyForGrant.body"),
  };

  return (
    <WalletsPage
      translations={translations}
      heroButtons={heroButtons}
      buildCards={buildCards}
      buyCards={buyCards}
      developerCards={developerCards}
      compareWalletsButton={compareWalletsButton}
      applyForGrantButton={applyForGrantButton}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "wallets-landing.meta.seoTitle",
    descriptionKey: "wallets-landing.meta.seoDescription",
    path: "/wallets",
    locale,
  });
}
