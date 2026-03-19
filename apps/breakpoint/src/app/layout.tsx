import type { ReactNode } from "react";
import "@/app/globals.css";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
