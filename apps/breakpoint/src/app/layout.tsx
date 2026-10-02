import type { ReactNode } from "react";
import "@/app/globals.css";
import { config, publicAssetPath } from "@/config";
import GTMTrackingSnippet from "@/components/GTMTrackingSnippet";
import { GoogleTagManagerNoScript } from "@solana-com/ui-chrome";

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
        <GoogleTagManagerNoScript containerId={googleTagManagerID} />
        <GTMTrackingSnippet />
        {children}
      </body>
    </html>
  );
}
