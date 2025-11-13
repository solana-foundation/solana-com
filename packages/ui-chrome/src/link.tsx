import { useMemo } from "react";
import NextLink from "next/link";
import { useRouter, usePathname } from "@workspace/i18n/use-router";
import classNames from "classnames";
import { resolveHref, shouldUseNextLink } from "./url-config";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  to?: string;
  href?: string;
  activeClassName?: string;
  partiallyActive?: boolean;
  partiallyActiveIgnore?: string[];
  className?: string;
  scroll?: boolean;
  prefetch?: boolean;
}

const Link = ({
  children,
  to,
  href,
  activeClassName = "",
  partiallyActive = false,
  partiallyActiveIgnore = [],
  className,
  ...other
}: LinkProps) => {
  const linkTo = to ?? href ?? "";
  const resolvedHref = resolveHref(linkTo);
  const useNextLink = shouldUseNextLink(linkTo);

  const { isReady } = useRouter();

  const asPath = usePathname();

  const isActive = useMemo(() => {
    return (
      asPath === linkTo ||
      (partiallyActive &&
        asPath.includes(linkTo) &&
        !partiallyActiveIgnore.filter((el) => asPath.startsWith(el)).length)
    );
  }, [partiallyActive, asPath, linkTo, partiallyActiveIgnore]);

  if (useNextLink) {
    const { scroll, prefetch, ...aProps } = other;
    return (
      <NextLink
        href={resolvedHref}
        scroll={scroll}
        prefetch={prefetch}
        passHref
        {...aProps}
        className={classNames(className, {
          [activeClassName]: isReady && isActive,
        })}
      >
        {children}
      </NextLink>
    );
  }
  return (
    <a href={resolvedHref} {...other} className={className}>
      {children}
    </a>
  );
};

interface InlineLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

const InlineLink = ({
  to,
  children,
  target = "_blank",
  ...props
}: InlineLinkProps) => {
  const resolvedHref = resolveHref(to);
  return (
    <a href={resolvedHref} {...props} target={target} rel="noopener noreferrer">
      {children}
    </a>
  );
};

export { Link, InlineLink };
