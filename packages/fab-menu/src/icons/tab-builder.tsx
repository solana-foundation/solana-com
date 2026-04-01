/** @jsxImportSource preact */
import type { JSX } from "preact";

/** Code/builder icon — simplified from nav/build/code */
export function TabBuilderIcon(
  props: JSX.SVGAttributes<SVGSVGElement>,
): JSX.Element {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.46 6.46L2.08 10l4.38 3.54.84-1.08L4.42 10l2.88-2.46-.84-1.08Zm7.08 0l4.38 3.54-4.38 3.54-.84-1.08L15.58 10l-2.88-2.46.84-1.08ZM11.2 4.4l-2.4 11.2 1.28.28 2.4-11.2-1.28-.28Z"
        fill="currentColor"
      />
    </svg>
  );
}
