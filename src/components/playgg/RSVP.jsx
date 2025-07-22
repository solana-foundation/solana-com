import { useTranslations } from "next-intl";
import ArrowSubmit from "../../../assets/playgg/arrow-submit.inline.svg";
import styles from "./RSVP.module.scss";
import classNames from "classnames";
import Button from "../shared/Button";

export default function RSVP() {
  const t = useTranslations();
  return (
    <>
      <Button
        size="large"
        variant="transparent"
        to="https://lu.ma/playgg"
        className={classNames(
          styles["playgg-rsvp"],
          "text-uppercase rounded-0",
        )}
      >
        {t("playgg.rsvp")}
        <ArrowSubmit className="ms-4" />
      </Button>
    </>
  );
}
