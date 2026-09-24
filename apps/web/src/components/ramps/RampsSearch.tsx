import styles from "./RampsSearch.module.scss";
import { useTranslations } from "next-intl";
import { Search } from "@boxicons/react/Search";
import { SliderAlt } from "@boxicons/react/SliderAlt";

interface RampsSearchProps {
  mobileClickEvent: () => void;
  searchTerm: string;
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
}

const RampsSearch = ({
  mobileClickEvent,
  searchTerm,
  handleInputChange,
}: RampsSearchProps) => {
  const t = useTranslations();

  return (
    <div className={`${styles["ramps-search"]}`}>
      <h3 className={`${styles["ramps-search__title"]}`}>
        {t("on-off-ramp.search.title")}
      </h3>
      <div className={`relative ${styles["ramps-search__field-container"]}`}>
        <input
          className={`${styles["ramps-search__search-field"]}`}
          type="text"
          name="search"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={t("on-off-ramp.search.search-placeholder")}
        ></input>
        <Search
          className={styles["ramps-search__submit-button"]}
          width={16}
          height={16}
          aria-hidden="true"
        />
      </div>

      <button
        className={`${styles["ramps-search__mobile-filters"]}`}
        aria-label={t("on-off-ramp.search.toggle-mobile-filters.aria-label")}
        onClick={mobileClickEvent}
      >
        <SliderAlt width={20} height={20} aria-hidden="true" />
      </button>
    </div>
  );
};

export default RampsSearch;
