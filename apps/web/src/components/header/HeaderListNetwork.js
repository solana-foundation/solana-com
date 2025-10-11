import { useTranslations } from "next-intl";
import Link, { InlineLink } from "../../utils/Link";
import ResourcesSVG from "../../../assets/nav/network/resources.inline.svg";
import InspectSVG from "../../../assets/nav/network/inspect.inline.svg";

const HeaderListNetwork = () => {
  const t = useTranslations();
  const networkInspectItems = t.raw("nav.network.inspect.items");
  const networkResourcesItems = t.raw("nav.network.resources.items");

  return (
    <div className="xl:flex">
      <div>
        <div className="text-uppercase py-2 d-flex align-items-center">
          <ResourcesSVG className="me-3" />
          {t("nav.network.resources.title")}
        </div>
        <div>
          <Link
            to="/validators"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {networkResourcesItems[0].title}
            </strong>
            {networkResourcesItems[0].description}
          </Link>
          <Link
            to="/rpc"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {networkResourcesItems[1].title}
            </strong>
            {networkResourcesItems[1].description}
          </Link>
          <InlineLink
            to="https://status.solana.com/"
            className="nav-link nav-link--secondary"
          >
            <strong className="d-block text-white">
              {networkResourcesItems[2].title}
            </strong>
            {networkResourcesItems[2].description}
          </InlineLink>
          <Link
            to="/solanaramp"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {networkResourcesItems[3].title}
            </strong>
            {networkResourcesItems[3].description}
          </Link>
        </div>
      </div>

      <div className="divider"></div>

      <div>
        <div className="text-uppercase py-2 d-flex align-items-center">
          <InspectSVG className="me-3" />
          {t("nav.network.inspect.title")}
        </div>
        <div>
          <InlineLink
            to="https://solscan.io/"
            className="nav-link nav-link--secondary"
          >
            <strong className="d-block text-white">
              {networkInspectItems[0].title}
            </strong>
            {networkInspectItems[0].description}
          </InlineLink>
          <InlineLink
            to="https://solana.fm/"
            className="nav-link nav-link--secondary"
          >
            <strong className="d-block text-white">
              {networkInspectItems[1].title}
            </strong>
            {networkInspectItems[1].description}
          </InlineLink>
          <InlineLink
            to="https://explorer.solana.com/"
            className="nav-link nav-link--secondary"
          >
            <strong className="d-block text-white">
              {networkInspectItems[2].title}
            </strong>
            {networkInspectItems[2].description}
          </InlineLink>
        </div>
      </div>
    </div>
  );
};

export default HeaderListNetwork;
