import { useTranslation } from "next-i18next";
import Link from "../shared/Link";

const Footer = () => {
  const { t } = useTranslation("common");

  return (
    <div className="container mt-10 mb-n10 pb-10">
      <div className="text-center text-uppercase">
        <Link to="/breakpoint/code-of-conduct">
          <small>{t("breakpoint.footer.link.code-of-conduct")}</small>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
