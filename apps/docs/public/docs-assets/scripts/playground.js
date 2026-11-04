/*
 * Playground buttons (styles/playground.css).
 *
 * The docs app loads this script on every docs page
 * (components/docs/docs-scripts.tsx). Only program tutorials (Anchor/Native)
 * have a Playground button: the playground's GitHub import only accepts
 * Solana programs, so client (TypeScript) tutorials have none until it can
 * import them. Each program tutorial has one button, in a block at the top
 * of its intro page; code blocks, demo terminals, and step pages have none.
 *
 * - The button is `<a class="sol-pg-tut" data-pg-open="packages/docs-
 *   examples/…">`, data-pg-open being the folder to import. Single-page
 *   tutorials (e.g. /developers/docs/programs/build-first-program) write it
 *   by hand; docs-tooling gen:paths generates it
 *   (snippets/paths/<lang>/<key>/playground.mdx) for a job tutorial whose
 *   example folder is a program.
 * - This script makes it a link (new tab) to
 *   <origin>/github.com/<SOURCE>/<data-pg-open>. The playground then reads
 *   the files through the GitHub contents API (unauthenticated: 60 requests
 *   per hour per reader IP, one request per imported folder).
 */
(function () {
  if (window.__solPlayground) return;
  window.__solPlayground = true;

  var CONFIG = {
    origin: "https://beta.solpg.io",
    // THE one value for owner/repo/ref the playground imports from.
    // The ref may not contain "/" (the playground's URL parser stops
    // there). Never prefix "https://": the playground's router collapses
    // "//" and then rejects the URL ("URL path not found").
    source: "solana-foundation/solana-com/tree/main",
  };
  var SAFE_PATH = /^[\w\-/.]+$/;

  function apply(btn) {
    var open = btn.getAttribute("data-pg-open") || "";
    if (!SAFE_PATH.test(open) || open.indexOf("..") !== -1) return;
    var href = CONFIG.origin + "/github.com/" + CONFIG.source + "/" + open;
    if (btn.getAttribute("href") === href) return;
    btn.setAttribute("href", href);
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener noreferrer");
    btn.setAttribute(
      "aria-label",
      btn.textContent.trim() + " (opens in a new tab)",
    );
  }

  function scan() {
    var btns = document.querySelectorAll(".sol-pg-tut");
    for (var i = 0; i < btns.length; i++) apply(btns[i]);
  }

  // The docs navigate client-side, so new pages arrive as DOM mutations.
  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    setTimeout(function () {
      pending = false;
      scan();
    }, 60);
  }
  if (typeof MutationObserver === "function")
    new MutationObserver(schedule).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", schedule);
  else schedule();

  // A click before the next scan still opens the playground.
  document.addEventListener(
    "click",
    function (event) {
      var btn = event.target.closest && event.target.closest(".sol-pg-tut");
      if (btn) apply(btn);
    },
    true,
  );
})();
