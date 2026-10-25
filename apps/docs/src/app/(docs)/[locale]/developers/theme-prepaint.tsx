/**
 * Blocking inline scripts that set the theme class on <html> before the
 * landing markup below them is parsed, so the page paints without a flash.
 * ThemeProvider (@solana-com/ui-chrome) applies the same rule after hydration.
 *
 * - `ThemePrepaint` (light/dark landings, /learn): sets `dark tw-dark` or
 *   `light tw-light` from localStorage.theme or prefers-color-scheme.
 *   ThemeProvider owns the toggle. Readers without JS get no class, and
 *   globals.css falls back to prefers-color-scheme for them.
 * - `DocsThemePrepaint` (/developers): the docs theme. Reads the choice
 *   from localStorage "isDarkMode", where the docs keep it on
 *   /developers/docs, so one choice applies to both ("dark" | "light" | "system", or
 *   the legacy "true" | "false"); "system" or nothing follows
 *   prefers-color-scheme. Sets `dark tw-dark` or `light tw-light`,
 *   html[data-theme-preference] and color-scheme as the docs do, and
 *   html[data-dh-js] so the header shows its JS-only toggle. The header's
 *   ThemeToggle (docs-header.client.tsx) applies the same rule after
 *   client-side navigation, where inline scripts do not run. Without JS,
 *   docs-chrome.css follows prefers-color-scheme.
 *
 * Rendered from the page rather than [locale]/layout.tsx because the layout
 * cannot see the pathname; this keeps each script on its own routes.
 */
const THEME_PREPAINT_SCRIPT = `(function(){try{var d=document.documentElement,t=null;try{t=window.localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.classList.remove("dark","tw-dark","light","tw-light");d.classList.add(t,"tw-"+t)}catch(e){}})();`;

export const DOCS_THEME_STORAGE_KEY = "isDarkMode";

export const DOCS_THEME_PREPAINT_SCRIPT = `(function(){try{var d=document.documentElement,v=null;try{v=window.localStorage.getItem("${DOCS_THEME_STORAGE_KEY}")}catch(e){}if(v==="true")v="dark";else if(v==="false")v="light";if(v!=="light"&&v!=="dark")v="system";var t=v!=="system"?v:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.classList.remove("dark","tw-dark","light","tw-light");d.classList.add(t,"tw-"+t);d.setAttribute("data-theme-preference",v);d.style.colorScheme=t;d.setAttribute("data-dh-js","")}catch(e){}})();`;

function InlineScript({ source }: { source: string }) {
  return (
    <script
      // Static string, no user input.
      dangerouslySetInnerHTML={{ __html: source }}
      suppressHydrationWarning
    />
  );
}

export function ThemePrepaint() {
  return <InlineScript source={THEME_PREPAINT_SCRIPT} />;
}

export function DocsThemePrepaint() {
  return <InlineScript source={DOCS_THEME_PREPAINT_SCRIPT} />;
}
