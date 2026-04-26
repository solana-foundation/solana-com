import React from "react";
import WordReveal from "@/components/WordReveal";

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
        <WordReveal
          as="span"
          text={eyebrow}
          stepMs={60}
          className="font-mono text-base uppercase tracking-[1.28px] text-white"
        />
      )}
      <WordReveal
        as="h2"
        text={headline}
        stepMs={90}
        className="font-sans text-[32px] leading-[1.15] tracking-[-0.96px] text-white md:text-[48px]"
      />
      {subhead && (
        <WordReveal
          as="p"
          text={subhead}
          stepMs={60}
          className="font-sans text-[24px] leading-[1.25] tracking-[-1.28px] text-white md:text-[32px]"
        />
      )}
      {children}
    </div>
  );
}
