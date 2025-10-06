import { useTranslations } from "next-intl";

export function CopyrightRow() {
  const t = useTranslations();
  return (
    <span className="text-base">
      {t("footer.copyright", { currentYear: new Date().getFullYear() })}
    </span>
  );
}
