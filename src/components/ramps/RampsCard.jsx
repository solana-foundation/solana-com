import styles from "./RampsCard.module.scss";
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
    <button
      data-index={rampIndex}
      className={`${styles["ramps-card"]}`}
      onClick={showModalOnClick}
    >
      <div className={`${styles["ramps-card__icon-container"]}`}>
        <Image src={imageUrl} width={61} height={61} alt="" />
      </div>
      <h2 className={`${styles["ramps-card__title"]}`}>{title}</h2>
      <p className={`${styles["ramps-card__description"]}`}>{description}</p>
      <span className={`${styles["ramps-card__details"]}`}>
        {t("on-off-ramp.cards.view-details-title")} <span>+</span>
      </span>
    </button>
  );
};

export default RampsCard;
