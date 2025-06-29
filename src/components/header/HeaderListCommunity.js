import { useTranslation } from "next-i18next";
import Link from "../../utils/Link";
import BreakpointLogo from "../../../assets/nav/community/breakpoint-logo.inline.svg";
import InvolvedSVG from "../../../assets/nav/community/involved.inline.svg";
import Dropdown from "react-bootstrap/Dropdown";

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
          <Dropdown.Item
            as={Link}
            to="/news"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {communityInvolvedItems[0].title}
            </strong>
            {communityInvolvedItems[0].description}
          </Dropdown.Item>
          <Dropdown.Item
            as={Link}
            to="/events"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {communityInvolvedItems[1].title}
            </strong>
            {communityInvolvedItems[1].description}
          </Dropdown.Item>
          <Dropdown.Item
            as={Link}
            to="https://www.solanacollective.com/"
            className="nav-link nav-link--secondary"
            target="_blank"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {communityInvolvedItems[2].title}
            </strong>
            {communityInvolvedItems[2].description}
          </Dropdown.Item>
          <Dropdown.Item
            as={Link}
            to="/community"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {communityInvolvedItems[3].title}
            </strong>
            {communityInvolvedItems[3].description}
          </Dropdown.Item>
        </div>
      </div>

      <div className="divider"></div>

      <div>
        <div className="text-uppercase py-2">
          {t("nav.community.event.title")}
        </div>
        <div>
          <Dropdown.Item as={Link} to="/breakpoint" className="text-white">
            <BreakpointLogo
              width={228}
              height={131}
              className="my-5 w-100 w-md-auto"
            />

            <div className="text-white" style={{ lineHeight: 1.2 }}>
              Dec. 11-13, 2025 - ABU DHABI
            </div>
          </Dropdown.Item>
        </div>
      </div>
    </div>
  );
};

export default HeaderListCommunity;
