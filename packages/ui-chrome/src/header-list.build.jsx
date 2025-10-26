import { useTranslations } from "next-intl";
import { Link } from "./link";
import DevelopersSVG from "./assets/nav/build/developers.inline.svg";
import MoreSVG from "./assets/nav/build/cases.inline.svg";

const HeaderListBuild = () => {
  const t = useTranslations();

  return (
    <div className="xl:flex">
      <div className="w-max">
        <div className="uppercase py-2 flex items-center !text-[#848895]">
          <DevelopersSVG className="me-3" />
          {t("nav.developers.items.title")}
        </div>
        <div>
          <Link
            to="/docs"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            <strong className="block !text-white">
              {t("nav.developers.items.docs.title")}
            </strong>
            {t("nav.developers.items.docs.description")}
          </Link>
          <Link
            to="/docs/rpc"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            <strong className="block !text-white">
              {t("nav.developers.items.api.title")}
            </strong>
            {t("nav.developers.items.api.description")}
          </Link>
          <Link
            to="/developers/cookbook"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            <strong className="block !text-white">
              {t("nav.developers.items.cookbook.title")}
            </strong>
            {t("nav.developers.items.cookbook.description")}
          </Link>
          <Link
            to="/developers"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            <strong className="block text-white">
              {t("nav.developers.items.hub.title")}
            </strong>
            {t("nav.developers.items.hub.description")}
          </Link>
        </div>
      </div>

      <div className="bg-white/10 w-px h-auto my-[-26px] mx-[40px]"></div>

      <div className="w-max">
        <div className="uppercase py-2 flex items-center !text-[#848895]">
          <MoreSVG className="me-3" />
          {t("nav.developers.tutorials.title")}
        </div>
        <div>
          <Link
            to="/docs/intro/quick-start"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-white font-bold hover:!border-white/30 transition-colors !no-underline"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            {t("nav.developers.tutorials.hello-world")}
          </Link>
          <Link
            to="/docs/intro/installation"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-white font-bold hover:!border-white/30 transition-colors !no-underline"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            {t("nav.developers.tutorials.local-setup")}
          </Link>
          <Link
            to="/developers/evm-to-svm"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-white font-bold hover:!border-white/30 transition-colors !no-underline"
            activeClassName="!border-white/10 bg-[#151118]"
          >
            {t("nav.developers.tutorials.evm-to-svm")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderListBuild;
