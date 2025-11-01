import React from "react";
import Link from "next/link";
import {
  resolveHref,
  shouldUseNextLink,
} from "@solana-com/ui-chrome/url-config";

export interface HeaderNavigationLink {
  href: string;
  label: string;
}

export interface HeaderNavigationProps {
  links: HeaderNavigationLink[];
  className?: string;
  linkClassName?: string;
}

export const HeaderNavigation = React.memo<HeaderNavigationProps>(
  ({
    links,
    className = "flex items-center gap-2 md:gap-4",
    linkClassName = "text-neutral-500 transition duration-200 ease-in-out hover:text-neutral-400",
  }) => {
    if (links.length === 0) return null;

    return (
      <div className={className}>
        {links.map((link) => {
          const resolvedHref = resolveHref(link.href);
          const useNextLink = shouldUseNextLink(link.href);

          if (useNextLink) {
            return (
              <Link
                href={resolvedHref}
                key={link.label}
                className={linkClassName}
              >
                {link.label}
              </Link>
            );
          }

          return (
            <a
              href={resolvedHref}
              key={link.label}
              className={linkClassName}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          );
        })}
      </div>
    );
  },
);

HeaderNavigation.displayName = "HeaderNavigation";
