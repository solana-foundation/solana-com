import { useTranslations } from "next-intl";
import { Link } from "./link";
import BreakpointLogo from "./assets/nav/community/breakpoint-logo.inline.svg";
import InvolvedSVG from "./assets/nav/community/involved.inline.svg";

const HeaderListCommunity = () => {
  const t = useTranslations();
  const communityInvolvedItems = t.raw("nav.community.involved.items");

  return (
    <div className="xl:flex">
      <div className="w-max">
        <div className="uppercase py-2 flex items-center !text-[#848895]">
          <InvolvedSVG className="me-3" />
          {t("nav.community.involved.title")}
        </div>
        <div>
          <Link
            to="/news"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            <strong className="block !text-white">
              {communityInvolvedItems[0].title}
            </strong>
            {communityInvolvedItems[0].description}
          </Link>
          <Link
            to="/events"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            <strong className="block !text-white">
              {communityInvolvedItems[1].title}
            </strong>
            {communityInvolvedItems[1].description}
          </Link>
          <Link
            to="https://www.solanacollective.com/"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
            target="_blank"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            <strong className="block !text-white">
              {communityInvolvedItems[2].title}
            </strong>
            {communityInvolvedItems[2].description}
          </Link>
          <Link
            to="/community"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            <strong className="block !text-white">
              {communityInvolvedItems[3].title}
            </strong>
            {communityInvolvedItems[3].description}
          </Link>
          <Link
            to="https://www.solanapolicyinstitute.org/"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
            target="_blank"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            <strong className="block !text-white">
              {communityInvolvedItems[4].title}
            </strong>
            {communityInvolvedItems[4].description}
          </Link>
        </div>
      </div>

      <div className="bg-white/10 w-px h-auto my-[-26px] mx-[40px]"></div>

      <div className="w-max">
        <div className="uppercase py-2">{t("nav.community.event.title")}</div>
        <div>
          <Link to="/breakpoint" className="!text-white !no-underline">
            <BreakpointLogo
              width={228}
              height={131}
              className="my-5 w-full md:w-auto"
            />

            <div className="!text-white" style={{ lineHeight: 1.2 }}>
              Dec. 11-13, 2025 - ABU DHABI
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderListCommunity;
