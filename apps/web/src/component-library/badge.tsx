import React from "react";
import Image from "next/image";
import { cn } from "@/app/components/utils";

export type BadgeProps = {
  className?: string;
  title?: React.ReactNode | string;
  LeftIcon?:
    | string
    | React.ComponentType<{
        className?: string;
        size?: string | number;
      }>;
};

export const Badge: React.FC<BadgeProps> = ({ className, title, LeftIcon }) => {
  return (
    <div
      className={cn(
        "h-[28px] md:h-[32px] px-twd-1.5 py-twd-1 text-nd-primary bg-nd-border-light rounded-sm font-medium nd-body-s inline-flex items-center flex-row !leading-[17px] md:!leading-[21px]",
        className,
      )}
    >
      {typeof LeftIcon === "string" ? (
        <Image
          className="inline-block align-middle mr-twd-0.5 max-xl:size-[18px] rounded-[2px]"
          src={LeftIcon}
          width={0}
          height={0}
          alt=""
        />
      ) : Boolean(LeftIcon) ? (
        <LeftIcon size={20} />
      ) : null}
      <span className="px-twd-1.5 inline-block align-middle pt-twd-0.5">
        {title}
      </span>
    </div>
  );
};
