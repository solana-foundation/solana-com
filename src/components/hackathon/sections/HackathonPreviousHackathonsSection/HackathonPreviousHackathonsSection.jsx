import classNames from "classnames";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { ArrowRightCircle } from "react-feather";
import CarouselCards from "../../../shared/CarouselCards";
import Link from "../../../shared/Link";
import renaissanceImg from "../../../../../assets/hackathon/past-hackathons/renaissance.jpg";
import hyperdriveImg from "../../../../../assets/hackathon/past-hackathons/hyperdrive.jpg";
import grizzlythonImg from "../../../../../assets/hackathon/past-hackathons/grizzlython.jpg";
import summercampImg from "../../../../../assets/hackathon/past-hackathons/summercamp.png";
import riptideImg from "../../../../../assets/hackathon/past-hackathons/riptide.jpg";
import ignitionImg from "../../../../../assets/hackathon/past-hackathons/ignition.jpg";
import seasonImg from "../../../../../assets/hackathon/past-hackathons/season.jpg";
import defiImg from "../../../../../assets/hackathon/past-hackathons/defi.png";
import inauguralImg from "../../../../../assets/hackathon/past-hackathons/inaugural.png";
import styles from "./HackathonPreviousHackathonsSection.module.scss";

function PreviousHackathonCard({ date, title, description, to, image }) {
  return (
    <Link to={to} className={styles["previous-hackathons__card"]}>
      <Image src={image} width={384} height={190} alt={title} />
      <div
        className={classNames(
          styles["previous-hackathons__card--content"],
          "d-flex flex-column",
        )}
      >
        <span>{date}</span>
        <div className={"d-flex justify-content-between"}>
          <h3>{title}</h3>
          <button className="btn btn-sm btn-link p-0">
            <ArrowRightCircle strokeWidth={1} />
          </button>
        </div>
        <p>{description}</p>
      </div>
    </Link>
  );
}

export default function HackathonPreviousHackathonsSection() {
  const { t } = useTranslation();
  return (
    <section className="mt-12">
      <div className="container">
        <h2 className="text-center">
          {t("hackathon.previousHackathons.title")}
        </h2>
        <div className="mt-8">
          <CarouselCards>
            <PreviousHackathonCard
              title={t("hackathon.previousHackathons.renaissance.title")}
              description={t(
                "hackathon.previousHackathons.renaissance.description",
              )}
              date="May 2024"
              to="/news/solana-renaissance-winners"
              image={renaissanceImg}
            />
            <PreviousHackathonCard
              title={t("hackathon.previousHackathons.hyperdrive.title")}
              description={t(
                "hackathon.previousHackathons.hyperdrive.description",
              )}
              date="November 2023"
              to="/news/solana-hyperdrive-hackathon-winners"
              image={hyperdriveImg}
            />
            <PreviousHackathonCard
              title={t("hackathon.previousHackathons.grizzlython.title")}
              description={t(
                "hackathon.previousHackathons.grizzlython.description",
              )}
              date="February 2023"
              to="/news/solana-grizzlython-winners"
              image={grizzlythonImg}
            />
            <PreviousHackathonCard
              title={t("hackathon.previousHackathons.summercamp.title")}
              description={t(
                "hackathon.previousHackathons.summercamp.description",
              )}
              date="July 2022"
              to="/news/solana-summer-camp-winners"
              image={summercampImg}
            />
            <PreviousHackathonCard
              title={t("hackathon.previousHackathons.riptide.title")}
              description={t(
                "hackathon.previousHackathons.riptide.description",
              )}
              date="February 2022"
              to="/news/riptide-hackathon-winners-solana"
              image={riptideImg}
            />
            <PreviousHackathonCard
              title={t("hackathon.previousHackathons.ignition.title")}
              description={t(
                "hackathon.previousHackathons.ignition.description",
              )}
              date="September 2021"
              to="/news/solana-ignition-hackathon-winners"
              image={ignitionImg}
            />
            <PreviousHackathonCard
              title={t("hackathon.previousHackathons.season.title")}
              description={t("hackathon.previousHackathons.season.description")}
              date="May 2021"
              to="/news/announcing-winners-of-the-solana-season-hackathon"
              image={seasonImg}
            />
            <PreviousHackathonCard
              title={t("hackathon.previousHackathons.defi.title")}
              description={t("hackathon.previousHackathons.defi.description")}
              date="February 2021"
              to="/news/winners-of-the-solana-x-serum-defi-hackathon"
              image={defiImg}
            />
            <PreviousHackathonCard
              title={t("hackathon.previousHackathons.inaugural.title")}
              description={t(
                "hackathon.previousHackathons.inaugural.description",
              )}
              date="November 2020"
              to="/news/announcing-the-winners-of-solana-s-inaugural-hackathon"
              image={inauguralImg}
            />
          </CarouselCards>
        </div>
      </div>
    </section>
  );
}
