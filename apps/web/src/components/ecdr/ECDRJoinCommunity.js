import { useTranslations } from "next-intl";
import classNames from "classnames";
import styles from "./ECDRJoinCommunity.module.scss";
import EmailSubscribeForm from "../shared/EmailSubscribeForm";
import Link from "../../utils/Link";

const ECDRJoinCommunity = () => {
  const t = useTranslations();

  return (
    <div
      className={classNames("mb-20 container", styles["ecdr-join-community"])}
    >
      <div className={styles["ecdr-join-community__signup"]}>
        <h5 className={styles["ecdr-join-community__signup--title"]}>
          {t("ecdr.join-community.title")}
        </h5>
        <p
          className={classNames(
            "mt-6",
            styles["ecdr-join-community__signup--description"],
          )}
        >
          {t("ecdr.join-community.description")}
        </p>
        <div className="flex mt-8">
          <EmailSubscribeForm formId="c54770ae-9976-4ab8-8b7f-21d288659efe" />
        </div>
      </div>
      <Link
        to="/grizzlython"
        className={styles["ecdr-join-community__background"]}
      >
        <span className="sr-only">Grizzlython hackathon</span>
      </Link>
    </div>
  );
};

export default ECDRJoinCommunity;
