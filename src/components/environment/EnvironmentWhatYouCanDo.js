import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { ArrowRightCircle } from "react-feather";
import styles from "./EnvironmentWhatYouCanDo.module.scss";
import dataImg from "../../../assets/environment/usages/data.png";
import footprintImg from "../../../assets/environment/usages/footprint.png";
import grantsImg from "../../../assets/environment/usages/grants.png";
import { InlineLink } from "../../utils/Link";

function WhatYouCanDoCard({ usage }) {
  return (
    <InlineLink
      to={usage.url}
      className={classNames("card", styles["usage"])}
      style={{ backgroundImage: `url(${usage.image.src}` }}
    >
      <div className="d-flex flex-row">
        <div>
          <h3>{usage?.title}</h3>
          <p className="subdued">{usage?.description}</p>
        </div>
        <div>
          <button className="btn btn-sm btn-link p-0">
            <ArrowRightCircle />
          </button>
        </div>
      </div>
    </InlineLink>
  );
}

export default function EnvironmentWhatYouCanDo() {
  const { t } = useTranslation("common");

  const usages = [
    {
      title: t("environment.what-you-can-do.data.title"),
      description: t("environment.what-you-can-do.data.description"),
      image: dataImg,
      url: "/news/announcing-real-time-emissions-measurement-on-the-solana-blockchain",
    },
    {
      title: t("environment.what-you-can-do.footprint.title"),
      description: t("environment.what-you-can-do.footprint.description"),
      image: footprintImg,
      url: "https://medium.com/orca-so/what-daos-can-do-about-climate-change-e38292c46c16",
    },
    {
      title: t("environment.what-you-can-do.grants.title"),
      description: t("environment.what-you-can-do.grants.description"),
      image: grantsImg,
      url: "https://solanafoundation.notion.site/Solana-Foundation-RFPs-be81db095f054b3f895e1c03de3e65fd",
    },
  ];

  return (
    <section
      className={classNames(
        "container mb-8",
        styles["environment-what-you-can-do"],
      )}
    >
      <h2
        className={classNames(
          "h3 text-center mb-5 mb-lg-8",
          styles["environment-what-you-can-do__title"],
        )}
      >
        {t("environment.what-you-can-do.title")}
      </h2>
      <div
        className={classNames(
          "d-flex flex-column flex-md-row",
          styles["usages"],
        )}
      >
        {usages.map((usage, idx) => (
          <WhatYouCanDoCard key={idx} usage={usage} />
        ))}
      </div>
    </section>
  );
}
