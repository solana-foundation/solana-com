import Link from "next/link";
import { NEWS_NAV_ITEMS, newsNavHref, type NewsNavItem } from "@/lib/news-nav";
import { cn } from "@/lib/utils";

interface NewsMastheadProps {
  /** Optional short tagline under the wordmark. */
  tagline?: string;
  /** Slug of the vertical currently being viewed, if any (for active state). */
  activeSlug?: string;
  navItems?: NewsNavItem[];
}

/**
 * News front masthead: wordmark plus a restrained editorial section nav built
 * from durable verticals. The nav links resolve to the existing
 * `/news/category/[category]` route.
 */
export function NewsMasthead({
  tagline = "Updates from across the Solana ecosystem",
  activeSlug,
  navItems = NEWS_NAV_ITEMS,
}: NewsMastheadProps) {
  return (
    <header className="border-b border-border">
      <div className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0 py-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/news"
            className="text-inherit no-underline hover:no-underline w-fit"
          >
            <span className="text-3xl md:text-4xl font-bold tracking-tight">
              Solana News
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">{tagline}</p>
        </div>

        <nav aria-label="News sections">
          <ul className="flex flex-nowrap gap-x-5 gap-y-2 overflow-x-auto whitespace-nowrap -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:whitespace-normal">
            <li>
              <Link
                href="/news"
                aria-current={!activeSlug ? "page" : undefined}
                className={cn(
                  "text-sm font-medium no-underline hover:no-underline transition-colors",
                  !activeSlug
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Latest
              </Link>
            </li>
            {navItems.map((item) => {
              const isActive = item.slug === activeSlug;
              return (
                <li key={item.slug}>
                  <Link
                    href={newsNavHref(item.slug)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "text-sm font-medium no-underline hover:no-underline transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
