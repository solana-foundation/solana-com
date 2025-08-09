import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const roots = {
  guides: "Guides",
  courses: "Courses",
  cookbook: "Cookbook",
  docs: "Docs",
  developers: "Developers",
};

export function Breadcrumb({
  root,
  items,
}: {
  root: string;
  items: { title: string; path: string }[];
}) {
  const rootParts = root?.split("/").filter((part) => part);

  return (
    <div
      className="-mb-3 flex flex-row items-center gap-1 text-sm font-medium text-fd-muted-foreground"
      id="nd-breadcrumb"
    >
      <Link className="truncate hover:text-fd-accent-foreground" href="/">
        Home
      </Link>
      {rootParts?.map((part, index) => (
        <React.Fragment key={part}>
          <ChevronRight className="size-4 shrink-0 rtl:rotate-180" />
          <Link
            className="truncate hover:text-fd-accent-foreground"
            href={`/${rootParts.slice(0, index + 1).join("/")}`}
          >
            {roots[part]}
          </Link>
        </React.Fragment>
      ))}
      {items?.map((item) => (
        <React.Fragment key={item.path}>
          <ChevronRight className="size-4 shrink-0 rtl:rotate-180" />
          <Link
            className="truncate hover:text-fd-accent-foreground"
            href={`${root}/${item.path}`}
          >
            {item.title}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}
