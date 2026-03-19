"use client";

import Button from "@/component-library/button";
import UnicornScene from "unicornstudio-react";

const bgSrc = "/src/img/solutions/sdp/hero-bg.png";
const bgMobileSrc = "/src/img/solutions/sdp/hero-bg-mobile.png";
const dashboardSrc = "/src/img/solutions/sdp/dashboard.svg";
const patternSrc = "/src/img/solutions/sdp/tutorials-bg.png";

const ArrowRight = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.75 9H14.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.75 4.5L14.25 9L9.75 13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Join = (): React.ReactElement => {
  return (
    <section className="relative flex flex-col items-center w-full overflow-hidden bg-[#0C0C0E]">
      {/* Decorative background — desktop */}
      <div
        aria-hidden
        className="hidden xl:block absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* <img
          src={bgSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        /> */}
        <UnicornScene
          projectId="join"
          className="!absolute inset-0 z-0"
          jsonFilePath="/src/img/solutions/sdp/hero-bg.json"
          width="100%"
          height="101%"
          scale={0.8}
          dpi={2}
          fps={15}
          lazyLoad={true}
          production={true}
          onError={(error) => console.error("UnicornScene error:", error)}
          placeholder={
            <img
              src={bgSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          }
          showPlaceholderOnError
          showPlaceholderWhileLoading
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #0c0c0e 0%, rgba(12,12,14,0) 93.3%)",
          }}
        />
      </div>

      {/* Decorative background — mobile/tablet */}
      <div
        aria-hidden
        className="xl:hidden absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute left-0 top-[-30%] bottom-0 right-0">
          <img
            src={bgMobileSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-[1440px] xl:border-x xl:border-white/[0.08]">
        {/* Mobile / Tablet layout (< xl) */}
        {/* <div className="xl:hidden flex flex-col gap-5 px-5 md:px-8 py-20">
          <h2 className="nd-heading-l-a text-white">
            Build the next wave of finance on Solana
          </h2>
          <Button size="m" showRightIcon>
            Join waitlist
          </Button>
          <div className="relative mt-3 rounded-md overflow-hidden border-t border-[rgba(236,228,253,0.08)]">
            <img
              src={dashboardSrc}
              alt="SDP dashboard"
              className="w-full h-auto"
            />
          </div>
        </div> */}

        <div className="flex flex-col xl:bg-[#0c0c0e]">
          {/* Row 1: Heading */}
          <div className="px-5 md:px-8 xl:px-12 py-10 md:py-20 flex flex-col gap-5">
            <h2 className="nd-heading-l-a text-white max-w-[546px]">
              Build the next wave of finance on Solana
            </h2>
            <div className="xl:hidden">
              <Button size="m" showRightIcon>
                Join waitlist
              </Button>
            </div>
          </div>

          {/* Row 2: Dashboard image with centered CTA */}
          <div
            className="relative pl-3 md:pr-3 xl:p-12 xl:pb-0 xl:border-t border-white/[0.08] overflow-hidden max-xl:!bg-none"
            style={{
              backgroundImage: `url(${patternSrc})`,
              backgroundPositionX: "4px",
            }}
          >
            {/* Dashboard screenshot */}
            <div className="relative overflow-hidden">
              <div className="relative rounded-lg overflow-hidden aspect-[1344/797] mb-[-10%] mr-[-30%] xl:mb-[-15%] md:mr-0">
                <img
                  src={dashboardSrc}
                  alt="SDP dashboard"
                  className="absolute inset-0 object-cover object-top"
                />
                <div
                  className="absolute inset-0 hidden xl:block"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(12,12,14,0) 0%, #0c0c0e 68.9%)",
                  }}
                />
              </div>
            </div>

            {/* Centered display CTA button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button className="pointer-events-auto hidden xl:flex items-center gap-0 bg-white hover:bg-[#ececec] transition-colors rounded-[800px] h-[126px] px-7 cursor-pointer">
                <span className="px-9 font-brand font-medium text-[40.5px] tracking-[-0.405px] leading-[54px] text-black whitespace-nowrap">
                  Join waitlist
                </span>
                <div className="w-[72px] h-[72px] flex items-center justify-center bg-black rounded-full text-white shrink-0">
                  <ArrowRight />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Join;
