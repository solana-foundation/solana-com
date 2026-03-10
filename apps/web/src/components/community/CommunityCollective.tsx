import Image from "next/legacy/image";
import { useTranslations } from "next-intl";
import Button from "../shared/Button";
import collectiveImg from "../../../public/src/img/community/collective.png";

const CommunityCollective = () => {
  const t = useTranslations();

  return (
    <section className="text-black container items-center my-12 flex flex-col md:flex-row">
      <div className="overflow-visible md:mb-0 md:w-auto md:[&_img]:h-[35rem] md:[&_img]:w-auto">
        <Image
          src={collectiveImg}
          alt="Community Collective"
          objectPosition="center"
          objectFit="contain"
        />
      </div>
      <div className="bg-[#eb54bc] rounded-2xl px-5 sm:px-12 pt-12 pb-6 justify-end md:max-w-[75%]">
        <div className="body">
          <h2 className="h1">Solana Collective</h2>
          <p className="my-4 md:max-w-[85%]">{t("community.collective")}</p>
          <Button to="https://www.solanacollective.com/" noBorder newTab>
            {t("community.apply")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommunityCollective;
