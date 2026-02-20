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
        "max-w-screen-2xl w-full mx-auto px-5 md:px-8 xl:px-10",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
