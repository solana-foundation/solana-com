import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "@workspace/i18n/server";
import HereForPage from "@/components/pages/here-for/HereForPage";
import { getPageMetadata } from "@/app/metadata";
import {
  hereForCardUrl,
  type HereForCardParams,
} from "@/components/pages/here-for/card-url";
import { loadCardAdds, loadIsMutual } from "@/lib/here-for/data";

const HANDLE_PATTERN = /^[a-z0-9_]{1,15}$/;

type Params = Promise<{ locale: string; handle: string }>;
type Search = { with?: string; card?: string };

/**
 * Picks the card a shared person link unfurls with. The share buttons add
 * ?with= for a mutual and ?card=mutuals for a mutuals post; anything the graph
 * can't back falls back to the site card rather than a broken image.
 */
async function resolveShareCard(
  slug: string,
  search: Search,
): Promise<{ card: HereForCardParams; search: string } | null> {
  const other = search.with?.toLowerCase();
  try {
    if (
      other &&
      other !== slug &&
      HANDLE_PATTERN.test(other) &&
      (await loadIsMutual(`@${slug}`, `@${other}`))
    ) {
      return {
        card: { type: "mutual", handle: slug, with: other },
        search: `?with=${other}`,
      };
    }
    const adds = await loadCardAdds(`@${slug}`);
    if (!adds?.length) return null;
    return search.card === "mutuals"
      ? { card: { type: "mutuals", handle: slug }, search: "?card=mutuals" }
      : { card: { type: "your3", handle: slug }, search: "" };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<Search>;
}): Promise<Metadata> {
  const { locale, handle } = await params;
  const slug = handle.toLowerCase();
  if (!HANDLE_PATTERN.test(slug)) return {};
  const [t, share] = await Promise.all([
    getTranslations({ locale, namespace: "breakpoint.hereFor" }),
    searchParams.then((search) => resolveShareCard(slug, search)),
  ]);
  const title = t("metadata.personTitle", { handle: `@${slug}` });
  return getPageMetadata(locale, {
    path: `/mutuals/${slug}`,
    title,
    description: t("metadata.personDescription", { handle: `@${slug}` }),
    // Anyone can be added by handle without opting in, so person pages are
    // for sharing, not search.
    noindex: true,
    ...(share && {
      image: {
        url: hereForCardUrl(share.card, locale),
        alt: title,
        type: "image/png",
      },
      shareSearch: share.search,
    }),
  });
}

export default async function LocaleHereForPersonPage({
  params,
}: {
  params: Params;
}) {
  const { locale, handle } = await params;
  const slug = handle.toLowerCase();
  if (!HANDLE_PATTERN.test(slug)) notFound();
  return <HereForPage locale={locale} focusHandle={slug} />;
}
