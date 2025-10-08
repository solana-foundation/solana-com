import { ComponentProps, ReactNode, useMemo } from "react";
import NextLink from "next/link";
import { useRouter, usePathname } from "./use-router";
import { cn } from "@workspace/ui/lib/utils";

export function Link({
  children,
  to,
  href,
  activeClassName = "",
  partiallyActive,
  partiallyActiveIgnore = [],
  className,
  ...other
}: Omit<ComponentProps<typeof NextLink>, "href"> & {
  children?: ReactNode;
  to?: string;
  href?: string;
  activeClassName?: string;
  partiallyActive?: boolean;
  partiallyActiveIgnore?: string[];
  className?: string;
}) {
  to = to ?? href ?? "";

  const internal = /^\/(?!\/)/.test(to);

  const { isReady } = useRouter();

  const asPath = usePathname();

  const isActive = useMemo(() => {
    return (
      asPath === to ||
      (partiallyActive &&
        asPath.includes(to) &&
        !partiallyActiveIgnore.filter((el) => asPath.startsWith(el)).length)
    );
  }, [partiallyActive, asPath, to, partiallyActiveIgnore]); // Added partiallyActiveIgnore to dependencies

  if (internal) {
    const { scroll, prefetch, ...aProps } = other;
    return (
      <NextLink
        href={to}
        scroll={scroll}
        prefetch={prefetch}
        passHref
        {...aProps}
        className={cn(className, {
          [activeClassName]: isReady && isActive,
        })}
      >
        {children}
      </NextLink>
    );
  }
  return (
    <a href={to} {...other} className={className}>
      {children}
    </a>
  );
}

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
