import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./CategorySelection.module.scss";
import classNames from "classnames";
import { SwitcherButtons } from "@solana-foundation/solana-lib";
import Dropdown from "react-bootstrap/Dropdown";

const CategorySelection = ({
  categories,
  activeCategoryFilter,
  setCategoryFilter,
  moreCategoriesLabel,
}) => {
  const categoryContainer = useRef(null);
  const dropdownButtonRef = useRef(null);
  const maxDisplayItems = useRef(0);
  const [displayCategories, setDisplayCategories] = useState([]);
  const [moreCategories, setMoreCategories] = useState([]);
  const [buttonWidths, setButtonWidths] = useState([]);

  const findExceedingIndex = (arr, maxWidth, dropdownWidth) => {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
      total += arr[i];

      if (total > maxWidth - dropdownWidth) {
        return i;
      }
    }
    return arr.length; // Return -1 if the sum never exceeds maxNumber
  };

  const updateDisplayedItems = useCallback(() => {
    const containerWidth = categoryContainer.current.offsetWidth;
    const dropdownWidth = moreCategoriesLabel?.length * 10 + 70; // 70 = padding + ~margin
    maxDisplayItems.current = findExceedingIndex(
      buttonWidths,
      containerWidth,
      dropdownWidth,
    );

    if (categories.length > maxDisplayItems.current) {
      setDisplayCategories(categories.slice(0, maxDisplayItems.current));
      setMoreCategories(categories.slice(maxDisplayItems.current));
    } else {
      setDisplayCategories(categories);
      setMoreCategories([]);
    }
  }, [buttonWidths, moreCategoriesLabel, categories]); // Added 'categories' to dependencies

  // estimate the widths of the category buttons on initial render
  // note: can't rely on actual widths because some buttons are stored in the dropdown and are not accessible
  useEffect(() => {
    const widths = [];
    categories.forEach((item) => {
      widths.push(item.category.length * 10 + 40); // 10px per character + 32px for padding + 8px for margin. Estimated higher then expected to account for font size differences.
    });

    setButtonWidths(widths);
  }, [categories]);

  // establish the initial displayed items and add a listener for window resizing
  useEffect(() => {
    updateDisplayedItems();
    window.addEventListener("resize", updateDisplayedItems);

    return () => {
      window.removeEventListener("resize", updateDisplayedItems);
    };
  }, [buttonWidths, updateDisplayedItems]);

  return (
    <>
      {/* Mobile dropdown */}
      <Dropdown ref={dropdownButtonRef} className={`d-block w-100 d-md-none`}>
        <Dropdown.Toggle
          variant="success"
          className={classNames(
            "text-uppercase lead opacity-100 text-white text-center w-100 rounded-pill border mb-3 py-3",
            styles["category-dropdown"],
          )}
        >
          {moreCategoriesLabel} +
        </Dropdown.Toggle>
        <Dropdown.Menu className={styles["category-dropdown-menu"]}>
          {categories.map((item, index) => {
            return (
              <Dropdown.Item
                key={index}
                className={classNames(
                  styles["category-dropdown-item"],
                  "tw-brightness-125",
                  activeCategoryFilter === item.value && "active",
                )}
                onClick={() => {
                  setCategoryFilter(item.value);
                }}
              >
                {item.category}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>

      {/* Tablet/Desktop UI */}
      <div
        ref={categoryContainer}
        className="row justify-items-start d-none d-md-flex"
      >
        <div className="col flex-grow-1">
          <SwitcherButtons
            switcherCards={displayCategories}
            activeIndex={activeCategoryFilter}
            setActive={setCategoryFilter}
            className="tw-hidden sm:tw-flex"
          />
        </div>
        {moreCategories.length > 0 && (
          <div className="col flex-grow-0 justify-self-end">
            <Dropdown ref={dropdownButtonRef}>
              <Dropdown.Toggle
                variant="success"
                className={classNames(
                  "text-uppercase flex-fill flex-md-grow-0 lead opacity-100 text-white",
                  styles["category-dropdown"],
                )}
              >
                {moreCategoriesLabel} +
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles["category-dropdown-menu"]}>
                {moreCategories.map((item, index) => {
                  return (
                    <Dropdown.Item
                      key={index}
                      className={classNames(
                        styles["category-dropdown-item"],
                        "tw-brightness-125",
                        activeCategoryFilter === item.value && "active",
                      )}
                      onClick={() => {
                        setCategoryFilter(item.value);
                      }}
                    >
                      {item.category}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </div>
    </>
  );
};

export default CategorySelection;
