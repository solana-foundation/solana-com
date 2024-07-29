import { useState } from "react";
import styles from "./RampFilter.module.scss";
import { useTranslation } from "next-i18next";

const RampFilter = ({
  title,
  options,
  inputType,
  setFilters,
  filters,
  setFilteredRamps,
  placeholderRamps,
}) => {
  const { t } = useTranslation();

  const [active, setActive] = useState(0);

  const toggleActiveState = (e) => {
    const parent = e.target.closest(".ramp-filter");
    parent.classList.toggle("ramp-filter--active");

    if (parent.classList.contains("ramp-filter--active")) {
      setActive(1);
    } else {
      setActive(0);
    }
  };

  const toggleFilterStatus = (e) => {
    const filterValue = e.target.id;
    const filterName = e.target.name;
    const checked = e.target.checked;

    let currentFilters = [...filters];

    const filterData = {
      name: filterName,
      value: filterValue,
    };

    if (e.target.checked === true) {
      currentFilters.push(filterData);
    } else {
      currentFilters = currentFilters.filter((filter) => {
        if (filter.value != filterValue) {
          if (filter.name === filter.name) {
            return true;
          }
        }

        return false;
      });
    }

    setFilters(currentFilters);

    if (currentFilters.length > 0) {
      // Go through our current ramps and filter them based on the new filters
      const updatedRamps = placeholderRamps.filter((ramp) => {
        let matchesFilter = false; // flag to return to .filter

        currentFilters.forEach((filter) => {
          if (filter.name in ramp.meta && filter.name !== "ramp-status") {
            if (ramp.meta[filter.name].includes(filter.value)) {
              matchesFilter = true;
            } else {
              matchesFilter = false;
            }
          } else if (filter.name === "ramp-status") {
            if (ramp.meta[filter.value] && checked) {
              matchesFilter = true;
            } else {
              matchesFilter = false;
            }
          } else if (filter.name === "name") {
            if (ramp.title.includes(filter.value)) {
              matchesFilter = true;
            } else {
              matchesFilter = false;
            }
          }
        });

        return matchesFilter;
      });

      setFilteredRamps(updatedRamps);
    } else {
      setFilteredRamps(placeholderRamps);
    }
  };

  return (
    <div className={`ramp-filter ${styles["ramp-filter"]}`}>
      <div
        className={`d-flex flex-row justify-content-between align-items-center ${styles["ramp-filter__header"]}`}
        onClick={toggleActiveState}
      >
        <h3 className={`${styles["ramp-filter__title"]}`}>{title}</h3>
        <button
          aria-label={t(
            "on-off-ramp.filters.mobile-dropdown-toggle.aria-label",
          )}
          className={`${styles["ramp-filter__toggle"]} ${
            active === 1 ? styles["ramp-filter__toggle--active"] : ""
          }`}
        ></button>
      </div>
      <div
        className={`${styles["ramp-options"]} ${
          inputType === "currency" ? styles["ramp-options--currency"] : ""
        } ${active === 1 ? styles["ramp-options--active"] : ""}`}
      >
        {options &&
          options.map((item, index) => (
            <div
              className={`${styles["ramp-options__option"]} ${
                inputType === "currency"
                  ? styles["ramp-options__option--currency"]
                  : ""
              }`}
              key={index}
            >
              <input
                className={
                  inputType === "normal"
                    ? styles["ramp-options__checkbox"]
                    : styles["ramp-options__currency"]
                }
                type="checkbox"
                name={item.name}
                id={item.value}
                onChange={toggleFilterStatus}
              />
              <label
                className={
                  inputType === "normal"
                    ? styles["ramp-options__label"]
                    : styles["ramp-options__currency-label"]
                }
                htmlFor={item.value}
              >
                {item.title}
              </label>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RampFilter;
