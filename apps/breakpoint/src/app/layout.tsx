import type { ReactNode } from "react";
import "@/app/globals.css";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="/assets/hero-architecture-poster.webp"
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
