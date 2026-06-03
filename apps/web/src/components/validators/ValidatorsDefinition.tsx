import Image from "next/legacy/image";
import { useTranslations } from "next-intl";
import validatorLogo from "../../../public/src/img/validators/validators_geometry_small.png";

const ValidatorsDefinition = () => {
  const t = useTranslations();

  return (
    <section className="mt-16 min-[576px]:mt-[7.5rem]">
      <div className="container">
        <div className="flex flex-col items-center [row-gap:3.25rem] min-[760px]:items-start min-[760px]:flex-row min-[760px]:justify-between min-[760px]:gap-x-8 min-[992px]:gap-x-24">
          <div className="w-[120px] min-[992px]:w-[220px] shrink-0">
            <Image
              src={validatorLogo}
              alt="Validator-Logo"
              placeholder="blur"
              quality={90}
            />
          </div>
          <div className="flex flex-col">
            <h2>{t("validators.definition.title")}</h2>
            <p className="text-white my-0">{t("validators.definition.text")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValidatorsDefinition;
