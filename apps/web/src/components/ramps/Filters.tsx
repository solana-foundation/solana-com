import React from "react";
import styles from "./Filters.module.scss";
import RampFilter from "./RampFilter";
import { useTranslations } from "next-intl";
import { XIcon } from "lucide-react";

interface FilterOption {
  value: string;
  title: string;
  name: string;
}

interface FilterData {
  name: string;
  value: string;
}

interface RampMeta {
  countries: string[];
  "payment-rails": string[];
  "fiat-assets": string[];
  "ramp-status-on": boolean;
  "ramp-status-off": boolean;
}

interface PlaceholderRamp {
  title: string;
  description: string;
  websiteUrl: string;
  imageUrl: string | null;
  meta: RampMeta;
}

interface FiltersProps {
  filtersActive: number;
  setFilteredRamps: React.Dispatch<React.SetStateAction<PlaceholderRamp[]>>;
  filteredRamps?: PlaceholderRamp[];
  placeholderRamps: PlaceholderRamp[];
  rampStatus?: FilterOption[];
  fiatAssets: FilterOption[];
  countries: FilterOption[];
  paymentRails: FilterOption[];
  toggleFiltersActive: () => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterData[]>>;
  resetFilters: () => void;
  filters: FilterData[];
}

const Filters = ({
  filtersActive,
  // filteredRamps,
  setFilteredRamps,
  placeholderRamps,
  // rampStatus,
  fiatAssets,
  countries,
  paymentRails,
  toggleFiltersActive,
  setFilters,
  resetFilters,
  filters,
}: FiltersProps) => {
  const t = useTranslations();

  return (
    <div
      className={`${styles["ramp-filters"]} ${
        filtersActive ? styles["ramp-filters--active"] : ""
      }`}
    >
      <div className={`${styles["ramp-filters__header"]}`}>
        <div className={styles["ramp-filters__header-left"]}>
          <h2 className={`${styles["ramp-filters__title"]}`}>Filters</h2>
          <button
            className={`${styles["ramp-filters__clear-filters"]}`}
            aria-label={t("on-off-ramp.filters.clear-button.aria-label")}
            onClick={resetFilters}
          >
            {t("on-off-ramp.filters.clear-button.title")}
          </button>
        </div>
        <button
          className="box-content w-[1em] h-[1em] p-[0.25em] text-[#232323] border-0 ramp-filters__close"
          aria-label={t("on-off-ramp.filters.close-button.aria-label")}
          onClick={toggleFiltersActive}
        >
          <XIcon className="block" size={21} />
        </button>
      </div>
      <div className="ramp-filters__list">
        {/*<RampFilter
          title="Ramp Status"
          options={rampStatus}
          inputType={"normal"}
          setFilters={setFilters}
          filters={filters}
          searchTerm={searchTerm}
          filteredRamps={filteredRamps}
          setFilteredRamps={setFilteredRamps}
          placeholderRamps={placeholderRamps}
        />*/}
        <RampFilter
          title={t("on-off-ramp.filters.country")}
          options={countries}
          inputType={"normal"}
          setFilters={setFilters}
          filters={filters}
          // filteredRamps={filteredRamps}
          setFilteredRamps={setFilteredRamps}
          placeholderRamps={placeholderRamps}
        />
        <RampFilter
          title={t("on-off-ramp.filters.fiat-assets")}
          options={fiatAssets}
          inputType={"currency"}
          setFilters={setFilters}
          filters={filters}
          // filteredRamps={filteredRamps}
          setFilteredRamps={setFilteredRamps}
          placeholderRamps={placeholderRamps}
        />
        <RampFilter
          title={t("on-off-ramp.filters.payment-rails")}
          options={paymentRails}
          inputType={"normal"}
          setFilters={setFilters}
          filters={filters}
          // filteredRamps={filteredRamps}
          setFilteredRamps={setFilteredRamps}
          placeholderRamps={placeholderRamps}
        />
      </div>
    </div>
  );
};

export default Filters;
