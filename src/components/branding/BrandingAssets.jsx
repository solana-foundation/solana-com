import Image from "next/legacy/image";
import styled from "styled-components";
import Divider from "../shared/Divider";
import Button from "../shared/Button";
import { useTranslation } from "next-i18next";

import solanaLogo from "../../../public/src/img/branding/solanaLogo.svg";
import solanaLogoMark from "../../../public/src/img/branding/solanaLogoMark.svg";
import solanaVerticalLogo from "../../../public/src/img/branding/solanaVerticalLogo.svg";
import solanaFoundationLogo from "../../../public/src/img/branding/solanaFoundationLogo.svg";
import solanaWordMark from "../../../public/src/img/branding/solanaWordMark.svg";

const StyledSection = styled.section`
  .logo-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 1.5rem;
    row-gap: 1.5rem;
    flex-wrap: wrap;

    .logo {
      min-width: 280px;
      width: 320px;
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const BrandingAssets = () => {
  const { t } = useTranslation();

  return (
    <StyledSection className="pt-10" id="asset">
      <h2 className="h3">{t("branding.assets.title")}</h2>
      <Button
        to="https://drive.google.com/drive/u/1/folders/1Y882o7uxW4Bx2vL6MXI-IozbGTX3ztBk"
        variant="secondary"
        size="large"
        newTab
        className="mt-6 mb-6"
      >
        {t("branding.assets.download-btn")}
      </Button>

      <Divider theme="light" axis="x" className="my-4" />
      <div className="logo-section">
        <div>
          <p className="smaller text-uppercase mt-4">
            {t("branding.assets.mainLogoType")}
          </p>
          <div className="d-flex align-items-center">
            <Button
              to="src/img/branding/solanaLogo.png"
              download
              className="me-4"
            >
              PNG
            </Button>
            <Button to="src/img/branding/solanaLogo.svg" download>
              SVG
            </Button>
          </div>
        </div>
        <div className="logo">
          <Image alt={`Solana`} src={solanaLogo} />
        </div>
      </div>

      <Divider theme="light" axis="x" className="my-4" />
      <div className="logo-section">
        <div>
          <p className="smaller text-uppercase mt-4">
            {t("branding.assets.logomark")}
          </p>
          <div className="d-flex align-items-center">
            <Button
              to="src/img/branding/solanaLogoMark.png"
              download
              className="me-4"
            >
              PNG
            </Button>
            <Button to="src/img/branding/solanaLogoMark.svg" download>
              SVG
            </Button>
          </div>
        </div>
        <div className="logo">
          <Image alt={`Solana`} src={solanaLogoMark} />
        </div>
      </div>

      <Divider theme="light" axis="x" className="my-4" />
      <div className="logo-section">
        <div>
          <p className="smaller text-uppercase mt-4">
            {t("branding.assets.wordmark")}
          </p>
          <div className="d-flex align-items-center">
            <Button
              to="src/img/branding/solanaWordMark.png"
              download
              className="me-4"
            >
              PNG
            </Button>
            <Button to="src/img/branding/solanaWordMark.svg" download>
              SVG
            </Button>
          </div>
        </div>
        <div className="logo">
          <Image alt={`Solana`} src={solanaWordMark} />
        </div>
      </div>

      <Divider theme="light" axis="x" className="my-4" />
      <div className="logo-section">
        <div>
          <p className="smaller text-uppercase mt-4">
            {t("branding.assets.vertical")}
          </p>
          <div className="d-flex align-items-center">
            <Button
              to="src/img/branding/solanaVerticalLogo.png"
              download
              className="me-4"
            >
              PNG
            </Button>
            <Button to="src/img/branding/solanaVerticalLogo.svg" download>
              SVG
            </Button>
          </div>
        </div>
        <div className="logo">
          <Image alt={`Solana`} src={solanaVerticalLogo} />
        </div>
      </div>

      <Divider theme="light" axis="x" className="my-4" />
      <div className="logo-section">
        <div>
          <p className="smaller text-uppercase mt-4">
            {t("branding.assets.foundation")}
          </p>
          <div className="d-flex align-items-center">
            <Button
              to="src/img/branding/solanaFoundationLogo.png"
              download
              className="me-4"
            >
              PNG
            </Button>
            <Button to="src/img/branding/solanaFoundationLogo.svg" download>
              SVG
            </Button>
          </div>
        </div>
        <div className="logo">
          <Image alt={`Solana`} src={solanaFoundationLogo} />
        </div>
      </div>
    </StyledSection>
  );
};

export default BrandingAssets;
