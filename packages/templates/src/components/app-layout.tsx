"use client";

import { AppHeader } from "../header";
import React from "react";
import { AppFooter } from "../app-footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 overflow-hidden">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
