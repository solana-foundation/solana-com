import { useTranslations } from "next-intl";
import ArrowSubmit from "../../../assets/playgg/arrow-submit.inline.svg";
import Button from "../shared/Button";

export default function RSVP() {
  const t = useTranslations();
  return (
    <>
      <Button
        size="large"
        variant="transparent"
        to="https://lu.ma/playgg"
        className={"uppercase !rounded-none !no-underline"}
      >
        {t("playgg.rsvp")}
        <ArrowSubmit className="ml-4" />
      </Button>
    </>
  );
}
