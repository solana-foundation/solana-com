import type { CSSProperties } from "react";
import type { Metadata } from "next";
import {
  getCompany,
  getCompanyLogo,
  getCompanyLogos,
  getCompanyLogoSrc,
  resolveImportedAssetSrc,
  type CompanyId,
} from "@workspace/ecosystem-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import SponsorsHeroBackground from "./SponsorsHeroBackground";

export const metadata: Metadata = {
  title: "Sponsors | Breakpoint 2026",
  description:
    "Meet the Breakpoint 2026 sponsors supporting the Solana ecosystem in London.",
};

const SPONSOR_LOGO_ID = "breakpoint-2026-white";

type SponsorLogo = {
  companyId: CompanyId;
  href: string;
  width: number;
  height: number;
};

type SponsorTier = {
  title: string;
  columns: string;
  cellAspect: string;
  sponsors: SponsorLogo[];
  emptyCells?: number;
};

const platinumSponsors = [
  {
    companyId: "solflare",
    href: "https://www.solflare.com/",
    width: 230.648,
    height: 55.2,
  },
  {
    companyId: "phantom",
    href: "https://phantom.com/",
    width: 279.68,
    height: 55.2,
  },
  {
    companyId: "galaxy",
    href: "https://www.galaxy.com/",
    width: 203.262,
    height: 58.075,
  },
  {
    companyId: "syndica",
    href: "https://www.syndica.io/",
    width: 274,
    height: 55.2,
  },
  {
    companyId: "render-network",
    href: "https://rendernetwork.com/",
    width: 173.158,
    height: 140.691,
  },
] satisfies SponsorLogo[];

const diamondSponsors = [
  {
    companyId: "altitude",
    href: "https://altitude.xyz/",
    width: 181.818,
    height: 32,
  },
  {
    companyId: "allnodes",
    href: "https://www.allnodes.com/",
    width: 196,
    height: 40,
  },
  {
    companyId: "pancakeswap",
    href: "https://pancakeswap.finance/",
    width: 218.182,
    height: 40,
  },
  {
    companyId: "trojan",
    href: "https://trojan.app/",
    width: 200.941,
    height: 56,
  },
  {
    companyId: "bonk",
    href: "https://bonkcoin.com/",
    width: 199.046,
    height: 64,
  },
  {
    companyId: "walrus",
    href: "https://www.walrus.xyz/",
    width: 153.931,
    height: 36,
  },
  {
    companyId: "sanctum",
    href: "https://sanctum.so/",
    width: 204.615,
    height: 40,
  },
  {
    companyId: "monke-dao",
    href: "https://monkedao.io/",
    width: 167.565,
    height: 64,
  },
  {
    companyId: "kast",
    href: "https://www.kast.xyz/",
    width: 191.781,
    height: 40,
  },
  {
    companyId: "dmcc",
    href: "https://www.dmcc.ae/",
    width: 167.377,
    height: 48,
  },
  {
    companyId: "flash-trade",
    href: "https://www.flash.trade/",
    width: 195.652,
    height: 72,
  },
] satisfies SponsorLogo[];

const goldSponsors = [
  {
    companyId: "yala",
    href: "https://www.yala.org/",
    width: 95.143,
    height: 36,
  },
  {
    companyId: "d3",
    href: "https://www.d3.inc/",
    width: 137.143,
    height: 48,
  },
  {
    companyId: "solpay",
    href: "https://solpay.finance/",
    width: 123.221,
    height: 31.5,
  },
  {
    companyId: "doublezero",
    href: "https://www.doublezero.xyz/",
    width: 168.75,
    height: 27,
  },
  {
    companyId: "term",
    href: "https://term.finance/",
    width: 135,
    height: 36,
  },
  {
    companyId: "listing-help",
    href: "https://listing.help/",
    width: 148.718,
    height: 36,
  },
  {
    companyId: "dawn",
    href: "https://www.dawninternet.com/",
    width: 152.219,
    height: 24,
  },
  {
    companyId: "walletconnect",
    href: "https://walletconnect.network/",
    width: 166.213,
    height: 18,
  },
  {
    companyId: "orbitflare",
    href: "https://orbitflare.com/",
    width: 138.909,
    height: 24,
  },
  {
    companyId: "alchemy",
    href: "https://www.alchemy.com/",
    width: 140,
    height: 30,
  },
  {
    companyId: "drpc",
    href: "https://drpc.org/",
    width: 111.13,
    height: 36,
  },
  {
    companyId: "reap",
    href: "https://www.reap.global/",
    width: 118.607,
    height: 27,
  },
  {
    companyId: "ryder",
    href: "https://www.ryder.id/",
    width: 117.728,
    height: 39,
  },
  {
    companyId: "xbit",
    href: "https://xbit.gg/",
    width: 104.157,
    height: 30,
  },
] satisfies SponsorLogo[];

const sponsorTiers = [
  {
    title: "Platinum",
    columns: "md:grid-cols-3",
    cellAspect: "aspect-[442/221]",
    sponsors: platinumSponsors,
    emptyCells: 1,
  },
  {
    title: "Diamond",
    columns: "md:grid-cols-4",
    cellAspect: "aspect-[326/163]",
    sponsors: diamondSponsors,
    emptyCells: 1,
  },
  {
    title: "Gold",
    columns: "md:grid-cols-5",
    cellAspect: "aspect-[256/128]",
    sponsors: goldSponsors,
    emptyCells: 1,
  },
] satisfies SponsorTier[];

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      width="8.02"
      height="8"
      viewBox="0 0 8.01975 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path
        d="M1.24444 8L0 6.7358L4.95803 1.79753H1.12593V0H8.01975V6.85432H6.20247V3.06173L1.24444 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function getLogo(sponsor: SponsorLogo) {
  const company = getCompany(sponsor.companyId);
  const canonicalMonotone = getCompanyLogos(sponsor.companyId).find(
    (logo) => logo.treatment === "monotone" && logo.id !== SPONSOR_LOGO_ID,
  );
  const monotone =
    canonicalMonotone ??
    getCompanyLogo(sponsor.companyId, { treatment: "monotone" });
  const src = monotone
    ? resolveImportedAssetSrc(monotone.source)
    : getCompanyLogoSrc(sponsor.companyId, { id: SPONSOR_LOGO_ID });

  if (!company || !src) {
    throw new Error(`Missing Breakpoint sponsor logo: ${sponsor.companyId}`);
  }

  return {
    alt: company.name,
    src,
  };
}

