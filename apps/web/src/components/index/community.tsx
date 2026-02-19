import React from "react";
import { Container } from "@/component-library/container";
import { cn } from "@/app/components/utils";
import dynamic from "next/dynamic";
import Image from "next/image";

const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((mod) => mod.default),
  {
    ssr: false,
  },
);

const EarthAnimation = dynamic(
  () =>
    import("@/components/index/earth-animation").then(
      (mod) => mod.EarthAnimation,
    ),
  {
    ssr: false,
  },
);

export type CommunityProps = {
  title?: React.ReactNode;
  subtitle?: string;
  bgJsonFilePath?: string;
  bgImageSrc?: string;
  links?: {
    title: string;
    description?: string;
    href: string;
    Icon?: React.ComponentType<{
      className?: string;
      "aria-hidden"?: boolean;
    }>;
  }[];
};

export const Community: React.FC<CommunityProps> = ({
  title,
  subtitle,
  bgJsonFilePath,
  bgImageSrc,
  links = [],
}) => {
  return (
    <section className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left m-twd-0 px-2">
      <div className="max-w-[1828px] mx-auto rounded-xl overflow-hidden relative transform-gpu">
        {bgJsonFilePath && (
          <UnicornScene
            projectId="community"
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
        <Container className="pt-10 pb-[120px] flex flex-col justify-between">
          <EarthAnimation className="absolute bottom-0 left-[-20%] md:left-[-10%] xl:left-0 w-[140%] md:w-[120%] xl:w-full mix-blend-overlay" />
          <div className="absolute top-0 left-0 right-0 h-[80%] bg-gradient-to-b from-[#0B0A10] via-[#0B0A10] via-19% to-transparent pointer-events-none" />
          <div className="xl:flex xl:justify-between xl:items-center relative">
            {title && <h2 className="nd-heading-l xl:max-w-[50%]">{title}</h2>}
            {subtitle && (
              <p
                className={cn(
                  "nd-body-xl max-xl:mt-twd-3 xl:py-twd-3 xl:pl-twd-6 xl:max-w-[40%] relative ",
                  "xl:before:absolute xl:before:top-0 xl:before:left-0 xl:before:w-px xl:before:h-full xl:before:bg-gradient-to-b xl:before:from-[#D884F0] xl:before:to-[#44EBA6]",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 mt-twd-10 relative">
            {links?.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex max-md:flex-row md:flex-col items-start gap-twd-3 md:gap-twd-12 px-twd-4 py-twd-5 md:px-twd-6 md:py-twd-8 rounded-xl bg-nd-border-light hover:bg-nd-mid-em-text-alpha/20 backdrop-blur-[8px] text-inherit"
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="shrink-0 grow-0">
                  {item.Icon && (
                    <item.Icon className="block w-5 h-5 md:w-10 md:h-10" />
                  )}
                </div>
                <div className="">
                  <h4 className="font-medium nd-body-xl max-xl:!text-[16px]">
                    {item.title}
                  </h4>
                  <p className="nd-body-m text-nd-mid-em-text !mt-twd-1 max-xl:!text-[14px]">
                    {item.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
};
