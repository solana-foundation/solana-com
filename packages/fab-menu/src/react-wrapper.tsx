import { createElement, useEffect, useRef } from "react";
import type { FabMenuConfig } from "./types";

export type { FabMenuConfig } from "./types";
export type { MenuData, TabData, LinkData } from "./types";

interface SolanaFabMenuElement extends HTMLElement {
  configure(config: FabMenuConfig): void;
}

export function SolanaFabMenu(props: FabMenuConfig) {
  const ref = useRef<SolanaFabMenuElement>(null);
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current) return;
    registered.current = true;
    import("./web-component");
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (el.configure) {
      el.configure(props);
    } else {
      customElements.whenDefined("solana-fab-menu").then(() => {
        el.configure(props);
      });
    }
  }, [props]);

  return createElement("solana-fab-menu", { ref });
}
