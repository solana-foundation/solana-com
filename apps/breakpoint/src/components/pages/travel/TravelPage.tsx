import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import Button from "@/components/Button";
import Marquee from "@/components/Marquee";
import PageShell from "@/components/PageShell";
import SubpageHero from "@/components/SubpageHero";
import Footer from "@/components/sections/Footer";
import { getAnchorLinkProps } from "@/lib/links";
import HotelsSection from "./TravelHotelsSection";
import LondonPicksSection from "./TravelLondonPicksSection";
import TravelSubnav from "./TravelSubnav";

const CONTACT_HREF =
  "mailto:breakpoint@solana.org?subject=Breakpoint%202026%20travel%20question";
const VISA_CHECK_HREF = "https://www.gov.uk/check-uk-visa";
const IAS_HREF =
  "https://iasservices.org.uk/breakpoint-priority-visa-application-centre/";

const AIRPORTS = [
  {
    code: "LCY",
    name: "London City Airport",
    href: "https://www.londoncityairport.com/",
    meta: "11km east of central London",
    detail:
      "Compact east London airport with DLR and Elizabeth line transfers.",
  },
  {
    code: "LHR",
    name: "Heathrow Airport",
    href: "https://www.heathrow.com/",
    meta: "24km west of central London",
    detail: "London's primary long-haul hub with rail and Tube connections.",
  },
  {
    code: "LGW",
    name: "London Gatwick Airport",
    href: "https://www.gatwickairport.com/",
    meta: "48km south of central London",
    detail: "South London airport connected by rail into central London.",
  },
] satisfies AirportInfo[];

const AIRLINES = [
  {
    name: "Virgin Airlines",
    href: "https://www.virginatlantic.com/en-US/",
    logo: "/img/travel/airline-virgin-atlantic.svg",
    logoClassName: "w-[208.8px] max-w-[74%] md:w-[238px]",
    description: "Transatlantic routes into Heathrow with partner connections.",
  },
  {
    name: "Delta Airlines",
    href: "https://www.delta.com/us/en/home",
    logo: "/img/travel/airline-delta.svg",
    logoClassName: "w-[170px] max-w-[60%] md:w-[222px]",
    description: "Direct US routes to Heathrow from major hubs.",
  },
  {
    name: "British Airways",
    href: "https://www.britishairways.com/",
    logo: "/img/travel/airline-british-airways.svg",
    logoClassName: "w-[214.9px] max-w-[76%] md:w-[239px]",
    description: "Global connections into Heathrow, Gatwick, and London City.",
  },
  {
    name: "Lufthansa",
    href: "https://www.lufthansa.com/",
    logo: "/img/travel/airline-lufthansa.svg",
    logoClassName: "w-[177.6px] max-w-[63%] md:w-[222px]",
    description: "European connections into London via Frankfurt and Munich.",
  },
] satisfies AirlineInfo[];

const TRAVEL_MARQUEE_HIGHLIGHTS = [
  "BP26",
  "LDN",
  "BUILD",
  "DEPLOY",
  "SHIP MORE",
];

type AirportInfo = {
  code: string;
  detail: string;
  href: string;
  meta: string;
  name: string;
};

type AirlineInfo = {
  description: string;
  href: string;
  logo: string;
  logoClassName: string;
  name: string;
};

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="mx-auto flex max-w-[920px] flex-col items-center gap-6 text-center">
      {eyebrow && <p className="type-eyebrow text-white">{eyebrow}</p>}
      <h2 className="type-h3 text-white">{title}</h2>
    </div>
  );
}

