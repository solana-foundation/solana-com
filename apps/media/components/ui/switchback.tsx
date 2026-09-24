import React from "react";
import { ArrowOutUpRightSquare } from "@boxicons/react/ArrowOutUpRightSquare";
import { Button } from "@/components/ui/button";

interface SwitchbackProps {
  title: string;
  image?: {
    src: string;
    alt: string;
  };
  eyebrow?: string;
  body: React.ReactNode;
  buttons?: {
    label: string;
    url: string;
  }[];
  actions?: React.ReactNode;
}

const Switchback: React.FC<SwitchbackProps> = ({
  title,
  image,
  eyebrow,
  body,
  buttons,
  actions,
}) => {
  const hasImage = image?.src;
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(236,228,253,0.08)]">
          {/* Subtle gradient wash */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_80%_30%,rgba(82,158,255,0.05),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[#0D0C11]/40" />

          <div
            className={`relative flex flex-col gap-8 p-6 md:p-10 ${
              hasImage ? "lg:flex-row lg:items-center lg:gap-12" : "lg:flex-col"
            }`}
          >
            {hasImage && (
              <div className="w-full shrink-0 lg:w-[45%]">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
              </div>
            )}

            <div className={hasImage ? "flex-1" : "w-full"}>
              {eyebrow && (
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-[#CA9FF5]">
                  {eyebrow}
                </p>
              )}
              <h2 className="mb-4 text-2xl font-medium leading-[1.15] tracking-[-0.015em] text-white md:text-3xl">
                {title}
              </h2>
              <div className="prose prose-sm max-w-2xl prose-p:text-[#ABABBA] prose-p:leading-7 prose-headings:text-white prose-strong:text-white prose-a:text-[#55E9AB] prose-a:no-underline hover:prose-a:underline">
                {body}
              </div>
              {buttons && buttons.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {buttons.map((button, index) => (
                    <Button
                      key={`${button.label}-${button.url}-${index}`}
                      asChild
                      size="lg"
                      className={
                        index === 0
                          ? "rounded-full bg-white px-6 text-sm font-medium text-black hover:bg-white/90"
                          : "rounded-full border-[rgba(236,228,253,0.12)] bg-transparent px-6 text-sm font-medium text-white hover:border-[rgba(236,228,253,0.32)] hover:bg-white/5 hover:text-white"
                      }
                      variant={index === 0 ? "default" : "outline"}
                    >
                      <a
                        href={button.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {button.label}
                        <ArrowOutUpRightSquare className="ml-1 size-4" />
                      </a>
                    </Button>
                  ))}
                </div>
              )}
              {actions && (
                <div className="mt-6 flex flex-wrap gap-3">{actions}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Switchback;
