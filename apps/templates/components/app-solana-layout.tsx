"use client";

import React from "react";
import { AppSolanaHeader, HeaderNavigationLink } from "./header";
import { AppSolanaFooter } from "./app-solana-footer";

const links: HeaderNavigationLink[] = [
  { label: "Documentation", href: "https://solana.com/docs" },
  { label: "Cookbook", href: "https://solana.com/developers/cookbook" },
];

export function AppSolanaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <AppSolanaHeader links={links} />
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <AppSolanaFooter />
    </div>
  );
}
