import { useTranslations } from "next-intl";
import { Link, InlineLink } from "./link";
import ResourcesSVG from "./assets/nav/network/resources.inline.svg";
import InspectSVG from "./assets/nav/network/inspect.inline.svg";

const HeaderListNetwork = () => {
  const t = useTranslations();
  const networkInspectItems = t.raw("nav.network.inspect.items");
  const networkResourcesItems = t.raw("nav.network.resources.items");

  return (
    <div className="xl:flex">
      <div className="w-full xl:w-max">
        <div className="uppercase py-2 flex items-center !text-[#848895] text-xs">
          <ResourcesSVG className="me-3" />
          {t("nav.network.resources.title")}
        </div>
        <div>
          <Link
            to="/validators"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            <strong className="block !text-white text-sm">
              {networkResourcesItems[0].title}
            </strong>
            {networkResourcesItems[0].description}
          </Link>
          <Link
            to="/rpc"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            <strong className="block !text-white text-sm">
              {networkResourcesItems[1].title}
            </strong>
            {networkResourcesItems[1].description}
          </Link>
          <InlineLink
            to="https://status.solana.com/"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
          >
            <strong className="block !text-white text-sm">
              {networkResourcesItems[2].title}
            </strong>
            {networkResourcesItems[2].description}
          </InlineLink>
          <Link
            to="/solanaramp"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            <strong className="block !text-white text-sm">
              {networkResourcesItems[3].title}
            </strong>
            {networkResourcesItems[3].description}
          </Link>
        </div>
      </div>

      <div className="bg-white/10 w-px h-auto my-[-26px] mx-[40px] hidden xl:block"></div>

      <div className="w-full xl:w-max">
        <div className="uppercase py-2 flex items-center !text-[#848895] text-xs">
          <InspectSVG className="me-3" />
          {t("nav.network.inspect.title")}
        </div>
        <div>
          <InlineLink
            to="https://solscan.io/"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
          >
            <strong className="block !text-white text-sm">
              {networkInspectItems[0].title}
            </strong>
            {networkInspectItems[0].description}
          </InlineLink>
          <InlineLink
            to="https://solana.fm/"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
          >
            <strong className="block !text-white text-sm">
              {networkInspectItems[1].title}
            </strong>
            {networkInspectItems[1].description}
          </InlineLink>
          <InlineLink
            to="https://explorer.solana.com/"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
          >
            <strong className="block !text-white text-sm">
              {networkInspectItems[2].title}
            </strong>
            {networkInspectItems[2].description}
          </InlineLink>
          <InlineLink
            to="https://orb.helius.dev/"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
          >
            <strong className="block !text-white text-sm">
              {networkInspectItems[3].title}
            </strong>
            {networkInspectItems[3].description}
          </InlineLink>
        </div>
      </div>
    </div>
  );
};

export default HeaderListNetwork;
