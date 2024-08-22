import { useTranslation } from "next-i18next";
import { useState } from "react";
import styles from "./WalletFilters.module.scss";
import Wallets from "./Wallets";

const WalletFilters = ({
  filterData,
  currentFilters,
  setFilters,
  updateWallets,
  walletData,
}) => {
  const { t } = useTranslation();

  /**
   * Returns all filter data with an extra key named `checked` set to false as the initial state of a filter
   * @returns Object
   */
  const setFilterInitialState = () => {
    return filterData.map((filter) => ({ ...filter, checked: false }));
  };

  const [filterState, setFilterState] = useState(setFilterInitialState());

  // Accepts the index of the filter and changes its checked state,
  // then updates filterState to use the updated state
  const toggleFilterActiveState = (index) => {
    const filters = [...filterState];
    filters[index].checked = !filters[index].checked;

    setFilterState(filters);

    const activeFilters = { ...currentFilters };
    const filterKey = filters[index].filterKey;

    // Add the filter as true to the filters state or remove the filter if its been unchecked
    if (filters[index].checked) {
      if (!(filterKey in activeFilters)) {
        activeFilters[filterKey] = true;
      }
    } else {
      if (filterKey in activeFilters) {
        delete activeFilters[filterKey];
      }
    }

    const showAllButton = document.querySelector(
      'button[data-role="show-all"]',
    );

    setFilters(activeFilters);

    // Handle case where a user checks a filter and then unchecks that same filter. If we have no filters active,
    // show all wallets and set the "All wallets" button as active. If we have filters at least one filter active,
    // remove active state from "All wallets" and show filtered wallets
    if (Object.keys(activeFilters).length > 0) {
      if (
        showAllButton &&
        showAllButton.classList.contains(`${styles["wallet-filter--active"]}`)
      ) {
        showAllButton.classList.remove(`${styles["wallet-filter--active"]}`);
      }

      // Filters are active - show filtered results
      updateWallets(activeFilters);
    } else {
      if (
        showAllButton &&
        !showAllButton.classList.contains(`${styles["wallet-filter--active"]}`)
      ) {
        showAllButton.classList.add(`${styles["wallet-filter--active"]}`);
      }

      // No filters are active - show all
      updateWallets({});
    }
  };

  const resetWalletsAndFilters = () => {
    setFilterState(setFilterInitialState()); // Reset all filters to unchecked
    setFilters({}); // Remove all current filters
    updateWallets({}); // Pass empty filters object to show all wallets

    const showAllButton = document.querySelector(
      'button[data-role="show-all"]',
    );

    if (
      showAllButton &&
      !showAllButton.classList.contains(`${styles["wallet-filter--active"]}`)
    ) {
      showAllButton.classList.add(`${styles["wallet-filter--active"]}`);
    }
  };

  return (
    <>
      <section className={styles["wallet-filter-section"]}>
        <div>
          <button
            onClick={() => {
              resetWalletsAndFilters();
            }}
            className={`${styles["wallet-filter"]} ${styles["wallet-filter--active"]}`}
            data-role="show-all"
          >
            {t("wallets.filters.all-wallets")}
          </button>
        </div>
        {filterState.length &&
          filterState.map((filter, index) => (
            <div key={index}>
              <label
                className={`${styles["wallet-filter"]} ${filter.checked ? styles["wallet-filter--active"] : ""}`}
                htmlFor={filter.filterKey}
              >
                {filter.title}
              </label>
              <input
                className={styles["wallet-filter-input"]}
                type="checkbox"
                name="filters"
                id={filter.filterKey}
                value={filter.filterKey}
                checked={filter.checked}
                onChange={() => toggleFilterActiveState(index)}
              ></input>
            </div>
          ))}
      </section>
      <Wallets
        walletData={walletData}
        resetWalletsAndFilters={resetWalletsAndFilters}
      />
    </>
  );
};

export default WalletFilters;
