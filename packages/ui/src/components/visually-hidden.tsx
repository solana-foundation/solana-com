import * as React from "react";

export function VisuallyHidden({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`sr-only ${className || ""}`} {...props}>
      {children}
    </span>
  );
}
