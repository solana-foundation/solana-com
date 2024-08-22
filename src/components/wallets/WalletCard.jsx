import { useTranslation } from "next-i18next";
import Image from "next/image";
import styles from "./WalletCard.module.scss";

const WalletCard = ({ index, walletImage, name, body, websiteUrl }) => {
  const { t } = useTranslation();

  return (
    <article data-index={index} className={styles["wallet"]}>
      <Image
        src={walletImage}
        width={60}
        height={60}
        alt={name}
        className={styles["wallet-card-icon"]}
      ></Image>
      <h3 className={styles["wallet-card-title"]}>{name}</h3>
      <p className={styles["wallet-card-body"]}>{body}</p>
      <a
        href={websiteUrl}
        className={styles["wallet-card-view-details"]}
        target="_blank"
      >
        {t("wallets.card.view-details")}
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-[15px] h-[15px] size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </span>
      </a>
    </article>
  );
};

export default WalletCard;
