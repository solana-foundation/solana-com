import { forwardRef } from "react";
import Image from "next/legacy/image";
import { useTranslations } from "next-intl";
import HeroImage from "../../../public/src/img/validators/validators_geometry.png";
import Button from "../shared/Button";

const ValidatorsHero = forwardRef((_, ref) => {
  const t = useTranslations();

  return (
    <section className="relative w-full flex overflow-hidden" ref={ref}>
      <div className="absolute w-[585px] left-1/2 top-[-9.5rem] -translate-x-1/2 min-[576px]:w-[950px] min-[576px]:top-[-2rem] min-[576px]:[transform:translate(-20%,0)] min-[992px]:top-0">
        <Image
          src={HeroImage}
          alt="Rings sphere geometry"
          quality={90}
          placeholder="blur"
        />
      </div>
      <div
        className="absolute w-[692px] h-[672px] left-1/2 top-[-50%] -translate-x-1/2 -translate-y-1/2 opacity-20 min-[576px]:w-full min-[576px]:max-w-[1144px] min-[576px]:h-[1112px] min-[576px]:opacity-100 min-[576px]:[transform:translate(-25%,-50%)]"
        style={{
          background:
            "radial-gradient(56.83% 56.83% at 50% 50%, #9945ff 0%, rgba(0, 0, 0, 0) 85%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 30.78%)",
        }}
      />
      <div className="container z-10">
        <div className="w-full pt-[12rem] pb-6 min-[576px]:max-w-[780px] min-[576px]:pt-24 min-[576px]:pb-24 min-[992px]:pt-24 min-[992px]:pb-[7rem]">
          <h1>{t("validators.header")}</h1>
          <p className="regular text-white text-[1.3125rem] leading-[130%] [font-feature-settings:'ss14'_on] py-4 my-0 min-[576px]:text-[1.5rem] min-[576px]:leading-[100%] min-[576px]:pt-8 min-[576px]:pb-[2.5rem]">
            {t("validators.sub-header")}
          </p>
          <div className="flex items-center flex-wrap gap-4">
            <Button
              to="https://docs.anza.xyz/operations"
              newTab
              aria-label="Read about becoming a Validator"
              className="inline-block mt-2 md:mt-4 sm:mr-2 lift"
              arrow={false}
              variant="secondary"
              size="large"
            >
              {t("validators.become-validator")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ValidatorsHero;
