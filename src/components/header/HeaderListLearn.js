import { useTranslation } from "next-i18next";
import { Link } from "../../utils/Link";
import StartSVG from "../../../assets/nav/learn/start.inline.svg";

const HeaderListLearn = () => {
  const { t } = useTranslation("common");

  return (
    <div className="d-lg-flex">
      <div>
        <div className="text-uppercase py-2 d-flex align-items-center">
          <StartSVG className="me-3" />
          {t("nav.learn.start.title")}
        </div>
        <div>
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
            to="/learn/sending-and-receiving-sol"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {t("learn.tutorials.items.sending-and-receiving-sol.title")}
            </strong>
            {t("nav.learn.start.items.transactions.description")}
          </Link>
          <Link
            to="/learn/understanding-solana-transaction-fees"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {t(
                "learn.tutorials.items.understanding-solana-transaction-fees.title",
              )}
            </strong>
            {t("nav.learn.start.items.fees.description")}
          </Link>
          <Link
            to="/learn#tutorials"
            className="nav-link nav-link--secondary"
            activeClassName="active"
          >
            <strong className="d-block text-white">
              {t("nav.learn.start.items.all.title")}
            </strong>
            {t("nav.learn.start.items.all.description")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderListLearn;
