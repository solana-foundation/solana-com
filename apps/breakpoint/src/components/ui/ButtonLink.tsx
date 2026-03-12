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
      ? "bg-[var(--bp-lime)] text-[var(--bp-ink)] hover:bg-white"
      : "border border-[var(--bp-border)] bg-white/5 text-[var(--bp-lilac)] hover:border-[var(--bp-lime)] hover:text-white";

  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition ${palette} ${className}`.trim()}
      {...props}
    />
  );
}