function SponsorCard({
  sponsor,
  cellAspect,
}: {
  sponsor: SponsorLogo;
  cellAspect: string;
}) {
  const logo = getLogo(sponsor);
  const logoStyle = {
    "--logo-width": `${sponsor.width}px`,
    "--logo-ratio": `${sponsor.width} / ${sponsor.height}`,
  } as CSSProperties;

  return (
    <a
      href={sponsor.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${logo.alt} (opens in a new tab)`}
      className={`group flex ${cellAspect} min-w-0 items-center justify-center overflow-hidden bg-white/[0.05] p-[10px] transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
    >
      <span
        className="block w-[min(var(--logo-width),78%)] max-w-[78%] transition-transform duration-200 group-hover:scale-[1.025]"
        style={{
          ...logoStyle,
          aspectRatio: "var(--logo-ratio)",
        }}
      >
        <img
          src={logo.src}
          alt=""
          aria-hidden="true"
          className="block h-full w-full object-contain brightness-0 invert"
        />
      </span>
    </a>
  );
}

function SponsorTierSection({
  tier,
  first = false,
}: {
  tier: SponsorTier;
  first?: boolean;
}) {
  return (
    <section
      aria-labelledby={`${tier.title.toLowerCase()}-sponsors`}
      className={`px-xs md:px-m ${first ? "pt-2xl" : "pt-3xl"}`}
    >
      <div className="mx-auto max-w-[1376px]">
        <h2
          id={`${tier.title.toLowerCase()}-sponsors`}
          className="font-sans text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-white md:text-[48px]"
        >
          {tier.title}
        </h2>

        <div
          className={`mt-m grid grid-cols-1 gap-[8px] sm:grid-cols-2 ${tier.columns}`}
        >
          {tier.sponsors.map((sponsor) => (
            <SponsorCard
              key={sponsor.companyId}
              sponsor={sponsor}
              cellAspect={tier.cellAspect}
            />
          ))}
          {Array.from({ length: tier.emptyCells ?? 0 }).map((_, index) => (
            <div
              key={`empty-${index}`}
              aria-hidden="true"
              className={`${tier.cellAspect} hidden min-w-0 md:block`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SponsorsHero() {
  return (
    <section className="relative h-[395px] overflow-hidden bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <SponsorsHeroBackground />
      </div>

      <img
        src="/assets/pixel-edge.svg"
        alt=""
        aria-hidden="true"
        width={1440}
        height={146}
        className="absolute left-0 top-[160px] h-[200px] w-full min-w-[840px] object-cover opacity-[0.85]"
      />

      <div className="absolute bottom-[31px] left-xs right-xs md:left-m md:right-auto md:w-[1026px]">
        <p className="font-mono text-[14px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-white md:text-[16px]">
          Breakpoint 2026
        </p>
        <h1 className="mt-m font-sans text-[56px] font-normal leading-[0.98] tracking-[-0.06em] text-white md:text-[80px]">
          Sponsors
        </h1>
      </div>
    </section>
  );
}

function SponsorsIntro() {
  return (
    <section className="bg-black px-xs pt-xl md:px-m">
      <div className="mx-auto flex max-w-[1376px] flex-col gap-m md:flex-row md:items-start md:justify-between">
        <p className="font-mono text-[14px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-white md:text-[16px]">
          WHY SPONSOR BP&apos;26
        </p>

        <div className="w-full max-w-[851px]">
          <p className="font-sans text-[28px] font-normal leading-[1.25] tracking-[-0.04em] text-white md:text-[32px]">
            <span className="text-purple">7,000+</span> high-intent{" "}
            <span className="text-purple">builders</span>,{" "}
            <span className="text-green">investors</span>, and{" "}
            <span className="text-blue">institutions</span> in one room. Direct
            access to Solana&apos;s decision-makers in London&apos;s financial
            hub. Your brand, their attention. ROI starts day one.
          </p>

          <a
            href="mailto:breakpoint@solana.org?subject=Breakpoint%202026%20sponsorship"
            className="mt-s inline-flex h-[40px] items-center justify-center gap-[12px] bg-white px-xs font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black transition-colors hover:bg-[#e7d2f9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Contact Us
            <span className="inline-flex size-[12px] items-center justify-center">
              <ArrowUpRight />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function SponsorsPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <a
        href="#breakpoint-sponsors-content"
        className="sr-only absolute left-5 top-5 z-50 focus:not-sr-only focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-[14px] focus:font-bold focus:uppercase focus:tracking-[0.08em] focus:text-black"
      >
        Skip to content
      </a>

      <Navigation />

      <div id="breakpoint-sponsors-content">
        <SponsorsHero />
        <SponsorsIntro />
        {sponsorTiers.map((tier, index) => (
          <SponsorTierSection
            key={tier.title}
            tier={tier}
            first={index === 0}
          />
        ))}
        <Footer />
      </div>
    </main>
  );
}
