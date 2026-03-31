/** @jsxImportSource preact */
import { h, render } from "preact";
import { FabApp } from "./fab-app";
import { injectStyles } from "./styles";
import type { FabMenuConfig } from "./types";

class SolanaFabMenuElement extends HTMLElement {
  private _config: FabMenuConfig = {};
  private _mounted = false;

  static get observedAttributes() {
    return ["position", "api-url", "z-index"];
  }

  connectedCallback() {
    injectStyles();
    this._mounted = true;
    this._render();
  }

  disconnectedCallback() {
    this._mounted = false;
    render(null, this);
  }

  attributeChangedCallback() {
    this._syncAttributesToConfig();
    if (this._mounted) this._render();
  }

  configure(config: FabMenuConfig) {
    this._config = { ...this._config, ...config };
    if (this._mounted) this._render();
  }

  private _syncAttributesToConfig() {
    const position = this.getAttribute("position");
    if (position) {
      this._config.position = position as FabMenuConfig["position"];
    }

    const apiUrl = this.getAttribute("api-url");
    if (apiUrl) {
      this._config.apiUrl = apiUrl;
    }

    const zIndex = this.getAttribute("z-index");
    if (zIndex) {
      this._config.zIndex = parseInt(zIndex, 10);
    }
  }

  private _render() {
    render(h(FabApp, { config: this._config }), this);
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("solana-fab-menu")
) {
  customElements.define("solana-fab-menu", SolanaFabMenuElement);
}

export { SolanaFabMenuElement };
