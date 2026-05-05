import type { ReactNode } from "react";
import "@/app/globals.css";
import { publicAssetPath } from "@/config";

export default function AppLayout({ children }: { children: ReactNode }) {
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
      <body>{children}</body>
    </html>
  );
}
