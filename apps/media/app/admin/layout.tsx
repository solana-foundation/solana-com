import React from "react";
import type { Metadata } from "next";

import "@/styles.css";

export const metadata: Metadata = {
  title: "Admin | Solana Media",
  description: "Solana Media Admin Panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 antialiased">{children}</body>
    </html>
  );
}
