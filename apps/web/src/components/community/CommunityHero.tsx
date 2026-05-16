import Image from "next/legacy/image";
import { useTranslations } from "next-intl";
import heroImg from "../../../public/src/img/community/hero.png";

/**
 * The community hero section
 */
const CommunityHero = () => {
  const t = useTranslations();

  return (
    <section className="w-full relative pt-[5.5rem]">
      <div className="relative">
        <div className="absolute z-[-1] left-0 top-0 w-full flex justify-end">
          <Image
            src={heroImg}
            alt=""
            objectPosition="center"
            objectFit="cover"
          />
        </div>
        <div className="container pt-32 md:pb-12">
          <div className="grid grid-cols-12 pb-12 mb-12">
            <div className="col-span-12 md:col-span-6">
              <div>
                <h1 className="h1-new text-white">{t("community.hero")}</h1>
                <p className="mb-0 [font-size:clamp(1.3125rem,8vw,1.5rem)] leading-8">
                  {t("community.header")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute -z-[1] top-0 left-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 39.21%)",
          }}
        />
      </div>
    </section>
  );
};

export default CommunityHero;
