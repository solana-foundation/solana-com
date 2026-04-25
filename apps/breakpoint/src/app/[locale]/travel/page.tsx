import type { Metadata } from "next";
import { Link } from "@workspace/i18n/routing";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import Marquee from "@/components/Marquee";
import Navigation from "@/components/Navigation";
import SubpageHero from "@/components/SubpageHero";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Travel | Breakpoint 2026",
  description:
    "Plan travel to Breakpoint 2026 in London with airport, flight, hotel, visa, and local recommendations.",
};

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
    meta: "Approx. 45 min to Olympia",
    detail:
      "Compact east London airport with DLR and Elizabeth line transfers.",
  },
  {
    code: "LHR",
    name: "Heathrow Airport",
    href: "https://www.heathrow.com/",
    meta: "Approx. 35-45 min to Olympia",
    detail: "London's primary long-haul hub with rail and Tube connections.",
  },
  {
    code: "LGW",
    name: "London Gatwick Airport",
    href: "https://www.gatwickairport.com/",
    meta: "Approx. 60 min to Olympia",
    detail: "South London airport connected by rail into central London.",
  },
] satisfies AirportInfo[];

const AIRLINES = [
  {
    name: "Virgin Atlantic",
    href: "https://www.virginatlantic.com/en-US/",
    logo: "/img/travel/airline-virgin-atlantic.svg",
    logoClassName: "w-[238px] max-w-[72%]",
    description: "Transatlantic routes into Heathrow with partner connections.",
  },
  {
    name: "Delta Air Lines",
    href: "https://www.delta.com/us/en/home",
    logo: "/img/travel/airline-delta.svg",
    logoClassName: "w-[222px] max-w-[68%]",
    description: "US routes into London through Delta and partner services.",
  },
  {
    name: "British Airways",
    href: "https://www.britishairways.com/",
    logo: "/img/travel/airline-british-airways.svg",
    logoClassName: "w-[239px] max-w-[72%]",
    description: "Global connections into Heathrow, Gatwick, and London City.",
  },
  {
    name: "Lufthansa",
    href: "https://www.lufthansa.com/",
    logo: "/img/travel/airline-lufthansa.svg",
    logoClassName: "w-[222px] max-w-[68%]",
    description: "European connections into London via Frankfurt and Munich.",
  },
] satisfies AirlineInfo[];

const HOTELS = [
  {
    name: "The Ned London",
    href: "https://www.thened.com/london/",
    description:
      "City of London hotel in a landmark 1930s bank building, with strong rail links across town.",
    distance: "40 minutes from Olympia Convention Centre",
  },
  {
    name: "Vintry and Mercer",
    href: "https://www.vintryandmercer.com/us/",
    description:
      "Boutique hotel near Mansion House with quick Underground connections west.",
    distance: "40 minutes from Olympia Convention Centre",
  },
  {
    name: "The Westin London City",
    href: "https://www.marriott.com/en-us/hotels/lonwi-the-westin-london-city/overview/",
    description:
      "Riverside hotel on Upper Thames Street with access to District line routes.",
    distance: "35 minutes from Olympia Convention Centre",
  },
  {
    name: "The Waldorf Hilton",
    href: "https://www.hilton.com/en/hotels/lonwahi-the-waldorf-hilton-london/",
    description:
      "Aldwych hotel near Covent Garden, theatres, and central London dining.",
    distance: "30 minutes from Olympia Convention Centre",
  },
  {
    name: "The Clermont London, Charing Cross",
    href: "https://www.theclermont.co.uk/charing-cross",
    description:
      "Charing Cross hotel by Trafalgar Square with direct access to central rail and Tube.",
    distance: "35 minutes from Olympia Convention Centre",
  },
] satisfies HotelInfo[];

const LONDON_PICKS = [
  {
    title: "Science Museum",
    location: "South Kensington",
    href: "https://www.sciencemuseum.org.uk/home",
    description:
      "Exhibitions, engineering history, and space artifacts a short trip from the venue.",
  },
  {
    title: "Design Museum",
    location: "Kensington",
    href: "https://designmuseum.org/",
    description:
      "Contemporary design, product, graphics, and architecture near Holland Park.",
  },
  {
    title: "Tate Modern",
    location: "Bankside",
    href: "https://www.tate.org.uk/visit/tate-modern",
    description:
      "Modern and contemporary art in a landmark power station on the Thames.",
  },
] satisfies LondonPick[];

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

type HotelInfo = {
  description: string;
  distance: string;
  href: string;
  name: string;
};

type LondonPick = {
  description: string;
  href: string;
  location: string;
  title: string;
};

