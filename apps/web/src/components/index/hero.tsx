import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/app/components/utils";
import { Container } from "@/component-library/container";
import dynamic from "next/dynamic";

const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((mod) => mod.default),
  {
    ssr: false,
  },
);

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
  bannerExpiryDate?: string; // ISO date string (e.g., "2026-02-10")
  cta?: string;
  // onCtaClick?: () => void;
  bgJsonFilePath?: string;
  bgImageSrc?: string;
  getStartedTitle?: string;
  getStartedTabs?: {
    id: string;
    title: string;
    Icon?: React.ComponentType<{
      className?: string;
      "aria-hidden"?: boolean;
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
  bannerExpiryDate,
  cta,
  // onCtaClick,
  bgJsonFilePath,
  bgImageSrc,
  getStartedTitle,
  getStartedTabs,
  getStartedLinks,
}) => {
  const [open, setOpen] = useState(false);

  // Check if banner should be shown based on expiry date
  const shouldShowBanner = React.useMemo(() => {
    if (!bannerHref || !bannerLabel) return false;
    if (!bannerExpiryDate) return true; // Show if no expiry date set

    const expiryDate = new Date(bannerExpiryDate);
    const today = new Date();
    // Set time to start of day for comparison
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    return today <= expiryDate;
  }, [bannerHref, bannerLabel, bannerExpiryDate]);

  return (
    <>
      <section
        id="hero"
        className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left border-b border-nd-border-light m-0"
        aria-labelledby="hero-title"
      >
        {bgJsonFilePath && (
          <UnicornScene
            projectId="hero"
            className="!absolute inset-0 z-0"
            jsonFilePath={bgJsonFilePath}
            width="100%"
            height="101%"
            scale={1}
            dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
            fps={30}
            lazyLoad={true}
            production={true}
            onError={(error) => console.error("UnicornScene error:", error)}
            placeholder={
              bgImageSrc ? (
                <Image
                  className="!absolute inset-0 z-0"
                  src={bgImageSrc}
                  alt="Hero background"
                  fill
                  sizes="150vw"
                  priority
                  style={{
                    objectFit: "cover",
                  }}
                />
              ) : undefined
            }
            showPlaceholderOnError
            showPlaceholderWhileLoading
          />
        )}
        <div className="flex min-h-[700px]">
          <Container className="flex flex-col justify-between relative pt-12 xl:pt-[165px] md:pb-8 xl:pb-10 min-h-[calc(100vh-70px)]">
            <div className="max-w-5xl">
              <h1 className="nd-heading-2xl" id="hero-title">
                {title}
              </h1>
              <p className="text-nd-mid-em-text font-medium max-md:mt-5 md:mt-6 nd-body-xl xl:max-w-[440px]">
                {subtitle}
              </p>

              {cta && (
                <div className="mt-[52px]">
                  <Button
                    className="rounded-full md:h-[48px] nd-body-m !px-5 py-3 bg-nd-cta text-nd-inverse hover:!bg-nd-primary/90 tracking-[-0.16px] md:tracking-[-0.18px]"
                    size="lg"
                    aria-label={cta}
                    onClick={() => setOpen(true)}
                  >
                    {cta}
                    <span className="-mr-3 p-1 !size-8 bg-nd-inverse text-nd-cta rounded-full inline-flex items-center justify-center">
                      <ArrowRightIcon
                        aria-hidden={true}
                        className="!size-[16px] block"
                        strokeWidth={3}
                      />
                    </span>
                  </Button>
                </div>
              )}
            </div>

            {shouldShowBanner && (
              <div className="mt-[52px] -mx-5 md:mx-0">
                <div className="overflow-hidden w-full md:w-[504px]">
                  <div className="w-full flex flex-row items-stretch p-2 bg-[#DFCDF5] text-nd-inverse md:rounded-xl bg-blend-screen">
                    {bannerImgSrc && (
                      <div className="grow-0 shrink-0 mr-3 md:mr-5 pb-10 md:pb-0">
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
                    <div className="grow flex flex-col justify-between md:py-1.5 xl:py-2 md:pr-2">
                      <div className="max-md:py-1 max-md:pr-1">
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
                      <div className="mt-2 md:mt-3">
                        <Button
                          className={cn(
                            "rounded-full font-normal nd-body-s tracking-[-0.1em] !px-4 py-[6px] h-8 bg-nd-inverse text-nd-primary hover:!bg-nd-inverse/90",
                            bannerImgSrc
                              ? "ml-[-86px] md:ml-0 w-[calc(100%+86px)] md:w-auto"
                              : "w-full md:w-auto",
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
