/** @jsxImportSource preact */
import type { JSX } from "preact";

export function SolanaColorIcon(
  props: JSX.SVGAttributes<SVGSVGElement>,
): JSX.Element {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient
          id="sfab-solana-grad"
          x1="0"
          y1="0"
          x2="12"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stop-color="#9945FF" />
          <stop offset="50%" stop-color="#14F195" />
          <stop offset="100%" stop-color="#00C2FF" />
        </linearGradient>
      </defs>
      <path
        d="M10.06 8.89H2.37a.46.46 0 0 1-.33-.8l1.59-1.65a.64.64 0 0 1 .46-.2h7.69a.46.46 0 0 1 .33.8L10.52 8.7a.64.64 0 0 1-.46.2zM3.61 4.36a.64.64 0 0 1 .46-.2h7.69a.46.46 0 0 1 .33.8L10.5 6.6a.64.64 0 0 1-.46.2H2.35a.46.46 0 0 1-.33-.8zM10.06 1.26H2.37a.46.46 0 0 0-.33.8l1.59 1.65a.64.64 0 0 0 .46.2h7.69a.46.46 0 0 0 .33-.8L10.52 1.46a.64.64 0 0 0-.46-.2z"
        fill="url(#sfab-solana-grad)"
      />
    </svg>
  );
}
