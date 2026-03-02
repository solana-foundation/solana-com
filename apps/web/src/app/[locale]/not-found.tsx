"use client";

import { Link } from "@workspace/i18n/routing";
import { NotFoundPage } from "@workspace/ui/not-found-page";

export default function NotFound() {
  return (
    <NotFoundPage
      renderLink={({ href, children, className }) => (
        <Link href={href} className={className}>
          {children}
        </Link>
      )}
    />
  );
}
