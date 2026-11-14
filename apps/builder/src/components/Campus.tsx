import { getTranslations } from "@workspace/i18n/server";
import { container, label } from "./layout";
import { Build, TurnHeading } from "./motion";

const VENUES = [
  {
    key: "midway",
    tags: ["mainStage", "workshops", "officeHours"],
    className: "chamfer text-surface",
    fill: "bg-ink",
  },
  {
    key: "street",
    tags: ["showcases"],
    className: "text-ink",
    dashed: true,
  },
  {
    key: "garage",
    tags: ["liveCoding", "startupDemos"],
    className: "chamfer text-black",
    fill: "bg-bldr-purple",
  },
] as const;

const DETAILS = ["dates", "guests"] as const;

/** Dashed outline with the same cut corner as the filled cards. */
function DashedChamferOutline() {
  return (
    <span className="absolute inset-0">
      <span className="chamfer absolute inset-0 border border-dashed border-ink/60" />
      <span className="absolute bottom-0 right-0 size-[var(--chamfer)]">
        <span className="absolute bottom-0 left-0 w-[141.42%] origin-bottom-left -rotate-45 border-t border-dashed border-ink/60" />
      </span>
    </span>
  );
}

export async function Campus({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "builder.campus" });

  return (
    <section id="campus" className="surface-a">
      <div
        className={`${container} pb-16 pt-16 md:pb-24 md:pt-28 xl:pb-[144px] xl:pt-[149px]`}
      >
        <TurnHeading
          label={t("heading")}
          lines={[{ text: t("heading") }]}
          className="text-[clamp(44px,8vw,128px)] min-[1200px]:text-[120px]"
        />

        <ul className="mt-10 grid gap-3 md:mt-16 lg:grid-cols-3 xl:mt-[72px]">
          {VENUES.map((venue, i) => (
            <Build
              as="li"
              key={venue.key}
              delay={i * 0.12}
              fill={"fill" in venue ? venue.fill : undefined}
              outline={"dashed" in venue ? <DashedChamferOutline /> : "solid"}
              className={`flex min-h-[220px] p-6 [--chamfer:56px] md:min-h-[300px] md:p-8 ${venue.className}`}
            >
              <h3 className="text-[36px] font-bold leading-none tracking-[-0.03em] md:text-[44px]">
                {t(`venues.${venue.key}.name`)}
              </h3>
              <p className="mt-2 max-w-[320px] text-[20px] leading-none tracking-[-0.025em] md:text-[24px]">
                {t(`venues.${venue.key}.description`)}
              </p>
              <ul className={`mt-auto space-y-[7px] pt-8 ${label}`}>
                {venue.tags.map((tag) => (
                  <li key={tag}>{t(`venues.${venue.key}.tags.${tag}`)}</li>
                ))}
              </ul>
            </Build>
          ))}
        </ul>

        <dl className="mt-10 grid gap-3 md:mt-16 lg:grid-cols-2 lg:gap-10 xl:mt-[72px]">
          {DETAILS.map((key) => (
            <div
              key={key}
              className="grid min-h-[55px] grid-cols-[96px_1fr] items-center border border-ink/20 px-6 py-3 md:grid-cols-[164px_1fr] md:px-8"
            >
              <dt className={`${label} text-ink/60`}>
                {t(`details.${key}.label`)}
              </dt>
              <dd className="text-[20px] leading-none tracking-[-0.025em] md:text-[24px]">
                {t(`details.${key}.value`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
