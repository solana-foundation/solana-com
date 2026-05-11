import { useTranslations } from "next-intl";
import { HeaderBanner } from "./header-banner";
import BreakpointLogo from "./assets/nav/community/bp26-footer-logo-mobile.inline.svg";
import { NavItemsList, SectionHeading } from "./nav-section-renderers";
import { communityInvolvedItems } from "./nav-section-content-config";

/** Hide the community event banner after this date (ISO date string, exclusive). */
const COMMUNITY_EVENT_EXPIRY = "2026-11-18";

export const HeaderListCommunity = () => {
  const t = useTranslations();
  const communityEvent = t.raw("nav.community.event");
  const isEventActive =
    communityEvent && new Date() < new Date(COMMUNITY_EVENT_EXPIRY);

  return (
    <div className="xl:w-[800px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-2">
      <div className="px-3 grow">
        <SectionHeading title={t("nav.community.involved.title")} />
        <NavItemsList items={communityInvolvedItems} />
      </div>

      {isEventActive && (
        <HeaderBanner
          className="w-[350px] max-w-full"
          logo={<BreakpointLogo width={220} height={32} />}
          title={communityEvent?.title}
          description={communityEvent?.description}
          cta={communityEvent?.cta}
          ctaHref="/breakpoint"
          location={communityEvent?.location}
          date={communityEvent?.date}
        />
      )}
    </div>
  );
};
