import { config } from "@/config";
import {
  type WalletCategory,
  type WalletDirectoryData,
  type WalletFeature,
  type WalletPlatform,
} from "./wallet-directory";

export const WALLETS_PATH = "/wallets";
export const WALLETS_SOCIAL_IMAGE = "/images/learn/understanding_wallets.webp";

export function buildWalletDirectoryJsonLd({
  data,
  title,
  description,
  locale,
  path,
  translations,
}: {
  data: WalletDirectoryData;
  title: string;
  description: string;
  locale: string;
  path: string;
  translations: {
    aboutName: string;
    listName: string;
    category: (_category: WalletCategory) => string;
    platform: (_platform: WalletPlatform) => string;
    feature: (_feature: WalletFeature) => string;
  };
}) {
  const pageUrl = `${config.publicUrl}${path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        inLanguage: locale,
        dateModified: data.lastReviewed,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${config.publicUrl}/#website`,
          name: "Solana",
          url: config.publicUrl,
        },
        about: {
          "@type": "Thing",
          name: translations.aboutName,
        },
        mainEntity: {
          "@id": `${pageUrl}#wallet-list`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#wallet-list`,
        name: translations.listName,
        numberOfItems: data.wallets.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: data.wallets.map((wallet, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareApplication",
            name: wallet.name,
            url: wallet.website,
            description: wallet.description,
            applicationCategory: translations.category(wallet.category),
            operatingSystem: wallet.platforms
              .map(translations.platform)
              .join(", "),
            featureList: wallet.features.map(translations.feature),
            dateModified: wallet.lastVerified,
          },
        })),
      },
    ],
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
