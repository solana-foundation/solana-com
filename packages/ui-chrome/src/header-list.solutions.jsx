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
        <div>
          <div className="uppercase py-2 flex items-center !text-[#848895]">
            <SolutionsToolsSVG className="me-3" />
            {t("nav.solutions.tools.title")}
          </div>
          <div>
            <Link
              to="/solutions/token-extensions"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsToolsItems[0].title}
              </strong>
            </Link>
            <Link
              to="/solutions/actions"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsToolsItems[9].title}
              </strong>
            </Link>
            <Link
              to="/wallets"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsToolsItems[10].title}
              </strong>
            </Link>
            <Link
              to="/solutions/solana-permissioned-environments"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsToolsItems[7].title}
              </strong>
            </Link>
            <Link
              to="/solutions/games-tooling"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsToolsItems[1].title}
              </strong>
            </Link>
            <Link
              to="/solutions/payments-tooling"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsToolsItems[2].title}
              </strong>
            </Link>
            <Link
              to="/solutions/commerce-tooling"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsToolsItems[3].title}
              </strong>
            </Link>
            <Link
              to="/solutions/financial-infrastructure"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsToolsItems[4].title}
              </strong>
            </Link>
            <Link
              to="/solutions/digital-assets"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsToolsItems[5].title}
              </strong>
            </Link>
            <Link
              to="/solutions/real-world-assets"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsToolsItems[8].title}
              </strong>
            </Link>
            <Link
              to="https://solanamobile.com/developers"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              target="_blank"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsToolsItems[6].title}
              </strong>
            </Link>
          </div>
        </div>

        <div className="bg-white/10 w-px h-auto my-[-1.625rem] mx-10"></div>

        <div>
          <div className="uppercase py-2 flex items-center !text-[#848895]">
            <SolutionsCasesSVG className="me-3" />
            {t("nav.solutions.cases.title")}
          </div>
          <div>
            <Link
              to="/solutions/tokenization"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-primary hover:!text-primary transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-primary">
                {solutionsCasesItems[5].title}
              </strong>
            </Link>
            <Link
              to="/solutions/depin"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsCasesItems[4].title}
              </strong>
            </Link>
            <Link
              to="/solutions/btcfi"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsCasesItems[6].title}
              </strong>
            </Link>
            <Link
              to="/solutions/institutional-payments"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsCasesItems[7].title}
              </strong>
            </Link>
            <Link
              to="/solutions/stablecoins"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsCasesItems[8].title}
              </strong>
            </Link>
            <Link
              to="/solutions/defi"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsCasesItems[9].title}
              </strong>
            </Link>
            <Link
              to="/solutions/consumer"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsCasesItems[10].title}
              </strong>
            </Link>
            <Link
              to="/solutions/ai"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsCasesItems[11].title}
              </strong>
            </Link>
            <Link
              to="/solutions/desci"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsCasesItems[12].title}
              </strong>
            </Link>
            <Link
              to="/solutions/enterprise"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsCasesItems[1].title}
              </strong>
            </Link>
            <Link
              to="/solutions/gaming-and-entertainment"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsCasesItems[0].title}
              </strong>
            </Link>
            <Link
              to="/solutions/artists-creators"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/10 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsCasesItems[2].title}
              </strong>
            </Link>
          </div>
        </div>
      </div>
      <div className="xl:flex border-t border-white/10 bg-[#151118] mt-[1.625rem] -mx-6 -mb-6 px-6 pb-6 pt-6 rounded-b-xl">
        <div className="xl:w-1/2">
          <div className="uppercase py-2 flex items-center !text-[#848895]">
            <SolutionsResourcesSVG className="me-3" />
            {t("nav.solutions.resources.title")}
          </div>
          <div>
            <Link
              to="/solutions"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/30 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/30 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsResourcesItems[0].title}
              </strong>
            </Link>
            <Link
              to="/ai"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/30 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/30 bg-[#151118]"
            >
              <strong className="block !text-white">
                {solutionsResourcesItems[1].title}
              </strong>
            </Link>
          </div>
        </div>

        <div className="bg-white/10 w-px h-auto my-[-1.625rem] mx-10 hidden xl:block invisible"></div>

        <div className="xl:w-1/2">
          <div className="hidden xl:block uppercase py-2 flex items-center !text-[#848895]">
            &nbsp;
          </div>
          <div>
            <Link
              to="/developers/dao"
              className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/30 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
              activeClassName="!border-white/30 bg-[#151118]"
            >
              <strong className="block !text-white">
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
