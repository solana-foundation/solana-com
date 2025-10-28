"use client";

import { useTranslations } from "next-intl";
import { Link } from "./link";
import SolutionsToolsSVG from "./assets/nav/solutions/solutions.inline.svg";
import SolutionsCasesSVG from "./assets/nav/solutions/cases.inline.svg";
import SolutionsResourcesSVG from "./assets/nav/solutions/resources.inline.svg";

const HeaderListSolutions = () => {
  const t = useTranslations();
  const solutionsToolsItems = t.raw("nav.solutions.tools.items");
  const solutionsCasesItems = t.raw("nav.solutions.cases.items");
  const solutionsResourcesItems = t.raw("nav.solutions.resources.items");

  return (
    <>
      <div className="xl:flex">
        <div className="w-full xl:w-max">
          <div className="uppercase py-2 flex items-center !text-[#848895] text-xs">
            <SolutionsToolsSVG className="me-3" />
            {t("nav.solutions.tools.title")}
          </div>
          <div>
            <Link
              to="/solutions/token-extensions"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsToolsItems[0].title}
              </strong>
            </Link>
            <Link
              to="/solutions/actions"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsToolsItems[9].title}
              </strong>
            </Link>
            <Link
              to="/wallets"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsToolsItems[10].title}
              </strong>
            </Link>
            <Link
              to="/solutions/solana-permissioned-environments"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsToolsItems[7].title}
              </strong>
            </Link>
            <Link
              to="/solutions/games-tooling"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsToolsItems[1].title}
              </strong>
            </Link>
            <Link
              to="/solutions/payments-tooling"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsToolsItems[2].title}
              </strong>
            </Link>
            <Link
              to="/solutions/commerce-tooling"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsToolsItems[3].title}
              </strong>
            </Link>
            <Link
              to="/solutions/financial-infrastructure"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsToolsItems[4].title}
              </strong>
            </Link>
            <Link
              to="/solutions/digital-assets"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsToolsItems[5].title}
              </strong>
            </Link>
            <Link
              to="/solutions/real-world-assets"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsToolsItems[8].title}
              </strong>
            </Link>
            <Link
              to="https://solanamobile.com/developers"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              target="_blank"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsToolsItems[6].title}
              </strong>
            </Link>
          </div>
        </div>

        <div className="bg-white/10 w-px h-auto my-[-26px] mx-[40px] hidden xl:block"></div>

        <div className="w-full xl:w-max">
          <div className="uppercase py-2 flex items-center !text-[#848895] text-xs">
            <SolutionsCasesSVG className="me-3" />
            {t("nav.solutions.cases.title")}
          </div>
          <div>
            <Link
              to="/solutions/tokenization"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-primary hover:!text-primary transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-primary text-sm">
                {solutionsCasesItems[5].title}
              </strong>
            </Link>
            <Link
              to="/solutions/depin"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsCasesItems[4].title}
              </strong>
            </Link>
            <Link
              to="/solutions/btcfi"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsCasesItems[6].title}
              </strong>
            </Link>
            <Link
              to="/solutions/institutional-payments"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsCasesItems[7].title}
              </strong>
            </Link>
            <Link
              to="/solutions/stablecoins"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsCasesItems[8].title}
              </strong>
            </Link>
            <Link
              to="/solutions/defi"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsCasesItems[9].title}
              </strong>
            </Link>
            <Link
              to="/solutions/consumer"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsCasesItems[10].title}
              </strong>
            </Link>
            <Link
              to="/solutions/ai"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsCasesItems[11].title}
              </strong>
            </Link>
            <Link
              to="/solutions/desci"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsCasesItems[12].title}
              </strong>
            </Link>
            <Link
              to="/solutions/enterprise"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsCasesItems[1].title}
              </strong>
            </Link>
            <Link
              to="/solutions/gaming-and-entertainment"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsCasesItems[0].title}
              </strong>
            </Link>
            <Link
              to="/solutions/artists-creators"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsCasesItems[2].title}
              </strong>
            </Link>
          </div>
        </div>
      </div>
      <div className="xl:flex border-t border-white/10 bg-[#151118] mt-[26px] -mx-6 -mb-6 px-6 pb-6 pt-6 rounded-b-xl">
        <div className="xl:w-1/2 w-full">
          <div className="uppercase py-2 flex items-center !text-[#848895] text-xs">
            <SolutionsResourcesSVG className="me-3" />
            {t("nav.solutions.resources.title")}
          </div>
          <div>
            <Link
              to="/solutions"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/30 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/30 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsResourcesItems[0].title}
              </strong>
            </Link>
            <Link
              to="/ai"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/30 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/30 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsResourcesItems[1].title}
              </strong>
            </Link>
          </div>
        </div>

        <div className="bg-white/10 w-px h-auto my-[-26px] mx-[40px] hidden xl:block invisible"></div>

        <div className="xl:w-1/2 w-full">
          <div className="hidden xl:block uppercase py-2 flex items-center !text-[#848895] text-xs">
            &nbsp;
          </div>
          <div>
            <Link
              to="/developers/dao"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/30 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
              activeClassName="!border-white/30 bg-[#151118]"
            >
              <strong className="block !text-white text-sm">
                {solutionsResourcesItems[2].title}
              </strong>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderListSolutions;
