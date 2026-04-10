"use client";

import { useTranslations } from "next-intl";
import { useCookieConsent } from "@solana-com/ui-chrome";
import Button from "../shared/Button";
import classNames from "classnames";
import styles from "./CookieConsent.module.scss";

export default function CookieConsent() {
  const t = useTranslations();
  const { setCookieConsent, shouldShowBanner } = useCookieConsent();

  return (
    <>
      {shouldShowBanner ? (
        <div
          className={classNames(
            "border bg-black text-white p-4 rounded",
            styles["cookie-consent"],
          )}
        >
          <div className="small">
            <p>{t("cookie-consent.title")}</p>
          </div>

          <div className="flex items-center justify-between smaller">
            <div>
              <Button
                variant="captioned"
                className="!px-0"
                onClick={() => setCookieConsent(false)}
              >
                {t("cookie-consent.button.optout")}
              </Button>
              <Button
                to="/privacy-policy#collection-of-information"
                variant="captioned"
                className="!px-0 ml-4"
              >
                {t("cookie-consent.button.details")}
              </Button>
            </div>
            <Button onClick={() => setCookieConsent(true)}>
              {t("cookie-consent.button.accept")}
            </Button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
