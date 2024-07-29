import { useTranslation } from "next-i18next";
import styles from "./NFTShowdownFAQ.module.scss";
import FAQsection from "../sharedPageSections/FAQsection";

const NFTShowdownFAQ = ({ showdownFAQs }) => {
  const { t } = useTranslation("common");

  return (
    <div className="my-10">
      <div className={styles["nft-showdown-faq"]}>
        <h2 className="mono section-title h6 fw-normal mb-5">
          {t("nft-showdown.faq.title")}:
        </h2>

        <FAQsection
          data={showdownFAQs}
          titles={[
            {
              sectionTitle: "NFTShowdown",
            },
          ]}
          hiddenTitle
          hiddenLogo
        />
      </div>
    </div>
  );
};

export default NFTShowdownFAQ;
