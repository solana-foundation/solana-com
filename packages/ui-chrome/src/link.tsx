import { useMemo } from "react";
import NextLink from "next/link";
import { useRouter, usePathname } from "@workspace/i18n/use-router";
import classNames from "classnames";

const Link = ({
  children,
  to,
  href,
  activeClassName,
  partiallyActive,
  partiallyActiveIgnore = [],
  className,
  ...other
}) => {
  to = to ?? href;
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
        className={classNames(className, {
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
};

const InlineLink = ({ to, children, ...props }) => (
  <a href={to} {...props} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export { Link, InlineLink };