function AirportList() {
  return (
    <div className="flex flex-col">
      {AIRPORTS.map((airport) => (
        <a
          key={airport.code}
          href={airport.href}
          {...getAnchorLinkProps({ href: airport.href })}
          className="group flex min-h-[140px] flex-col items-start justify-center gap-4 border-b border-neutral-700 py-6 transition-colors hover:border-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <p className="type-h6 w-[123px] text-white">{airport.code}</p>
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <h3 className="type-h5-fixed text-white">{airport.name}</h3>
              <span className="inline-flex size-3 shrink-0 items-center justify-center text-white">
                <ArrowUpRightIcon />
              </span>
            </div>
            <p className="type-eyebrow whitespace-nowrap text-blue">
              {airport.meta}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

function AirlineCard({ airline }: { airline: AirlineInfo }) {
  return (
    <article className="flex w-[283.56px] shrink-0 flex-col items-start md:min-w-0 md:w-auto">
      <a
        href={airline.href}
        {...getAnchorLinkProps({ href: airline.href })}
        aria-label={`${airline.name} travel information`}
        className="flex aspect-[369.5/246] w-full items-center justify-center border border-neutral-700 bg-white/[0.05] transition-colors hover:border-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <img
          src={airline.logo}
          alt=""
          aria-hidden="true"
          className={`block h-auto ${airline.logoClassName}`}
        />
      </a>
      <div className="flex w-full min-w-0 flex-col items-start py-6">
        <div className="flex w-full min-w-0 flex-col gap-2">
          <h3 className="type-paragraph-bold text-white">{airline.name}</h3>
          <p className="type-paragraph max-w-full text-text-secondary">
            {airline.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function FlightsSection() {
  return (
    <section
      id="flights"
      className="scroll-mt-16 bg-black pt-[80px] md:scroll-mt-20 md:pt-[120px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 md:gap-12 md:px-8">
        <SectionHeading
          eyebrow="Airports / Airlines"
          title="Getting to London"
        />

        <div className="flex flex-col gap-8 md:grid md:grid-cols-bp-desktop md:gap-x-s">
          <div className="md:col-span-6">
            <AirportList />
          </div>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 scrollbar-hidden md:col-span-9 md:col-start-8 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0">
            {AIRLINES.map((airline) => (
              <AirlineCard key={airline.name} airline={airline} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VisaSection() {
  return (
    <section
      id="visas"
      className="scroll-mt-16 bg-black pt-[80px] md:scroll-mt-20 md:pt-[120px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <div className="grid gap-16 border-t border-neutral-700 pt-8 md:grid-cols-bp-desktop md:gap-x-s md:pt-12">
          <div className="flex flex-col items-start gap-8 md:col-span-6">
            <div className="flex flex-col gap-4">
              <h2 className="type-h3 text-white">Visas for London</h2>
              <p className="type-paragraph text-white">
                Attendees are responsible for reviewing entry requirements and
                arranging their own visas.
              </p>
            </div>
            <Button
              arrow
              href={CONTACT_HREF}
              label="Learn more"
              variant="secondary"
            />
          </div>

          <div className="flex flex-col gap-8 md:col-span-8 md:col-start-9">
            <div className="flex flex-col gap-4">
              <h3 className="type-p-large text-white">
                First, check if you need a visa
              </h3>
              <p className="type-paragraph text-white">
                <a
                  href={VISA_CHECK_HREF}
                  className="text-purple underline decoration-purple underline-offset-4 transition-opacity hover:opacity-80"
                  {...getAnchorLinkProps({ href: VISA_CHECK_HREF })}
                >
                  Click here
                </a>{" "}
                to see if you are required to have a visa for entry.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="type-p-large text-white">
                Then, if you need support with a visa
              </h3>
              <div className="type-paragraph flex flex-col gap-4 text-white">
                <p>
                  Solana Foundation has engaged Immigration Advice Service (IAS)
                  to assist you in this process. If you are ready to apply,
                  click{" "}
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
                  Please note Solana Foundation does not cover the cost of visa
                  support and it is up to the individual to pay for these
                  services. IAS fees are to be confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
      title="Welcome to London"
      contentClassName="max-w-[1440px]"
      tintClassName=""
      imageTopClassName="top-[-300px] md:top-[-330px]"
      pixelEdgeSrc="/assets/pixel-edge-travel.svg"
      videoSources={[
        {
          src: "/assets/subpage-heroes/travel.webm",
          type: "video/webm",
        },
        {
          src: "/assets/subpage-heroes/travel.mp4",
          type: "video/mp4",
        },
      ]}
    />
  );
}

export default function TravelPage() {
  return (
    <PageShell
      contentId="travel-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: "/registration",
        ctaLabel: "Register",
        showMenuButton: true,
      }}
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
      <LondonPicksSection />
      <FaqBanner />
      <Footer />
    </PageShell>
  );
}
