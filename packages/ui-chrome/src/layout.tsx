"use client";
import { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