function InlineCta({
  href,
  label = "Learn more",
}: {
  href: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-3 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-white transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {label}
      <span className="inline-flex size-3 items-center justify-center">
        <ArrowUpRightIcon />
      </span>
    </a>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex h-7 items-center justify-center border border-white/20 px-3 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.08em] text-white transition-colors hover:border-blue hover:text-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-8 md:text-[12px]"
    >
      {label}
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="mx-auto flex max-w-[920px] flex-col items-center gap-4 text-center">
      {eyebrow && (
        <p className="font-mono text-[14px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-white md:text-[16px]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-sans text-[40px] font-normal leading-[1.15] tracking-[-0.02em] text-white md:text-[48px]">
        {title}
      </h2>
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
          className="group border-t border-stroke-card py-6 transition-colors last:border-b hover:border-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <div className="flex items-start gap-5">
            <p className="w-12 shrink-0 font-mono text-[16px] font-bold uppercase leading-[1.3] tracking-[0.08em] text-white">
              {airport.code}
            </p>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-sans text-[20px] font-bold leading-[1.18] tracking-[-0.01em] text-white md:text-[24px]">
                  {airport.name}
                </h3>
                <span className="mt-1 inline-flex size-3 shrink-0 items-center justify-center text-white transition-colors group-hover:text-blue">
                  <ArrowUpRightIcon />
                </span>
              </div>
              <p className="mt-2 font-mono text-[13px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-blue md:text-[14px]">
                {airport.meta}
              </p>
              <p className="mt-3 max-w-[360px] font-sans text-[16px] font-normal leading-[1.45] tracking-normal text-text-secondary md:text-[18px]">
                {airport.detail}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

function AirlineCard({ airline }: { airline: AirlineInfo }) {
  return (
    <article className="flex min-w-0 flex-col items-start">
      <a
        href={airline.href}
        aria-label={`${airline.name} travel information`}
        className="flex h-[180px] w-full items-center justify-center border border-neutral-700 bg-white/[0.05] transition-colors hover:border-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-[246px]"
      >
        <img
          src={airline.logo}
          alt=""
          aria-hidden="true"
          className={`block h-auto ${airline.logoClassName}`}
        />
      </a>
      <div className="flex w-full flex-col items-start gap-4 py-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-sans text-[18px] font-bold leading-[1.45] tracking-normal text-white">
            {airline.name}
          </h3>
          <p className="font-sans text-[18px] font-normal leading-[1.45] tracking-normal text-text-secondary">
            {airline.description}
          </p>
        </div>
        <InlineCta href={airline.href} />
      </div>
    </article>
  );
}

function FlightsSection() {
  return (
    <section id="flights" className="bg-black pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-5 md:px-8">
        <SectionHeading
          eyebrow="Airports / Flight deals"
          title="Getting to London"
        />

        <div className="grid gap-10 md:grid-cols-[minmax(250px,0.7fr)_minmax(0,1.55fr)] md:gap-[64px] lg:gap-[110px]">
          <AirportList />
          <div className="grid gap-6 md:grid-cols-2">
            {AIRLINES.map((airline) => (
              <AirlineCard key={airline.name} airline={airline} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HotelsSection() {
  return (
    <section id="hotels" className="bg-black pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-5 md:px-8">
        <SectionHeading title="Hotels" />

        <div className="grid items-start gap-10 md:grid-cols-[minmax(320px,589px)_minmax(0,676px)] md:justify-center md:gap-[80px] lg:gap-[111px]">
          <div className="relative aspect-square w-full overflow-hidden bg-neutral-800">
            <img
              src="/img/travel/hotel-london.webp"
              alt=""
              aria-hidden="true"
              width={638}
              height={967}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            {HOTELS.map((hotel, index) => (
              <details
                key={hotel.name}
                open={index === 0}
                className="group border-t border-neutral-700 pb-3 pt-6 open:border-white"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-sans text-[22px] font-bold leading-[1.18] tracking-[-0.01em] text-text-secondary transition-colors group-open:text-white md:text-[24px]">
                    {hotel.name}
                  </h3>
                  <span className="mt-1 h-[14px] w-[14px] shrink-0 border border-white/40 transition-colors group-open:bg-blue group-open:border-blue" />
                </summary>
                <div className="mt-4 flex flex-col items-start gap-4">
                  <p className="font-sans text-[18px] font-normal leading-[1.45] tracking-normal text-white">
                    {hotel.description}
                  </p>
                  <p className="font-mono text-[14px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-blue md:text-[16px]">
                    {hotel.distance}
                  </p>
                  <InlineCta href={hotel.href} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VisaSection() {
  return (
    <section id="visas" className="bg-black pt-[120px]">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8">
        <div className="grid gap-10 border-t border-neutral-700 pt-12 md:grid-cols-[minmax(260px,501px)_minmax(0,676px)] md:justify-between">
          <div className="flex flex-col items-start gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="font-sans text-[40px] font-normal leading-[1.15] tracking-[-0.02em] text-white md:text-[48px]">
                Visas for London
              </h2>
              <p className="font-sans text-[18px] font-normal leading-[1.45] tracking-normal text-white">
                Attendees are responsible for reviewing entry requirements and
                arranging their own visas.
              </p>
            </div>
            <a
              href={CONTACT_HREF}
              className="inline-flex h-10 items-center justify-center gap-3 border border-white px-5 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Learn more
              <span className="inline-flex size-3 items-center justify-center">
                <ArrowUpRightIcon />
              </span>
            </a>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-sans text-[24px] font-normal leading-[1.18] tracking-[-0.04em] text-white">
                First, check if you need a visa
              </h3>
              <p className="font-sans text-[18px] font-normal leading-[1.45] tracking-normal text-white">
                <a
                  href={VISA_CHECK_HREF}
                  className="text-purple underline decoration-purple underline-offset-4 transition-opacity hover:opacity-80"
                >
                  Click here
                </a>{" "}
                to see if you are required to have a visa for entry.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-sans text-[24px] font-normal leading-[1.18] tracking-[-0.04em] text-white">
                Then, if you need support with a visa
              </h3>
              <div className="flex flex-col gap-3 font-sans text-[18px] font-normal leading-[1.45] tracking-normal text-white">
                <p>
                  Solana Foundation has engaged Immigration Advice Service (IAS)
                  to assist you in this process. If you are ready to apply,
                  click{" "}
                  <a
                    href={IAS_HREF}
                    className="text-purple underline decoration-purple underline-offset-4 transition-opacity hover:opacity-80"
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

function LondonPickCard({ pick }: { pick: LondonPick }) {
  return (
    <article className="flex min-w-0 flex-col items-start">
      <div className="aspect-[400/300] w-full border border-neutral-700 bg-neutral-800" />
      <div className="flex w-full flex-col items-start gap-4 py-6 md:pr-10">
        <div className="flex flex-col gap-3">
          <h3 className="font-sans text-[24px] font-bold leading-[1.18] tracking-[-0.01em] text-white">
            {pick.title}
          </h3>
          <p className="font-mono text-[14px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-blue md:text-[16px]">
            {pick.location}
          </p>
        </div>
        <p className="font-sans text-[18px] font-normal leading-[1.45] tracking-normal text-white">
          {pick.description}
        </p>
        <InlineCta href={pick.href} />
      </div>
    </article>
  );
}

function LondonPicksSection() {
  return (
    <section id="london" className="bg-black pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 md:px-8">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-[676px] flex-col gap-6">
            <p className="font-mono text-[14px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-white md:text-[16px]">
              More BP26 events
            </p>
            <h2 className="font-sans text-[40px] font-normal leading-[1.15] tracking-[-0.02em] text-white md:text-[48px]">
              More to see while in London
            </h2>
          </div>
          <div aria-hidden="true" className="hidden items-center gap-4 md:flex">
            <span className="flex size-12 items-center justify-center border border-white/30 text-white">
              ←
            </span>
            <span className="flex size-12 items-center justify-center border border-white/30 text-white">
              →
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {LONDON_PICKS.map((pick) => (
            <LondonPickCard key={pick.title} pick={pick} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqBanner() {
  return (
    <section className="bg-black pt-[120px]">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8">
        <div className="flex min-h-[220px] flex-col items-center justify-end gap-10 bg-neutral-800 px-5 py-12 text-center md:min-h-[286px] md:p-[80px]">
          <h2 className="font-sans text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-white md:text-[40px]">
            Frequently asked questions
          </h2>
          <Link
            href="/faq"
            className="inline-flex h-10 items-center justify-center gap-3 bg-white px-5 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black transition-colors hover:bg-[#e7d2f9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            See all
            <span className="inline-flex size-3 items-center justify-center">
              <ArrowUpRightIcon />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TravelHero() {
  return (
    <SubpageHero
      title="Welcome to London"
      tintClassName="bg-blue"
      imageTopClassName="top-[-300px] md:top-[-330px]"
    >
      <div className="-mt-8 flex flex-wrap items-center gap-1 md:-mt-5 md:gap-2">
        <QuickLink href="#flights" label="Flights" />
        <QuickLink href="#hotels" label="Travel" />
        <QuickLink href="#visas" label="Visas" />
        <QuickLink href="#london" label="What to do" />
      </div>
    </SubpageHero>
  );
}

export default function TravelPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <a
        href="#travel-content"
        className="sr-only absolute left-5 top-5 z-50 focus:not-sr-only focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-[14px] focus:font-bold focus:uppercase focus:tracking-[0.08em] focus:text-black"
      >
        Skip to content
      </a>

      <Navigation
        ctaAlwaysVisible
        ctaHref="/registration"
        ctaLabel="Register"
        showMenuButton
      />

      <div id="travel-content">
        <TravelHero />
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
      </div>
    </main>
  );
}
