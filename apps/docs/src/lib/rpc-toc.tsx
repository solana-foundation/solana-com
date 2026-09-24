import { Fragment, type ReactNode } from "react";
import type { TOCItemType } from "fumadocs-core/server";
import {
  rpcCategoryEndpoints,
  type RpcCategory,
} from "@/lib/rpc-endpoint-categories";
import { websocketEndpoints } from "@/lib/websocket-endpoints";

/**
 * Locale-stripped slug prefix shared by every Surfpool RPC reference page, i.e.
 * `content/docs/<locale>/tools/surfpool/rpc/<page>.mdx`. `docsSource` parses the
 * locale from the directory, so this is identical for all locales.
 */
const SURFPOOL_RPC_SLUG = ["tools", "surfpool", "rpc"];

/**
 * Method names per RPC page, in render order, keyed by page slug.
 *
 * `overview` is intentionally absent: it is ordinary Markdown and already gets a
 * table of contents from `rehypeToc`.
 */
const pageMethodNames: Record<string, string[]> = {
  ...Object.fromEntries(
    (Object.keys(rpcCategoryEndpoints) as RpcCategory[]).map((category) => [
      category,
      rpcCategoryEndpoints[category].map((endpoint) => endpoint.method_name),
    ]),
  ),
  websockets: websocketEndpoints.map((endpoint) => endpoint.method_name),
};

/**
 * Builds the endpoint entries for a Surfpool RPC reference page's table of
 * contents.
 *
 * Those pages are a single self-closing MDX component, and their endpoint
 * headings are emitted at runtime by `RpcMethodSolana` /
 * `WebSocketMethodSolana`. `rehypeToc` collects h1-h6 from the compiled hast at
 * build time, sees only an MDX JSX element, and exports an empty `toc` — so the
 * list is rebuilt here from the same data those components render.
 *
 * This relies on those components being server-prerendered: fumadocs'
 * `useAnchorObserver` resolves each `document.getElementById` once, in an effect
 * that only re-runs when the `toc` array identity changes. Loading them with
 * `next/dynamic({ ssr: false })` would silently break the active-item highlight.
 *
 * @param slug - Locale-stripped page slug, e.g.
 *   `["tools", "surfpool", "rpc", "cheatcodes"]`.
 * @returns One entry per endpoint, or an empty array for any other page.
 */
export function getRpcEndpointToc(slug: string[]): TOCItemType[] {
  if (slug.length !== SURFPOOL_RPC_SLUG.length + 1) return [];
  if (!SURFPOOL_RPC_SLUG.every((part, index) => slug[index] === part))
    return [];

  const methodNames = pageMethodNames[slug[SURFPOOL_RPC_SLUG.length]];
  if (!methodNames) return [];

  // `url` has to match the exact-case `id` on the rendered `<h3>` for
  // fumadocs to track the active anchor — not the lowercased id that
  // `WebSocketsRpc` also puts on its wrapper elements. `depth: 2` renders
  // flush-left; anything deeper would indent the whole list under a parent
  // heading that does not exist.
  return methodNames.map((methodName) => ({
    title: breakOnWordBoundaries(methodName),
    url: `#${methodName}`,
    depth: 2,
  }));
}

/**
 * Renders a method name that can wrap, but only between its words.
 *
 * The table of contents is 250px wide (`globals.css`), so the ten longest
 * method names do not fit on one line. Wrapping is the right answer — it is what
 * every long prose heading on the site already does — but prose wraps at spaces
 * and an identifier has none, so fumadocs' `[overflow-wrap:anywhere]` would
 * slice it mid-word into `getMinimumBalanceForRentExem` / `ption`. Marking the
 * camelCase and underscore boundaries as the preferred break points instead
 * yields `getMinimumBalanceFor` / `RentExemption`.
 *
 * `overflow-wrap: break-word` is what makes those marks win: unlike `anywhere`,
 * it breaks at an arbitrary character only when a line offers no other break
 * opportunity. `<wbr>` contributes no character, so copying an entry still
 * yields the plain method name.
 */
function breakOnWordBoundaries(methodName: string): ReactNode {
  const words = methodName.split(/(?=[A-Z])|(?<=_)/).filter(Boolean);

  return (
    <span className="[overflow-wrap:break-word]">
      {words.map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? <wbr /> : null}
          {word}
        </Fragment>
      ))}
    </span>
  );
}
