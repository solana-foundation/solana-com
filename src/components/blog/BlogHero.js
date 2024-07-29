import styled from "styled-components";
import { useTranslation } from "next-i18next";
import Image from "next/legacy/image";

import blogHeroImage from "../../../public/src/img/news/hero.png";

const StyledBlogHeroImageContainer = styled.div`
  position: absolute;
  left: 0;
  overflow: hidden;
  height: 100%;
  display: flex;
  justify-content: center;
  @media (min-width: 576px) {
    right: 0;
  }
  img {
    width: 100%;
  }
`;

const StyledHeroText = styled.div`
  font-family: Diatype, var(--font-family-sans-serif);

  .news-heading {
    color: #ffffff;
    font-size: 4rem;
    font-weight: bold;
    line-height: 100%;

    // Using !important here to overcome the global !important setting from solana-variables
    letter-spacing: -0.04em !important;
    font-feature-settings: "ss14" on;

    @media (min-width: 576px) {
      font-size: 5rem;
    }
    @media (min-width: 992px) {
      font-size: 6rem;
    }
  }

  a:hover {
    text-decoration: none;
  }
`;

const BlogHero = () => {
  const { t } = useTranslation();

  return (
    <section className="news-hero">
      <div className="main-container">
        <StyledBlogHeroImageContainer>
          <Image
            src={blogHeroImage}
            placeholder="blur"
            alt="Hero Background"
            objectFit="cover"
            objectPosition="center right"
          />
        </StyledBlogHeroImageContainer>
        <div className="background-gradient primary" />
        <div className="background-gradient secondary" />
        <div className="hero-title">
          <StyledHeroText>
            <h1 className="news-heading">{t("blog.hero")}</h1>
          </StyledHeroText>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
