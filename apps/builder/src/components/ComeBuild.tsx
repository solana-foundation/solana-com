import { getTranslations } from "@workspace/i18n/server";
import { links } from "@@/src/content/links";
import { CtaLink } from "./CtaLink";
import { container } from "./layout";
import { TurnHeading } from "./motion";
import { SlashField } from "./SlashField";

export async function ComeBuild({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "builder" });

  return (
    <>
      <SlashField label={t("comeBuild.pattern")} />

      {/* White in both palettes; only the callout bar changes. */}
      <section id="register" className="surface-white">
        <div
          className={`${container} pb-16 pt-16 md:pb-24 md:pt-28 xl:pb-[129px] xl:pt-[154px]`}
        >
          <TurnHeading
            label={t("comeBuild.heading")}
            stagger={0.07}
            lines={[
              { text: t("comeBuild.headingLines.one") },
              {
                text: t("comeBuild.headingLines.two"),
                tile: "#000000",
                className: "text-bldr-purple",
              },
            ]}
            className="text-[clamp(48px,16vw,300px)] [perspective:1400px] min-[1200px]:text-[240px]"
          />

          <div className="mt-8 flex flex-col gap-6 border border-[rgb(var(--bldr-cta-bar))] bg-[rgb(var(--bldr-cta-bar))] p-6 text-[rgb(var(--bldr-cta-bar-fg))] md:mt-10 md:min-h-[150px] md:flex-row md:items-center md:justify-between md:px-10 xl:mt-[39px]">
            <p className="text-[22px] leading-none tracking-[-0.03em] md:text-[28px]">
              {t("comeBuild.line1")}
              <br />
              {t("comeBuild.line2")}
            </p>
            <CtaLink
              href={links.register}
              pendingLabel={t("cta.pending")}
              className="h-[60px] bg-[rgb(var(--bldr-cta-button))] [--btn-cut-size:24px] px-4 text-[16px] leading-none min-[375px]:text-[18px] sm:px-8 tracking-[-0.03em] text-white md:mr-8 md:h-[72px] md:px-[38px] md:text-[20px]"
              hoverClassName="hover:bg-white hover:text-black"
            >
              {t("cta.registerEpoch")}
            </CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
