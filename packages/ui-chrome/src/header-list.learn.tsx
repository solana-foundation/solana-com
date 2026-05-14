import { useTranslations } from "next-intl";
import { HeaderBanner } from "./header-banner";
import { NavItemsList, SectionHeading } from "./nav-section-renderers";
import { learnPrimaryItems } from "./nav-section-content-config";

const HeaderListLearn = () => {
  const t = useTranslations();

  return (
    <div className="xl:w-[840px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-2">
      <HeaderBanner
        className="w-[400px] max-w-full"
        title={t("nav.learn.start.items.what-is-solana.title")}
        description={t("nav.learn.start.items.what-is-solana.description")}
        cta={t("nav.learn.start.items.what-is-solana.cta")}
        ctaHref="/learn/what-is-solana"
      />
      <div className="px-3 grow">
        <SectionHeading title={t("nav.learn.start.title")} />
        <NavItemsList items={learnPrimaryItems} />
      </div>
    </div>
  );
};

export default HeaderListLearn;
