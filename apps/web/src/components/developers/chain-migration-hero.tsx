"use client";

import dynamic from "next/dynamic";

const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((mod) => mod.default),
  { ssr: false },
);

type HeroButton = {
  label: string;
  url: string;
  hierarchy: "primary" | "outline";
};

export function ChainMigrationHero({
  eyebrow,
  headline,
  body,
  buttons = [],
  showScene = false,
}: {
  eyebrow?: string;
  headline: string;
  body?: string;
  buttons?: HeroButton[];
  showScene?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-black border-b border-white/10">
      {showScene && (
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
      )}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-8 xl:px-10 py-16 md:py-24 xl:py-32 w-full">
        <div className="flex flex-col gap-4 max-w-3xl">
          {eyebrow && (
            <p className="text-xs font-medium text-sky-300/80 uppercase tracking-widest mb-0">
              {eyebrow}
            </p>
          )}
          <h1 className="text-[32px] md:text-[48px] xl:text-[64px] font-brand font-medium text-white leading-[1.1] tracking-[-1.28px] md:tracking-[-1.92px] xl:tracking-[-2.56px] mb-0">
            {headline}
          </h1>
          {body && (
            <div
              className="text-[#ABABBA] text-base md:text-lg text-pretty leading-[1.6] mb-0 [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          )}
          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {buttons.map((btn, i) => (
                <a
                  key={i}
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
