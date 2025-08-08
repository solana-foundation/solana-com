import { cn } from "@/app/components/utils";

export type DividerProps = {
  className?: string;
};

export const Divider = ({ className }: DividerProps) => (
  <div className={cn("max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
    <hr className=" border-[#919191] " />
  </div>
);
