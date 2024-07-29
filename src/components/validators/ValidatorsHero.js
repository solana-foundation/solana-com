import { forwardRef } from "react";
import Image from "next/legacy/image";
import { useTranslation } from "next-i18next";
import HeroImage from "../../../public/src/img/validators/validators_geometry.png";
import Button from "../shared/Button";

const ValidatorsHero = forwardRef((props, ref) => {
  const { t } = useTranslation();

  return (
    <section className="hero" ref={ref}>
      <div className="hero-image">
        <Image
          src={HeroImage}
          alt="Rings sphere geometry"
          quality={90}
          placeholder="blur"
        />
      </div>
      <div className="hero-gradient" />
      <div className="hero-gradient-secondary" />
      <div className="container main-content">
        <div className="hero-content">
          <h1>{t("validators.new.header")}</h1>
          <p className="regular hero-text">{t("validators.new.sub-header")}</p>
          <div className="hero-buttons">
            <Button
              to="https://docs.solanalabs.com/operations"
              newTab
              aria-label="Read about becoming a Validator"
              className="d-inline-block mt-2 mt-md-4 me-sm-2 lift"
              arrow={false}
              variant="secondary"
              size="large"
            >
              {t("validators.new.become-validator")}
            </Button>
            {/* <Button
              to="https://docs.solanalabs.com/validator/anatomy"
              newTab
              aria-label="Read the Solana Documentation about Validators"
              className="d-inline-block mt-2 mt-md-4 me-sm-2 lift"
              arrowRight={true}
              size="large"
            >
              {t("commands.gtdocs")}
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
});

export default ValidatorsHero;
