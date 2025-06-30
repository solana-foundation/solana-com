import { useTranslation } from "next-i18next";
import Link from "../../utils/Link";
import BreakpointLogo from "../../../assets/nav/community/breakpoint-logo.inline.svg";
import InvolvedSVG from "../../../assets/nav/community/involved.inline.svg";

const HeaderListCommunity = () => {
  const { t } = useTranslation("common");
  const communityInvolvedItems = t("nav.community.involved.items", {
    returnObjects: true,
  });

  return (
    <div className="d-lg-flex">
      <div>
        <div className="text-uppercase py-2 d-flex align-items-center">
          <InvolvedSVG className="me-3" />
          {t("nav.community.involved.title")}
        </div>
        <div>
          <Link
            to="/news"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {communityInvolvedItems[0].title}
            </strong>
            {communityInvolvedItems[0].description}
          </Link>
          <Link
            to="/events"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {communityInvolvedItems[1].title}
            </strong>
            {communityInvolvedItems[1].description}
          </Link>
          <Link
            to="https://www.solanacollective.com/"
            className="nav-link nav-link--secondary"
            target="_blank"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {communityInvolvedItems[2].title}
            </strong>
            {communityInvolvedItems[2].description}
          </Link>
          <Link
            to="/community"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {communityInvolvedItems[3].title}
            </strong>
            {communityInvolvedItems[3].description}
          </Link>
        </div>
      </div>

      <div className="divider"></div>

      <div>
        <div className="text-uppercase py-2">
          {t("nav.community.event.title")}
        </div>
        <div>
          <Link to="/breakpoint" className="text-white">
            <BreakpointLogo
              width={228}
              height={131}
              className="my-5 w-100 w-md-auto"
            />

            <div className="text-white" style={{ lineHeight: 1.2 }}>
              Dec. 11-13, 2025 - ABU DHABI
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderListCommunity;
