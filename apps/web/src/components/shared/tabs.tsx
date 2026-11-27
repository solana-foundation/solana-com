"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/**
 * Pill tabs with roving focus. Uncontrolled by default; pass `selected` and
 * `onSelect` to drive the selection from outside (for example, to sync other
 * parts of the page). A URL hash pointing inside a panel selects that panel.
 */
export function Tabs({
  label,
  items,
  selected: controlledSelected,
  onSelect,
  tablistClassName = "",
}: {
  label: string;
  items: { name: ReactNode; key?: string; content: ReactNode }[];
  selected?: number;
  onSelect?: (index: number) => void;
  tablistClassName?: string;
}) {
  const [uncontrolledSelected, setUncontrolledSelected] = useState(0);
  const selected = controlledSelected ?? uncontrolledSelected;
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const idBase = label.replaceAll(" ", "-");

  const select = (index: number) => {
    if (controlledSelected === undefined) setUncontrolledSelected(index);
    onSelect?.(index);
  };
  const selectRef = useRef(select);
  selectRef.current = select;

  useEffect(() => {
    function selectHashTarget() {
      const target = document.getElementById(window.location.hash.slice(1));
      if (!target || !root.current) return;
      // Only this instance's own panels: a nested Tabs inside a panel has
      // its own indexes, which must not select a panel here.
      const ownPanels = root.current.querySelectorAll<HTMLElement>(
        ":scope > [role='tabpanel']",
      );
      const panel = Array.from(ownPanels).find((own) => own.contains(target));
      if (panel) selectRef.current(Number(panel.dataset.index));
    }
    selectHashTarget();
    window.addEventListener("hashchange", selectHashTarget);
    return () => window.removeEventListener("hashchange", selectHashTarget);
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next =
      (index + (event.key === "ArrowRight" ? 1 : -1) + items.length) %
      items.length;
    select(next);
    buttons.current[next]?.focus();
  }

  return (
    <div ref={root} className="min-w-0 space-y-3">
      <div
        role="tablist"
        aria-label={label}
        className={`inline-flex max-w-full gap-2 overflow-x-auto font-sans ${tablistClassName}`}
      >
        {items.map((item, index) => (
          <button
            key={item.key ?? index}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${idBase}-tab-${index}`}
            aria-controls={`${idBase}-panel-${index}`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`h-10 shrink-0 whitespace-nowrap rounded-full px-4 text-base leading-[22px] tracking-[-0.16px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14F195] ${selected === index ? "!bg-white text-black hover:!bg-[#ececec]" : "!bg-white/[0.08] text-white hover:!bg-white/[0.12]"}`}
          >
            {item.name}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.key ?? index}
          role="tabpanel"
          data-index={index}
          id={`${idBase}-panel-${index}`}
          aria-labelledby={`${idBase}-tab-${index}`}
          hidden={selected !== index}
          className="min-w-0"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
