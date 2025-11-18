import React, { useCallback, useState } from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/app/components/utils";
import { Container } from "@/component-library/container";
import { useViewportVisibility } from "@/hooks/useViewportVisibility";
import dynamic from "next/dynamic";

const GetStarted = dynamic(
  () => import("./get-started").then((mod) => mod.GetStarted),
  { ssr: false },
);

export type HeroProps = {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  bannerEyebrow?: string;
  bannerDescription?: string;
  bannerImgSrc?: string;
  bannerHref?: string;
  bannerLabel?: string;
  cta?: string;
  // onCtaClick?: () => void;
  bgVideoSrc?: string;
  bgVideoPoster?: string;
  getStartedTitle?: string;
  getStartedTabs?: {
    id: string;
    title: string;
    Icon?: React.ComponentType<{
      className?: string;
      "aria-hidden"?: boolean | "true" | "false";
    }>;
  }[];
  getStartedLinks?: Record<
    string,
    {
      title: string;
      href: string;
    }[]
  >;
};

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  bannerEyebrow,
  bannerDescription,
  bannerImgSrc,
  bannerHref,
  bannerLabel,
  cta,
  // onCtaClick,
  bgVideoSrc,
  bgVideoPoster,
  getStartedTitle,
  getStartedTabs,
  getStartedLinks,
}) => {
  const handler = useCallback((node: HTMLVideoElement | null) => {
    if (!node) return;
    if (node.paused) {
      node.play();
    }
  }, []);
  const { ref } = useViewportVisibility<HTMLVideoElement>(handler, {
    topOffset: 100,
    bottomOffset: 100,
  });
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        id="hero"
        className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left border-b border-nd-border-light m-twd-0"
        aria-labelledby="hero-title"
      >
        {bgVideoSrc && (
          <video
            src={bgVideoSrc}
            preload="none"
            autoPlay={false}
            loop
            muted
            playsInline
            controls={false}
            poster={bgVideoPoster}
            className="absolute inset-0 w-full h-full object-cover"
            ref={ref}
          />
        )}
        <div className="flex min-h-[700px]">
          <Container className="flex flex-col justify-between relative pt-twd-12 xl:pt-[165px] md:pb-twd-8 xl:pb-twd-10 min-h-[calc(100vh-70px)]">
            <div className="max-w-5xl">
              <h1 className="nd-heading-2xl" id="hero-title">
                {title}
              </h1>
              <p className="text-nd-mid-em-text font-medium max-md:mt-twd-5 md:mt-twd-6 nd-body-xl xl:max-w-[440px]">
                {subtitle}
              </p>

              {cta && (
                <div className="mt-[52px]">
                  <Button
                    className="rounded-full nd-body-m !px-twd-5 py-twd-3 bg-nd-cta text-nd-inverse hover:!bg-nd-primary/90 tracking-[-0.16px] md:tracking-[-0.18px]"
                    size="lg"
                    aria-label={cta}
                    onClick={() => setOpen(true)}
                  >
                    {cta}
                    <ArrowRightIcon
                      aria-hidden={true}
                      className="-mr-twd-2 p-twd-1 !size-6 bg-nd-inverse text-nd-cta rounded-full"
                      strokeWidth={3}
                    />
                  </Button>
                </div>
              )}
            </div>

            {bannerHref && bannerLabel && (
              <div className="mt-[52px] -mx-twd-5 md:mx-twd-0">
                <div className="overflow-hidden w-full md:w-[504px]">
                  <div className="w-full flex flex-row items-stretch p-twd-2 bg-[#DFCDF5] text-nd-inverse md:rounded-xl bg-blend-screen">
                    {bannerImgSrc && (
                      <div className="grow-0 shrink-0 mr-twd-3 md:mr-twd-5 pb-twd-10 md:pb-twd-0">
                        <Image
                          src={bannerImgSrc}
                          alt=""
                          width={153}
                          height={153}
                          className="!h-auto w-[74px] md:w-[153px] rounded-lg md:rounded-sm aspect-square"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                    <div className="grow flex flex-col justify-between gap-twd-3 xl:gap-twd-4">
                      <div>
                        {bannerEyebrow && (
                          <p className="font-medium nd-body-l">
                            {bannerEyebrow}
                          </p>
                        )}
                        {bannerDescription && (
                          <p className="nd-body-s opacity-[0.64]">
                            {bannerDescription}
                          </p>
                        )}
                      </div>
                      <div className="mt-twd-2">
                        <Button
                          className={cn(
                            "rounded-full font-normal nd-body-s tracking-[-0.1em] !px-twd-4 py-[6px] h-8 bg-nd-inverse text-nd-primary hover:!bg-nd-inverse/90",
                            bannerImgSrc
                              ? "ml-[-86px] md:ml-twd-0 w-[calc(100%+86px)] md:w-auto"
                              : "w-full md:w-twd-auto",
                          )}
                          size="lg"
                          asChild
                        >
                          <a
                            href={bannerHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={bannerLabel}
                          >
                            {bannerLabel}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Container>
        </div>
      </section>
      <GetStarted
        open={open}
        onClose={() => setOpen(false)}
        title={getStartedTitle}
        tabs={getStartedTabs}
        links={getStartedLinks}
      />
    </>
  );
};
