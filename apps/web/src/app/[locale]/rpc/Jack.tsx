/** A patch-bay jack from the hero scene: plugged marks the active path or a selected feature. */
export function Jack({
  plugged,
  small = false,
  className = "",
}: {
  plugged: boolean;
  small?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${small ? "size-3 border-[1.5px]" : "size-4 border-2"} ${plugged ? "border-nd-highlight-green" : "border-[#E7DFD0]/50"} ${className}`}
    >
      <span
        className={`rounded-full ${small ? "size-1" : "size-1.5"} ${plugged ? "bg-nd-highlight-green" : "bg-transparent"}`}
      />
    </span>
  );
}
