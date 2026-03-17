"use client";

import { useState, type ReactNode } from "react";

type FaqItem = {
  question: string;
  answer: ReactNode;
};

const sponsorLogos = [
  "https://cdn.sanity.io/images/a4237xbr/production/10b92a11808918fb3677321526d3158c1009ba5e-728x200.svg",
  "https://cdn.sanity.io/images/a4237xbr/production/063a4b1e96d4bea2b2f5ffba7a56091faffc5e98-1376x182.svg",
  "https://cdn.sanity.io/images/a4237xbr/production/970fb8f24b6ac37f65208f116aca033f89831c6b-687x162.svg",
  "https://cdn.sanity.io/images/a4237xbr/production/56a5125c1d55b83d9fa756e046aad1d7e7139fe2-650x100.svg",
  "https://cdn.sanity.io/images/a4237xbr/production/f6351edbc10a24fb837ff9e27b2143f2bdd66ad3-925x235.svg",
  "https://cdn.sanity.io/images/a4237xbr/production/ece947eeecf506fb6520b13ba92f568659d661ed-1622x285.svg",
  "https://cdn.sanity.io/images/a4237xbr/production/4b3c04a636c53cae969a1cc287918066004700c8-1000x176.svg",
  "https://cdn.sanity.io/images/a4237xbr/production/21b297f0b0f86c1588dbb22450c413fe2286d1f8-601x162.svg",
  "https://cdn.sanity.io/images/a4237xbr/production/c6ad23e736be20dec1c0f0bc640dc3267b1175d5-672x73.svg",
  "https://cdn.sanity.io/images/a4237xbr/production/ca35db3e5294fafd75baa300d9dbe0042b2d27ba-750x250.svg",
  "https://cdn.sanity.io/images/a4237xbr/production/8bf9c1d957031e52a6ede31c8f035fca933b4f36-1102x197.svg",
  "https://cdn.sanity.io/images/a4237xbr/production/cba796b681350ede24fa3caaea3750bcfb973201-2264x750.svg",
];

const faqItems: FaqItem[] = [
  {
    question: "What is included in Breakpoint?",
    answer:
      "Your Breakpoint ticket unlocks two days of boundary-pushing talks, workshops, immersive experiences, unforgettable celebrations, and meaningful connections with the entire Solana ecosystem and the builders shaping the future beyond it!",
  },
  {
    question: "What is the refund or cancellation policy?",
    answer: (
      <>
        <p>
          Tickets are non-refundable but can be transferred. To transfer your
          ticket:
        </p>
        <ul>
          <li>
            Click{" "}
            <a
              target="_blank"
              href="https://luma.com/breakpoint2025/transfer"
              className="underline"
              rel="noreferrer"
            >
              HERE
            </a>{" "}
            (make sure you&apos;re logged into the Luma account associated with
            the ticket)
          </li>
          <li>
            Enter the email of the person you&apos;d like to transfer the ticket
            to, then click &apos;Complete Transfer&apos;
          </li>
          <li>
            The new ticket holder will receive a separate email to accept the
            ticket
          </li>
        </ul>
        <p>
          If you have further questions, please email{" "}
          <a href="mailto:breakpoint@solana.org" className="underline">
            breakpoint@solana.org
          </a>
          .
        </p>
      </>
    ),
  },
  {
    question:
      "Are there any special ticket tiers, grant programs, or discounts on Breakpoint tickets?",
    answer:
      "Breakpoint is for everyone, and the Solana Foundation wants to ensure that it’s within reach to almost everyone in the Solana community. Applications for developer, artist, and student programs will be available in 2026 — stay tuned!",
  },
  {
    question: "Are travel and accommodation part of my ticket?",
    answer:
      "Breakpoint attendees are responsible for making their own travel and accommodation — but the Solana Foundation is working to get discounts during Breakpoint. Check back in 2026 for more details.",
  },
  {
    question: "How do I connect with other attendees?",
    answer: (
      <p>
        Join the{" "}
        <a
          target="_blank"
          href="https://t.me/+wxxRNayehMdhOGEx"
          className="underline"
          rel="noreferrer"
        >
          Breakpoint Telegram group
        </a>
        .
      </p>
    ),
  },
  {
    question: "Additional questions?",
    answer: (
      <p>
        Please email{" "}
        <a href="mailto:breakpoint@solana.org" className="underline">
          breakpoint@solana.org
        </a>
        .
      </p>
    ),
  },
];

