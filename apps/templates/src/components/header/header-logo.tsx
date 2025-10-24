import React from "react";
import Image from "next/image";
import SolanaLogo from "../logotype.inline.svg";

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
    return (
      <a href={href} rel="noopener noreferrer">
        <Image
          src={SolanaLogo}
          alt="Solana Logo"
          width={width}
          height={height}
          className={className}
        />
      </a>
    );
  },
);

HeaderLogo.displayName = "HeaderLogo";
