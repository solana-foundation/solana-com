import Image from "next/legacy/image";
import { useTranslation } from "next-i18next";
import HackathonSponsorCard from "./HackathonSponsorCard";
import graphicLeft from "../../../../../assets/hackathon/previous-sponsors/graphic-left.png";
import graphicRight from "../../../../../assets/hackathon/previous-sponsors/graphic-right.png";
import googleLogo from "../../../../../assets/hackathon/previous-sponsors/google.png";
import microsoftLogo from "../../../../../assets/hackathon/previous-sponsors/microsoft.png";
import stripeLogo from "../../../../../assets/hackathon/previous-sponsors/stripe.png";
import visaLogo from "../../../../../assets/hackathon/previous-sponsors/visa.png";
import jumpLogo from "../../../../../assets/hackathon/previous-sponsors/jump.png";
import samsungLogo from "../../../../../assets/hackathon/previous-sponsors/samsung.png";
import tsmLogo from "../../../../../assets/hackathon/previous-sponsors/tsm.png";
import standardCharteredLogo from "../../../../../assets/hackathon/previous-sponsors/standard-chartered.png";
import styles from "./HackathonPreviousSponsorsSection.module.scss";
import classNames from "classnames";

const pastSponsors = [
  { logo: googleLogo, alt: "google", width: 112, height: 38 },
  { logo: microsoftLogo, alt: "microsoft", width: 136, height: 29 },
  { logo: stripeLogo, alt: "stripe", width: 80, height: 33 },
  { logo: visaLogo, alt: "visa", width: 66, height: 22 },
  { logo: jumpLogo, alt: "jump_", width: 95, height: 30 },
  { logo: samsungLogo, alt: "samsung", width: 104, height: 16 },
  { logo: tsmLogo, alt: "tsm", width: 51, height: 49 },
  {
    logo: standardCharteredLogo,
    alt: "standard-chartered",
    width: 107,
    height: 42,
  },
];

export default function HackathonPreviousSponsorsSection() {
  const { t } = useTranslation();

  return (
    <section className={styles["previous-sponsors"]}>
      <div
        className={classNames(
          "container position-relative",
          styles["previous-sponsors__content"],
        )}
      >
        <h2>{t("hackathon.previousSponsors.title")}</h2>
        <div className={styles["previous-sponsors__container"]}>
          {pastSponsors.map(({ logo, alt, width, height }) => (
            <HackathonSponsorCard
              key={alt}
              alt={alt}
              logo={logo}
              width={width}
              height={height}
            />
          ))}
        </div>
      </div>
      <div className={styles["previous-sponsors__graphic-left"]}>
        <Image src={graphicLeft} />
      </div>
      <div className={styles["previous-sponsors__graphic-right"]}>
        <Image src={graphicRight} />
      </div>
      <div className={styles["previous-sponsors__background"]}></div>
    </section>
  );
}
