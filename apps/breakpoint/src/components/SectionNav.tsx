import type { BreakpointPageContent } from "@/content/page";
import { Container } from "@/components/ui/Container";

export function SectionNav({ items }: { items: BreakpointPageContent["nav"] }) {
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--bp-border)] bg-[rgba(5,5,5,0.94)] backdrop-blur-md">
      <Container className="overflow-x-auto">
        <nav
          aria-label="Section navigation"
          className="scrollbar-hide flex min-h-14 items-center gap-0.5 py-2"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="group relative whitespace-nowrap px-4 py-2 font-bp-mono text-[11px] uppercase tracking-[0.14em] text-bp-gray transition-all duration-300 hover:text-bp-lavender"
            >
              {item.label}
              <span className="absolute bottom-1 left-4 right-4 h-px origin-left scale-x-0 bg-bp-purple transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}
