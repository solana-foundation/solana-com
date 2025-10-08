import { ComponentProps, ReactNode } from "react";

export function InlineLink({
  to,
  children,
  ...props
}: ComponentProps<"a"> & {
  to: string;
  children?: ReactNode;
}) {
  return (
    <a href={to} {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
