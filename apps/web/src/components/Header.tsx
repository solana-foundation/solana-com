"use client";

import React from "react";
import { NavigationAdapter } from "./NavigationAdapter";
import DevelopersNav from "./developers/DevelopersNav/DevelopersNav";
import { useRouter } from "@@/src/hooks/useRouter";

interface HeaderProps {
  className?: string;
  containerClassName?: string;
}

const Header: React.FC<HeaderProps> = ({
  className = "",
  containerClassName = "",
}) => {
  const router = useRouter();

  // Determine if secondary nav should be shown
  const showDevelopersNav =
    router.asPath.includes("/developers") || router.asPath.includes("/docs");

  return (
    <>
      <NavigationAdapter
        className={className}
        containerClassName={containerClassName}
      />
      {/* Secondary nav for /developers/* and /docs/* */}
      {showDevelopersNav && (
        <DevelopersNav containerClassName={containerClassName} />
      )}
    </>
  );
};

export default Header;
