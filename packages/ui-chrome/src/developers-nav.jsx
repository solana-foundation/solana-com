import { Link } from "./link";
import DocsIcon from "./assets/developers/docs.inline.svg";
import RpcApiIcon from "./assets/developers/api.inline.svg";
import CookbookIcon from "./assets/developers/cookbook.inline.svg";
import StackExchangeIcon from "./assets/developers/stackexchange.inline.svg";
import { useTranslations } from "next-intl";

function NavLink(props) {
  return (
    <Link
      {...props}
      className="text-[var(--body-text-secondary)] inline-block rounded-md px-[10px] py-[2px] !border border-transparent hover:text-[var(--body-text)] [&.active]:text-[var(--body-text)] [&.active]:bg-[rgba(204,204,204,0.1)] [&.active]:border-[rgba(255,255,255,0.1)] [&.active:hover]:border-[rgba(255,255,255,0.2)] light:[&.active]:bg-[rgba(204,204,204,0.35)] light:[&.active]:border-[rgba(0,0,0,0.1)] light:[&.active:hover]:border-[rgba(0,0,0,0.3)] mr-[5px] last:mr-0"
    />
  );
}

export function DevelopersNav({ containerClassName }) {
  const t = useTranslations();

  return (
    <div className="relative z-[1] text-[0.85em] bg-[rgb(18_18_18/95%)] transition-colors duration-300 ease-in-out text-[var(--body-text-secondary)] border-t border-b border-[rgba(255,255,255,0.05)] light:bg-[rgb(255_255_255/95%)] light:border-[rgba(0,0,0,0.05)]">
      <div className={`container-xl ${containerClassName}`}>
        <div className="py-2">
          <nav>
            <NavLink
              partiallyActive
              to="/docs"
              partiallyActiveIgnore={["/docs/rpc"]}
              activeClassName="active"
            >
              <DocsIcon height="16" width="16" className="me-2" />
              <span className="align-middle">
                {t("developers.nav.documentation")}
              </span>
            </NavLink>
            <NavLink partiallyActive to="/docs/rpc" activeClassName="active">
              <RpcApiIcon height="16" width="16" className="me-2" />
              <span className="align-middle">{t("developers.nav.rpc")}</span>
            </NavLink>
            <NavLink
              partiallyActive
              to="/developers/cookbook"
              activeClassName="active"
            >
              <CookbookIcon height="16" width="16" className="me-2" />
              <span className="align-middle">
                {t("developers.nav.cookbook")}
              </span>
            </NavLink>
            <NavLink
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
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}
