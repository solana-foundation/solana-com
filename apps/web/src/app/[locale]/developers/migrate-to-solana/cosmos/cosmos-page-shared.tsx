"use client";

import dynamic from "next/dynamic";

const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((mod) => mod.default),
  { ssr: false },
);

export type HeroButton = {
  label: string;
  url: string;
  hierarchy: "primary" | "outline";
};

export function AnimatedHeroSection({
  eyebrow,
  headline,
  body,
  buttons,
  showScene = true,
  compact = false,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  buttons: HeroButton[];
  showScene?: boolean;
  compact?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-black border-b border-white/10">
      {showScene ? (
        <UnicornScene
          className="!absolute inset-0 z-0"
          jsonFilePath="/src/img/solutions/icm/hero-bg.json"
          width="100%"
          height="100%"
          scale={1}
          dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
          fps={30}
          lazyLoad={true}
          production={true}
        />
      ) : null}

      <div
        className={[
          "relative z-10 max-w-[1440px] mx-auto px-5 md:px-8 xl:px-10 w-full",
          compact
            ? "pt-10 pb-12 md:pt-12 md:pb-14 xl:pt-14 xl:pb-16"
            : "py-16 md:py-28 xl:py-40",
        ].join(" ")}
      >
        <div
          className={[
            "flex flex-col gap-6",
            compact ? "max-w-2xl" : "max-w-3xl",
          ].join(" ")}
        >
          {eyebrow && (
            <p className="text-xs font-medium text-sky-300/80 uppercase tracking-widest mb-0">
              {eyebrow}
            </p>
          )}
          <h1
            className={[
              "font-brand font-medium text-white leading-[1.1] mb-0",
              compact
                ? "text-[40px] md:text-[50px] xl:text-[62px] tracking-[-1.6px] md:tracking-[-2px] xl:tracking-[-2.48px]"
                : "text-[40px] md:text-[56px] xl:text-[88px] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px]",
            ].join(" ")}
          >
            {headline}
          </h1>
          <div
            className={[
              "text-[#ABABBA] text-pretty leading-[1.33] mb-0 [&_p]:m-0",
              compact
                ? "text-lg md:text-xl tracking-[-0.36px] md:tracking-[-0.4px]"
                : "text-lg md:text-2xl tracking-[-0.36px] md:tracking-[-0.48px]",
            ].join(" ")}
            dangerouslySetInnerHTML={{ __html: body }}
          />
          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {buttons.map((btn, index) => (
                <a
                  key={index}
                  href={btn.url}
                  className={[
                    "inline-flex items-center px-6 py-3 rounded-full text-sm font-brand font-semibold no-underline transition-opacity hover:opacity-90",
                    btn.hierarchy === "primary"
                      ? "tw-bg-nd-cta tw-text-nd-on-cta-high-em-text"
                      : "border border-white/30 text-white bg-transparent",
                  ].join(" ")}
                >
                  {btn.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function SectionDivider() {
  return (
    <div className="tw-max-w-screen-xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-my-12">
      <div className="tw-border-t tw-border-white/10" />
    </div>
  );
}
