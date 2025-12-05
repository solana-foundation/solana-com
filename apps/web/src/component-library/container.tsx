import React from "react";
import { cn } from "@/app/components/utils";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const Container: React.FC<ContainerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "max-w-screen-2xl w-full mx-twd-auto px-twd-5 md:px-twd-8 xl:px-twd-10",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
