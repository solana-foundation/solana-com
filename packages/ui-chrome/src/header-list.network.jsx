import { useTranslations } from "next-intl";
import { Link, InlineLink } from "./link";
import { HeaderItem } from "./header-item";
import ApiConnectionIcon from "./assets/nav/network/api-connection.inline.svg";
import BezierIcon from "./assets/nav/network/bezier.inline.svg";
import ExplorerIcon from "./assets/nav/network/explorer.inline.svg";
import PulseIcon from "./assets/nav/network/pulse.inline.svg";
import SolScanIcon from "./assets/nav/network/sol-scan.inline.svg";
import OrbIcon from "./assets/nav/network/orb.inline.svg";
import SolanaFmIcon from "./assets/nav/network/solana-fm.inline.svg";
import SwitchIcon from "./assets/nav/network/switch.inline.svg";

const HeaderListNetwork = () => {
  const t = useTranslations();
  const networkInspectItems = t.raw("nav.network.inspect.items");
  const networkResourcesItems = t.raw("nav.network.resources.items");

  return (
    <div className="xl:w-[800px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-2">
      <div className="px-3 xl:w-[390px]">
        <div className="py-2 font-brand-mono font-medium text-[rgba(255,255,255,0.64)] text-[12px] xl:text-[14px] tracking-[1px] uppercase">
          {t("nav.network.resources.title")}
        </div>
        <div className="divide-y divide-[rgba(238,228,255,0.04)]">
          <Link
            to="/validators"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={networkResourcesItems[0].title}
              description={networkResourcesItems[0].description}
              Icon={BezierIcon}
              variant="large"
            />
          </Link>
          <Link
            to="/rpc"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={networkResourcesItems[1].title}
              description={networkResourcesItems[1].description}
              Icon={ApiConnectionIcon}
              variant="large"
            />
          </Link>
          <InlineLink
            to="https://status.solana.com/"
            className="block no-underline text-inherit group/link"
          >
            <HeaderItem
              title={networkResourcesItems[2].title}
              description={networkResourcesItems[2].description}
              Icon={PulseIcon}
              variant="large"
            />
          </InlineLink>
          <Link
            to="/solanaramp"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={networkResourcesItems[3].title}
              description={networkResourcesItems[3].description}
              Icon={SwitchIcon}
              variant="large"
            />
          </Link>
        </div>
      </div>
      <div className="px-3 grow">
        <div className="py-2 font-brand-mono font-medium text-[rgba(255,255,255,0.64)] text-[12px] xl:text-[14px] tracking-[1px] uppercase">
          {t("nav.network.inspect.title")}
        </div>
        <div className="divide-y divide-[rgba(238,228,255,0.04)]">
          <InlineLink
            to="https://solscan.io/"
            className="block no-underline text-inherit group/link"
          >
            <HeaderItem
              title={networkInspectItems[0].title}
              Icon={SolScanIcon}
            />
          </InlineLink>
          <InlineLink
            to="https://solana.fm/"
            className="block no-underline text-inherit group/link"
          >
            <HeaderItem
              title={networkInspectItems[1].title}
              Icon={SolanaFmIcon}
            />
          </InlineLink>
          <InlineLink
            to="https://explorer.solana.com/"
            className="block no-underline text-inherit group/link"
          >
            <HeaderItem
              title={networkInspectItems[2].title}
              Icon={ExplorerIcon}
            />
          </InlineLink>
          <InlineLink
            to="https://orbmarkets.io/"
            className="block no-underline text-inherit group/link"
          >
            <HeaderItem
              title={networkInspectItems[3].title}
              Icon={OrbIcon}
            />
          </InlineLink>
        </div>
      </div>
    </div>
  );
};

export default HeaderListNetwork;
