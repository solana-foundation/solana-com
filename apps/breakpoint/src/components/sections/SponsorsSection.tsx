import type { CSSProperties } from "react";
import Button from "@/components/Button";
import SectionHeadline from "@/components/SectionHeadline";
import { publicAssetPath } from "@/config";
import { SPONSOR_FORM_HREF } from "@/content/links";
import { sponsorMarqueeRows, type SponsorMarqueeRow } from "@/content/sponsors";
import { resolveSponsorLogo, type ResolvedSponsorLogo } from "@/lib/sponsors";

const rowCellClasses = {
  featured: "h-[72px] w-[220px] md:h-[96px] md:w-[320px]",
  standard: "h-[56px] w-[172px] md:h-[72px] md:w-[240px]",
  compact: "h-[52px] w-[156px] md:h-[64px] md:w-[216px]",
} satisfies Record<SponsorMarqueeRow["density"], string>;

const logoScales = {
  featured: {
    mobile: 0.58,
    desktop: 0.92,
    mobileMaxHeight: "52px",
    desktopMaxHeight: "72px",
  },
  standard: {
    mobile: 0.46,
    desktop: 0.68,
    mobileMaxHeight: "38px",
    desktopMaxHeight: "48px",
  },
  compact: {
    mobile: 0.46,
    desktop: 0.64,
    mobileMaxHeight: "38px",
    desktopMaxHeight: "48px",
  },
} satisfies Record<
  SponsorMarqueeRow["density"],
  {
    mobile: number;
    desktop: number;
    mobileMaxHeight: string;
    desktopMaxHeight: string;
  }
>;

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
      focusable="false"
    >
      <path
        d="M0 4H9M9 4L5.5 0.5M9 4L5.5 7.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

const sponsorRows = sponsorMarqueeRows.map((row) => ({
  ...row,
  sponsors: row.sponsors.map(resolveSponsorLogo),
}));

const sponsorNames = Array.from(
  new Map(
    sponsorRows.flatMap((row) =>
      row.sponsors.map((sponsor) => [sponsor.companyId, sponsor.name]),
    ),
  ).values(),
);

function SponsorLogoItem({
  density,
  sponsor,
}: {
  density: SponsorMarqueeRow["density"];
  sponsor: ResolvedSponsorLogo;
}) {
  const scale = logoScales[density];
  const logoStyle = {
    "--sponsor-logo-width": `${sponsor.width * scale.desktop}px`,
    "--sponsor-logo-height": `${sponsor.height * scale.desktop}px`,
    "--sponsor-logo-width-mobile": `${sponsor.width * scale.mobile}px`,
    "--sponsor-logo-height-mobile": `${sponsor.height * scale.mobile}px`,
    "--sponsor-logo-max-height": scale.desktopMaxHeight,
    "--sponsor-logo-max-height-mobile": scale.mobileMaxHeight,
  } as CSSProperties;

  return (
    <span
      className={`flex shrink-0 items-center justify-center px-xs ${rowCellClasses[density]}`}
    >
      <span
        className="block h-[min(var(--sponsor-logo-height-mobile),var(--sponsor-logo-max-height-mobile))] w-[min(var(--sponsor-logo-width-mobile),76%)] md:h-[min(var(--sponsor-logo-height),var(--sponsor-logo-max-height))] md:w-[min(var(--sponsor-logo-width),78%)]"
        style={logoStyle}
      >
        <img
          src={publicAssetPath(sponsor.src)}
          alt=""
          aria-hidden="true"
          className="block h-full w-full object-contain brightness-0 invert"
          loading="lazy"
        />
      </span>
    </span>
  );
}

function SponsorRow({ row }: { row: (typeof sponsorRows)[number] }) {
  const animationClass =
    row.direction === "right" ? "animate-ticker-reverse" : "animate-ticker";
  const rowSponsors =
    row.sponsors.length < 6
      ? Array.from(
          { length: Math.ceil(6 / row.sponsors.length) },
          () => row.sponsors,
        ).flat()
      : row.sponsors;

  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max will-change-transform motion-reduce:animate-none ${animationClass}`}
        style={{ animationDuration: row.duration }}
      >
        {[0, 1].map((loopIndex) => (
          <div
            key={`${row.title}-${loopIndex}`}
            className="flex shrink-0 gap-3xs pr-3xs md:gap-s md:pr-s"
          >
            {rowSponsors.map((sponsor, sponsorIndex) => (
              <SponsorLogoItem
                key={`${loopIndex}-${sponsor.companyId}-${sponsorIndex}`}
                sponsor={sponsor}
                density={row.density}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SponsorsSection() {
  const maskStyle = {
    WebkitMaskImage:
      "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
    maskImage:
      "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
  } as CSSProperties;

  return (
    <section id="sponsors" className="bg-black py-20 md:py-[120px]">
      <div className="container">
        <div className="mx-auto max-w-[676px]">
          <SectionHeadline
            alignment="center"
            eyebrow="Sponsors"
            headline="Become a Breakpoint 2026 sponsor"
          >
            <div className="flex w-full flex-col items-center justify-center gap-xs md:w-auto md:flex-row">
              <Button
                arrow
                className="w-full md:w-auto"
                href={SPONSOR_FORM_HREF}
                label="Contact us"
                variant="primary"
              />
              <Button
                className="w-full md:w-auto"
                href="/sponsors"
                iconRight={<ArrowRightIcon />}
                label="Our 2026 sponsors"
                variant="secondary"
              />
            </div>
          </SectionHeadline>
        </div>

        <ul className="sr-only">
          {sponsorNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>

      <div
        aria-hidden="true"
        className="mt-l flex flex-col gap-3xs overflow-hidden md:mt-xl md:gap-xs"
        style={maskStyle}
      >
        {sponsorRows.map((row, rowIndex) => (
          <SponsorRow key={`${row.title}-${rowIndex}`} row={row} />
        ))}
      </div>
    </section>
  );
}
