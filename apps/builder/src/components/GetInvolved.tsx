import { getTranslations } from "@workspace/i18n/server";
import { links } from "@@/src/content/links";
import { CtaLink } from "./CtaLink";
import { container } from "./layout";
import { Build, TurnHeading } from "./motion";

/**
 * Not in the Figma file: built from the design's own parts (accent surface,
 * cut-corner card). One black sponsorship card, which keeps its colours in
 * either palette, as the accent surface does.
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
          className="text-[length:clamp(32px,min(12.8vw,max(44px,8vw)),128px)] min-[1200px]:text-[120px]"
        />

        <Build
          as="article"
          fill="bg-black"
          className="chamfer mt-10 flex min-h-[220px] p-6 text-white [--chamfer:56px] md:mt-16 md:min-h-[260px] md:p-8 xl:mt-[72px]"
        >
          <h3 className="text-[36px] font-bold leading-none tracking-[-0.03em] md:text-[44px]">
            {t("getInvolved.sponsor.title")}
          </h3>
          <p className="mt-2 max-w-[460px] text-[20px] leading-[1.05] tracking-[-0.025em] md:text-[24px]">
            {t("getInvolved.sponsor.body")}
          </p>
          <div className="mt-auto pt-8">
            <CtaLink
              href={links.sponsorship}
              pendingLabel={t("cta.pending")}
              className="h-12 bg-bldr-purple px-5 text-[16px] leading-none tracking-[-0.5px] text-black"
              hoverClassName="hover:bg-white"
            >
              {t("getInvolved.sponsor.cta")}
            </CtaLink>
          </div>
        </Build>
      </div>
    </section>
  );
}
