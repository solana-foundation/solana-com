import Image from "next/legacy/image";
import styled from "styled-components";
import Button from "../shared/Button";
import RoundedDepthCard from "../shared/RoundedDepthCard";
import { Trans, useTranslation } from "next-i18next";
import nftLogo from "../../../assets/format/nftLogo.png";
import Link from "../../utils/Link";

const StyledHeroSection = styled.section`
  width: 100%;
  margin-top: 8rem;

  .container {
    & > div {
      width: 100%;
      position: relative;
      margin: 7rem 0;
      min-height: 400px;
    }
  }

  .title {
    max-width: 560px;
  }
`;

const ImgContainer = styled.div`
  width: 100%;
  margin-left: -20%;

  @media (min-width: 768px) {
    margin-top: -10%;
    margin-bottom: -25%;
    margin-left: -12%;
  }
`;

const NFTCard = styled.div`
  position: absolute;
  right: 0;
  top: 25%;
  width: 95%;
  z-index: 1;

  @media (min-width: 324px) {
    width: 85%;
    max-width: 720px;
  }

  .nft-volume {
    min-height: 370px;
    padding: 2.5rem 1.75rem 2.75rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    row-gap: 2rem;

    h2 {
      max-width: 450px;
    }
  }
`;

const FormatNFTVolume = () => {
  const { t } = useTranslation();

  return (
    <StyledHeroSection>
      <div className="container">
        <h2 className="title mb-0">{t("format.nft-volume.title")}</h2>
        <p className="mt-2 w-md-75">
          <Trans
            i18nKey="format.nft-volume.description"
            components={{
              learnNFTsLink: <Link to="/learn/nfts" />,
            }}
          />
        </p>
        <div>
          <ImgContainer>
            <Image src={nftLogo} alt="NFT Volume" objectFit="contain" />
          </ImgContainer>
          <NFTCard>
            <RoundedDepthCard
              bgColor="#9945FF"
              borderRadius="0.75rem"
              shadow="bottom"
            >
              <div className="nft-volume">
                <div>
                  <h2 className="mb-0">
                    {t("format.nft-volume.volume.title")}
                  </h2>
                  <p className="clamp mt-2 mt-md-4">
                    {t("format.nft-volume.volume.description")}
                  </p>
                </div>
                <div className="d-inline-block">
                  <Button to="/learn/nfts" noBorder className="m-1">
                    {t("format.nft-volume.volume.nfts")}
                  </Button>
                  <Button
                    to="https://www.magiceden.io/"
                    noBorder
                    newTab
                    className="m-1"
                  >
                    {t("format.nft-volume.volume.me")}
                  </Button>
                  <Button
                    to="https://opensea.io/"
                    noBorder
                    newTab
                    className="m-1"
                  >
                    {t("format.nft-volume.volume.os")}
                  </Button>
                </div>
              </div>
            </RoundedDepthCard>
          </NFTCard>
        </div>
      </div>
    </StyledHeroSection>
  );
};

export default FormatNFTVolume;
