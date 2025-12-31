import { useTranslations } from "next-intl";
import { Link } from "./link";
import { HeaderItem } from "./header-item";
import { HeaderBanner } from "./header-banner";
import NewspaperIcon from "./assets/nav/community/newspaper.inline.svg";
import CalendarIcon from "./assets/nav/community/calendar.inline.svg";
import FistbumpIcon from "./assets/nav/community/fistbump.inline.svg";
import GlobusIcon from "./assets/nav/community/globus.inline.svg";
import ScriptIcon from "./assets/nav/community/script.inline.svg";
import BreakpointLogo from "./assets/nav/community/breakpoint-logo.inline.svg";
import ApiConnectionIcon from "./assets/nav/community/api-connection.inline.svg";

export const HeaderListCommunity = () => {
  const t = useTranslations();
  const communityInvolvedItems = t.raw("nav.community.involved.items");

  return (
    <div className="xl:w-[800px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-2">
      <div className="px-3 grow">
        <div className="py-2 font-brand-mono font-medium text-[rgba(255,255,255,0.64)] text-[12px] xl:text-[14px] tracking-[1px] uppercase">
          {t("nav.community.involved.title")}
        </div>
        <div className="divide-y divide-[rgba(238,228,255,0.04)]">
          <Link
            to="/news"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
            partiallyActive
          >
            <HeaderItem
              title={communityInvolvedItems[0].title}
              // description={communityInvolvedItems[0].description}
              Icon={NewspaperIcon}
              // variant="large"
            />
          </Link>
          <Link
            to="/podcasts"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
            partiallyActive
          >
            <HeaderItem
              title={communityInvolvedItems[1].title}
              // description={communityInvolvedItems[1].description}
              Icon={ApiConnectionIcon}
              // variant="large"
            />
          </Link>
          <Link
            to="/events"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
            partiallyActive
          >
            <HeaderItem
              title={communityInvolvedItems[2].title}
              // description={communityInvolvedItems[2].description}
              Icon={CalendarIcon}
              // variant="large"
            />
          </Link>
          <Link
            to="/community"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
            partiallyActive
          >
            <HeaderItem
              title={communityInvolvedItems[4].title}
              // description={communityInvolvedItems[4].description}
              Icon={GlobusIcon}
              // variant="large"
            />
          </Link>
          <Link
            to="https://www.solanacollective.com/"
            className="block no-underline text-inherit group/link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HeaderItem
              title={communityInvolvedItems[3].title}
              description={communityInvolvedItems[3].description}
              Icon={FistbumpIcon}
              variant="large"
            />
          </Link>
          <Link
            to="https://www.solanapolicyinstitute.org/"
            className="block no-underline text-inherit group/link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HeaderItem
              title={communityInvolvedItems[5].title}
              description={communityInvolvedItems[5].description}
              Icon={ScriptIcon}
              variant="large"
            />
          </Link>
        </div>
      </div>

      <HeaderBanner
        className="w-[350px] max-w-full"
        logo={<BreakpointLogo width={158} height={64} />}
        cta={t("nav.community.event.cta")}
        ctaHref="/breakpoint/registration"
        location={t("nav.community.event.location")}
        date={t("nav.community.event.date")}
      />
    </div>
  );
};
