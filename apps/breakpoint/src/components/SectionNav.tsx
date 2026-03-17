import type { BreakpointPageContent } from "@/content/page";
import { Container } from "@/components/ui/Container";

export function SectionNav({ items }: { items: BreakpointPageContent["nav"] }) {
  return (
    <div className="sticky top-0 z-30 border-b border-stroke-primary bg-transparent-null-80 backdrop-blur-md">
      <Container className="overflow-x-auto">
        <nav
          aria-label="Section navigation"
          className="scrollbar-hidden flex min-h-[3.75rem] items-center gap-1 py-2"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="group relative whitespace-nowrap rounded-full px-xs py-3 font-macan-mono text-2xs uppercase tracking-button text-secondary cta-transition hover:text-primary"
            >
              {item.label}
              <span className="absolute bottom-2 left-xs right-xs h-px origin-left scale-x-0 bg-byte transition-transform duration-200 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}
