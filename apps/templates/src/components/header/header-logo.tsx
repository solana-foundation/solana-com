import React from "react";
import Image from "next/image";
import Link from "next/link";
import SolanaLogo from "../logotype.inline.svg";
import {
  resolveHref,
  shouldUseNextLink,
} from "@solana-com/ui-chrome/url-config";

export interface HeaderLogoProps {
  href?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const HeaderLogo = React.memo<HeaderLogoProps>(
  ({
    href = "https://solana.com",
    width = 149,
    height = 22,
    className = "text-white",
  }) => {
    const resolvedHref = resolveHref(href);
    const useNextLink = shouldUseNextLink(href);

    const logoImage = (
      <Image
        src={SolanaLogo}
        alt="Solana Logo"
        width={width}
        height={height}
        className={className}
      />
    );

    if (useNextLink) {
      return <Link href={resolvedHref}>{logoImage}</Link>;
    }

    return (
      <a href={resolvedHref} rel="noopener noreferrer">
        {logoImage}
      </a>
    );
  },
);

HeaderLogo.displayName = "HeaderLogo";
