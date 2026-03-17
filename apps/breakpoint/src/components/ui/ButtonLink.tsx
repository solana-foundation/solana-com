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
    "bp-button cta cta-transition inline-flex min-h-[3.25rem] items-center justify-center rounded-full px-s py-xs";

  const palette =
    variant === "primary"
      ? "bg-button-fill text-invert hover:bg-button-fill-hover hover:text-invert"
      : "border border-stroke-secondary bg-transparent text-primary hover:border-byte hover:text-byte";

  return <a className={`${base} ${palette} ${className}`.trim()} {...props} />;
}
