import styles from "./DevelopersNav.module.scss";
import Link from "@/utils/Link";
import DocsIcon from "@@/public/src/img/developers/docs.inline.svg";
import RpcApiIcon from "@@/public/src/img/developers/api.inline.svg";
import CookbookIcon from "@@/public/src/img/developers/cookbook.inline.svg";
import GuidesIcon from "@@/public/src/img/developers/guides.inline.svg";
import TerminologyIcon from "@@/public/src/img/developers/terminology.inline.svg";
import CoursesIcon from "@@/public/src/img/developers/courses.inline.svg";
import StackExchangeIcon from "@@/assets/developers/stackexchange.inline.svg";
import { useTranslation } from "next-i18next";

export default function DevelopersNav({ containerClassName }) {
  const { t } = useTranslation();

  return (
    <div className={styles["developers-nav"]}>
      <div className={`container-xl ${containerClassName}`}>
        <div className="py-2">
          <nav>
            <Link
              partiallyActive
              to="/docs"
              partiallyActiveIgnore={["/docs/rpc", "/docs/terminology"]}
              activeClassName="active"
            >
              <DocsIcon height="16" width="16" className="me-2" />
              <span className="align-middle">
                {t("developers.nav.documentation")}
              </span>
            </Link>
            <Link
              partiallyActive
              to="/developers/courses"
              activeClassName="active"
            >
              <CoursesIcon height="16" width="16" className="me-2" />
              <span className="align-middle">
                {t("developers.nav.courses")}
              </span>
            </Link>
            <Link
              partiallyActive
              to="/developers/guides"
              activeClassName="active"
            >
              <GuidesIcon height="16" width="16" className="me-2" />
              <span className="align-middle">{t("developers.nav.guides")}</span>
            </Link>
            <Link
              partiallyActive
              to="/developers/cookbook"
              activeClassName="active"
            >
              <CookbookIcon height="16" width="16" className="me-2" />
              <span className="align-middle">
                {t("developers.nav.cookbook")}
              </span>
            </Link>
            <Link to="/docs/terminology" activeClassName="active">
              <TerminologyIcon height="16" width="16" className="me-2" />
              <span className="align-middle">
                {t("developers.nav.terminology")}
              </span>
            </Link>
            <Link partiallyActive to="/docs/rpc" activeClassName="active">
              <RpcApiIcon height="16" width="16" className="me-2" />
              <span className="align-middle">{t("developers.nav.rpc")}</span>
            </Link>
            <Link
              href="https://solana.stackexchange.com/"
              target="_blank"
              activeClassName="active"
            >
              <StackExchangeIcon
                height="16"
                width="16"
                className="me-2"
                fill="currentColor"
              />
              <span className="align-middle">Stack Exchange</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
