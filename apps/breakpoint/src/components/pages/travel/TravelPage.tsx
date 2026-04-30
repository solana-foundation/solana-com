import type { ReactNode } from "react";
import Button from "@/components/Button";
import Marquee from "@/components/Marquee";
import PageShell from "@/components/PageShell";
import SubpageHero from "@/components/SubpageHero";
import Footer from "@/components/sections/Footer";
import { IAS_HREF, VISA_CHECK_HREF } from "@/content/links";
import { getAnchorLinkProps } from "@/lib/links";
import TravelSubnav from "./TravelSubnav";

const TRAVEL_MARQUEE_HIGHLIGHTS = [
  "BP26",
  "LDN",
  "BUILD",
  "DEPLOY",
  "SHIP MORE",
];

function SectionFrame({
  children,
  eyebrow,
  id,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-16 bg-black pt-[80px] md:scroll-mt-20 md:pt-[120px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <div className="grid gap-10 border-t border-neutral-700 pt-8 md:grid-cols-bp-desktop md:gap-x-s md:pt-12">
          <div className="flex flex-col gap-4 md:col-span-6">
            <p className="type-eyebrow text-white">{eyebrow}</p>
            <h2 className="type-h3 text-white">{title}</h2>
          </div>
          <div className="flex flex-col items-start gap-6 md:col-span-8 md:col-start-9">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function FlightsSection() {
  return (
    <SectionFrame id="flights" eyebrow="Flights" title="Getting to London">
      <div className="flex flex-col gap-4">
        <h3 className="type-p-large text-white">
          Nearest airport: London Heathrow (LHR)
        </h3>
        <p className="type-paragraph text-white">
          Heathrow is the primary London long-haul hub and connects to central
          London by rail, Tube, taxi, and rideshare.
        </p>
      </div>
      <Button
        arrow
        href="https://www.heathrow.com/"
        label="View Heathrow"
        variant="secondary"
      />
    </SectionFrame>
  );
}

function HotelsSection() {
  return (
    <SectionFrame id="hotels" eyebrow="Hotels" title="Book your stay">
      <p className="type-p-large text-white">
        Hotel accommodations are available through aRes Travel.
      </p>
      <Button disabled label="Book a hotel" variant="secondary" />
    </SectionFrame>
  );
}

function VisaSection() {
  return (
    <SectionFrame id="visas" eyebrow="Visas" title="Entry requirements">
      <div className="type-paragraph flex flex-col gap-4 text-white">
        <p>
          Attendees are responsible for reviewing entry requirements and
          arranging their own visas. You can check whether you need a visa{" "}
          <a
            href={VISA_CHECK_HREF}
            className="text-purple underline decoration-purple underline-offset-4 transition-opacity hover:opacity-80"
            {...getAnchorLinkProps({ href: VISA_CHECK_HREF })}
          >
            here
          </a>
          .
        </p>
        <p>
          If you need support obtaining your visa, the Solana Foundation has
          engaged the Immigration Advice Service (IAS) to assist you in this
          process. If you are ready to apply, click{" "}
          <a
            href={IAS_HREF}
            className="text-purple underline decoration-purple underline-offset-4 transition-opacity hover:opacity-80"
            {...getAnchorLinkProps({ href: IAS_HREF })}
          >
            here
          </a>{" "}
          to get started.
        </p>
        <p>
          Please note Solana Foundation does not cover the cost of visa support
          and it is up to the individual to pay for these services.
        </p>
      </div>
    </SectionFrame>
  );
}

function FaqBanner() {
  return (
    <section className="bg-black pt-[80px] md:pt-[120px]">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <div className="flex h-[308px] flex-col items-center justify-end gap-10 bg-neutral-800 px-8 py-20 text-center md:h-auto md:min-h-[286px] md:p-[80px]">
          <h2 className="type-h4 text-white">Frequently asked questions</h2>
          <Button arrow href="/faq" label="See all" variant="primary" />
        </div>
      </div>
    </section>
  );
}

function TravelHero() {
  return (
    <SubpageHero
      title="Travel"
      contentClassName="max-w-[1440px]"
      heroImage="travel"
    />
  );
}

export default function TravelPage() {
  return (
    <PageShell
      contentId="travel-content"
      // navigation={{
      //   ctaAlwaysVisible: true,
      //   ctaHref: GENERAL_ADMISSION_HREF,
      //   ctaLabel: "Get tickets",
      //   showMenuButton: true,
      // }}
    >
      <TravelHero />
      <TravelSubnav />
      <FlightsSection />
      <Marquee
        highlightClassName="text-green"
        highlights={TRAVEL_MARQUEE_HIGHLIGHTS}
      />
      <HotelsSection />
      <VisaSection />
      <Marquee
        highlightClassName="text-blue"
        highlights={TRAVEL_MARQUEE_HIGHLIGHTS}
      />
      <FaqBanner />
      <Footer />
    </PageShell>
  );
}
