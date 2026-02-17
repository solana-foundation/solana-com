import { useTranslations } from "next-intl";
import { Link } from "./link";
import { HeaderItem } from "./header-item";
import NewspaperIcon from "./assets/nav/build/newspaper.inline.svg";
import ApiConnectionIcon from "./assets/nav/build/api-connection.inline.svg";
import TemplatesIcon from "./assets/nav/build/templates.inline.svg";
import EthereumIcon from "./assets/nav/build/ethereum.inline.svg";
import SchoolIcon from "./assets/nav/build/school.inline.svg";
import HandIcon from "./assets/nav/build/hand.inline.svg";
import MaintenanceIcon from "./assets/nav/build/maintenance.inline.svg";

const HeaderListBuild = () => {
  const t = useTranslations();

  return (
    <div className="xl:w-[800px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-2">
      <div className="xl:w-[480px] px-3">
        <div className="py-2 font-brand-mono font-medium text-[rgba(255,255,255,0.64)] text-[12px] xl:text-[14px] tracking-[1px] uppercase">
          {t("nav.developers.items.title")}
        </div>
        <div className="divide-y divide-[rgba(238,228,255,0.04)]">
          <Link
            to="/docs"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={t("nav.developers.items.docs.title")}
              description={t("nav.developers.items.docs.description")}
              Icon={NewspaperIcon}
              variant="large"
            />
          </Link>
          <Link
            to="/docs/rpc"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={t("nav.developers.items.api.title")}
              description={t("nav.developers.items.api.description")}
              Icon={ApiConnectionIcon}
              variant="large"
            />
          </Link>
          <Link
            to="/developers/templates"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={t("nav.developers.items.templates.title")}
              description={t("nav.developers.items.templates.description")}
              Icon={TemplatesIcon}
              variant="large"
            />
          </Link>
          <Link
            to="/developers"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={t("nav.developers.items.hub.title")}
              description={t("nav.developers.items.hub.description")}
              Icon={SchoolIcon}
              variant="large"
            />
          </Link>
          <Link
            to="/developers/learn"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={t("developers.nav.courses")}
              description={t("developers.courses.description")}
              Icon={SchoolIcon}
              variant="large"
            />
          </Link>
        </div>
      </div>
      <div className="px-3 grow">
        <div className="py-2 font-brand-mono font-medium text-[rgba(255,255,255,0.64)] text-[12px] xl:text-[14px] tracking-[1px] uppercase">
          {t("nav.developers.tutorials.title")}
        </div>
        <div className="divide-y divide-[rgba(238,228,255,0.04)]">
          <Link
            to="/docs/intro/quick-start"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={t("nav.developers.tutorials.hello-world")}
              Icon={HandIcon}
            />
          </Link>
          <Link
            to="/docs/intro/installation"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={t("nav.developers.tutorials.local-setup")}
              Icon={MaintenanceIcon}
            />
          </Link>
          <Link
            to="/developers/evm-to-svm"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={t("nav.developers.tutorials.evm-to-svm")}
              Icon={EthereumIcon}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderListBuild;
