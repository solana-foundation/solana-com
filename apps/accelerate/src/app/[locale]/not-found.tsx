"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("accelerate.notFound");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white">
      <h1 className="text-6xl font-bold mb-4">{t("title")}</h1>
      <p className="text-xl text-white/70 mb-8">{t("description")}</p>
      <Link
        href="/"
        className="rounded-full bg-[#14F195] px-6 py-3 text-black font-medium hover:opacity-90 transition-opacity"
      >
        {t("backToHome")}
      </Link>
    </div>
  );
}
