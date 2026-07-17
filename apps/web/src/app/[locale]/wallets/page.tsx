import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { WalletDirectory } from "./WalletDirectory";
import { getWalletDirectoryData } from "./get-wallet-directory";
import type { WalletFeature } from "./wallet-directory";
import {
  buildWalletDirectoryJsonLd,
  serializeJsonLd,
  WALLETS_PATH,
  WALLETS_SOCIAL_IMAGE,
} from "./structured-data";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 604800;

const QUICK_FEATURE_FILTERS = [
  "non_custodial",
  "buy_crypto",
  "card_spending",
  "staking",
  "hold_nfts",
  "hardware",
  "multi_sig",
] as const satisfies readonly WalletFeature[];

function shuffle<T>(items: T[]) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex]!,
      shuffledItems[index]!,
    ];
  }

  return shuffledItems;
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const [data, t] = await Promise.all([
    getWalletDirectoryData(),
    getTranslations({ locale, namespace: "wallets" }),
  ]);
  const title = t("meta.title");
  const description = t("meta.description");
  const alternates = getAlternates(WALLETS_PATH, locale);
  const structuredData = buildWalletDirectoryJsonLd({
    data,
    title,
    description,
    locale,
    path: alternates.canonical,
    translations: {
      aboutName: t("schema.aboutName"),
      listName: t("schema.listName"),
      category: (category) => t(`taxonomy.categories.${category}`),
      platform: (platform) => t(`taxonomy.platforms.${platform}`),
      feature: (feature) => t(`taxonomy.features.${feature}`),
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <WalletDirectory
        data={{
          ...data,
          wallets: shuffle(data.wallets),
        }}
        quickFeatureFilters={QUICK_FEATURE_FILTERS}
      />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wallets" });
  const title = t("meta.title");
  const description = t("meta.description");
  const alternates = getAlternates(WALLETS_PATH, locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      url: alternates.canonical,
      images: [
        {
          url: WALLETS_SOCIAL_IMAGE,
          width: 1920,
          height: 1080,
          alt: t("socialImageAlt"),
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [WALLETS_SOCIAL_IMAGE],
    },
  };
}
