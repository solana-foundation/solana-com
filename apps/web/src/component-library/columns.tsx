import React from "react";
import { twMerge } from "tailwind-merge";

type Breakpoint = "mobile" | "tablet" | "desktop";

interface ColumnsProps {
  children: React.ReactNode;
  space?: number | string;
  stackColumnsAt?: Breakpoint;
  reverseColumnsWhenStacked?: boolean;
  className?: string;
}

const breakpointClasses: Record<Breakpoint, string> = {
  mobile: "sm:flex-row",
  tablet: "lg:flex-row",
  desktop: "xl:flex-row",
};

export const Columns: React.FC<ColumnsProps> = ({
  children,
  space = 0,
  stackColumnsAt,
  reverseColumnsWhenStacked = false,
  className,
}) => {
  const gapStyle = typeof space === "number" ? `${space}px` : space;

  const baseClasses = "flex [&>*]:flex-1 items-center";

  const directionClasses = stackColumnsAt
    ? twMerge(
        reverseColumnsWhenStacked ? "flex-col-reverse" : "flex-col",
        breakpointClasses[stackColumnsAt],
      )
    : "flex-row";

  return (
    <div
      className={twMerge(baseClasses, directionClasses, className)}
      style={{ gap: gapStyle }}
    >
      {children}
    </div>
  );
};
