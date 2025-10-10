"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";

export function AppProviders({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
