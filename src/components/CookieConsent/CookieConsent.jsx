"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Button from "../shared/Button";
import classNames from "classnames";
import styles from "./CookieConsent.module.scss";

// Get localstorage with expiry date
const getLocalStorage = function (key, defaultValue) {
  const now = new Date().getTime();
  let sticky = null;

  try {
    sticky = JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(error);
  }

  if (sticky !== null && sticky !== "undefined") {
    // remove stored consent value based on the expiration date
    if (now > sticky.timeToExpire) {
      localStorage.removeItem(key);
    }
    return sticky.value;
  }

  return defaultValue;
};

// Set localstorage with expiry date
const setLocalStorage = function (key, value) {
  const now = new Date().getTime();
  const timeToExpire = 15778476000; //6months

  const obj = { value, timeToExpire: now + timeToExpire };
  localStorage.setItem(key, JSON.stringify(obj));
};

export default function CookieConsent() {
  const { t } = useTranslation("common");

  // cookieConsent is blank by default
  const [cookieConsent, setCookieConsent] = useState("");

  // check if it has previously set within localStorage, or null otherwise
  useEffect(() => {
    const consent = getLocalStorage("cookie_consent", null);
    setCookieConsent(consent);

    // set builderNoTrack based on the previously set consent
    if (typeof window !== "undefined" && consent) {
      window.builderNoTrack = !consent;
    }
  }, [setCookieConsent]);

  // update when cookieConsent is changed via onClick
  useEffect(() => {
    if (typeof window.gtag !== "undefined" && cookieConsent !== "") {
      setLocalStorage("cookie_consent", cookieConsent);
      window.gtag("consent", "update", {
        ad_storage: cookieConsent ? "granted" : "denied",
        ad_user_data: cookieConsent ? "granted" : "denied",
        ad_personalization: cookieConsent ? "granted" : "denied",
        analytics_storage: cookieConsent ? "granted" : "denied",
      });

      window.builderNoTrack = !cookieConsent;
    }
  }, [cookieConsent]);

  return (
    <>
      {cookieConsent === null ? (
        <div
          className={classNames(
            "border bg-black p-4 rounded",
            styles["cookie-consent"],
          )}
        >
          <div className="small">
            <p>{t("cookie-consent.title")}</p>
          </div>

          <div className="d-flex align-items-center justify-content-between smaller">
            <div>
              <Button
                variant="captioned"
                className="px-0"
                onClick={() => setCookieConsent(false)}
              >
                {t("cookie-consent.button.optout")}
              </Button>
              <Button
                to="/privacy-policy#collection-of-information"
                variant="captioned"
                className="px-0 ms-4"
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
