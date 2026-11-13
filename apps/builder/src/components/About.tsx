import { getTranslations } from "@workspace/i18n/server";
import { links } from "@@/src/content/links";
import { CtaLink } from "./CtaLink";
import { container } from "./layout";
import { Build, TurnHeading } from "./motion";

const STATS = ["days", "attendees", "campus", "stages"] as const;

export async function About({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "builder.about" });
  const tCta = await getTranslations({ locale, namespace: "builder.cta" });

  return (
    <section id="about" className="surface-b">
      <div
        className={`${container} pb-16 pt-16 md:pb-24 md:pt-28 xl:pb-[116px] xl:pt-[149px]`}
      >
        <TurnHeading
          label={t("heading")}
          lines={[
            { text: t("headingLines.one") },
            { text: t("headingLines.two") },
            { text: t("headingLines.three") },
          ]}
          className="text-[clamp(30px,9.2vw,152px)] min-[1200px]:text-[128px]"
        />

        <div className="mt-12 grid gap-3 md:mt-20 lg:grid-cols-2 xl:mt-[81px]">
          <Build
            outline="faint"
            className="flex min-h-[180px] p-6 md:min-h-[230px] md:p-8"
          >
            <p className="max-w-[540px] text-[22px] leading-none tracking-[-0.03em] md:text-[28px]">
              {t("intro")}
            </p>
          </Build>
          <Build
            delay={0.12}
            fill="bg-bldr-purple"
            className="chamfer flex min-h-[180px] p-6 text-black [--chamfer:48px] md:min-h-[230px] md:p-8 md:[--chamfer:72px]"
          >
            <div className="max-w-[540px] space-y-[1em] text-[20px] leading-[1.05] tracking-[-0.03em] md:text-[24px]">
              <p>{t("body.one")}</p>
              <p>{t("body.two")}</p>
            </div>
          </Build>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {STATS.map((key, i) => (
            <Build
              key={key}
              delay={0.1 + i * 0.06}
              fill="bg-ink"
              className="chamfer flex min-h-[130px] p-4 text-surface [--chamfer:20px] sm:min-h-[150px] sm:p-6 sm:[--chamfer:32px] md:min-h-[190px] md:p-7"
              contentClassName="justify-end gap-[9px]"
            >
              <dt className="order-2 text-[12px] uppercase leading-none text-surface/65">
                {t(`stats.${key}.label`)}
              </dt>
              <dd className="order-1 text-[22px] font-bold leading-none tracking-[-0.03em] sm:text-[32px] md:text-[40px]">
                {t(`stats.${key}.value`)}
              </dd>
            </Build>
          ))}
        </dl>

        <div className="mt-8 md:mt-10">
          <CtaLink
            href={links.register}
            pendingLabel={tCta("pending")}
            className="h-12 bg-bldr-purple px-[22px] text-[16px] leading-none tracking-[-0.03em] text-surface"
            hoverClassName="hover:bg-[rgb(var(--bldr-btn-hover))]"
          >
            {tCta("register")}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
