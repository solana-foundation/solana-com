import { cn } from "@/app/components/utils";

export type DividerProps = {
  className?: string;
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
};

export const Divider = ({
  className,
  hideOnMobile,
  hideOnDesktop,
  hideOnTablet,
}: DividerProps) => (
  <div
    className={cn(
      "w-full",
      className,
      hideOnMobile && "max-md:hidden",
      hideOnDesktop && "xl:hidden",
      hideOnTablet && "md:hidden",
    )}
  >
    <hr className="border-nd-border-light border-t m-0 !opacity-100" />
  </div>
);
