"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes } from "react";
import { isDocsHref } from "@/lib/docs/docs-href";

/**
 * A link that navigates client-side within the docs. Prefetches on hover or
 * focus only (a page links to dozens of others).
 */
export function DocsLink({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const router = useRouter();
  if (!isDocsHref(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  const prefetch = () => router.prefetch(href);
  return (
    <Link
      href={href}
      prefetch={false}
      {...rest}
      onMouseEnter={(event) => {
        prefetch();
        rest.onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        prefetch();
        rest.onFocus?.(event);
      }}
    >
      {children}
    </Link>
  );
}
