import { ReactNode } from "react";
import "../scss/index.scss";
import "./globals.css";

export const metadata = {
  title: "Solana Developer Templates",
  description:
    "Build faster with production-ready templates for dApps, DeFi protocols, NFT marketplaces, and more.",
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
