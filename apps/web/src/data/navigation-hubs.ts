import type { HubPageConfig } from "@/components/navigation-migration/hub-page";
import creatingYourFirstWalletImage from "@@/public/images/learn/creating_your_first_wallet.webp";

interface NavigationHubConfig extends HubPageConfig {
  path: string;
  metaTitle: string;
  metaDescription: string;
}

type NavigationHubKey = keyof typeof navigationHubStaticConfigs;

type TranslationAdapter = {
  (_key: string): string;
  raw(_key: string): unknown;
};

const navigationHubStaticConfigs = {
  useSolana: {
    path: "/use-solana",
    accentColor: "#14F195",
    heroImageSrc: "/src/img/index/hero-bg.webp",
    bgJsonFilePath: "/src/img/navigation-hubs/use-solana-bg.json",
    primaryCta: {
      href: "/wallets",
    },
    secondaryCta: {
      href: "/learn",
    },
    overview: {
      imageSrc: creatingYourFirstWalletImage,
    },
    pathways: [
      {
        href: "/wallets",
        featured: true,
        links: [
          {
            href: "/wallets",
          },
          {
            href: "/learn/what-is-a-wallet",
          },
          {
            href: "/wallets",
          },
        ],
      },
      {
        href: "/learn",
        links: [
          {
            href: "/learn/what-is-solana",
          },
          {
            href: "/learn/understanding-solana-transaction-fees",
          },
          {
            href: "/learn/introduction-to-solana-tokens",
          },
        ],
      },
      {
        href: "/solutions/consumer",
        links: [
          {
            href: "/solutions/consumer",
          },
          {
            href: "/staking",
          },
          {
            href: "/events",
          },
        ],
      },
    ],
    feature: {
      href: "/learn/staying-safe-on-solana",
    },
    sections: [
      {
        links: [
          {
            href: "/wallets",
          },
          {
            href: "/learn/what-is-solana",
          },
          {
            href: "/learn/getting-started",
          },
          {
            href: "/learn/what-is-a-wallet",
          },
          {
            href: "/learn/sending-and-receiving-sol",
          },
        ],
      },
      {
        links: [
          {
            href: "/learn/staying-safe-on-solana",
          },
          {
            href: "/learn/understanding-solana-transaction-fees",
          },
          {
            href: "/learn/introduction-to-solana-tokens",
          },
          {
            href: "/staking",
          },
          {
            href: "/learn/what-is-staking",
          },
          {
            href: "/solutions/consumer",
          },
        ],
      },
      {
        links: [
          {
            href: "/learn",
          },
          {
            href: "/learn/exploring-solana-applications",
          },
          {
            href: "/events",
          },
          {
            href: "/news",
          },
        ],
      },
    ],
  },
  enterprise: {
    path: "/enterprise",
    accentColor: "#CA9FF5",
    heroImageSrc: "/src/img/solutions/icm/what-is.webp",
    bgJsonFilePath: "/src/img/navigation-hubs/enterprise-bg.json",
    primaryCta: {
      href: "/solutions/enterprise",
    },
    secondaryCta: {
      href: "/network",
    },
    overview: {
      imageSrc: "/src/img/index/projects-bg.webp",
    },
    pathways: [
      {
        href: "/solutions/institutional-payments",
        featured: true,
        links: [
          {
            href: "/solutions/institutional-payments",
          },
          {
            href: "/solutions/stablecoins",
          },
          {
            href: "/docs/payments",
          },
        ],
      },
      {
        href: "/solutions/tokenization",
        links: [
          {
            href: "/solutions/tokenization",
          },
          {
            href: "/solutions/real-world-assets",
          },
          {
            href: "/solutions/token-extensions",
          },
        ],
      },
      {
        href: "/reports",
        links: [
          {
            href: "/network",
          },
          {
            href: "/reports",
          },
          {
            href: "/privacy",
          },
        ],
      },
    ],
    feature: {
      href: "/reports",
    },
    sections: [
      {
        links: [
          {
            href: "/solutions/enterprise",
          },
          {
            href: "/solutions/institutional-payments",
          },
          {
            href: "/solutions/commerce-tooling",
          },
          {
            href: "/solutions/stablecoins",
          },
          {
            href: "/solutions/tokenization",
          },
          {
            href: "/solutions/real-world-assets",
          },
        ],
      },
      {
        links: [
          {
            href: "/solutions/sdp",
          },
          {
            href: "/solutions/digital-assets",
          },
          {
            href: "/solutions/defi",
          },
          {
            href: "/solutions/financial-infrastructure",
          },
          {
            href: "/solutions/financial-institutions",
          },
          {
            href: "/solutions/depin",
          },
        ],
      },
      {
        links: [
          {
            href: "/network",
          },
          {
            href: "/validators",
          },
          {
            href: "/reports",
          },
          {
            href: "/research",
          },
          {
            href: "/privacy",
          },
        ],
      },
    ],
  },
  products: {
    path: "/products",
    accentColor: "#00C2FF",
    heroImageSrc: "/src/img/solutions/sdp/hero-bg.webp",
    bgJsonFilePath: "/src/img/navigation-hubs/products-bg.json",
    primaryCta: {
      href: "/solutions/sdp",
    },
    secondaryCta: {
      href: "/agent-registry",
    },
    overview: {
      imageSrc: "/src/img/index/performance-bg.webp",
    },
    pathways: [
      {
        href: "/solutions/sdp",
        featured: true,
        links: [
          {
            href: "/solutions/sdp",
          },
          {
            href: "/docs/payments",
          },
          {
            href: "/rpc",
          },
        ],
      },
      {
        href: "/agent-registry",
        links: [
          {
            href: "/agent-registry",
          },
          {
            href: "/skills",
          },
          {
            href: "/x402",
          },
        ],
      },
      {
        href: "/solutions/actions",
        links: [
          {
            href: "/solutions/actions",
          },
          {
            href: "/docs/tools/solana-pay",
          },
          {
            href: "/docs/tools/kora",
          },
        ],
      },
      {
        href: "/data",
        links: [
          {
            href: "/data",
          },
          {
            href: "https://pay.sh",
            external: true,
          },
          {
            href: "https://tokens.xyz",
            external: true,
          },
        ],
      },
    ],
    feature: {
      href: "/x402",
    },
    sections: [
      {
        links: [
          {
            href: "/solutions/sdp",
          },
          {
            href: "/x402",
          },
          {
            href: "/agent-registry",
          },
          {
            href: "/skills",
          },
          {
            href: "/solutions/actions",
          },
          {
            href: "/solutions/ai",
          },
        ],
      },
      {
        links: [
          {
            href: "/docs/tools/commerce-kit",
          },
          {
            href: "/docs/tools/kora",
          },
          {
            href: "/docs/tools/solana-pay",
          },
          {
            href: "/rpc",
          },
          {
            href: "/solutions/payments-tooling",
          },
          {
            href: "/solutions/token-extensions",
          },
          {
            href: "/solutions/digital-assets",
          },
        ],
      },
      {
        links: [
          {
            href: "/docs",
          },
          {
            href: "/docs/payments",
          },
          {
            href: "/docs/tokens",
          },
          {
            href: "/rpc",
          },
          {
            href: "/developers/guides",
          },
        ],
      },
      {
        links: [
          {
            href: "/data",
          },
          {
            href: "https://pay.sh",
            external: true,
          },
          {
            href: "https://tokens.xyz",
            external: true,
          },
        ],
      },
    ],
  },
  ecosystem: {
    path: "/ecosystem",
    accentColor: "#9945FF",
    heroImageSrc: "/src/img/community/hero.png",
    bgJsonFilePath: "/src/img/navigation-hubs/ecosystem-bg.json",
    primaryCta: {
      href: "/events",
    },
    secondaryCta: {
      href: "/network",
    },
    overview: {
      imageSrc: "/src/img/solutions/depin/globe.webp",
    },
    pathways: [
      {
        href: "/network",
        featured: true,
        links: [
          {
            href: "/network",
          },
          {
            href: "/validators",
          },
          {
            href: "/reports",
          },
        ],
      },
      {
        href: "/events",
        links: [
          {
            href: "/events",
          },
          {
            href: "/news",
          },
          {
            href: "/podcasts",
          },
        ],
      },
      {
        href: "/solutions",
        links: [
          {
            href: "/solutions/depin",
          },
          {
            href: "/solutions/gaming-and-entertainment",
          },
          {
            href: "/solutions/artists-creators",
          },
        ],
      },
    ],
    feature: {
      href: "/breakpoint",
    },
    sections: [
      {
        links: [
          {
            href: "/network",
          },
          {
            href: "/validators",
          },
          {
            href: "/rpc",
          },
          {
            href: "/reports",
          },
          {
            href: "/research",
          },
          {
            href: "https://status.solana.com/",
            external: true,
          },
        ],
      },
      {
        links: [
          {
            href: "/events",
          },
          {
            href: "/events/archive",
          },
          {
            href: "/accelerate",
          },
          {
            href: "/breakpoint",
          },
          {
            href: "/wsop",
          },
          {
            href: "/community",
          },
          {
            href: "/news",
          },
          {
            href: "/podcasts",
          },
        ],
      },
      {
        links: [
          {
            href: "/solutions/depin",
          },
          {
            href: "/solutions/desci",
          },
          {
            href: "/solutions/btcfi",
          },
          {
            href: "/solutions/gaming-and-entertainment",
          },
          {
            href: "/solutions/artists-creators",
          },
        ],
      },
    ],
  },
  network: {
    path: "/network",
    accentColor: "#14F195",
    heroImageSrc: "/src/img/index/performance-bg.webp",
    bgJsonFilePath: "/src/img/navigation-hubs/network-bg.json",
    primaryCta: {
      href: "/validators",
    },
    secondaryCta: {
      href: "https://status.solana.com/",
      external: true,
    },
    overview: {
      imageSrc: "/src/img/index/performance-bg.webp",
    },
    pathways: [
      {
        href: "/validators",
        featured: true,
        links: [
          {
            href: "/validators",
          },
          {
            href: "/docs",
          },
          {
            href: "/research",
          },
        ],
      },
      {
        href: "/rpc",
        links: [
          {
            href: "/rpc",
          },
          {
            href: "/docs/rpc",
          },
          {
            href: "/docs",
          },
        ],
      },
      {
        href: "/reports",
        links: [
          {
            href: "https://status.solana.com/",
            external: true,
          },
          {
            href: "/reports",
          },
          {
            href: "/research",
          },
        ],
      },
    ],
    feature: {
      href: "/reports",
    },
    sections: [
      {
        links: [
          {
            href: "/validators",
          },
          {
            href: "/rpc",
          },
          {
            href: "/docs",
          },
          {
            href: "/docs/rpc",
          },
        ],
      },
      {
        links: [
          {
            href: "https://solscan.io/",
            external: true,
          },
          {
            href: "https://explorer.solana.com/",
            external: true,
          },
          {
            href: "https://orb.helius.dev/",
            external: true,
          },
          {
            href: "https://web3.okx.com/explorer/solana",
            external: true,
          },
          {
            href: "https://status.solana.com/",
            external: true,
          },
        ],
      },
      {
        links: [
          {
            href: "/reports",
          },
          {
            href: "/research",
          },
          {
            href: "/privacy",
          },
          {
            href: "/ecosystem",
          },
        ],
      },
    ],
  },
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function mergeHubConfig(
  staticValue: unknown,
  translatedValue: unknown,
): unknown {
  if (translatedValue === undefined) {
    return staticValue;
  }

  if (Array.isArray(staticValue) || Array.isArray(translatedValue)) {
    const staticArray = Array.isArray(staticValue) ? staticValue : [];
    const translatedArray = Array.isArray(translatedValue)
      ? translatedValue
      : [];
    // Static arrays define the page structure (and contain non-translatable
    // values such as hrefs). Ignore stale translated entries that no longer
    // have a static counterpart, while preserving translation-only arrays
    // such as metrics and overview points.
    const length = Array.isArray(staticValue)
      ? staticArray.length
      : translatedArray.length;

    return Array.from({ length }, (_, index) =>
      mergeHubConfig(staticArray[index], translatedArray[index]),
    );
  }

  if (isRecord(staticValue) && isRecord(translatedValue)) {
    return Object.fromEntries(
      Array.from(
        new Set([...Object.keys(staticValue), ...Object.keys(translatedValue)]),
        (key) => [key, mergeHubConfig(staticValue[key], translatedValue[key])],
      ),
    );
  }

  return translatedValue;
}

export function getNavigationHubConfig(
  hub: NavigationHubKey,
  t: TranslationAdapter,
): NavigationHubConfig {
  return mergeHubConfig(
    navigationHubStaticConfigs[hub],
    t.raw(`navigationHubs.${hub}`),
  ) as NavigationHubConfig;
}

export function getNavigationHubMetadata(
  hub: NavigationHubKey,
  t: TranslationAdapter,
) {
  return {
    path: navigationHubStaticConfigs[hub].path,
    metaTitle: t(`navigationHubs.${hub}.metaTitle`),
    metaDescription: t(`navigationHubs.${hub}.metaDescription`),
  };
}
