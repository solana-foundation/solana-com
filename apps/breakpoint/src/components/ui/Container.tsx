import type { HTMLAttributes } from "react";

export function Container({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`container px-xs sm:px-s ${className}`.trim()} {...props} />
  );
}
