import React from "react";

const ACTIVE_CLASSNAME =
  "group-[.active]/link:bg-gradient-to-r group-[.active]/link:from-transparent group-[.active]/link:via-[10%] group-[.active]/link:via-white/5 group-[.active]/link:to-transparent group-hover/link:bg-gradient-to-r group-hover/link:from-transparent group-hover/link:via-[10%] group-hover/link:via-white/5 group-hover/link:to-transparent";

interface HeaderItemProps {
  title?: string;
  description?: string;
  Icon?: React.ComponentType<{
    className?: string;
  }>;
  variant?: "medium" | "large";
}

export const HeaderItem: React.FC<HeaderItemProps> = ({
  title,
  description,
  Icon,
  variant = "medium",
}) => {
  if (variant === "large") {
    return (
      <div
        className={
          ACTIVE_CLASSNAME + " flex items-start gap-3 max-xl:py-4 xl:py-4"
        }
      >
        {Icon && (
          <div className="w-[40px] h-[40px] shrink-0 flex items-center justify-center bg-white/[0.06] rounded-lg">
            <Icon className="size-[20px] text-white" />
          </div>
        )}
        <div className="min-w-0">
          <div className="font-medium text-white text-[14px] xl:text-[15px] leading-[1.35]">
            {title}
          </div>
          <div className="text-white/55 mt-0.5 text-[13px] xl:text-[13px] leading-[1.4]">
            {description}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        ACTIVE_CLASSNAME + " flex items-center gap-2.5 max-xl:py-3.5 xl:py-3"
      }
    >
      {Icon && <Icon className="size-[18px] text-white shrink-0" />}
      <div className="font-medium text-white text-[14px]">{title}</div>
    </div>
  );
};
