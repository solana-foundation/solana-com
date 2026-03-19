"use client";

import Button from "@/component-library/button";
import { VideoTrigger } from "@/component-library/video-modal";
import UnicornScene from "unicornstudio-react";

const bgSrc = "/src/img/solutions/sdp/hero-bg.png";
const bgMobileSrc = "/src/img/solutions/sdp/hero-bg-mobile.png";
const videoFrameSrc = "/src/img/solutions/sdp/hero-video-cover.jpg";

const VideoLabel = () => (
  <div className="flex items-center bg-black/[0.64] px-3 py-1">
    <span className="nd-body-xs font-brand-mono font-medium text-white tracking-[1px] uppercase whitespace-nowrap">
      VISION BEHIND SDP
    </span>
  </div>
);

const VideoFrame = () => (
  <div className="relative w-full aspect-[525/297] flex items-center justify-center overflow-hidden">
    <img
      src={videoFrameSrc}
      alt="Vision behind SDP video thumbnail"
      className="absolute left-0 w-full max-w-none object-cover"
      style={{ height: "117.71%", top: "-0.11%" }}
    />
    <div className="absolute inset-0 bg-black/[0.32]" />
    <VideoTrigger
      platform="youtube"
      id="mIGoTSdkEww"
      title="Vision behind SDP"
      bgColorClass="!bg-black/70"
      className={
        "!w-14 !h-14 !bg-white/[0.08] hover:!bg-white/[0.12] border border-white/[0.20] hover:border-white/[0.28] backdrop-blur-[6px] group"
      }
      iconClassName="!w-4 !h-4 opacity-[0.64] group-hover:opacity-[1]"
    />
  </div>
);

export const Hero = (): React.ReactElement => {
  return (
    <section className="relative flex flex-col items-center w-full overflow-hidden bg-[#0C0C0E] transform-gpu">
      {/* Background — desktop (xl+) */}
      <div
        aria-hidden
        className="hidden xl:block absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none overflow-hidden"
        style={{ width: "2225px", height: "1096px" }}
      >
        <UnicornScene
          projectId="hero"
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
              "linear-gradient(to bottom, #0c0c0e 0%, rgba(12,12,14,0) 38.184%)",
          }}
        />
      </div>

      {/* Background — mobile/tablet (< xl) */}
      <div
        aria-hidden
        className="xl:hidden absolute inset-0 w-full h-full pointer-events-none"
      >
        <img
          src={bgMobileSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #0c0c0e 0%, rgba(12,12,14,0) 38.184%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-[1440px] xl:border-x xl:border-white/[0.08]">
        {/* Row 1: Hero text + video label */}
        <div className="relative flex flex-col xl:flex-row border-b border-white/[0.08] min-h-[471px] xl:h-auto">
          {/* Col 1: Heading, body, buttons */}
          <div className="flex flex-col gap-12 px-5 md:px-8 xl:px-12 py-10 md:py-20 border-r border-white/[0.08] flex-1">
            <div className="flex flex-col gap-6 xl:gap-8">
              <h1 className="nd-heading-2xl text-white">
                Solana for enterprise.
                <br />
                One API.
              </h1>
              <p className="nd-body-l text-white/[0.64] xl:w-[475px]">
                The institutional infrastructure for digital assets, built for
                compliant issuance, seamless payments, and efficient trading
                from a single platform on Solana.
              </p>
            </div>

            {/* Desktop buttons (xl size) */}
            <div className="hidden xl:flex items-start gap-2 flex-wrap">
              <Button size="xl" showRightIcon>
                Join waitlist
              </Button>
              <Button size="xl" variant="tertiary">
                Try demo
              </Button>
            </div>

            {/* Mobile/tablet buttons (m size) */}
            <div className="flex xl:hidden items-start gap-2">
              <Button size="m" showRightIcon>
                Join waitlist
              </Button>
              <Button size="m" variant="tertiary">
                Try demo
              </Button>
            </div>
          </div>

          {/* Col 2: Video label on desktop (side panel) */}
          <div className="hidden xl:flex relative w-[526px] px-12 py-20">
            <div className="absolute bottom-[-1px] left-0">
              <VideoLabel />
            </div>
          </div>

          {/* Video label on mobile/tablet — absolute at row bottom */}
          <div className="xl:hidden absolute bottom-[-1px] left-5 md:left-8">
            <VideoLabel />
          </div>
        </div>

        {/* Row 2: Video frame */}
        <div className="flex border-b border-white/[0.08]">
          {/* Spacer (desktop only) */}
          <div className="hidden xl:block flex-1 border-r border-white/[0.08]" />
          {/* Video */}
          <div className="w-full mb-[-1px] xl:w-[526px] xl:shrink-0">
            <VideoFrame />
          </div>
        </div>
      </div>
    </section>
  );
};
