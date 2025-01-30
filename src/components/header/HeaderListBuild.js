import { useTranslation } from "next-i18next";
import { Link } from "../../utils/Link";
import DevelopersSVG from "../../../assets/nav/build/developers.inline.svg";
import MoreSVG from "../../../assets/nav/build/cases.inline.svg";

const HeaderListBuild = () => {
  const { t } = useTranslation("common");

  return (
    <div className="d-lg-flex">
      <div>
        <div className="text-uppercase py-2 d-flex align-items-center">
          <DevelopersSVG className="me-3" />
          {t("nav.developers.items.title")}
        </div>
        <div>
          <Link
            to="/developers"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {t("nav.developers.items.hub.title")}
            </strong>
            {t("nav.developers.items.hub.description")}
          </Link>
          <Link
            to="/docs"
            className="nav-link nav-link--secondary"
            partiallyActive
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {t("nav.developers.items.docs.title")}
            </strong>
            {t("nav.developers.items.docs.description")}
          </Link>
          <Link
            to="/developers/courses"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {t("nav.developers.items.courses.title")}
            </strong>
            {t("nav.developers.items.courses.description")}
          </Link>
          <Link
            to="/developers/cookbook"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {t("nav.developers.items.cookbook.title")}
            </strong>
            {t("nav.developers.items.cookbook.description")}
          </Link>
          <Link
            to="/developers/resources"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {t("nav.developers.items.resources.title")}
            </strong>
            {t("nav.developers.items.resources.description")}
          </Link>
        </div>
      </div>

      <div className="divider"></div>

      <div>
        <div className="text-uppercase py-2 d-flex align-items-center">
          <MoreSVG className="me-3" />
          {t("nav.developers.tutorials.title")}
        </div>
        <div>
          <Link
            to="/developers/guides/getstarted/hello-world-in-your-browser"
            className="nav-link nav-link--secondary d-block text-white fw-bold"
            activeClassName="active"
          >
            {t("nav.developers.tutorials.hello-world")}
          </Link>
          <Link
            to="/docs/intro/installation"
            className="nav-link nav-link--secondary text-white d-block fw-bold"
            activeClassName="active font-weight-bold"
          >
            {t("nav.developers.tutorials.local-setup")}
          </Link>
          <Link
            to="/developers/evm-to-svm"
            className="nav-link nav-link--secondary text-white d-block fw-bold"
            activeClassName="active font-weight-bold"
          >
            {t("nav.developers.tutorials.evm-to-svm")}
          </Link>
          <Link
            to="/developers/guides"
            className="nav-link nav-link--secondary text-white d-block fw-bold"
            activeClassName="active font-weight-bold"
          >
            {t("nav.developers.tutorials.all-guides")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderListBuild;
