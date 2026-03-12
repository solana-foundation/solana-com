import type { AnchorHTMLAttributes } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  className = "",
  variant = "primary",
  ...props
}: Props) {
  const palette =
    variant === "primary"
      ? "bg-bp-purple text-white hover:bg-bp-purple-light active:bg-bp-purple-dark"
      : "border border-[var(--bp-border-strong)] text-[var(--bp-text)] hover:border-bp-purple hover:text-white";

  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-200 ${palette} ${className}`.trim()}
      {...props}
    />
  );
}
