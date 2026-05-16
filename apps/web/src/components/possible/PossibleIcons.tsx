import { useTranslations } from "next-intl";
import PossibleGlow from "./PossibleGlow";
import classNames from "classnames";
import Button from "../shared/Button";
import styles from "./PossibleIcons.module.scss";
import IconBackground from "../../../assets/possible/icons.png";
import IconMobileBackground from "../../../assets/possible/icons-mobile.png";

const PossibleIcons = () => {
  const t = useTranslations();

  return (
    <section
      className={classNames(
        styles["icons--possible"],
        "relative overflow-hidden",
      )}
      style={{ backgroundImage: `url(${IconBackground.src})` }}
    >
      <div
        className="block md:hidden absolute z-index-1 h-full w-full"
        style={{
          background: `url(${IconMobileBackground.src}) #000 center center / cover no-repeat`,
        }}
      ></div>
      <PossibleGlow
        backgroundColor="#2e00e6"
        top="80%"
        left="85%"
        height="520px"
        width="900px"
        rotation="-45deg"
      />
      <PossibleGlow
        backgroundColor="#9e00d6"
        top="-20%"
        left="-5%"
        height="520px"
        width="900px"
        rotation="20deg"
      />
      <div className="container-xl pt-48 pb-48 md:pt-32 md:pb-32 px-8 md:px-12 mx-auto relative text-center">
        <div className="grid grid-cols-12 gap-5 md:gap-10 items-center md:h-auto">
          <div className="col-span-12">
            <h3 className="h2 mb-4">{t("possible.icons.title")}</h3>
            <p
              className={classNames(
                styles["icons__copy--possible"],
                "mb-8 mx-auto",
              )}
            >
              {t("possible.icons.description")}
            </p>
            <div className="text-center md:text-left">
              <Button
                to="https://drive.google.com/file/d/1VrfJS15kOjJsKz-V9_uRlSj6gFbdLlxX/view"
                newTab
                variant="secondary"
                size={"large"}
                className="table mx-auto"
              >
                {t("possible.icons.cta")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PossibleIcons;
