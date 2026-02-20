import Image from "next/legacy/image";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import heroImg from "../../../public/src/img/community/hero.png";

const ImgContainer = styled.div`
  position: absolute;
  z-index: -1;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

/**
 * The community hero section
 *
 * @returns {JSX.Element}
 * @constructor
 */
const CommunityHero = () => {
  const t = useTranslations();

  return (
    <section className="w-full relative pt-[5.5rem]">
      <div className="relative">
        <ImgContainer>
          <Image
            src={heroImg}
            alt=""
            objectPosition="center"
            objectFit="cover"
          />
        </ImgContainer>
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
