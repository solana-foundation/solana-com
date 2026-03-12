import type { BreakpointPageContent } from "@/content/page";
import { Container } from "@/components/ui/Container";

export function SectionNav({ items }: { items: BreakpointPageContent["nav"] }) {
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--bp-border)] bg-[rgba(17,8,27,0.74)] backdrop-blur-xl">
      <Container className="overflow-x-auto">
        <nav
          aria-label="Section navigation"
          className="scrollbar-hide flex min-h-16 items-center gap-3 py-3"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="whitespace-nowrap rounded-full border border-[var(--bp-border)] bg-white/5 px-4 py-2 text-sm text-[var(--bp-lilac)] transition hover:border-[var(--bp-mint)] hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}
