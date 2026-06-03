import DisclosureIcon from "@/components/DisclosureIcon";

type AccordionButtonProps = {
  className?: string;
  interaction?: "group" | "self";
  open: boolean;
};

export function accordionButtonClassName(
  open: boolean,
  interaction: "group" | "self" = "self",
) {
  const interactionClasses =
    interaction === "group"
      ? open
        ? "group-hover/accordion-control:border-neutral-500 group-hover/accordion-control:bg-neutral-600 group-focus-visible/accordion-control:outline group-focus-visible/accordion-control:outline-1 group-focus-visible/accordion-control:outline-offset-4 group-focus-visible/accordion-control:outline-white"
        : "group-hover/accordion-control:border-neutral-500 group-hover/accordion-control:bg-neutral-700 group-focus-visible/accordion-control:outline group-focus-visible/accordion-control:outline-1 group-focus-visible/accordion-control:outline-offset-4 group-focus-visible/accordion-control:outline-white"
      : open
        ? "hover:border-neutral-500 hover:bg-neutral-600 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
        : "hover:border-neutral-500 hover:bg-neutral-700 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white";

  return `flex size-8 shrink-0 items-center justify-center border text-white transition-colors ${
    open
      ? "border-transparent bg-neutral-700"
      : "border-stroke-primary bg-transparent"
  } ${interactionClasses}`;
}

export default function AccordionButton({
  className = "",
  interaction = "self",
  open,
}: AccordionButtonProps) {
  return (
    <span
      aria-hidden="true"
      className={`${accordionButtonClassName(open, interaction)} ${className}`.trim()}
    >
      <DisclosureIcon open={open} />
    </span>
  );
}
