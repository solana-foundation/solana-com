import { Metadata } from "next";
import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Keystatic Admin",
  description: "Content management for Solana Media",
};

export default function Layout() {
  return <KeystaticApp />;
}