function LogoMark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 16" fill="none">
      <g clipPath="url(#clip0_breakpoint_local)">
        <mask
          id="mask0_breakpoint_local"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="20"
          height="17"
        >
          <path d="M0 0H108.364V16.1033H0V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_breakpoint_local)">
          <path
            d="M18.2087 12.6968L15.2363 15.8837C15.1719 15.9528 15.094 16.0079 15.0074 16.0457C14.9209 16.0835 14.8275 16.1031 14.733 16.1033H0.642129C0.57507 16.103 0.509559 16.0832 0.453556 16.0463C0.397554 16.0094 0.353471 15.957 0.326665 15.8955C0.299859 15.8341 0.291483 15.7661 0.302556 15.7C0.313629 15.6339 0.343673 15.5724 0.389038 15.523L3.35777 12.3361C3.42219 12.267 3.50008 12.2119 3.58665 12.1741C3.67321 12.1363 3.76659 12.1167 3.86104 12.1164H17.9519C18.0197 12.1151 18.0864 12.1338 18.1436 12.1702C18.2008 12.2067 18.246 12.2592 18.2734 12.3212C18.3008 12.3832 18.3093 12.452 18.2978 12.5188C18.2863 12.5856 18.2553 12.6475 18.2087 12.6968ZM15.2363 6.27716C15.1716 6.20844 15.0937 6.15354 15.0072 6.11579C14.9207 6.07804 14.8274 6.05822 14.733 6.05753H0.642129C0.574929 6.05757 0.509199 6.07721 0.452991 6.11404C0.396783 6.15087 0.352538 6.20329 0.325675 6.26489C0.298813 6.32649 0.2905 6.39459 0.301754 6.46084C0.313009 6.52709 0.343342 6.58862 0.389038 6.63789L3.35777 9.82698C3.42245 9.89571 3.5004 9.9506 3.5869 9.98835C3.6734 10.0261 3.76666 10.0459 3.86104 10.0466H17.9519C18.0189 10.046 18.0842 10.0259 18.14 9.98895C18.1958 9.95195 18.2396 9.89958 18.2663 9.83816C18.2929 9.77675 18.3011 9.70893 18.29 9.64293C18.2789 9.57692 18.2489 9.51555 18.2036 9.46626L15.2363 6.27716ZM0.642129 3.98771H14.733C14.8275 3.98744 14.9209 3.96781 15.0074 3.93004C15.094 3.89226 15.1719 3.83714 15.2363 3.76807L18.2087 0.580436C18.2433 0.543467 18.2693 0.499351 18.2849 0.451209C18.3006 0.403067 18.3054 0.352076 18.2992 0.301843C18.2929 0.25161 18.2757 0.203363 18.2488 0.160516C18.2218 0.117669 18.1858 0.0812688 18.1432 0.0538909C18.0862 0.0174073 18.0196 -0.00132368 17.9519 7.27636e-05H3.86104C3.76659 0.000340677 3.67321 0.0199692 3.58665 0.0577459C3.50008 0.0955226 3.42219 0.150645 3.35777 0.219709L0.389038 3.40735C0.343342 3.45662 0.313009 3.51815 0.301754 3.5844C0.2905 3.65065 0.298813 3.71875 0.325675 3.78034C0.352538 3.84194 0.396783 3.89437 0.452991 3.9312C0.509199 3.96803 0.574929 3.98767 0.642129 3.98771Z"
            fill="#E7D2F9"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_breakpoint_local">
          <rect width="108.364" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <a
        className="block w-full nav-sm:w-auto whitespace-nowrap nav-sm:px-xs"
        href={href}
      >
        <div className="inset-shadow-[0px_-2px_0px_0px] inset-shadow-transparent hover:inset-shadow-transparent-wisp-40 py-xs">
          {children}
        </div>
      </a>
    </li>
  );
}

function CTAButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={`gap-xs cta cursor-pointer uppercase flex gap-xs items-center justify-center cta-transition [&>svg]:transition-all [&>svg]:duration-300 outline-offset-[8px] outline-transparent focus:outline focus:outline-transparent-wisp-40 px-[var(--spacing-xs)] h-[3rem] w-full hover:text-invert hover:[&>svg]:fill-primary-null active:bg-transparent-wisp-80 bg-byte text-invert [&>svg]:fill-primary-null ${className}`.trim()}
      target="_blank"
      rel="noreferrer"
      href={href}
    >
      {children}
      <svg
        width="10"
        height="10"
        viewBox="0 0 9 10"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.35938 8.65625L5.10156 6.97656L6.6875 5.57812V5.53125L4.77344 5.625H0V4.21094H4.78906L6.6875 4.3125V4.26562L5.10156 2.86719L3.35938 1.1875L4.32812 0.171875L9 4.92188L4.32812 9.66406L3.35938 8.65625Z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full mt-xl md:w-6/12">
      {faqItems.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.question}
            data-state={open ? "open" : "closed"}
            className="group mt-s pb-s border-b-wisp-10 border-b-1 grid"
          >
            <button
              type="button"
              className="h5 w-full flex justify-start items-start gap-3xs"
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <div className="group cursor-pointer flex justify-between w-full">
                <h5 className="h5 cta-transition normal-case text-left group-hover:text-byte row-1">
                  {item.question}
                </h5>
                <div className="change-border-hover cta-transition group-hover:border-primary-byte relative cursor-pointer outline-0 outline-wisp-40 outline-offset-4 size-m text-primary shrink-0 text-2xl border-1 border-stroke-tertiary text-center group-focus-visible:outline-1 ms-xs">
                  <span className="change-bg-hover cta-transition group-hover:bg-primary-byte absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-0.5 w-2xs bg-primary" />
                  <span
                    className={`change-bg-hover cta-transition group-hover:bg-primary-byte absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-0.5 w-2xs bg-primary ${open ? "rotate-180 opacity-0" : "rotate-90"}`.trim()}
                  />
                </div>
              </div>
            </button>
            <div
              className={`accordion-transition mt-xs overflow-hidden ${open ? "block" : "hidden"}`.trim()}
            >
              {typeof item.answer === "string" ? (
                <p>{item.answer}</p>
              ) : (
                item.answer
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <nav
        aria-label="Main"
        className="sticky top-0 flex-col w-full text-button z-20 overflow-hidden"
      >
        <div className="w-full mb-[-2.5px]">
          <ul className="bg-null w-full inline-flex unstyled-list inset-shadow-[0px_-1px_0px_0px] inset-shadow-transparent-wisp-30/100 justify-between">
            <li className="flex-start px-s py-xs">
              <a
                className="block w-[18.2px] h-xs"
                title="Breakpoint homepage"
                href="#top"
              >
                <LogoMark />
              </a>
            </li>
            <li className="flex-end hidden nav-sm:flex">
              <ul className="inline-flex unstyled-list transition-transform duration-300 transform-[translateX(0)] transform-[translateX(158px)]">
                <NavLink href="#bp26">BP26</NavLink>
                <NavLink href="#highlights">Highlights</NavLink>
                <NavLink href="#get-involved">Get Involved</NavLink>
                <NavLink href="#faq">FAQ</NavLink>
                <NavLink href="#sponsors">Sponsors</NavLink>
                <li>
                  <CTAButton
                    href="https://www.youtube.com/@SolanaFndn/videos"
                    className="px-s focus:outline-none focus:underline focus:underline-offset-4 focus:decoration-null"
                  >
                    Videos
                  </CTAButton>
                </li>
              </ul>
            </li>
            <div className="nav-sm:hidden flex-end transition-transform duration-300 transform-[translateX(0)] transform-[translateX(158px)]">
              <li>
                <CTAButton href="https://www.youtube.com/@SolanaFndn/videos">
                  Videos
                </CTAButton>
              </li>
            </div>
          </ul>
        </div>
      </nav>

      <main id="top" className="container">
        <section className="[&&]:pb-2xl [&&]:md:pb-2xl px-s py-s flex flex-col justify-between relative">
          <img
            className="w-full hidden md:block"
            alt="Solana Breakpoint Logo"
            src="/assets/bp-logo-full.svg"
          />
          <img
            className="w-full block md:hidden"
            alt="Solana Breakpoint Logo"
            src="/assets/bg-logo-mobile-full.svg"
          />

          <div className="mt-m md:mt-l">
            <div className="aspect-video overflow-hidden">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/394wb968J68"
                title="Solana Breakpoint 2025 - The Movie"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-m gap-l flex flex-col md:flex-row items-start">
            <div className="gap-s flex flex-col w-full md:w-2/3">
              <p className="text-eyebrow">Solana Breakpoint 2025</p>
              <h3>The Movie</h3>
            </div>
          </div>
        </section>

        <article
          id="bp26"
          className="p-xs w-full md:px-s md:py-m text-primary bg-null pb-xl pt-xl md:pt-3xl"
        >
          <div className="flex flex-col gap-2xl sm:gap-l">
            <p className="text-eyebrow">Solana Breakpoint 2026</p>
            <h2>Solana BP26 is coming to London</h2>
            <div className="grid gap-m md:grid-cols-2">
              <p>November 15-17, 2026</p>
              <p>
                Olympia
                <br />
                London, England
              </p>
            </div>
          </div>
        </article>

        <section id="highlights" className="grid gap-xs md:gap-s">
          <article className="p-xs w-full md:px-s md:py-m text-invert bg-lime grid gap-l md:grid-rows-1 md:grid-cols-12 md:gap-s">
            <div className="col-span-full w-full [&_img]:w-full md:col-span-6 md:order-1">
              <img
                src="https://cdn.sanity.io/images/a4237xbr/production/50bec578ef31739266634bcea83754045f23d1ed-1000x800.jpg"
                alt="Discover recordings, transcripts, and presentations from Breakpoint 2025"
              />
            </div>
            <div className="grid md:grid-rows-[1fr_auto] gap-l col-span-full md:col-span-6 pb-m md:pb-0">
              <div className="flex flex-col gap-m md:self-center md:pt-l md:gap-l [&>p]:text-h5">
                <div className="flex flex-col gap-2xl sm:gap-l">
                  <p className="text-eyebrow">Session Archives</p>
                  <h2>
                    Discover recordings, transcripts, and presentations from
                    Breakpoint 2025
                  </h2>
                </div>
              </div>
              <CTAButton
                href="https://www.youtube.com/playlist?list=PLilwLeBwGuK53OUOcc_GsCcbqcU5V4H9Z"
                className="md:self-end border-1 border-primary-null text-invert hover:bg-primary-null hover:text-primary"
              >
                Explore the archives
              </CTAButton>
            </div>
          </article>

          <article className="p-xs w-full md:px-s md:py-m text-invert bg-byte grid gap-l md:grid-rows-1 md:grid-cols-12 md:gap-s">
            <div className="col-span-full w-full [&_img]:w-full md:col-span-6 md:order-1">
              <img
                src="https://cdn.sanity.io/images/a4237xbr/production/abe83c176d0329c7d353871213ca3ecfd1784049-684x685.png"
                alt="Sign up for updates and early registration for Breakpoint 2026"
              />
            </div>
            <div className="grid md:grid-rows-[1fr_auto] gap-l col-span-full md:col-span-6 pb-m md:pb-0">
              <div className="flex flex-col gap-m md:self-center md:pt-l md:gap-l [&>p]:text-h5">
                <div className="flex flex-col gap-2xl sm:gap-l">
                  <p className="text-eyebrow">Breakpoint 2026</p>
                  <h2>
                    Sign up for updates and early registration for Breakpoint
                    2026
                  </h2>
                </div>
              </div>
              <form
                action="https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=7b8f7f90-b5cc-479e-af28-7121d89fc6a4"
                method="get"
                target="_blank"
                className="flex flex-col gap-xs md:flex-row"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  required
                  className="border-1 border-primary-null bg-transparent px-xs h-[3rem] w-full focus:outline-none focus:border-primary-null"
                />
                <button
                  type="submit"
                  className="gap-xs cta cursor-pointer uppercase flex gap-xs items-center justify-center cta-transition outline-offset-[8px] outline-transparent focus:outline focus:outline-transparent-null-40 px-[var(--spacing-xs)] h-[3rem] hover:bg-primary-wisp hover:text-invert bg-null text-primary"
                >
                  SIGN UP
                </button>
              </form>
            </div>
          </article>
        </section>

        <article
          id="get-involved"
          className="p-xs w-full md:px-s md:py-m text-invert bg-mint pt-2xl md:pt-3xl"
        >
          <div className="flex flex-col gap-2xl sm:gap-l [&&]:gap-m md:[&&]:gap-l">
            <p className="text-eyebrow">Get Involved BP26</p>
            <h2>Sponsors</h2>
            <p className="text-p1">Take part in Breakpoint 2026</p>
          </div>
          <div className="flex flex-col gap-xs mt-m md:flex-row md:gap-s md:mt-l">
            <CTAButton
              href="https://solanafoundation.typeform.com/bp26sponsorform"
              className="bg-null text-primary hover:bg-primary hover:text-invert"
            >
              Reach out
            </CTAButton>
          </div>
        </article>

        <article
          id="sponsors"
          className="p-xs w-full md:px-s md:py-m text-primary bg-null pt-xl md:pt-3xl"
        >
          <div className="flex flex-col gap-2xl sm:gap-l">
            <p className="text-eyebrow">Sponsors</p>
            <h2>Partners already shaping Breakpoint</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-s mt-xl">
            {sponsorLogos.map((logo) => (
              <div
                key={logo}
                className="border-1 border-wisp-10 p-s min-h-20 flex items-center justify-center bg-transparent-wisp-10"
              >
                <img
                  src={logo}
                  alt="Breakpoint sponsor logo"
                  className="w-full h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </article>

        <article
          id="faq"
          className="p-xs w-full md:px-s md:py-m text-primary bg-null p-xs pt-xl pb-xl flex flex-col md:flex-row md:p-s md:pt-3xl md:pb-2xl"
        >
          <div className="w-full mr-auto md:w-5/12">
            <div className="flex flex-col gap-2xl sm:gap-l pt-0">
              <p className="text-eyebrow">Faq</p>
              <h2>Frequently asked questions</h2>
            </div>
          </div>
          <FaqAccordion />
        </article>
      </main>
    </>
  );
}
