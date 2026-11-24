/**
 * Settings shared by the Ask AI store, panel and prepaint script. Nothing
 * here touches `window` at import, so server components can import it.
 */
import { ASK_AI_PATH } from "../ask-ai";

/** The agent rejects messages longer than this (counted in code points). */
export const ASK_MAX_MESSAGE_CHARS = 4_000;

/** Code sent from a code block's Ask button is cut to this, leaving room for the prompt. */
export const ASK_MAX_CODE_CHARS = 3_500;

/** Text selected on the page ("Ask AI about this") is cut to this, at a word. */
export const ASK_MAX_QUOTE_CHARS = 1_200;

/** Messages kept in sessionStorage; the agent caps a conversation at about 40. */
export const ASK_MAX_STORED_MESSAGES = 40;

export const ASK_STORAGE_KEYS = {
  /** sessionStorage: the conversation (messages + conversationId). */
  thread: "docs-ask:thread:v1",
  /** sessionStorage: whether the panel is open and full screen. */
  ui: "docs-ask:ui:v1",
  /** localStorage: the docked panel width the reader chose, in px. */
  width: "docs-ask:width",
  /** localStorage prefix: a thread handed to a new tab, `+ <thread id>` (./handoff.ts). */
  handoff: "docs-ask:handoff:",
} as const;

/**
 * sessionStorage: Bri's client's answer cache (ANSWER_CACHE_STORAGE_KEY in
 * @solana-com/ui-chrome/ask-solana/api, not exported). A question sent
 * without a conversation gets the cached answer when the same words were
 * asked that way in the last 15 minutes: no conversation, no run id. The
 * store clears it as each question goes out without a conversation (the
 * first, after New chat, after a dropped one), so it reaches the agent.
 */
export const ASK_SOLANA_ANSWER_CACHE_KEY = "ask-solana:answer-cache:v1";

/**
 * Query of the "Expand to full screen" link (./handoff.ts):
 * `?ask=full&askThread=<thread id>` opens the panel full screen and picks
 * up the thread the link was opened from.
 */
export const ASK_LINK_PARAMS = {
  layout: "ask",
  fullscreen: "full",
  thread: "askThread",
} as const;

/** Docked panel width limits in px. The max is also capped at half the viewport. */
export const ASK_PANEL_WIDTH = {
  min: 360,
  max: 720,
  default: 420,
  /** Arrow-key step on the resize handle; Shift uses `largeStep`. */
  step: 24,
  largeStep: 96,
} as const;

/** Viewport width (px) from which the panel docks beside the page. */
export const ASK_DOCK_MIN_VIEWPORT = 1280;

/**
 * Speculation Rules prerender /developers and the docs pages. A prerendered
 * page runs scripts, so storage reads and session warm-up wait until it is
 * shown (`prerenderingchange`).
 */
export function isPrerendering(): boolean {
  return (
    typeof document !== "undefined" &&
    (document as Document & { prerendering?: boolean }).prerendering === true
  );
}

/**
 * If the full-screen panel has not mounted by then (its scripts failed),
 * the prepaint script shows the page again.
 */
export const ASK_PREPAINT_FULLSCREEN_TIMEOUT_MS = 10_000;

/**
 * Blocking inline script for the docs layout, so the page is drawn as the
 * store (./store.ts) will lay it out once it has read the same state. Only
 * on the docs (ASK_AI_PATH): the layout's other routes have Inkeep, and
 * no panel to make room for. There:
 * - a full-screen link (?ask=full), or a panel left full screen
 *   (sessionStorage; not while prerendering, where that copy may be stale):
 *   html[data-ask="fullscreen"], which hides the page until the dialog
 *   covers it;
 * - a panel left open and docked on a wide enough viewport:
 *   html[data-ask="docked"] and --ask-w, so a reload or a navigation
 *   between docs pages does not shift the page after hydration.
 */
export const DOCS_ASK_PREPAINT_SCRIPT = `(function(){try{if(!/${ASK_AI_PATH.source}/.test(window.location.pathname))return;var d=document.documentElement,v=window.innerWidth,f=function(){d.setAttribute("data-ask","fullscreen");setTimeout(function(){if(d.getAttribute("data-ask")==="fullscreen"&&!document.querySelector("[data-ask-panel]"))d.removeAttribute("data-ask")},${ASK_PREPAINT_FULLSCREEN_TIMEOUT_MS})};if(new URLSearchParams(window.location.search).get("${ASK_LINK_PARAMS.layout}")==="${ASK_LINK_PARAMS.fullscreen}")return f();var u=JSON.parse(window.sessionStorage.getItem("${ASK_STORAGE_KEYS.ui}")||"null");if(!u||u.open!==true)return;if(u.fullscreen===true)return document.prerendering?void 0:f();if(v<${ASK_DOCK_MIN_VIEWPORT})return;var w=parseInt(window.localStorage.getItem("${ASK_STORAGE_KEYS.width}")||"",10);if(!(w>0))w=${ASK_PANEL_WIDTH.default};var m=Math.max(${ASK_PANEL_WIDTH.min},Math.min(${ASK_PANEL_WIDTH.max},Math.floor(v/2)));w=Math.max(${ASK_PANEL_WIDTH.min},Math.min(m,w));d.setAttribute("data-ask","docked");d.style.setProperty("--ask-w",w+"px")}catch(e){}})();`;
