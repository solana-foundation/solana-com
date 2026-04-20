import type { SVGProps } from "react";

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.354 4.354a.5.5 0 00-.708-.708L8 7.293 4.354 3.646a.5.5 0 10-.708.708L7.293 8l-3.647 3.646a.5.5 0 00.708.708L8 8.707l3.646 3.647a.5.5 0 00.708-.708L8.707 8l3.647-3.646z"
        fill="white"
      />
    </svg>
  );
}
