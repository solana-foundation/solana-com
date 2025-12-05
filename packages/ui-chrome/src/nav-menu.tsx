import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import classNames, { ArgumentArray } from "classnames";
import { twMerge } from "tailwind-merge";
import AngleDown from "./assets/angle-down.inline.svg";

function cn(...inputs: ArgumentArray) {
  return twMerge(classNames(inputs));
}

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("group flex flex-1 list-none mb-0", className)}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle =
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:text-accent-foreground focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1";

function NavigationMenuTrigger({
  className,
  children,
  isActive,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger> & {
  isActive?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        navigationMenuTriggerStyle,
        "group",
        "flex justify-between items-center w-full xl:w-auto py-1 px-4",
        "text-[rgba(255,255,255,0.64)] text-[16px] leading-[1.5] font-normal light:text-[rgba(0,0,0,0.64)]",
        "border-0 rounded-full",
        "hover:text-white focus:text-white hover:bg-[rgba(240,228,255,0.12)] focus:bg-[rgba(240,228,255,0.12)] light:hover:text-black light:focus:text-black light:hover:bg-black/5 light:focus:bg-black/5",
        "relative",
        "transition-colors duration-200",
        "before:transition-all before:duration-300 before:ease-out",
        "data-[state=open]:text-white data-[state=open]:bg-[rgba(240,228,255,0.12)] light:data-[state=open]:text-black light:data-[state=open]:bg-black/5",
        isActive && "text-white light:!text-black",
        className,
      )}
      {...props}
    >
      {children}{" "}
      <AngleDown
        className="relative top-[1px] ml-1 -mr-2 size-5"
        aria-hidden="true"
        width={20}
        height={20}
        viewBox="0 0 24 24"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  align = "center",
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content> & {
  align?: "center" | "right";
}) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        // Motion-based slide animations - handles directional entrance/exit
        // "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
        "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
        // "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52",
        // "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
        // Positioning
        "top-[45px] left-0 w-full xl:absolute xl:w-auto",
        // Viewport-less mode animations - when NavigationMenu has viewport={false}
        // "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground",
        // "group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out",
        // "group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95",
        // "group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0",
        // "group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md",
        // "group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200",
        // Focus states for nested links
        "[&_data-[slot=navigation-menu-link]]:focus:ring-0 [&_data-[slot=navigation-menu-link]]:focus:outline-none",
        // Alignment
        align === "center" && "xl:left-1/2 xl:-translate-x-1/2",
        align === "right" && "xl:right-0 xl:left-auto xl:translate-x-0",
        // Visual styling
        "min-w-[300px] bg-[rgba(25,24,27,0.90)] p-2 rounded-xl text-[rgba(255,255,255,0.64)] text-[14px] xl:text-[16px] leading-[1.5] backdrop-blur-[12px]",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className={cn("absolute top-full left-0 flex justify-center")}>
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:focus:bg-accent data-[active=true]:text-accent-foreground hover:text-accent-foreground focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
