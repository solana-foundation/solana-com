import Link from "next/link";
import { NEWS_NAV_ITEMS, newsNavHref, type NewsNavItem } from "@/lib/news-nav";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "-mb-px inline-block border-b-2 py-3 text-sm font-medium no-underline transition-colors hover:no-underline",
        isActive
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

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
    // Fragment (not a wrapping element) is deliberate: the sticky <nav> below
    // must have the tall page container as its sticky containing block. If it
    // were nested inside a short <header>, it would only stick within that
    // header's height and then scroll away.
    <>
      <header className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0 pt-6 pb-4">
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
      </header>

      {/*
        Sticky section nav. Sticks directly beneath the global site header
        (sticky top-0, ~65px mobile / ~71px desktop) so verticals stay reachable
        while scrolling. z-40 keeps it below the global header's z-50.
      */}
      <nav
        aria-label="News sections"
        className="sticky top-[65px] lg:top-[71px] z-40 border-y border-border bg-background/85 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0">
          <ul className="flex flex-nowrap gap-x-6 overflow-x-auto overflow-y-hidden whitespace-nowrap md:flex-wrap md:whitespace-normal">
            <li>
              <NavLink href="/news" isActive={!activeSlug}>
                Latest
              </NavLink>
            </li>
            {navItems.map((item) => (
              <li key={item.slug}>
                <NavLink
                  href={newsNavHref(item.slug)}
                  isActive={item.slug === activeSlug}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
