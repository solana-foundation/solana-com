import { ArtBaselPage } from "./art-basel";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";
import {
  CARD_DECK_CARDS,
  CONTACT_PANEL,
  META,
  MINTING_PANEL,
  SWITCHBACK,
} from "@/data/art-basel";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const t = await getTranslations("art-basel");

  const translations = {
    heroEyebrow: t("hero.eyebrow"),
    heroHeadline: t("hero.headline"),
    heroBody: t.raw("hero.body") as string,
    headingEyebrow: t("heading.eyebrow"),
    headingHeadline: t("heading.headline"),
    headingBody: t("heading.body"),
    leoQuote: t.raw("artists.leo.quote") as string,
    leoCopy: t.raw("artists.leo.copy") as string,
    leoAuthorName: t("artists.leo.author.name"),
    leoAuthorRole: t("artists.leo.author.role"),
    lauraQuote: t.raw("artists.laura.quote") as string,
    lauraCopy: t.raw("artists.laura.copy") as string,
    lauraAuthorName: t("artists.laura.author.name"),
    lauraAuthorRole: t("artists.laura.author.role"),
    cultureHackerQuote: t.raw("artists.cultureHacker.quote") as string,
    cultureHackerCopy: t.raw("artists.cultureHacker.copy") as string,
    cultureHackerAuthorName: t("artists.cultureHacker.author.name"),
    cultureHackerAuthorRole: t("artists.cultureHacker.author.role"),
    switchbackHeadline: t("switchback.headline"),
    switchbackBody: t.raw("switchback.body") as string,
    switchbackButtons: SWITCHBACK.buttons.map((_, index) =>
      t(`switchback.buttons.${index}`),
    ),
    mintingPanelHeading: t("mintingPanel.heading"),
    mintingPanelBody: t("mintingPanel.body"),
    mintingPanelButtons: MINTING_PANEL.buttons.map((_, index) =>
      t(`mintingPanel.buttons.${index}`),
    ),
    whySolanaEyebrow: t("whySolana.eyebrow"),
    whySolanaHeadline: t("whySolana.headline"),
    whySolanaBody: t("whySolana.body"),
    cardDeckHeadings: CARD_DECK_CARDS.map((_, index) =>
      t(`cardDeck.headings.${index}`),
    ),
    cardDeckBodies: CARD_DECK_CARDS.map((_, index) =>
      t(`cardDeck.bodies.${index}`),
    ),
    cardDeckCtaLabels: CARD_DECK_CARDS.map((_, index) =>
      t(`cardDeck.ctaLabels.${index}`),
    ),
    contactPanelHeading: t("contactPanel.heading"),
    contactPanelBody: t("contactPanel.body"),
    contactPanelButtons: CONTACT_PANEL.buttons.map((_, index) =>
      t(`contactPanel.buttons.${index}`),
    ),
  };

  return <ArtBaselPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "art-basel.meta.seoTitle",
    descriptionKey: "art-basel.meta.seoDescription",
    path: "/art-basel",
    locale,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: [META.seoImage],
    },
  };
}
