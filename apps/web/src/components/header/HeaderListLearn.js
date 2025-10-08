import { useTranslations } from "next-intl";
import Link from "@/components/shared/Link";
import StartSVG from "../../../assets/nav/learn/start.inline.svg";

const HeaderListLearn = () => {
  const t = useTranslations();

  return (
    <div>
      <div className="text-uppercase py-2 d-flex align-items-center">
        <StartSVG className="me-3" />
        {t("nav.learn.start.title")}
      </div>
      <div>
        <Link
          to="/learn"
          className="nav-link nav-link--secondary"
          activeClassName="active"
        >
          <strong className="d-block text-white">
            {t("nav.learn.start.items.all.title")}
          </strong>
          {t("nav.learn.start.items.all.description")}
        </Link>
        <Link
          to="/learn/what-is-solana"
          className="nav-link nav-link--secondary"
          activeClassName="active"
        >
          <strong className="d-block text-white">
            {t("learn.tutorials.items.what-is-solana.title")}
          </strong>
          {t("nav.learn.start.items.what-is-solana.description")}
        </Link>
        <Link
          to="/learn/what-is-a-wallet"
          className="nav-link nav-link--secondary"
          activeClassName="active"
        >
          <strong className="d-block text-white">
            {t("learn.tutorials.items.what-is-a-wallet.title")}
          </strong>
          {t("nav.learn.start.items.wallet.description")}
        </Link>
        <Link
          to="/learn/introduction-to-defi-on-solana"
          className="nav-link nav-link--secondary"
          activeClassName="active"
        >
          <strong className="d-block text-white">
            {t("learn.tutorials.items.introduction-to-defi-on-solana.title")}
          </strong>
          {t("nav.learn.start.items.defi.description")}
        </Link>
        <Link
          to="/universities"
          className="nav-link nav-link--secondary"
          activeClassName="active"
        >
          <strong className="d-block text-white">
            {t("nav.learn.start.items.universities.title")}
          </strong>
          {t("nav.learn.start.items.universities.description")}
        </Link>
      </div>
    </div>
  );
};

export default HeaderListLearn;
