import { useState, useEffect } from "react";
import styles from "./Ramps.module.scss";
import RampsCard from "./RampsCard";
import SharedModal from "../shared/SharedModal";
// import FAQsection from "../sharedPageSections/FAQsection";
import Image from "next/image";
import RampIconPlaceholder from "./assets/ramp-icon-placeholder.png";
import Button from "../shared/Button";
import { Accordion } from "react-bootstrap";
// import AccordionBody from "react-bootstrap/esm/AccordionBody";
import CommonMarkdown from "../sharedPageSections/CommonMarkdown";
import ChevronDown from "../../../public/src/img/icons/Angle-down.inline.svg";
import { useTranslation } from "next-i18next";

const Ramps = ({
  fiatAssets,
  countries,
  paymentRails,
  ramps,
  resetFilters,
}) => {
  const { t } = useTranslation();

  const textContent = (content) => {
    return `<div class="${styles["ramp_popup_content"]}"><p>${content}</p></div>`;
  };

  const fiatContent = [...Array(16).keys()]
    .map(() => {
      return `<span class="${styles["fiat_asset"]}">€ EURO</span>`;
    })
    .join(" ");

  const [showModal, setShowModal] = useState(false);

  // Default modal data
  const [generalModalData, setGeneralModalData] = useState({
    title: "Ramp",
    websiteUrl: "",
    imageUrl: "",
  });

  // Sets default modal data but will be replaced by ramp data when clicking on a specific ramp
  const [modalData, setModalData] = useState([
    {
      content:
        "Austria / Belgium / Brazil / Bulgaria / Croatia / Cyprus / Czech Republic / Denmark / Estonia / Finland / France / Germany / Greece / Hungary / Ireland / Italy / Latvia / Lithuania / Luxembourg / Malta / Netherlands / Poland / Portugal / Romania / Slovakia / Slovenia / Spain / Sweden / United Kingdom",
      title: t("on-off-ramp.ramp-modal-data.country-title"),
    },
    {
      content: `<div class="tw-flex tw-flex-row tw-gap-2 tw-flex-wrap py-2">${fiatContent}</div>`,
      title: t("on-off-ramp.ramp-modal-data.fiat-title"),
    },
    {
      content: "PayPal / Google Wallet / Apple Pay",
      title: t("on-off-ramp.ramp-modal-data.payment-rails-title"),
    },
  ]);

  useEffect(() => {
    setShowModal(false);
  }, []);

  const showModalOnClick = (e) => {
    const index = e.target?.dataset?.index;

    if (index) {
      const data = ramps[index]; // The main object containing all the maps of the data specific to the clicked ramp

      const countriesOfRamp = countries.filter((countryData) => {
        if (data.meta.countries.includes(countryData.value)) {
          return true;
        }
      });

      const fiatAssetsOfRamp = fiatAssets.filter((fiatData) => {
        if (data.meta["fiat-assets"].includes(fiatData.value)) {
          return true;
        }
      });

      const paymentRailsOfRamp = paymentRails.filter((paymentData) => {
        if (data.meta["payment-rails"].includes(paymentData.value)) {
          return true;
        }
      });

      const fiatHtml = fiatAssetsOfRamp
        .map((item) => {
          return `<span class="${styles["fiat_asset"]}">${item.title}</span>`;
        })
        .join(" ");

      setGeneralModalData({
        title: data.title,
        websiteUrl: data.websiteUrl,
        countriesOfRamp,
        imageUrl: data.imageUrl ?? null,
      });

      // Used for the new inline accordion that allows for multiple items open at once
      setModalData([
        {
          content: textContent(
            countriesOfRamp
              .map((item) => item.title)
              .sort()
              .join(" / "),
          ),
          title: t("on-off-ramp.ramp-modal-data.country-title"),
        },
        {
          content: `<div class="tw-flex tw-flex-row tw-gap-2 tw-flex-wrap py-2">${fiatHtml}</div>`,
          title: t("on-off-ramp.ramp-modal-data.fiat-title"),
        },
        {
          content: textContent(
            paymentRailsOfRamp
              .map((item) => item.title)
              .sort()
              .join(" / "),
          ),
          title: t("on-off-ramp.ramp-modal-data.payment-rails-title"),
        },
      ]);
    }

    setShowModal(true);
  };

  return (
    <div className={`${styles["ramps"]}`}>
      <div className={`${styles["ramp__header"]}`}>
        <h2 className={`${styles["ramp__title"]}`}>All Ramps</h2>
      </div>

      <div className={`${styles["ramp__grid"]}`}>
        {ramps.length ? (
          ramps.map((item, index) => (
            <RampsCard
              title={item.title}
              description={item.description}
              key={index}
              rampIndex={index}
              imageUrl={item.imageUrl}
              showModalOnClick={showModalOnClick}
            ></RampsCard>
          ))
        ) : (
          <div className={styles["ramp-no-results"]}>
            {t("on-off-ramp.no-results.title")}
            <Button variant="outline" onClick={resetFilters} className="ms-2">
              {t("on-off-ramp.no-results.reset-filters-button-title")}
            </Button>
          </div>
        )}
      </div>

      <SharedModal
        size="lg"
        show={showModal}
        handleClose={() => {
          document.body.style.overflow = "auto";
          setShowModal(false);
        }}
        showCloseButton={false}
        className={styles["ramp-popup-custom"]}
      >
        <div className="ramp-data">
          <div className={styles["ramp__header"]}>
            <Image
              src={generalModalData.imageUrl ?? RampIconPlaceholder}
              width={61}
              height={61}
              alt="Ramp Icon Placeholder"
            />
            <h3 className={styles["ramp-popup__title"]}>
              {generalModalData.title}
            </h3>
            <Button
              to={generalModalData.websiteUrl}
              ariaLabel={t("on-off-ramp.ramp-modal-data.button-aria-label")}
              variant="tertiary"
              size="md"
              newTab={true}
            >
              {t("on-off-ramp.ramp-modal-data.button-title")}
            </Button>
          </div>
          <div className="mt-5">
            <Accordion defaultActiveKey={["0"]} alwaysOpen>
              {modalData.map((itemData, index) => (
                <Accordion.Item
                  key={index}
                  bsPrefix="custom-accordion-item"
                  className={styles["custom-accordion-item"]}
                  eventKey={index}
                >
                  <Accordion.Header
                    as="h6"
                    bsPrefix="custom-accordion-header"
                    className={styles["custom-accordion-header"]}
                  >
                    {itemData.title}
                    <ChevronDown className="collapse-chevron" />
                  </Accordion.Header>
                  <Accordion.Body>
                    <CommonMarkdown>{itemData.content}</CommonMarkdown>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </div>
      </SharedModal>
    </div>
  );
};

export default Ramps;
