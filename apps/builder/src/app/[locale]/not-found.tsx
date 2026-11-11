"use client";

import { Link } from "@workspace/i18n/routing";
import { useTranslations } from "@workspace/i18n/client";

export default function NotFound() {
  const t = useTranslations("builder.notFound");

  return (
    <main className="surface-a flex min-h-screen flex-col items-start justify-center gap-6 px-5 md:px-8 xl:px-[49px]">
      <h1 className="text-[56px] font-bold leading-[0.9] tracking-[-0.045em] md:text-[96px]">
        {t("title")}
      </h1>
      <p className="text-[22px] leading-none tracking-[-0.03em] text-ink/65">
        {t("description")}
      </p>
      <Link
        href="/builder"
        className="inline-flex h-12 items-center bg-bldr-purple px-5 text-[16px] leading-none tracking-[-0.5px] text-surface"
      >
        {t("backToHome")}
      </Link>
    </main>
  );
}
