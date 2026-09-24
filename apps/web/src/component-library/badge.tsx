import React from "react";
import Image from "next/image";
import { cn } from "@/app/components/utils";

export type BadgeProps = {
  className?: string;
  title?: React.ReactNode | string;
  LeftIcon?:
    | string
    | React.ElementType<{
        className?: string;
        width?: string | number;
        height?: string | number;
        "aria-hidden"?: boolean;
      }>;
};

export const Badge: React.FC<BadgeProps> = ({ className, title, LeftIcon }) => {
  return (
    <div
      className={cn(
        "h-[28px] md:h-[32px] px-1.5 py-1 text-nd-primary bg-nd-border-light rounded-sm font-medium nd-body-s inline-flex items-center flex-row !leading-[17px] md:!leading-[21px]",
        className,
      )}
    >
      {typeof LeftIcon === "string" ? (
        <Image
          className="inline-block align-middle mr-0.5 max-xl:size-[18px] rounded-[2px]"
          src={LeftIcon}
          width={0}
          height={0}
          alt=""
        />
      ) : LeftIcon ? (
        <LeftIcon width={20} height={20} aria-hidden={true} />
      ) : null}
      <span className="px-1.5 inline-block align-middle pt-0.5">{title}</span>
    </div>
  );
};
