import styled from "styled-components";
import { useTranslations } from "next-intl";

const StyledSection = styled.section`
  a {
    color: #f9f9fb;
  }

  .tag {
    display: flex;
    align-items: center;
    column-gap: 0.75rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #ffffff44;
    cursor: pointer;
  }

  .smallest {
    font-size: 0.875rem;
  }
`;

const BrandingAnchorTagsSection = () => {
  const t = useTranslations();

  return (
    <StyledSection>
      <p className="smallest">{t("branding.tags.title")}</p>
      <div className="flex flex-col">
        <a href="#brand">
          <div className="tag small">
            <span>{t("branding.tags.first-tag")}</span>
          </div>
        </a>
        <a href="#asset">
          <div className="tag small">
            <span>{t("branding.tags.second-tag")}</span>
          </div>
        </a>
        <a href="#press">
          <div className="tag small">
            <span>{t("branding.tags.third-tag")}</span>
          </div>
        </a>
      </div>
    </StyledSection>
  );
};

export default BrandingAnchorTagsSection;
