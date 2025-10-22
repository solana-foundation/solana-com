import { useTranslations } from "next-intl";
import { Link } from "./link";
import StartSVG from "./assets/nav/learn/start.inline.svg";

const HeaderListLearn = () => {
  const t = useTranslations();

  return (
    <div>
      <div className="uppercase py-2 flex items-center !text-[#848895]">
        <StartSVG className="me-3" />
        {t("nav.learn.start.title")}
      </div>
      <div>
        <Link
          to="/learn"
          className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
          activeClassName="!border-white/10 bg-[#151118]"
        >
          <strong className="block !text-white">
            {t("nav.learn.start.items.all.title")}
          </strong>
          {t("nav.learn.start.items.all.description")}
        </Link>
        <Link
          to="/learn/what-is-solana"
          className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
          activeClassName="!border-white/10 bg-[#151118]"
        >
          <strong className="block !text-white">
            {t("learn.tutorials.items.what-is-solana.title")}
          </strong>
          {t("nav.learn.start.items.what-is-solana.description")}
        </Link>
        <Link
          to="/learn/what-is-a-wallet"
          className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
          activeClassName="!border-white/10 bg-[#151118]"
        >
          <strong className="block !text-white">
            {t("learn.tutorials.items.what-is-a-wallet.title")}
          </strong>
          {t("nav.learn.start.items.wallet.description")}
        </Link>
        <Link
          to="/learn/introduction-to-defi-on-solana"
          className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
          activeClassName="!border-white/10 bg-[#151118]"
        >
          <strong className="block !text-white">
            {t("learn.tutorials.items.introduction-to-defi-on-solana.title")}
          </strong>
          {t("nav.learn.start.items.defi.description")}
        </Link>
        <Link
          to="/universities"
          className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline"
          activeClassName="!border-white/10 bg-[#151118]"
        >
          <strong className="block text-white">
            {t("nav.learn.start.items.universities.title")}
          </strong>
          {t("nav.learn.start.items.universities.description")}
        </Link>
      </div>
    </div>
  );
};

export default HeaderListLearn;
