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
        className={classNames(styles["playgg-rsvp"], "uppercase !rounded-none")}
      >
        {t("playgg.rsvp")}
        <ArrowSubmit className="ml-4" />
      </Button>
    </>
  );
}
