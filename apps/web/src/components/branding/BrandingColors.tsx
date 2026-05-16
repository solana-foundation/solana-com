import Image from "next/legacy/image";
import { useTranslations } from "next-intl";
import Divider from "../shared/Divider";
import Button from "../shared/Button";

import solanaGradient from "../../../public/src/img/branding/solanaGradient.jpg";

const BrandingColors = () => {
  const t = useTranslations();

  return (
    <section>
      <div className="h6 font-bold !mb-4">{t("branding.colors.title")}</div>
      <Divider theme="light" axis="x" />
      <div className="mt-4 mb-8">
        <p className="smaller uppercase mb-6">
          {t("branding.colors.gradient")}
        </p>
        <Button
          className="px-5"
          to="src/img/branding/solanaGradient.jpg"
          download
        >
          PNG
        </Button>
        <div className="mt-8">
          <Image alt="" className="rounded-xl" src={solanaGradient} />
        </div>
      </div>
      <Divider theme="light" axis="x" />
      <div className="flex items-center flex-wrap gap-x-6 gap-y-6 mt-4">
        <div className="flex-1 min-w-[200px]">
          <p className="smaller uppercase mt-2">
            {t("branding.colors.purple")}
          </p>
          <p className="small mt-2">#9945FF</p>
          <div className="w-full h-[120px] bg-[#9945ff] rounded-xl mt-6" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="smaller uppercase mt-2">{t("branding.colors.green")}</p>
          <p className="small mt-2">#14F195</p>
          <div className="w-full h-[120px] bg-[#14f195] rounded-xl mt-6" />
        </div>
      </div>
    </section>
  );
};

export default BrandingColors;
