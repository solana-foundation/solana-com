/**
 * Classes for the wrapper of a page in the docs layout (the docs header,
 * then the page, then the footer), so the page makes room for Ask AI:
 * - docked (html[data-ask=docked], ask-panel.client.tsx), everything but
 *   the header gets padding as wide as the panel on the side the panel
 *   docks. That side follows <html dir>, as the panel's `end-0` does, not
 *   the wrapper's: an untranslated page at /ar/... sets dir="ltr" on the
 *   wrapper (lib/docs/content-language.ts) while the panel stays on the
 *   left, so a logical end padding would land on the wrong side. The
 *   header moves over only as far as its 92rem bar has room, so it lines
 *   up with the page without squeezing its tabs (2rem less: on docs pages
 *   the panel's room replaces .docs-body's own end padding). The panel
 *   starts below the header, so the header never sits under it.
 * - full screen (html[data-ask=fullscreen], set before paint for a
 *   full-screen link), the page is hidden under the dialog: on a load at
 *   once, as the first style runs no transition; on Expand once the dialog
 *   has faded in (150ms), so the page doesn't blink out first. It also
 *   stops the body's colour transition, which would otherwise fade from
 *   light to dark behind it as the theme loads.
 */
export const ASK_ROOM_CLASS =
  "xl:[html[data-ask=docked]:not([dir=rtl])_&>.dh]:pr-[min(var(--ask-w)_-_2rem,max(0px,100%_-_92rem))] xl:[html[data-ask=docked][dir=rtl]_&>.dh]:pl-[min(var(--ask-w)_-_2rem,max(0px,100%_-_92rem))] xl:[html[data-ask=docked]:not([dir=rtl])_&>:not(.dh)]:pr-[var(--ask-w)] xl:[html[data-ask=docked][dir=rtl]_&>:not(.dh)]:pl-[var(--ask-w)] [html[data-ask=fullscreen]_&]:invisible [html[data-ask=fullscreen]_&]:[transition:visibility_0s_150ms] motion-reduce:[html[data-ask=fullscreen]_&]:[transition:none] [html[data-ask=fullscreen]_body:has(&)]:transition-none";
