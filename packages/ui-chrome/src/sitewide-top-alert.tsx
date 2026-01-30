"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@workspace/i18n/use-router";
import { ArrowRight } from "react-feather";
import {
  sitewideTopAlertConfig,
  type AlertColor,
} from "./sitewide-top-alert-config";

const colorStyles: Record<AlertColor, { background: string; color: string }> = {
  green: {
    background: "linear-gradient(90deg, #00d18c 0%, #14f195 50%, #9945ff 100%)",
    color: "#000000",
  },
  purple: {
    background: "linear-gradient(90deg, #9945ff 0%, #14f195 100%)",
    color: "#ffffff",
  },
};

interface AnnouncementBarProps {
  text: string;
  cta: {
    label: string;
    url: string;
  };
  color: AlertColor;
}

function AnnouncementBar({ text, cta, color }: AnnouncementBarProps) {
  const styles = colorStyles[color];

  return (
    <div
      role="banner"
      className="flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium text-center"
      style={{ background: styles.background, color: styles.color }}
    >
      {text && <span>{text}</span>}
      {cta?.label && cta?.url && (
        <a
          href={cta.url}
          className="inline-flex items-center gap-1.5 font-semibold transition-opacity duration-200 hover:opacity-80 hover:underline"
          style={{ color: "inherit" }}
        >
          {cta.label}
          <ArrowRight size={14} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

/**
 * Displays an Alert at the top of the window excluding
 * all the sub-pages that the alert message is linking to
 * and paths in excludedPaths configuration.
 *
 * Configuration is managed in sitewide-top-alert-config.ts
 */
export function SitewideTopAlert() {
  const router = useRouter();
  const [announcementBarData, setAnnouncementBarData] = useState<{
    text: string;
    cta: { label: string; url: string };
    color: AlertColor;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (sitewideTopAlertConfig.enabled) {
      setAnnouncementBarData({
        text: sitewideTopAlertConfig.text,
        cta: sitewideTopAlertConfig.cta,
        color: sitewideTopAlertConfig.color,
      });
      // Trigger animation after mount
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, []);

  // Don't render if not enabled or data not set
  if (!announcementBarData) {
    return null;
  }

  // Don't render on pages that match the CTA URL
  if (
    announcementBarData.cta?.url &&
    router.asPath.includes(announcementBarData.cta.url)
  ) {
    return null;
  }

  // Don't render on excluded paths
  const isExcludedPath = sitewideTopAlertConfig.excludedPaths.some((path) =>
    router.asPath.includes(path),
  );
  if (isExcludedPath) {
    return null;
  }

  // Don't render if there's no content
  if (!announcementBarData.text && !announcementBarData.cta?.label) {
    return null;
  }

  return (
    <div
      className="relative w-full z-[1] grid transition-all duration-300 ease-out"
      style={{
        gridTemplateRows: isVisible ? "1fr" : "0fr",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="overflow-hidden">
        <AnnouncementBar {...announcementBarData} />
      </div>
    </div>
  );
}
