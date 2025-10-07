import { cn } from "@/app/components/utils";

export type DividerProps = {
  className?: string;
};

export const Divider = ({ className }: DividerProps) => (
  <div className={cn("w-full md:hidden", className)}>
    <hr className="border-white/10 border-t m-0 !opacity-100" />
  </div>
);
