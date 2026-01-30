import React from "react";
import { twMerge } from "tailwind-merge";

type Breakpoint = "mobile" | "tablet" | "desktop";

interface ColumnsProps {
  children: React.ReactNode;
  /** Gap between columns in pixels */
  space?: number;
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
  const gapClass = space > 0 ? `gap-[${space}px]` : "";

  const baseClasses = "flex [&>*]:flex-1 items-center";

  const directionClasses = stackColumnsAt
    ? twMerge(
        reverseColumnsWhenStacked ? "flex-col-reverse" : "flex-col",
        breakpointClasses[stackColumnsAt],
      )
    : "flex-row";

  return (
    <div
      className={twMerge(baseClasses, gapClass, directionClasses, className)}
    >
      {children}
    </div>
  );
};
