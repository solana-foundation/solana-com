import React from "react";

interface SectionHeadlineProps {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  alignment?: "center" | "left";
  children?: React.ReactNode;
}

export default function SectionHeadline({
  eyebrow,
  headline,
  subhead,
  alignment = "left",
  children,
}: SectionHeadlineProps) {
  const alignmentClasses =
    alignment === "center"
      ? "items-center text-center"
      : "items-start text-left";

  return (
    <div className={`flex flex-col gap-s ${alignmentClasses}`}>
      {eyebrow && (
        <span className="font-mono text-base uppercase tracking-[1.28px] text-white">
          {eyebrow}
        </span>
      )}
      <h2 className="font-sans text-[32px] leading-[1.15] tracking-[-0.96px] text-white md:text-[48px]">
        {headline}
      </h2>
      {subhead && (
        <p className="font-sans text-[24px] leading-[1.25] tracking-[-1.28px] text-white md:text-[32px]">
          {subhead}
        </p>
      )}
      {children}
    </div>
  );
}
