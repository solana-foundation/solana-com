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
          ACTIVE_CLASSNAME + " flex items-center gap-4 max-xl:py-4 xl:py-5"
        }
      >
        {Icon && (
          <div className="w-[50px] h-[50px] flex items-center justify-center bg-[rgba(255,255,255,0.06)] rounded-lg">
            <Icon className="size-[24px] text-white" />
          </div>
        )}
        <div>
          <div className="font-medium text-white">{title}</div>
          <div className="text-[rgba(255,255,255,0.64)] mt-1">
            {description}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        ACTIVE_CLASSNAME + " flex items-center gap-2.5 max-xl:py-3 xl:py-2.5"
      }
    >
      {Icon && <Icon className="size-[20px] text-white" />}
      <div className="font-medium text-white">{title}</div>
    </div>
  );
};
