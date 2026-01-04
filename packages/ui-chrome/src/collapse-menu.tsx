"use client";

import * as React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import AngleDown from "./assets/angle-down.inline.svg";
import { twMerge } from "tailwind-merge";

interface CollapseMenuProps {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
  alwaysOpen?: boolean;
}

export const CollapseMenu = ({
  className,
  title,
  children,
  alwaysOpen = false,
}: CollapseMenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (alwaysOpen) {
    return (
      <>
        {title}
        {children}
      </>
    );
  }

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <Collapsible.Trigger asChild>
        <button
          className={twMerge(
            "flex w-full items-center justify-between",
            className,
          )}
        >
          {title}
          <AngleDown
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            width={20}
            height={20}
            viewBox="0 0 24 24"
          />
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className="overflow-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:duration-300 data-[state=closed]:duration-300">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
