"use client";

import { useTranslations } from "next-intl";
import { Link } from "./link";
import { HeaderItem } from "./header-item";
import { CollapseMenu } from "./collapse-menu";
import BankIcon from "./assets/nav/solutions/bank.inline.svg";
import BitcoinIcon from "./assets/nav/solutions/bitcoin.inline.svg";
import BuildingsIcon from "./assets/nav/solutions/buildings.inline.svg";
import CoinIcon from "./assets/nav/solutions/coin.inline.svg";
import CoinsAddIcon from "./assets/nav/solutions/coins-add.inline.svg";
import CoinsIcon from "./assets/nav/solutions/coins.inline.svg";
import ContrastIcon from "./assets/nav/solutions/contrast.inline.svg";
import FlowIcon from "./assets/nav/solutions/flow.inline.svg";
import MallIcon from "./assets/nav/solutions/mall.inline.svg";
import MoneyIcon from "./assets/nav/solutions/money.inline.svg";
import PhoneIcon from "./assets/nav/solutions/phone.inline.svg";
import RootingIcon from "./assets/nav/solutions/rooting.inline.svg";
import SparklesIcon from "./assets/nav/solutions/sparkles.inline.svg";
import StoreIcon from "./assets/nav/solutions/store.inline.svg";
import WalletIcon from "./assets/nav/solutions/wallet.inline.svg";

