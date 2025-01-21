import { useState } from "react";
import styles from "./Ramps.module.scss";
import RampsCard from "./RampsCard";
import SharedModal from "../shared/SharedModal";
import Image from "next/image";
import Button from "../shared/Button";
import { Accordion } from "react-bootstrap";
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
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [generalModalData, setGeneralModalData] = useState({
    title: "Ramp",
    websiteUrl: "",
    imageUrl: "",
  });

  const handleShowModal = (ramp) => {
    const countriesOfRamp = countries.filter((countryData) =>
      ramp.meta.countries.includes(countryData.value),
    );
    const fiatAssetsOfRamp = fiatAssets.filter((fiatData) =>
      ramp.meta["fiat-assets"].includes(fiatData.value),
    );
    const paymentRailsOfRamp = paymentRails.filter((paymentData) =>
      ramp.meta["payment-rails"].includes(paymentData.value),
    );

    const fiatHtml = fiatAssetsOfRamp
      .map(
        (item) => `<span class="${styles["fiat_asset"]}">${item.title}</span>`,
      )
      .join(" ");

    setGeneralModalData({
      title: ramp.title,
      websiteUrl: ramp.websiteUrl,
      imageUrl: ramp.imageUrl,
    });

    setModalData([
      {
        content: countriesOfRamp
          .map((item) => item.title)
          .sort()
          .join(" / "),
        title: t("on-off-ramp.ramp-modal-data.country-title"),
      },
      {
        content: `<div class="tw-flex tw-flex-row tw-gap-2 tw-flex-wrap py-2">${fiatHtml}</div>`,
        title: t("on-off-ramp.ramp-modal-data.fiat-title"),
      },
      {
        content: paymentRailsOfRamp
          .map((item) => item.title)
          .sort()
          .join(" / "),
        title: t("on-off-ramp.ramp-modal-data.payment-rails-title"),
      },
    ]);

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
              showModalOnClick={() => handleShowModal(item)}
            />
          ))
        ) : (
          <div className={styles["ramp-no-results"]}>
            {t("on-off-ramp.no-results.title")}
            <Button variant="outline" onClick={resetFilters} className="ms-2">
              {t("on-off-ramp.no-results.clear-filters-button")}
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
              src={generalModalData.imageUrl}
              width={61}
              height={61}
              alt={generalModalData.title}
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
