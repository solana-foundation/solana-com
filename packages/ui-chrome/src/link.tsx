"use client";

import { useMemo } from "react";
import { Link as I18nLink } from "@workspace/i18n/routing";
import { useRouter, usePathname } from "@workspace/i18n/use-router";
import classNames from "classnames";
import { shouldUseNextLink } from "./url-config";

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
      <I18nLink
        href={linkTo}
        scroll={scroll}
        prefetch={prefetch}
        {...aProps}
        className={classNames(className, {
          [activeClassName]: isReady && isActive,
        })}
      >
        {children}
      </I18nLink>
    );
  }
  return (
    <a href={linkTo} {...other} className={className}>
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
  return (
    <a href={to} {...props} target={target} rel="noopener noreferrer">
      {children}
    </a>
  );
};

export { Link, InlineLink };
