import React from "react";
import styles from "./Filters.module.scss";
import RampFilter from "./RampFilter";
import { CloseButton } from "react-bootstrap";
import { useTranslation } from "next-i18next";

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
}) => {
  const { t } = useTranslation();

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
        <CloseButton
          className="ramp-filters__close"
          aria-label={t("on-off-ramp.filters.close-button.aria-label")}
          onClick={toggleFiltersActive}
        ></CloseButton>
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
