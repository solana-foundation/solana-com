import Image from "next/image";
import { useTranslation } from "next-i18next";
import Button from "../shared/Button";
import Link from "next/link";
import PossibleGlow from "./PossibleGlow";
import classNames from "classnames";
import styles from "./PossibleStartBuilding.module.scss";
import portalImg from "../../../assets/possible/startBuilding-portal.png";
import programmingImg from "../../../assets/possible/startBuilding-programming.png";
import communityImg from "../../../assets/possible/startBuilding-community.png";

const PossibleStartBuilding = () => {
  const { t } = useTranslation();

  return (
    <section className={styles["section__start-building--possible"]}>
      <PossibleGlow
        backgroundColor="#2e00e6"
        top="0%"
        left="65%"
        height="520px"
        width="900px"
        rotation="20deg"
        className="d-none d-md-block z-n1"
      />
      <div className="container pt-8 pb-4 pt-md-10 pb-md-12 px-md-0 position-relative z-index-1">
        <div className={`row d-flex align-items-end`}>
          <div className="col">
            <h2 className="h2 mb-10 mb-md-6 text-start text-md-center">
              {t("possible.startBuilding.title")}
            </h2>
          </div>
        </div>
        <div className={`row flex-md-wrap `}>
          <StartBuildingColumn
            image={portalImg}
            title={t("possible.startBuilding.portal.title")}
            copy={t("possible.startBuilding.portal.description")}
            cta={t("possible.startBuilding.portal.cta")}
            url={"/developers"}
          />
          <StartBuildingColumn
            image={programmingImg}
            title={t("possible.startBuilding.programming.title")}
            copy={t("possible.startBuilding.programming.description")}
            cta={t("possible.startBuilding.programming.cta")}
            url={"/events"}
          />
          <StartBuildingColumn
            image={communityImg}
            title={t("possible.startBuilding.community.title")}
            copy={t("possible.startBuilding.community.description")}
            cta={t("possible.startBuilding.community.cta")}
            url={"/community"}
          />
        </div>
      </div>
    </section>
  );
};

const StartBuildingColumn = ({ image, title, copy, cta, url }) => {
  return (
    <div className="col-12 col-md-4 mb-8 mb-md-0 d-md-flex flex-md-column flex-md-grow-1">
      <div
        className={classNames(
          styles["card--possible"],
          `h-md-100 d-md-flex flex-md-column`,
        )}
      >
        <Link
          href={url}
          className="d-flex justify-content-center mt-n9 mt-md-0 mb-3 mb-md-6"
        >
          <Image
            priority
            src={image}
            alt=""
            className={`px-lg-6 w-100 h-auto`}
          />
        </Link>
        <Link href={url} className="d-block mb-4">
          <h3 className="h6 fw-semibold text-white">{title}</h3>
        </Link>
        <p className={"copy mb-5"}>{copy}</p>
        <Button
          to={url}
          newTab
          variant="outline"
          size="large"
          className={"mt-md-auto"}
        >
          {cta}
        </Button>
      </div>
    </div>
  );
};

export default PossibleStartBuilding;
