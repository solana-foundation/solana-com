import styled from "styled-components";
import Button from "../shared/Button";
import { useTranslation } from "next-i18next";

const StyledCardsWrapper = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(300px, 1fr));
  }
`;

const StyledGettingStartedCard = styled.div`
  background: ${(props) => props.background || "#AB66FF"};
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 300px;

  @media (min-width: 567px) {
    padding: 1.5rem;
    min-height: 360px;
  }
  & .section-title {
    overflow-wrap: break-word;
  }
`;

const ValidatorsGettingStarted = () => {
  const { t } = useTranslation();

  return (
    <section className="getting-started">
      <div className="container">
        <StyledCardsWrapper>
          <StyledGettingStartedCard background="#AB66FF">
            <div>
              <h2 className="text-black">
                {t("validators.getting-started.cards.docs-header")}
              </h2>
              <p className="clamp text-black mt-2">
                {t("validators.getting-started.cards.docs-text")}
              </p>
            </div>
            <Button
              to="https://docs.anza.xyz/operations"
              newTab
              aria-label="Solana Docs"
              variant="none"
              arrow={true}
            >
              {t("commands.gtdocs")}
            </Button>
          </StyledGettingStartedCard>
          <StyledGettingStartedCard background="#14F195">
            <div>
              <h2 className="text-black">
                {t("validators.getting-started.cards.explorer-header")}
              </h2>
              <p className="clamp text-black mt-2">
                {t("validators.getting-started.cards.explorer-text")}
              </p>
            </div>
            <Button
              to="https://solanabeach.io/validators"
              newTab
              aria-label="Solanabeach"
              variant="none"
              arrow={true}
            >
              {t("validators.getting-started.cards.explorer-btn")}
            </Button>
          </StyledGettingStartedCard>
          <StyledGettingStartedCard background="#EB54BC">
            <div>
              <h2 className="text-black">
                {t("validators.getting-started.cards.education-header")}
              </h2>
              <p className="clamp text-black mt-2">
                {t("validators.getting-started.cards.education-text")}
              </p>
            </div>
            <Button
              to="https://www.youtube.com/watch?v=b0-vMyoojuo&list=PLilwLeBwGuK6jKrmn7KOkxRxS9tvbRa5p"
              newTab
              aria-label="Solana Validator Education"
              variant="none"
              arrow={true}
            >
              {t("commands.learn")}
            </Button>
          </StyledGettingStartedCard>
          <StyledGettingStartedCard background="#FF754A">
            <div>
              <h2 className="text-black">
                {t("validators.getting-started.cards.delegation-header")}
              </h2>
              <p className="clamp text-black mt-2">
                {t("validators.getting-started.cards.delegation-text")}
              </p>
            </div>
            <div className="d-flex flex-wrap">
              <Button
                to="https://solana.org/delegation-program"
                newTab
                aria-label="Solana Foundation delegation program"
                variant="none"
                className="mt-2 me-2"
              >
                {t("commands.learn")}
              </Button>
              <Button
                to="https://solana.org/validators-search"
                newTab
                aria-label="Delegation Dashboard"
                variant="transparent"
                arrow={true}
                className="mt-2"
              >
                {t("validators.getting-started.cards.delegation-btn")}
              </Button>
            </div>
          </StyledGettingStartedCard>
        </StyledCardsWrapper>
      </div>
    </section>
  );
};

export default ValidatorsGettingStarted;
