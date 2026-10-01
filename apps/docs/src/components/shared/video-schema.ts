import { z } from "zod";

/**
 * Shared shape for a single video/project entry rendered by
 * VideoChapterList and ProjectCardGrid. Validated at render time (via
 * `.parse`) so a malformed entry — a typo'd field name, an empty title —
 * fails loudly when the page is built instead of rendering silently wrong.
 *
 * `href` is optional: omit it (rather than a placeholder like `"#"`) to
 * mark an entry as not-yet-linked. See MediaThumbnail's isPlaceholderHref.
 */
export const videoItemSchema = z.object({
  title: z.string().min(1, "title is required"),
  href: z.string().min(1).optional(),
  subtext: z.string().optional(),
});

export const videoItemListSchema = z.array(videoItemSchema);

export type VideoItem = z.infer<typeof videoItemSchema>;

/**
 * A video/project entry is a "draft" (not yet linked) when `href` is
 * omitted, rather than a magic string like `"#"` — that keeps the intent
 * explicit in content instead of relying on a sentinel URL. Lives here
 * (not MediaThumbnail.tsx, which is a Client Component) so it can also be
 * called from the Server Components that render these lists.
 */
export function isPlaceholderHref(href?: string) {
  return !href;
}
