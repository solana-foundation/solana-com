"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@workspace/i18n/use-router";
import { AnnouncementBar } from "@solana-foundation/solana-lib";
import styles from "./SitewideTopAlert.module.scss";

// Local announcement bar configuration
// Update this object to change the announcement bar content
const ANNOUNCEMENT_CONFIG = {
  enabled: false, // Set to true to enable the announcement bar
  text: "",
  cta: {
    label: "",
    url: "",
  },
  color: "primary",
};

/**
 * Displays an Alert at the top of the window excluding
 * all the sub-pages that the alert message is linking to
 *
 * @returns {JSX.Element}
 */
function SitewideTopAlert({ locale }) {
  const router = useRouter();
  const [announcementBarData, setAnnouncementBarData] = useState(null);

  useEffect(() => {
    // Use local configuration instead of Builder.io
    if (ANNOUNCEMENT_CONFIG.enabled) {
      setAnnouncementBarData({
        text: ANNOUNCEMENT_CONFIG.text,
        cta: ANNOUNCEMENT_CONFIG.cta,
        color: ANNOUNCEMENT_CONFIG.color,
      });
    }
  }, [locale]);

  if (
    !announcementBarData ||
    router.pathname.includes(announcementBarData?.cta?.url) ||
    router.asPath.includes("/breakpoint/app")
  ) {
    return null;
  }

  return (
    <>
      {(announcementBarData?.text || announcementBarData?.cta?.label) && (
        <div className={styles["alertOuter"]}>
          <div className={styles["alertInner"]}>
            <AnnouncementBar {...announcementBarData} dismissable={false} />
          </div>
        </div>
      )}
    </>
  );
}

export default SitewideTopAlert;
