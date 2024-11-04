import { useState } from "react";
import Filters from "./Filters";
import Ramps from "./Ramps";
import styles from "./RampsLayout.module.scss";
import RampsSearch from "./RampsSearch";
import { Hero } from "@solana-foundation/solana-lib";
import onOffRampHeroImage from "../../../assets/onofframp/on-off-ramp-hero-img.png";
import { useTranslation } from "next-i18next";

const RampLayout = ({
  data,
  fiatAssetsOptions,
  countryOptions,
  paymentRailsOptions,
}) => {
  const { t } = useTranslation();

  const [filtersActive, setFiltersActive] = useState(0);

  // Shows/Hides the mobile filter layout
  const toggleFiltersActive = () => {
    if (filtersActive == 0) {
      setFiltersActive(1);
    } else {
      setFiltersActive(0);
    }
  };

  const rampsTitles = data.map((data) => data.fields.RampName).sort();
  const placeholderRamps = [];

  if (rampsTitles.length) {
    rampsTitles.forEach((title) => {
      const matchingRamp = data.filter(
        (item) => item.fields.RampName === title,
      );

      const {
        RampName,
        Description,
        RampStatusOff,
        RampStatusOn,
        WebsiteUrl,
        RampLogo,
        Countries,
        FiatAssets,
        PaymentRails,
      } = matchingRamp[0].fields;

      placeholderRamps.push({
        title: RampName,
        description: Description ?? "",
        websiteUrl: WebsiteUrl,
        imageUrl: RampLogo,
        meta: {
          countries: Countries ?? [],
          "payment-rails": PaymentRails ?? [],
          "fiat-assets": FiatAssets ?? [],
          "ramp-status-on": RampStatusOn ?? false,
          "ramp-status-off": RampStatusOff ?? false,
        },
      });
    });
  } else {
    // Dummy ramp data if we have no data coming from the API
    placeholderRamps.push({
      title: t("on-off-ramp.ramp-fallbacks.title"),
      description: t("on-off-ramp.ramp-fallbacks.description"),
      websiteUrl: "",
      imageUrl: null,
      meta: {
        countries: [],
        "payment-rails": [],
        "fiat-assets": [],
        "ramp-status-on": false,
        "ramp-status-off": false,
      },
    });
  }

  const rampStatus = [
    {
      value: "ramp-status-on",
      title: t("on-off-ramp.ramp-data.on-ramp-status"),
      name: "ramp-status",
    },
    {
      value: "ramp-status-off",
      title: t("on-off-ramp.ramp-data.off-ramp-status"),
      name: "ramp-status",
    },
  ];

  /**
   * Sorts and formats the data for the filter checkboxes
   *
   * @param {Array} dataArray Array of items (fiatAssets, countries, or paymentRails)
   * @param {String} checkboxName the name of the checkbox for filtering (fiat-assets, countries, or payment-rails)
   * @returns array of formatted items for the filter checkboxes
   */
  const sortAndFormatData = (dataArray, checkboxName) => {
    const sortedData = [];
    if (dataArray.length) {
      const onlyTitles = dataArray.map((data) => data.fields.Name).sort();

      onlyTitles.forEach((title) => {
        const data = dataArray.filter((item) => item.fields.Name === title);
        sortedData.push({
          value: data[0].id,
          title:
            checkboxName === "fiat-assets" ? data[0].id : data[0].fields?.Name,
          name: checkboxName,
        });
      });
    }

    return sortedData;
  };

  const fiatAssets = sortAndFormatData(fiatAssetsOptions, "fiat-assets");
  const countries = sortAndFormatData(countryOptions, "countries");
  const paymentRails = sortAndFormatData(paymentRailsOptions, "payment-rails");

  const [searchItems, setSearchItems] = useState("");
  const [filteredRamps, setFilteredRamps] = useState(placeholderRamps);

  const [filters, setFilters] = useState([]);

  const resetFilters = () => {
    const allFilters = document.querySelectorAll(
      'input[type="checkbox"]:checked',
    );

    if (allFilters.length) {
      allFilters.forEach((filter) => (filter.checked = false));
    }

    setSearchItems("");

    setFilteredRamps(placeholderRamps);

    setFilters([]);
  };

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItems(searchTerm);

    let currentFilters = [...filters];

    // Remove old search input values in exchange for newly typed ones
    currentFilters = currentFilters.filter(
      (filterItem) => filterItem.name !== "name",
    );

    currentFilters.push({
      name: "name",
      value: searchTerm,
    });

    setFilters(currentFilters);

    const filteredItems = placeholderRamps.filter(
      (ramp) =>
        ramp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ramp.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredRamps(filteredItems);
  };

  return (
    <>
      <div className={styles["ramps-hero-container"]}>
        <Hero
          eyebrow={t("on-off-ramp.hero.eyebrow")}
          headline={t("on-off-ramp.hero.headline")}
          headingAs="h1"
          body={`<p>${t("on-off-ramp.hero.body")}</p>`}
          image={onOffRampHeroImage}
          centered={false}
          newsletter={false}
        />
      </div>
      <div className={`position-relative ${styles["ramps-layout"]}`}>
        <RampsSearch
          mobileClickEvent={toggleFiltersActive}
          searchTerm={searchItems}
          handleInputChange={handleInputChange}
        />
        <div
          className={`d-flex flex-row align-items-start relative ${styles["ramps-layout__content"]}`}
        >
          <Filters
            placeholderRamps={placeholderRamps}
            setFilteredRamps={setFilteredRamps}
            filteredRamps={filteredRamps}
            filtersActive={filtersActive}
            rampStatus={rampStatus}
            fiatAssets={fiatAssets}
            countries={countries}
            paymentRails={paymentRails}
            toggleFiltersActive={toggleFiltersActive}
            setFilters={setFilters}
            resetFilters={resetFilters}
            filters={filters}
          ></Filters>
          <Ramps
            fiatAssets={fiatAssets}
            countries={countries}
            paymentRails={paymentRails}
            ramps={filteredRamps}
            resetFilters={resetFilters}
          ></Ramps>
        </div>
      </div>
    </>
  );
};

export default RampLayout;
