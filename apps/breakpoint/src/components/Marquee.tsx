"use client";

import React from "react";
import { useTranslations } from "next-intl";

function TickerContent({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  return (
    <>
      <span className="text-white/32">{text}</span>
      <span className="px-4 text-purple">{highlight}</span>
    </>
  );
}

export default function Marquee() {
  const t = useTranslations("breakpoint.marquee");

  return (
    <div className="w-full overflow-hidden border-y border-white/10 bg-black">
      <div className="flex h-[82px] whitespace-nowrap">
        <span className="inline-flex min-w-max animate-ticker items-center font-mono text-[0.9375rem] uppercase tracking-[0.08em]">
          <TickerContent text={t("text")} highlight={t("highlight")} />
        </span>
        <span className="inline-flex min-w-max animate-ticker items-center pl-4 font-mono text-[0.9375rem] uppercase tracking-[0.08em]">
          <TickerContent text={t("suffix")} highlight={t("highlight")} />
        </span>
      </div>
    </div>
  );
}
