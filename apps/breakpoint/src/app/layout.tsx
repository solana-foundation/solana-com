import type { ReactNode } from "react";
import "@/app/globals.css";
import { config, publicAssetPath } from "@/config";
import GTMTrackingSnippet from "@/components/GTMTrackingSnippet";

export default function AppLayout({ children }: { children: ReactNode }) {
  const googleTagManagerID = config.siteMetadata.googleTagManagerID;

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href={publicAssetPath("/assets/home-hero.webp")}
          fetchPriority="high"
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <GTMTrackingSnippet />
        {children}
      </body>
    </html>
  );
}
