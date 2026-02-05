import { Link } from "./link";
import DocsIcon from "./assets/developers/docs.inline.svg";
import RpcApiIcon from "./assets/developers/api.inline.svg";
import CookbookIcon from "./assets/developers/cookbook.inline.svg";
import WalletIcon from "./assets/developers/wallet.inline.svg";
import StackExchangeIcon from "./assets/developers/stackexchange.inline.svg";
import { useTranslations } from "next-intl";

function NavLink(props) {
  return (
    <Link
      {...props}
      className="!no-underline !text-[#848895] inline-block rounded-md px-[10px] py-[2px] !border border-transparent hover:!text-white light:hover:!text-gray-900 mr-[5px] last:mr-0"
    />
  );
}

export function DevelopersNav({ containerClassName }) {
  const t = useTranslations();

  return (
    <div className="relative z-[1] text-[0.85em] bg-[rgb(18_18_18/95%)] transition-colors duration-300 ease-in-out text-[#ababbc] border-t border-b border-[rgba(255,255,255,0.05)] light:!bg-[rgba(255,255,255,0.95)] light:text-[#7f8391] light:border-[rgba(0,0,0,0.05)]">
      <div className={`mx-auto w-full max-w-[1440px] ${containerClassName}`}>
        <div className="py-2 text-[17px] font-light ml-3 xl:ml-0">
          <div className="flex items-center">
            <div
              id="docs-sidebar-toggle-slot"
              className="mr-2 flex items-center empty:hidden"
            />
            <nav className="flex items-center flex-wrap">
            <NavLink
              partiallyActive
              to="/docs"
              partiallyActiveIgnore={["/docs/rpc", "/docs/payments"]}
              activeClassName="!text-white light:!text-gray-900 bg-[rgba(204,204,204,0.1)] border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.2)] light:bg-[rgba(204,204,204,0.35)] light:border-[rgba(0,0,0,0.2)] light:hover:border-[rgba(0,0,0,0.3)]"
            >
              <DocsIcon height="16" width="16" className="inline-block mr-2" />
              <span className="align-middle">
                {t("developers.nav.documentation")}
              </span>
            </NavLink>
            <NavLink
              partiallyActive
              to="/docs/rpc"
              activeClassName="!text-white light:!text-gray-900 bg-[rgba(204,204,204,0.1)] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] light:bg-[rgba(204,204,204,0.35)] light:border-[rgba(0,0,0,0.1)] light:hover:border-[rgba(0,0,0,0.3)]"
            >
              <RpcApiIcon
                height="16"
                width="16"
                className="inline-block mr-2"
              />
              <span className="align-middle">{t("developers.nav.rpc")}</span>
            </NavLink>
            <NavLink
              partiallyActive
              to="/developers/cookbook"
              activeClassName="!text-white light:!text-gray-900 bg-[rgba(204,204,204,0.1)] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] light:bg-[rgba(204,204,204,0.35)] light:border-[rgba(0,0,0,0.1)] light:hover:border-[rgba(0,0,0,0.3)]"
            >
              <CookbookIcon
                height="16"
                width="16"
                className="inline-block mr-2"
              />
              <span className="align-middle">
                {t("developers.nav.cookbook")}
              </span>
            </NavLink>
            <NavLink
              partiallyActive
              to="/docs/payments"
              activeClassName="!text-white light:!text-gray-900 bg-[rgba(204,204,204,0.1)] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] light:bg-[rgba(204,204,204,0.35)] light:border-[rgba(0,0,0,0.1)] light:hover:border-[rgba(0,0,0,0.3)]"
            >
              <WalletIcon
                height="16"
                width="16"
                className="inline-block mr-2"
              />
              <span className="align-middle">{t("developers.nav.payments")}</span>
            </NavLink>
            <NavLink href="https://solana.stackexchange.com/" target="_blank">
              <StackExchangeIcon
                height="16"
                width="16"
                className="inline-block mr-2"
                fill="currentColor"
              />
              <span className="align-middle">Get Support</span>
            </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
