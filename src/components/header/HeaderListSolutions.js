import { useTranslation } from "next-i18next";
import { Link } from "../../utils/Link";
import SolutionsToolsSVG from "../../../assets/nav/solutions/solutions.inline.svg";
import SolutionsCasesSVG from "../../../assets/nav/solutions/cases.inline.svg";
import SolutionsResourcesSVG from "../../../assets/nav/solutions/resources.inline.svg";

const HeaderListSolutions = () => {
  const { t } = useTranslation("common");
  const solutionsToolsItems = t("nav.solutions.tools.items", {
    returnObjects: true,
  });
  const solutionsCasesItems = t("nav.solutions.cases.items", {
    returnObjects: true,
  });
  const solutionsResourcesItems = t("nav.solutions.resources.items", {
    returnObjects: true,
  });

  return (
    <>
      <div className="d-lg-flex">
        <div>
          <div className="text-uppercase py-2 d-flex align-items-center">
            <SolutionsToolsSVG className="me-3" />
            {t("nav.solutions.tools.title")}
          </div>
          <div>
            <Link
              to="/solutions/token-extensions"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsToolsItems[0].title}
              </strong>
            </Link>
            <Link
              to="/solutions/actions"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsToolsItems[9].title}
              </strong>
            </Link>
            <Link
              to="/wallets"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsToolsItems[10].title}
              </strong>
            </Link>
            <Link
              to="/solutions/solana-permissioned-environments"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsToolsItems[7].title}
              </strong>
            </Link>
            <Link
              to="/solutions/games-tooling"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsToolsItems[1].title}
              </strong>
            </Link>
            <Link
              to="/solutions/payments-tooling"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsToolsItems[2].title}
              </strong>
            </Link>
            <Link
              to="/solutions/commerce-tooling"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsToolsItems[3].title}
              </strong>
            </Link>
            <Link
              to="/solutions/financial-infrastructure"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsToolsItems[4].title}
              </strong>
            </Link>
            <Link
              to="/solutions/digital-assets"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsToolsItems[5].title}
              </strong>
            </Link>
            <Link
              to="/solutions/real-world-assets"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsToolsItems[8].title}
              </strong>
            </Link>
            <Link
              to="https://solanamobile.com/developers"
              className="nav-link nav-link--secondary"
              target="_blank"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsToolsItems[6].title}
              </strong>
            </Link>
          </div>
        </div>

        <div className="divider"></div>

        <div>
          <div className="text-uppercase py-2 d-flex align-items-center">
            <SolutionsCasesSVG className="me-3" />
            {t("nav.solutions.cases.title")}
          </div>
          <div>
            <Link
              to="/solutions/enterprise"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsCasesItems[1].title}
              </strong>
            </Link>
            <Link
              to="/solutions/gaming-and-entertainment"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsCasesItems[0].title}
              </strong>
            </Link>
            <Link
              to="/solutions/artists-creators"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsCasesItems[2].title}
              </strong>
            </Link>
            <Link
              to="/solutions/financial-institutions"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsCasesItems[3].title}
              </strong>
            </Link>
          </div>
        </div>
      </div>
      <div className="d-lg-flex nav-footer">
        <div className="w-lg-50">
          <div className="text-uppercase py-2 d-flex align-items-center">
            <SolutionsResourcesSVG className="me-3" />
            {t("nav.solutions.resources.title")}
          </div>
          <div>
            <Link
              to="/solutions"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsResourcesItems[0].title}
              </strong>
            </Link>
            <Link
              to="/ai"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsResourcesItems[1].title}
              </strong>
            </Link>
          </div>
        </div>

        <div className="divider d-none d-lg-block invisible"></div>

        <div className="w-lg-50">
          <div className="d-none d-lg-block text-uppercase py-2 d-flex align-items-center">
            &nbsp;
          </div>
          <div>
            <Link
              to="/developers/dao"
              className="nav-link nav-link--secondary"
              activeClassName="active"
            >
              <strong className="d-block text-white">
                {solutionsResourcesItems[2].title}
              </strong>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderListSolutions;
