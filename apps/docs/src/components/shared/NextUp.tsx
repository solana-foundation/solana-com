import FumaLink from "fumadocs-core/link";

/** A right-aligned "Next up: <title> →" link for the bottom of a course page. */
export function NextUp({ title, href }: { title: string; href: string }) {
  return (
    <div className="not-prose mt-10 flex justify-end">
      <FumaLink
        href={href}
        className="group inline-flex items-center gap-2 text-sm font-medium"
      >
        <span className="text-fd-muted-foreground">Next up:</span>
        <span className="text-fd-primary group-hover:underline">{title}</span>
        <span
          aria-hidden="true"
          className="text-fd-primary transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </FumaLink>
    </div>
  );
}
