import { getTranslations } from "@workspace/i18n/server";
import { links } from "@@/src/content/links";
import { HeroIntro } from "./HeroIntro";
import { container } from "./layout";

export async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "builder" });

  return (
    <section id="top" className="surface-a">
      <div className={`${container} py-10 md:py-[5.7vw] xl:py-[82px]`}>
        {/* The lock-up is the page's h1; HeroIntro draws and animates it. */}
        <h1 className="sr-only">{t("hero.title")}</h1>
        <HeroIntro
          registerHref={links.register}
          labels={{
            place: t("hero.place"),
            country: t("hero.country"),
            dateRange: t("hero.dateRange"),
            year: t("hero.year"),
            tagline: t("hero.tagline"),
            dates: t("hero.dates"),
            register: t("cta.register"),
            pending: t("cta.pending"),
            rebuild: t("hero.rebuild"),
          }}
        />
      </div>
    </section>
  );
}
