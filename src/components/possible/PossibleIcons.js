import { useTranslation } from "next-i18next";
import PossibleGlow from "./PossibleGlow";
import classNames from "classnames";
import Button from "../shared/Button";
import styles from "./PossibleIcons.module.scss";
import IconBackground from "../../../assets/possible/icons.png";
import IconMobileBackground from "../../../assets/possible/icons-mobile.png";

const PossibleIcons = () => {
  const { t } = useTranslation();

  return (
    <section
      className={classNames(
        styles["icons--possible"],
        "position-relative overflow-hidden",
      )}
      style={{ backgroundImage: `url(${IconBackground.src})` }}
    >
      <div
        className={`d-block d-md-none position-absolute z-n1 h-100 w-100`}
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
      <div className="container-xl pt-14 pb-14 pt-md-12 pb-md-12 px-6 px-md-8 mx-auto position-relative text-center">
        <div className={`row d-flex align-items-center h-md-auto`}>
          <div className="col">
            <h3 className="h2 mb-4">{t("possible.icons.title")}</h3>
            <p
              className={classNames(
                styles["icons__copy--possible"],
                `mb-6 mx-auto`,
              )}
            >
              {t("possible.icons.description")}
            </p>
            <div className={`text-center text-md-start`}>
              <Button
                to="https://drive.google.com/file/d/1VrfJS15kOjJsKz-V9_uRlSj6gFbdLlxX/view"
                newTab
                variant="secondary"
                size={"large"}
                className="d-table mx-auto"
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
