"use client";
import dynamic from "next/dynamic";
import { useInkeepConfig } from "./useInkeepConfig";

const SearchBar = dynamic(
  () => import("@inkeep/cxkit-react").then((mod) => mod.InkeepSearchBar),
  {
    ssr: false,
  },
);

export function InkeepSearchBar() {
  const inkeepConfig = useInkeepConfig();
  return <SearchBar {...inkeepConfig} />;
}
