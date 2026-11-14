"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Up to three pages matching the words of the missing path. */
export function NotFoundSuggestions() {
  const pathname = usePathname();
  const [pages, setPages] = useState<{ url: string; title: string }[]>([]);
  useEffect(() => {
    const words = (pathname ?? "")
      .split("/")
      .filter(
        (s) => s && !["developers", "docs", "cookbook", "learn"].includes(s),
      )
      .join(" ")
      .replace(/[-_]+/g, " ")
      .trim();
    if (!words) return;
    const locale = /^\/([a-z]{2})\//.exec(pathname ?? "")?.[1];
    const params = new URLSearchParams({ query: words });
    if (locale) params.set("locale", locale);
    fetch(`/api/docs-search?${params}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((results: { type: string; url: string; content: string }[]) =>
        setPages(
          results
            .filter((r) => r.type === "page")
            .slice(0, 3)
            .map((r) => ({ url: r.url, title: r.content })),
        ),
      )
      .catch(() => setPages([]));
  }, [pathname]);
  return (
    <div className="not-found-recommended">
      <div className="not-found-recommended-pages-list">
        {pages.map((p) => (
          <a
            key={p.url}
            href={p.url}
            className="not-found-recommended-page-link"
          >
            <span>{p.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
