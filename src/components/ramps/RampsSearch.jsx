import styles from "./RampsSearch.module.scss";
import { useTranslation } from "next-i18next";

const RampsSearch = ({ mobileClickEvent, searchTerm, handleInputChange }) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles["ramps-search"]}`}>
      <h3 className={`${styles["ramps-search__title"]}`}>
        {t("on-off-ramp.search.title")}
      </h3>
      <div
        className={`position-relative ${styles["ramps-search__field-container"]}`}
      >
        <input
          className={`${styles["ramps-search__search-field"]}`}
          type="text"
          name="search"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={t("on-off-ramp.search.search-placeholder")}
        ></input>
        <div className={`${styles["ramps-search__submit-button"]}`}></div>
      </div>

      <button
        className={`${styles["ramps-search__mobile-filters"]}`}
        aria-label={t("on-off-ramp.search.toggle-mobile-filters.aria-label")}
        onClick={mobileClickEvent}
      ></button>
    </div>
  );
};

export default RampsSearch;