const HeaderListSolutions = ({ isMobile = false }) => {
  const t = useTranslations();
  const solutionsToolsItems = t.raw("nav.solutions.tools.items");
  const solutionsCasesItems = t.raw("nav.solutions.cases.items");
  const solutionsResourcesItems = t.raw("nav.solutions.resources.items");

  return (
    <div className="xl:w-[800px] max-w-full flex flex-col xl:gap-2">
      <div className="px-3 max-xl:border-b max-xl:border-[rgba(238,228,255,0.04)] max-xl:border-dotted">
        <CollapseMenu
          className="text-[rgba(255,255,255,0.64)] data-[state=open]:text-white"
          title={
            <div className="py-3 xl:py-2 font-brand-mono font-medium text-[12px] xl:text-[14px] tracking-[1px] uppercase">
              {t("nav.solutions.tools.title")}
            </div>
          }
          alwaysOpen={!isMobile}
        >
          <div className="flex flex-col xl:flex-row xl:gap-5 max-xl:divide-y max-xl:divide-[rgba(238,228,255,0.04)]">
            <div className="divide-y divide-[rgba(238,228,255,0.04)] flex-1">
              <Link
                to="/solutions/token-extensions"
                className="block no-underline text-inherit group/link"
                activeClassName="active"
              >
                <HeaderItem
                  title={solutionsToolsItems[0].title}
                  Icon={CoinsIcon}
                />
              </Link>
              <Link
                to="/solana-wallets"
                className="block no-underline text-inherit group/link"
                activeClassName="active"
              >
                <HeaderItem
                  title={solutionsToolsItems[5].title}
                  Icon={WalletIcon}
                />
              </Link>
            </div>
            <div className="divide-y divide-[rgba(238,228,255,0.04)] flex-1">
              <Link
                to="/solutions/commerce-tooling"
                className="block no-underline text-inherit group/link"
                activeClassName="active"
              >
                <HeaderItem
                  title={solutionsToolsItems[1].title}
                  Icon={StoreIcon}
                />
              </Link>
              <Link
                to="/solutions/financial-infrastructure"
                className="block no-underline text-inherit group/link"
                activeClassName="active"
              >
                <HeaderItem
                  title={solutionsToolsItems[2].title}
                  Icon={FlowIcon}
                />
              </Link>
            </div>
            <div className="divide-y divide-[rgba(238,228,255,0.04)] flex-1">
              <Link
                to="/solutions/digital-assets"
                className="block no-underline text-inherit group/link"
                activeClassName="active"
              >
                <HeaderItem
                  title={solutionsToolsItems[3].title}
                  Icon={ContrastIcon}
                />
              </Link>
              <Link
                to="/solutions/real-world-assets"
                className="block no-underline text-inherit group/link"
                activeClassName="active"
              >
                <HeaderItem
                  title={solutionsToolsItems[4].title}
                  Icon={MallIcon}
                />
              </Link>
            </div>
          </div>
        </CollapseMenu>
      </div>
      <div className="flex flex-col xl:flex-row">
        <div className="px-3 w-full xl:w-2/3 max-xl:border-b max-xl:border-[rgba(238,228,255,0.04)] max-xl:border-dotted">
          <CollapseMenu
            className="text-[rgba(255,255,255,0.64)] data-[state=open]:text-white"
            title={
              <div className="py-3 xl:py-2 font-brand-mono font-medium text-[12px] xl:text-[14px] tracking-[1px] uppercase">
                {t("nav.solutions.cases.title")}
              </div>
            }
            alwaysOpen={!isMobile}
          >
            <div className="flex flex-col xl:flex-row xl:gap-5 max-xl:divide-y max-xl:divide-[rgba(238,228,255,0.04)]">
              <div className="divide-y divide-[rgba(238,228,255,0.04)] flex-1">
                <Link
                  to="/solutions/tokenization"
                  className="block no-underline text-inherit group/link"
                  activeClassName="active"
                >
                  <HeaderItem
                    title={solutionsCasesItems[5].title}
                    Icon={CoinsAddIcon}
                  />
                </Link>
                <Link
                  to="/solutions/depin"
                  className="block no-underline text-inherit group/link"
                  activeClassName="active"
                >
                  <HeaderItem
                    title={solutionsCasesItems[4].title}
                    Icon={RootingIcon}
                  />
                </Link>
                <Link
                  to="/solutions/btcfi"
                  className="block no-underline text-inherit group/link"
                  activeClassName="active"
                >
                  <HeaderItem
                    title={solutionsCasesItems[6].title}
                    Icon={BitcoinIcon}
                  />
                </Link>
                <Link
                  to="/solutions/institutional-payments"
                  className="block no-underline text-inherit group/link"
                  activeClassName="active"
                >
                  <HeaderItem
                    title={solutionsCasesItems[7].title}
                    Icon={BankIcon}
                  />
                </Link>
              </div>
              <div className="divide-y divide-[rgba(238,228,255,0.04)] flex-1">
                <Link
                  to="/solutions/stablecoins"
                  className="block no-underline text-inherit group/link"
                  activeClassName="active"
                >
                  <HeaderItem
                    title={solutionsCasesItems[8].title}
                    Icon={CoinIcon}
                  />
                </Link>
                <Link
                  to="/solutions/enterprise"
                  className="block no-underline text-inherit group/link"
                  activeClassName="active"
                >
                  <HeaderItem
                    title={solutionsCasesItems[1].title}
                    Icon={BuildingsIcon}
                  />
                </Link>
                <Link
                  to="/solutions/financial-institutions"
                  className="block no-underline text-inherit group/link"
                  activeClassName="active"
                >
                  <HeaderItem
                    title={solutionsCasesItems[3].title}
                    Icon={BankIcon}
                  />
                </Link>
                <Link
                  to="/solutions/ai"
                  className="block no-underline text-inherit group/link"
                  activeClassName="active"
                >
                  <HeaderItem
                    title={solutionsCasesItems[11].title}
                    Icon={SparklesIcon}
                  />
                </Link>
              </div>
            </div>
          </CollapseMenu>
        </div>
        <div className="px-3 w-full xl:w-1/3">
          <CollapseMenu
            className="text-[rgba(255,255,255,0.64)] data-[state=open]:text-white"
            title={
              <div className="py-3 xl:py-2 font-brand-mono font-medium text-[12px] xl:text-[14px] tracking-[1px] uppercase">
                {t("nav.solutions.resources.title")}
              </div>
            }
            alwaysOpen={!isMobile}
          >
            <div className="divide-y divide-[rgba(238,228,255,0.04)] flex-1">
              <Link
                to="https://payments.org"
                className="block no-underline text-inherit group/link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HeaderItem
                  title={solutionsResourcesItems[0].title}
                  Icon={MoneyIcon}
                />
              </Link>
              <Link
                to="https://launch.solana.com/products/contra"
                className="block no-underline text-inherit group/link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HeaderItem
                  title={solutionsResourcesItems[1].title}
                  Icon={SparklesIcon}
                />
              </Link>
              <Link
                to="https://solanamobile.com/developers"
                className="block no-underline text-inherit group/link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HeaderItem
                  title={solutionsResourcesItems[2].title}
                  Icon={PhoneIcon}
                />
              </Link>
            </div>
          </CollapseMenu>
        </div>
      </div>
    </div>
  );
};

export default HeaderListSolutions;
