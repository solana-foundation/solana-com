import styled from "styled-components";
import Image from "next/legacy/image";
import { useTranslations } from "next-intl";
import Button from "../shared/Button";
import collectiveImg from "../../../public/src/img/community/collective.png";

const StyledCommunityCollective = styled.section`
  color: #000;

  .image {
    overflow: visible;
    margin-bottom: -5rem;
    margin-left: -2rem;
    width: 115%;

    @media (min-width: 768px) {
      margin-left: -8rem;
      margin-bottom: 0;
      width: auto;

      img {
        height: 35rem;
        width: auto;
      }
    }
  }

  .card {
    background: #eb54bc;
    border-radius: 1rem;
    @media (min-width: 768px) {
      max-width: 75%;
      p {
        max-width: 85%;
      }
    }
  }
`;

const CommunityCollective = () => {
  const t = useTranslations();

  return (
    <StyledCommunityCollective className="container items-center my-12 flex flex-col md:flex-row">
      <Image
        src={collectiveImg}
        alt="Community Collective"
        objectPosition="center"
        objectFit="contain"
      />
      <div className="card px-12 pt-12 pb-6 justify-end">
        <div className="body">
          <h2 className="h1">Solana Collective</h2>
          <p className="my-4">{t("community.collective")}</p>
          <Button to="https://www.solanacollective.com/" noBorder newTab>
            {t("community.apply")}
          </Button>
        </div>
      </div>
    </StyledCommunityCollective>
  );
};

export default CommunityCollective;
