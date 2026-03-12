import React from "react";
import Image from "next/image";
import Link from "next/link";
import SolanaLogo from "../logotype.inline.svg";
import { shouldUseNextLink } from "@solana-com/ui-chrome/url-config";

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
    const logoImage = (
      <Image
        src={SolanaLogo}
        alt="Solana Logo"
        width={width}
        height={height}
        className={className}
      />
    );

    if (shouldUseNextLink(href)) {
      return <Link href={href}>{logoImage}</Link>;
    }

    return <a href={href}>{logoImage}</a>;
  },
);

HeaderLogo.displayName = "HeaderLogo";
