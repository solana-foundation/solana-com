import type { AnchorHTMLAttributes } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  className = "",
  variant = "primary",
  ...props
}: Props) {
  const base =
    "inline-flex min-h-12 items-center justify-center px-7 py-3 text-sm font-medium tracking-[0.08em] uppercase transition-all duration-300";

  const palette =
    variant === "primary"
      ? "bg-bp-purple text-white hover:bg-bp-purple-light hover:shadow-[0_0_28px_rgba(98,58,196,0.4)] active:scale-[0.97]"
      : "border border-[var(--bp-border-strong)] text-[var(--bp-text)] hover:border-bp-purple hover:text-white hover:shadow-[0_0_20px_rgba(98,58,196,0.15)] active:scale-[0.97]";

  return <a className={`${base} ${palette} ${className}`.trim()} {...props} />;
}
