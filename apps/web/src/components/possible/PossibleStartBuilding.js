import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "../shared/Button";
import Link from "next/link";
import PossibleGlow from "./PossibleGlow";
import classNames from "classnames";
import styles from "./PossibleStartBuilding.module.scss";
import portalImg from "../../../assets/possible/startBuilding-portal.png";
import programmingImg from "../../../assets/possible/startBuilding-programming.png";
import communityImg from "../../../assets/possible/startBuilding-community.png";

const PossibleStartBuilding = () => {
  const t = useTranslations();

  return (
    <section className={styles["section__start-building--possible"]}>
      <PossibleGlow
        backgroundColor="#2e00e6"
        top="0%"
        left="65%"
        height="520px"
        width="900px"
        rotation="20deg"
        className="hidden md:block [z-index:-1]"
      />
      <div className="container pt-12 pb-4 md:pt-20 md:pb-32 md:px-0 relative z-[1]">
        <div className="grid grid-cols-12 gap-5 md:gap-10 items-end">
          <div className="col-span-12">
            <h2 className="h2 mb-20 md:mb-8 text-left md:text-center">
              {t("possible.startBuilding.title")}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-5 md:gap-10">
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
    <div className="col-span-12 md:col-span-4 mb-12 md:mb-0 md:flex md:flex-col md:grow">
      <div
        className={classNames(
          styles["card--possible"],
          "md:h-full md:flex md:flex-col",
        )}
      >
        <Link
          href={url}
          className="flex justify-center -mt-16 md:mt-0 mb-3 md:mb-8"
        >
          <Image
            priority
            src={image}
            alt=""
            className="lg:px-8 w-full h-auto"
          />
        </Link>
        <Link href={url} className="block mb-4">
          <h3 className="h6 font-semibold text-white">{title}</h3>
        </Link>
        <p className="copy mb-6">{copy}</p>
        <Button
          to={url}
          newTab
          variant="outline"
          size="large"
          className="md:mt-auto"
        >
          {cta}
        </Button>
      </div>
    </div>
  );
};

export default PossibleStartBuilding;
