import { getCompanyLogoSrc, type CompanyId } from "@workspace/ecosystem-data";

/**
 * Settings for the Migrate to Solana program sections of the hub page.
 * Owner todos for filling these in live in docs/migrate-to-solana/todo.md.
 */

/** HubSpot intake form share URL. CTAs that open it are hidden while empty. */
export const INTAKE_FORM_URL = "";

/** Contact or form for companies that want to be listed as partners. */
export const PARTNER_APPLICATION_URL = "";

/** Recurring migration office hours (event page or calendar). */
export const OFFICE_HOURS_URL = "";

export const GRANTS_URL = "https://solana.org/grants-funding";

export const SUPPORTED_THRESHOLD = {
  tvlUsd: "$1M",
  monthlyActiveUsers: "10,000",
} as const;

/**
 * Pending partners render only in local development, with a "pending" badge,
 * so the public page never lists a company that hasn't agreed to take part.
 */
export type PartnerStatus = "live" | "pending";

export type MigrationPartner = {
  /** Also the i18n key for an optional offer: partners.offers.<id> */
  id: string;
  name: string;
  url: string;
  status: PartnerStatus;
  /** Omit when the company has no ecosystem-data record yet; the name renders as text. */
  companyId?: CompanyId;
};

export type PartnerCategory = {
  /** i18n key under partners.categories.<key> */
  key: "rpc" | "wallets" | "tokens" | "liquidity" | "security" | "multisig";
  partners: MigrationPartner[];
};

export const PARTNER_CATEGORIES: PartnerCategory[] = [
  {
    key: "rpc",
    partners: [
      {
        id: "quicknode",
        name: "QuickNode",
        url: "https://www.quicknode.com",
        status: "live",
        companyId: "quicknode",
      },
      {
        id: "helius",
        name: "Helius",
        url: "https://www.helius.dev",
        status: "pending",
      },
      {
        id: "triton",
        name: "Triton One",
        url: "https://triton.one",
        status: "pending",
        companyId: "triton",
      },
    ],
  },
  {
    key: "wallets",
    partners: [
      {
        id: "solflare",
        name: "Solflare",
        url: "https://www.solflare.com",
        status: "pending",
        companyId: "solflare",
      },
      {
        id: "backpack",
        name: "Backpack",
        url: "https://backpack.app",
        status: "pending",
      },
      {
        id: "phantom",
        name: "Phantom",
        url: "https://phantom.com",
        status: "pending",
        companyId: "phantom",
      },
    ],
  },
  {
    // Native Solana tokens: issue a new token and move holders over with a
    // claim or airdrop, rather than bridging the old one.
    key: "tokens",
    partners: [
      {
        id: "metaplex",
        name: "Metaplex",
        url: "https://www.metaplex.com",
        status: "pending",
        companyId: "metaplex",
      },
      {
        id: "streamflow",
        name: "Streamflow",
        url: "https://streamflow.finance",
        status: "pending",
        companyId: "streamflow",
      },
    ],
  },
  {
    key: "liquidity",
    partners: [
      {
        id: "jupiter",
        name: "Jupiter",
        url: "https://jup.ag",
        status: "pending",
        companyId: "jupiter",
      },
      {
        id: "raydium",
        name: "Raydium",
        url: "https://raydium.io",
        status: "pending",
        companyId: "raydium",
      },
      {
        id: "meteora",
        name: "Meteora",
        url: "https://www.meteora.ag",
        status: "pending",
      },
    ],
  },
  {
    key: "security",
    partners: [
      {
        id: "ottersec",
        name: "OtterSec",
        url: "https://osec.io",
        status: "pending",
      },
    ],
  },
  {
    key: "multisig",
    partners: [
      {
        id: "squads",
        name: "Squads",
        url: "https://squads.xyz",
        status: "pending",
        companyId: "squads",
      },
    ],
  },
];

export function getPartnerLogoSrc(partner: MigrationPartner) {
  if (!partner.companyId) return undefined;
  // Prefer the white monotone mark made for dark surfaces; fall back to the
  // default logo, which the card renders white with a CSS filter.
  return getCompanyLogoSrc(partner.companyId, { id: "breakpoint-2026-white" });
}

export function getVisiblePartnerCategories(showPending: boolean) {
  return PARTNER_CATEGORIES.map((category) => ({
    ...category,
    partners: category.partners.filter(
      (partner) => partner.status === "live" || showPending,
    ),
  })).filter((category) => category.partners.length > 0);
}
