import { isProductionAnalyticsEnabled } from "./analytics";

/** No-JavaScript fallback for an approved GTM container. */
export function GoogleTagManagerNoScript({
  containerId,
}: {
  containerId: string;
}) {
  if (!isProductionAnalyticsEnabled()) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${containerId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
