import { useEffect } from "react";
import { FabApp } from "./fab-app";
import { injectStyles } from "./styles";
import type { FabMenuConfig } from "./types";

export type { FabMenuConfig } from "./types";
export type {
  MenuData,
  TabData,
  LinkData,
  FeaturedData,
  StatData,
  PromoData,
  TabIcon,
} from "./types";

export function SolanaFabMenu(props: FabMenuConfig) {
  useEffect(() => {
    injectStyles();
  }, []);

  return <FabApp config={props} />;
}
