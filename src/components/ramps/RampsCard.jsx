import styles from "./RampsCard.module.scss";
import RampIconPlaceholder from "./assets/ramp-icon-placeholder.png";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const RampsCard = ({
  rampIndex,
  title,
  description,
  showModalOnClick,
  imageUrl,
}) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles["ramps-card"]}`}>
      <div className={`${styles["ramps-card__icon-container"]}`}>
        <Image
          src={imageUrl ?? RampIconPlaceholder}
          width={61}
          height={61}
          alt={t("on-off-ramp.cards.ramp-logo-placeholder-alt")}
        />
      </div>
      <h2 className={`${styles["ramps-card__title"]}`}>{title}</h2>
      <p className={`${styles["ramps-card__description"]}`}>{description}</p>
      <button
        data-index={rampIndex}
        className={`${styles["ramps-card__details"]}`}
        onClick={showModalOnClick}
      >
        {t("on-off-ramp.cards.view-details-title")} <span>+</span>
      </button>
    </div>
  );
};

export default RampsCard;
