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
        "inline-block border-b-2 py-2 text-sm font-medium no-underline transition-colors hover:no-underline",
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
          <ul className="-mx-4 flex flex-nowrap gap-x-6 gap-y-1 overflow-x-auto whitespace-nowrap px-4 md:mx-0 md:flex-wrap md:whitespace-normal md:px-0">
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
        </nav>
      </div>
    </header>
  );
}
