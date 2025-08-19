"use client";

import React from "react";
import { NavigationAdapter } from "./NavigationAdapter";
import DevelopersNav from "./developers/DevelopersNav/DevelopersNav";
import { useRouter } from "@@/src/hooks/useRouter";

interface HeaderNewProps {
  className?: string;
  containerClassName?: string;
}

const HeaderNew: React.FC<HeaderNewProps> = ({
  className = "",
  containerClassName = "",
}) => {
  const router = useRouter();

  return (
    <>
      <NavigationAdapter
        className={className}
        containerClassName={containerClassName}
      />
      {/* Secondary nav for /developers/* and /docs/* */}
      {(router.asPath.includes("/developers") ||
        router.asPath.includes("/docs")) && (
        <DevelopersNav containerClassName={containerClassName} />
      )}
    </>
  );
};

export default HeaderNew;
