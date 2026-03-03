import { useState } from "react";
import styles from "./Ramps.module.scss";
import RampsCard from "./RampsCard";
import SharedModal from "../shared/SharedModal";
import Image from "next/image";
import Button from "../shared/Button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@workspace/ui";
import CommonMarkdown from "../sharedPageSections/CommonMarkdown";
import { useTranslations } from "next-intl";

const Ramps = ({
  fiatAssets,
  countries,
  paymentRails,
  ramps,
  resetFilters,
}) => {
  const t = useTranslations();
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
        content: `<div class="flex flex-row gap-2 flex-wrap py-2">${fiatHtml}</div>`,
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
            <Button variant="outline" onClick={resetFilters} className="ml-2">
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
          <div className="mt-6">
            <Accordion type="multiple">
              {modalData.map((itemData, index) => (
                <AccordionItem
                  key={index}
                  className={styles["custom-accordion-item"]}
                  value={String(index)}
                >
                  <AccordionTrigger
                    className={`${styles["custom-accordion-header"]} [&>svg]:self-center [&>svg]:size-5 [&[data-state="open"]>svg]:rotate-180`}
                  >
                    <h6 className="m-0">{itemData.title}</h6>
                  </AccordionTrigger>
                  <AccordionContent className="pl-5 pr-5">
                    <CommonMarkdown>{itemData.content}</CommonMarkdown>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </SharedModal>
    </div>
  );
};

export default Ramps;
