import type { HTMLAttributes } from "react";

export function Container({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`bp-shell ${className}`.trim()} {...props} />;
}
