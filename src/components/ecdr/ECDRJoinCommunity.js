import { useTranslation } from "next-i18next";
import classNames from "classnames";
import styles from "./ECDRJoinCommunity.module.scss";
import EmailSubscribeForm from "../shared/EmailSubscribeForm";
import Link from "../../utils/Link";

const ECDRJoinCommunity = () => {
  const { t } = useTranslation("common");

  return (
    <div
      className={classNames("mb-10 container", styles["ecdr-join-community"])}
    >
      <div className={styles["ecdr-join-community__signup"]}>
        <h5 className={styles["ecdr-join-community__signup--title"]}>
          {t("ecdr.join-community.title")}
        </h5>
        <p
          className={classNames(
            "mt-5",
            styles["ecdr-join-community__signup--description"],
          )}
        >
          {t("ecdr.join-community.description")}
        </p>
        <div className="d-flex mt-6">
          <EmailSubscribeForm formId="c54770ae-9976-4ab8-8b7f-21d288659efe" />
        </div>
      </div>
      <Link
        to="/grizzlython"
        className={styles["ecdr-join-community__background"]}
      >
        <span className="visually-hidden">Grizzlython hackathon</span>
      </Link>
    </div>
  );
};

export default ECDRJoinCommunity;
