import type { SVGProps } from "react";

type ArrowUpRightIconProps = SVGProps<SVGSVGElement> & {
  variant?: "filled" | "stroke";
};

export default function ArrowUpRightIcon({
  className = "block",
  variant = "filled",
  ...props
}: ArrowUpRightIconProps) {
  if (variant === "stroke") {
    return (
      <svg
        aria-hidden="true"
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        focusable="false"
        {...props}
      >
        <path
          d="M1.6 6.4L6.4 1.6M6.4 1.6H2.56M6.4 1.6V5.44"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="square"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      width="8.02"
      height="8"
      viewBox="0 0 8.01975 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      focusable="false"
      {...props}
    >
      <path
        d="M1.24444 8L0 6.7358L4.95803 1.79753H1.12593V0H8.01975V6.85432H6.20247V3.06173L1.24444 8Z"
        fill="currentColor"
      />
    </svg>
  );
}
