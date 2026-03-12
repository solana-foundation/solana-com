import type { BreakpointPageContent } from "@/content/page";
import { Container } from "@/components/ui/Container";

export function SectionNav({ items }: { items: BreakpointPageContent["nav"] }) {
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--bp-border)] bg-[rgba(5,5,5,0.92)] backdrop-blur-md">
      <Container className="overflow-x-auto">
        <nav
          aria-label="Section navigation"
          className="scrollbar-hide flex min-h-14 items-center gap-1 py-2"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="whitespace-nowrap rounded-md px-4 py-2 font-bp-mono text-xs uppercase tracking-[0.16em] text-bp-gray transition-colors duration-200 hover:bg-white/5 hover:text-bp-lavender"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}
