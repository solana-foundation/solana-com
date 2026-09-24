import React from "react";

export function AppHero({
  children,
  subtitle,
  title,
}: {
  children?: React.ReactNode;
  subtitle?: React.ReactNode;
  title?: React.ReactNode;
}) {
  const hasVisual = Boolean(children);

  return (
    <section className="relative mx-auto w-full max-w-[1440px] border-b border-white/[0.08] xl:border-x">
      <div
        className={
          hasVisual
            ? "grid min-h-[430px] xl:grid-cols-[minmax(0,1fr)_480px] xl:min-h-[560px]"
            : "min-h-[360px]"
        }
      >
        <div className="relative z-10 flex flex-col justify-end px-5 py-14 md:px-8 md:py-20 xl:px-12 xl:py-24">
          <div className="max-w-[860px]">
            {typeof title === "string" ? (
              <h1 className="nd-heading-2xl text-nd-high-em-text">{title}</h1>
            ) : (
              title
            )}
            {typeof subtitle === "string" ? (
              <p className="mt-5 max-w-[720px] nd-body-l text-nd-mid-em-text md:mt-6">
                {subtitle}
              </p>
            ) : (
              subtitle
            )}
          </div>
        </div>

        {hasVisual ? (
          <div className="relative hidden overflow-hidden border-l border-white/[0.08] xl:block">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
