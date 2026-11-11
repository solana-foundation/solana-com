import { getTranslations } from "@workspace/i18n/server";
import { links } from "@@/src/content/links";
import { CtaLink } from "./CtaLink";
import { container, label } from "./layout";
import { Build, TurnHeading } from "./motion";

/**
 * Not in the Figma file: built from the design's own parts (accent surface,
 * cut-corner card, outlined card) for the launch "Get involved" requirement.
 */
export async function GetInvolved({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "builder" });

  return (
    <section id="get-involved" className="surface-accent">
      <div
        className={`${container} pb-16 pt-16 md:pb-24 md:pt-24 xl:pb-[116px] xl:pt-[116px]`}
      >
        <TurnHeading
          label={t("getInvolved.heading")}
          lines={[{ text: t("getInvolved.heading"), tile: "#000000" }]}
          className="text-[clamp(44px,8vw,128px)] min-[1200px]:text-[120px]"
        />

        <div className="mt-10 grid gap-3 md:mt-16 lg:grid-cols-2 xl:mt-[72px]">
          <Build
            as="article"
            fill="bg-ink"
            className="chamfer flex min-h-[260px] p-6 text-white [--chamfer:56px] md:min-h-[300px] md:p-8"
          >
            <p className={`${label} text-white/65`}>
              {t("getInvolved.speak.eyebrow")}
            </p>
            <h3 className="mt-6 text-[36px] font-bold leading-none tracking-[-0.03em] md:text-[44px]">
              {t("getInvolved.speak.title")}
            </h3>
            <p className="mt-2 max-w-[460px] text-[20px] leading-[1.05] tracking-[-0.025em] md:text-[24px]">
              {t("getInvolved.speak.body")}
            </p>
            <div className="mt-auto pt-8">
              <CtaLink
                href={links.speakerInterest}
                pendingLabel={t("cta.pending")}
                className="h-12 bg-bldr-purple px-5 text-[16px] leading-none tracking-[-0.5px] text-black"
              >
                {t("getInvolved.speak.cta")}
              </CtaLink>
            </div>
          </Build>

          <Build
            as="article"
            delay={0.12}
            className="flex min-h-[260px] p-6 md:min-h-[300px] md:p-8"
          >
            <p className={`${label} text-ink/65`}>
              {t("getInvolved.sponsor.eyebrow")}
            </p>
            <h3 className="mt-6 text-[36px] font-bold leading-none tracking-[-0.03em] md:text-[44px]">
              {t("getInvolved.sponsor.title")}
            </h3>
            <p className="mt-2 max-w-[460px] text-[20px] leading-[1.05] tracking-[-0.025em] md:text-[24px]">
              {t("getInvolved.sponsor.body")}
            </p>
            <div className="mt-auto pt-8">
              <CtaLink
                href={links.sponsorship}
                pendingLabel={t("cta.pending")}
                className="h-12 bg-ink px-5 text-[16px] leading-none tracking-[-0.5px] text-white"
              >
                {t("getInvolved.sponsor.cta")}
              </CtaLink>
            </div>
          </Build>
        </div>
      </div>
    </section>
  );
}
