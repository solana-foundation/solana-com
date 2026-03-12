/**
 * Sitewide Top Alert Configuration
 *
 * To enable the alert across all apps:
 * 1. Set `enabled` to `true`
 * 2. Update `text` with the announcement message
 * 3. Update `cta.label` and `cta.url` with the call-to-action
 * 4. Optionally change `color` to match the announcement theme
 *
 * Colors available: "green" | "purple"
 */

export type AlertColor = "green" | "purple";

export interface SitewideTopAlertConfig {
  /** Set to true to show the announcement bar site-wide */
  enabled: boolean;
  /** The main announcement text */
  text: string;
  /** Call-to-action button configuration */
  cta: {
    /** Button label */
    label: string;
    /** Button URL - pages matching this URL will not show the alert */
    url: string;
  };
  /** Color theme for the announcement bar */
  color: AlertColor;
  /** Paths that should never show the alert (in addition to the CTA URL) */
  excludedPaths: string[];
}

export const sitewideTopAlertConfig: SitewideTopAlertConfig = {
  enabled: false,
  text: "",
  cta: {
    label: "",
    url: "",
  },
  color: "green",
  excludedPaths: ["/breakpoint/app"],
};
