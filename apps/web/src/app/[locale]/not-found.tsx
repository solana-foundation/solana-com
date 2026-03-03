"use client";

import { useTranslations } from "next-intl";
import { Link } from "@workspace/i18n/routing";
import { NotFoundPage } from "@workspace/ui/not-found-page";

export default function NotFound() {
  const t = useTranslations();
  return (
    <NotFoundPage
      title={t("404.title")}
      subtitle={t("404.copy")}
      ctaLabel={t("404.button")}
      renderLink={({ href, children, className }) => (
        <Link href={href} className={className}>
          {children}
        </Link>
      )}
    />
  );
}
