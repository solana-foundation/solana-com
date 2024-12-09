import { useState } from "react";

import { MobileFilters, DesktopFilters } from "./Filters";

import Wallets from "./Wallets";

import styles from "./WalletFilters.module.scss";

const WalletFilters = ({
  filterData,
  currentFilters,
  setFilters,
  updateWallets,
  walletData,
}) => {
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
    console.log({ index });
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
    <div className={styles.WalletFilters}>
      <MobileFilters
        filterState={filterState}
        toggleFilterActiveState={toggleFilterActiveState}
        resetWalletsAndFilters={resetWalletsAndFilters}
      />
      <DesktopFilters
        filterState={filterState}
        toggleFilterActiveState={toggleFilterActiveState}
        resetWalletsAndFilters={resetWalletsAndFilters}
      />
      <Wallets filteredWalletData={walletData} />
    </div>
  );
};

export default WalletFilters;
