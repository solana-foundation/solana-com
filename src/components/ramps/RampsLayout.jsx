import { useState } from "react";
import Filters from "./Filters";
import Ramps from "./Ramps";
import styles from "./RampsLayout.module.scss";
import RampsSearch from "./RampsSearch";
import { Hero } from "@solana-foundation/solana-lib";
import onOffRampHeroImage from "../../../assets/onofframp/on-off-ramp-hero-img.png";
import { useTranslation } from "next-i18next";

// Logo imports
import alchemyPayLogo from "./assets/logos/alchemy-pay.png";
import banxa from "./assets/logos/banxa.png";
import coinflow from "./assets/logos/coinflow.png";
import coinify from "./assets/logos/coinify.png";
import kado from "./assets/logos/kado.png";
import luno from "./assets/logos/luno.png";
import mercuryo from "./assets/logos/mercuryo.png";
import mesonetwork from "./assets/logos/meso.png";
import moneygram from "./assets/logos/moneygram.png";
import moonpay from "./assets/logos/moonpay.png";
import onmeta from "./assets/logos/onmeta.png";
import onramp from "./assets/logos/onramp.png";
import payfura from "./assets/logos/payfura.png";
import saber from "./assets/logos/saber.png";
import scalex from "./assets/logos/scalex.png";
import stripe from "./assets/logos/stripe.png";
import transak from "./assets/logos/transak.png";
import transfero from "./assets/logos/transfero.png";
import transfi from "./assets/logos/transfi.png";
import unlimit from "./assets/logos/unlimit.png";
import utorg from "./assets/logos/untorg.png";
import paybis from "./assets/logos/paybis.png";
import topper from "./assets/logos/topper.png";

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

  const RampLogoMap = [
    {
      ramp: "AlchemyPay",
      logo: alchemyPayLogo,
    },
    {
      ramp: "Banxa",
      logo: banxa,
    },
    {
      ramp: "Coinflow",
      logo: coinflow,
    },
    {
      ramp: "Coinify",
      logo: coinify,
    },
    {
      ramp: "Kado",
      logo: kado,
    },
    {
      ramp: "Luno",
      logo: luno,
    },
    {
      ramp: "Mercuryo",
      logo: mercuryo,
    },
    {
      ramp: "Meso Network",
      logo: mesonetwork,
    },
    {
      ramp: "Moonpay",
      logo: moonpay,
    },
    {
      ramp: "Moneygram",
      logo: moneygram,
    },
    {
      ramp: "Onmeta",
      logo: onmeta,
    },
    {
      ramp: "OnRamp",
      logo: onramp,
    },
    {
      ramp: "Payfura",
      logo: payfura,
    },
    {
      ramp: "Saber Money",
      logo: saber,
    },
    {
      ramp: "Scalex",
      logo: scalex,
    },
    {
      ramp: "Stripe",
      logo: stripe,
    },
    {
      ramp: "Transak",
      logo: transak,
    },
    {
      ramp: "Transfero",
      logo: transfero,
    },
    {
      ramp: "TransFi",
      logo: transfi,
    },
    {
      ramp: "Unlimit Crypto",
      logo: unlimit,
    },
    {
      ramp: "Utorg",
      logo: utorg,
    },
    {
      ramp: "Paybis",
      logo: paybis,
    },
    {
      ramp: "Topper",
      logo: topper,
    },
  ];

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
        Countries2,
        FiatAssets2,
        PaymentRails2,
      } = matchingRamp[0].fields;

      const matchingRampLogoObject = RampLogoMap.filter(
        (item) => item.ramp === RampName,
      );

      placeholderRamps.push({
        title: RampName,
        description: Description ?? "",
        websiteUrl: WebsiteUrl,
        imageUrl: matchingRampLogoObject.length
          ? matchingRampLogoObject[0].logo.src
          : null,
        meta: {
          countries: Countries2 ?? [],
          "payment-rails": PaymentRails2 ?? [],
          "fiat-assets": FiatAssets2 ?? [],
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
   * Runs through an array of records that comes from the Airtable API, sorts them by Name, then returns the correct format for the data for our checkboxes
   *
   * @param {Array} dataArray the Data that gets returned from the Airtable API
   * @param {String} checkboxName the name of the checkbox so when one is clicked the ramps will filter based on that data
   * @returns array
   */
  const sortAndFormatData = (dataArray, checkboxName) => {
    const sortedData = [];
    if (dataArray.length) {
      const onlyTitles = dataArray.map((data) => data.fields.Name).sort();

      onlyTitles.forEach((title) => {
        const data = dataArray.filter((item) => item.fields.Name === title);
        sortedData.push({
          value: data[0].id,
          title: data[0].fields?.Name,
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
