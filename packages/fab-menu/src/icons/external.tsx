/** @jsxImportSource preact */
import type { JSX } from "preact";

export function ExternalIcon(
  props: JSX.SVGAttributes<SVGSVGElement>,
): JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.5 3.5H12.5V11.5H11V6.06L4.03 13.03L2.97 11.97L9.94 5H4.5V3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
