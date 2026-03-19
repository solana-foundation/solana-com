import React from "react";
import { ArrowUpRight, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SwitchbackReportCta } from "./switchback-report-cta";

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
  isReport?: boolean;
  hubspotForm?: {
    buttonLabel: string;
    portalId: string;
    formId: string;
  };
  pdfUrl?: string;
  headline?: string;
  description?: string;
}

const Switchback: React.FC<SwitchbackProps> = ({
  title,
  image,
  eyebrow,
  body,
  buttons,
  isReport,
  hubspotForm,
  pdfUrl,
  headline,
  description,
}) => {
  const hasImage = image?.src;
  const displayTitle = headline || title;

  if (isReport) {
    return (
      <section className="py-14 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
          {/* Report promotion card */}
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(236,228,253,0.10)]">
            {/* Gradient background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_10%_20%,rgba(153,69,255,0.08),transparent_60%),radial-gradient(ellipse_70%_60%_at_90%_80%,rgba(20,241,149,0.05),transparent_50%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[#0D0C11]/60" />

            <div className="relative flex flex-col gap-8 p-6 md:p-10 lg:flex-row lg:items-center lg:gap-14">
              {/* Report cover image */}
              {hasImage && (
                <div className="w-full shrink-0 lg:w-[260px] xl:w-[300px]">
                  <div className="relative mx-auto aspect-[4/5] w-[220px] overflow-hidden rounded-xl border border-[rgba(236,228,253,0.08)] shadow-[0_8px_40px_rgba(153,69,255,0.12)] transition-transform duration-500 hover:scale-[1.02] sm:w-[240px] lg:mx-0 lg:w-full">
                    <img
                      src={image.src}
                      alt={image.alt || displayTitle}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Text + CTA */}
              <div className="flex flex-1 flex-col gap-5">
                {/* Eyebrow + badge */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(202,159,245,0.2)] bg-[rgba(202,159,245,0.06)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#CA9FF5]">
                    <FileText className="size-3" />
                    Report
                  </span>
                  {eyebrow && (
                    <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#ABABBA]">
                      {eyebrow}
                    </span>
                  )}
                </div>

                {/* Headline */}
                <h2 className="max-w-xl text-2xl font-medium leading-[1.15] tracking-[-0.015em] text-white md:text-3xl lg:text-[2rem]">
                  {displayTitle}
                </h2>

                {/* Description or body */}
                {description ? (
                  <p className="max-w-lg text-[15px] leading-7 text-[#ABABBA]">
                    {description}
                  </p>
                ) : (
                  <div className="prose prose-sm max-w-lg prose-p:text-[#ABABBA] prose-p:leading-7 prose-headings:text-white prose-strong:text-white prose-a:text-[#55E9AB] prose-a:no-underline hover:prose-a:underline">
                    {body}
                  </div>
                )}

                {/* CTA buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {hubspotForm && (
                    <SwitchbackReportCta
                      buttonLabel={hubspotForm.buttonLabel}
                      portalId={hubspotForm.portalId}
                      formId={hubspotForm.formId}
                      title={displayTitle}
                    />
                  )}

                  {pdfUrl && (
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-white px-6 text-sm font-medium text-black hover:bg-white/90"
                    >
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="size-4" />
                        Download Report
                      </a>
                    </Button>
                  )}

                  {buttons &&
                    buttons.length > 0 &&
                    buttons.map((button) => (
                      <Button
                        key={`${button.label}-${button.url}`}
                        asChild
                        variant="outline"
                        size="lg"
                        className="rounded-full border-[rgba(236,228,253,0.12)] bg-transparent px-6 text-sm font-medium text-white hover:border-[rgba(236,228,253,0.32)] hover:bg-white/5 hover:text-white"
                      >
                        <a
                          href={button.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {button.label}
                          <ArrowUpRight className="size-4" />
                        </a>
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Normal switchback mode
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
                        <ArrowUpRight className="ml-1 size-4" />
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Switchback;
