import { useTranslations } from "next-intl";
import { Link } from "./link";
import { HeaderItem } from "./header-item";
import { HeaderBanner } from "./header-banner";
import WalletIcon from "./assets/nav/learn/wallet.inline.svg";
import DocumentsIcon from "./assets/nav/learn/documents.inline.svg";
import EducationIcon from "./assets/nav/learn/education.inline.svg";
import TradingViewIcon from "./assets/nav/learn/trading-view.inline.svg";

const HeaderListLearn = () => {
  const t = useTranslations();

  return (
    <div className="xl:w-[800px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-2">
      <HeaderBanner
        className="w-[400px] max-w-full"
        title={t("nav.learn.start.items.what-is-solana.title")}
        description={t("nav.learn.start.items.what-is-solana.description")}
        cta={t("nav.learn.start.items.what-is-solana.cta")}
        ctaHref="/learn/what-is-solana"
      />
      <div className="px-3 grow">
        <div className="py-2 font-brand-mono font-medium text-[rgba(255,255,255,0.64)] text-[12px] xl:text-[14px] tracking-[1px] uppercase">
          {t("nav.learn.start.title")}
        </div>
        <div className="divide-y divide-[rgba(238,228,255,0.04)]">
          <Link
            to="/learn/what-is-a-wallet"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={t("nav.learn.start.items.wallet.title")}
              description={t("nav.learn.start.items.wallet.description")}
              Icon={WalletIcon}
              variant="large"
            />
          </Link>
          <Link
            to="/learn/introduction-to-defi-on-solana"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={t("nav.learn.start.items.defi.title")}
              description={t("nav.learn.start.items.defi.description")}
              Icon={TradingViewIcon}
              variant="large"
            />
          </Link>
          <Link
            to="/universities"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={t("nav.learn.start.items.universities.title")}
              description={t("nav.learn.start.items.universities.description")}
              Icon={EducationIcon}
              variant="large"
            />
          </Link>
          <Link
            to="/learn"
            className="block no-underline text-inherit group/link"
            activeClassName="active"
          >
            <HeaderItem
              title={t("nav.learn.start.items.all.title")}
              description={t("nav.learn.start.items.all.description")}
              Icon={DocumentsIcon}
              variant="large"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderListLearn;
