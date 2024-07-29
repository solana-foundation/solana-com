import Image from "next/legacy/image";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import Divider from "../shared/Divider";
import Button from "../shared/Button";

import solanaGradient from "../../../public/src/img/branding/solanaGradient.jpg";

const StyledSection = styled.section`
  .title {
    font-size: clamp(2rem, 8vw, 2.25rem);
    line-height: 105%;
    font-weight: bold;
  }

  .gradient {
    border-radius: 0.75rem;
  }

  .colors {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    column-gap: 1.5rem;
    row-gap: 1.5rem;

    & > div {
      flex: 1;
      min-width: 200px;
    }

    .purple {
      width: 100%;
      height: 120px;
      background: #9945ff;
      border-radius: 0.75rem;
    }

    .green {
      width: 100%;
      height: 120px;
      background: #14f195;
      border-radius: 0.75rem;
    }
  }
`;

const BrandingColors = () => {
  const { t } = useTranslation();

  return (
    <StyledSection>
      <div className="h6 fw-bold mb-4">{t("branding.colors.title")}</div>
      <Divider theme="light" axis="x" />
      <div className="mt-4 mb-6">
        <p className="smaller text-uppercase">
          {t("branding.colors.gradient")}
        </p>
        <Button to="src/img/branding/solanaGradient.jpg" download>
          PNG
        </Button>
        <div className="mt-6">
          <Image alt="" className="gradient" src={solanaGradient} />
        </div>
      </div>
      <Divider theme="light" axis="x" />
      <div className="colors mt-4">
        <div>
          <p className="smaller text-uppercase mt-2">
            {t("branding.colors.purple")}
          </p>
          <p className="small mt-2">#9945FF</p>
          <div className="purple mt-6" />
        </div>
        <div>
          <p className="smaller text-uppercase mt-2">
            {t("branding.colors.green")}
          </p>
          <p className="small mt-2">#14F195</p>
          <div className="green mt-6" />
        </div>
      </div>
    </StyledSection>
  );
};

export default BrandingColors;
