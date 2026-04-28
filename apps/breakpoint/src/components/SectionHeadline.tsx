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
          className="type-eyebrow text-white"
        />
      )}
      <WordReveal
        as="h2"
        text={headline}
        stepMs={90}
        className="type-h3 text-white"
      />
      {subhead && (
        <WordReveal
          as="p"
          text={subhead}
          stepMs={60}
          className="type-h5 text-white"
        />
      )}
      {children}
    </div>
  );
}
