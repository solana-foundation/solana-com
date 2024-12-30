"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/hooks/useRouter";
import { AnnouncementBar } from "@solana-foundation/solana-lib";
import builder from "@builder.io/react";
import { BUILDER_CONFIG } from "../../lib/builder/builderConstants";
import styles from "./SitewideTopAlert.module.scss";

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
    // Fetch announcement bar data from Builder.io
    builder.init(BUILDER_CONFIG.apiKey);
    builder.apiVersion = "v3";
    builder
      .get("component-announcement-bar", {
        staleCacheSeconds: 20,
        userAttributes: {
          locale,
        },
        options: {
          locale,
        },
      })
      .promise()
      .then((response) => {
        setAnnouncementBarData({
          text: response.data.text,
          cta: {
            label: response.data.ctaLabel,
            url: response.data.ctaUrl,
          },
          color: response.data.color,
        });
      });
  }, [locale]);

  if (
    router.pathname.includes(announcementBarData?.cta.url) ||
    router.asPath.includes("/breakpoint/app")
  ) {
    return null;
  }

  return (
    <>
      {(announcementBarData?.text || announcementBarData?.cta.label) && (
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
