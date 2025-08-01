import styles from "./DevelopersNav.module.scss";
import Link from "@/utils/Link";
import DocsIcon from "@@/public/src/img/developers/docs.inline.svg";
import RpcApiIcon from "@@/public/src/img/developers/api.inline.svg";
import CookbookIcon from "@@/public/src/img/developers/cookbook.inline.svg";
import StackExchangeIcon from "@@/assets/developers/stackexchange.inline.svg";
import { useTranslations } from "next-intl";

export default function DevelopersNav({ containerClassName }) {
  const t = useTranslations();

  return (
    <div className={styles["developers-nav"]}>
      <div className={`container-xl ${containerClassName}`}>
        <div className="py-2">
          <nav>
            <Link
              partiallyActive
              to="/docs"
              partiallyActiveIgnore={["/docs/rpc"]}
              activeClassName="active"
            >
              <DocsIcon height="16" width="16" className="me-2" />
              <span className="align-middle">
                {t("developers.nav.documentation")}
              </span>
            </Link>
            <Link partiallyActive to="/docs/rpc" activeClassName="active">
              <RpcApiIcon height="16" width="16" className="me-2" />
              <span className="align-middle">{t("developers.nav.rpc")}</span>
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
              <span className="align-middle">Get Support</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
