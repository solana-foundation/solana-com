import Image from "next/legacy/image";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
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
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="main-container">
        <ImgContainer>
          <Image
            src={heroImg}
            alt=""
            objectPosition="center"
            objectFit="cover"
          />
        </ImgContainer>
        <div className="container pt-12 pb-md-8">
          <div className="row pb-8 mb-8">
            <div className="col-12 col-md-6">
              <div className="hero-title">
                <h1 className="h1-new text-white">{t("community.hero")}</h1>
                <p className="mb-0">{t("community.header")}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="background-gradient" />
      </div>
    </section>
  );
};

export default CommunityHero;
