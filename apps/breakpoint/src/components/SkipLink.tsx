"use client";

import { useTranslations } from "@workspace/i18n/client";

type SkipLinkProps = {
  label?: string;
  targetId: string;
};

export default function SkipLink({ label, targetId }: SkipLinkProps) {
  const t = useTranslations("breakpoint.accessibility");

  return (
    <a
      href={`#${targetId}`}
      className="type-button sr-only absolute left-5 top-5 z-50 focus:not-sr-only focus:bg-white focus:px-4 focus:py-2 focus:text-black"
    >
      {label ?? t("skipToContent")}
    </a>
  );
}
