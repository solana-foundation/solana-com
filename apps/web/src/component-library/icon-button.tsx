import React from "react";

export type IconButtonVariant = "default" | "vibrant";
export type IconButtonSize = "l" | "xl" | "2xl";
export type IconButtonDirection = "left" | "right";

const ChevronRight = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 3.5L10.5 8L6 12.5"
      stroke="currentColor"
      strokeWidth={size > 24 ? 0.75 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronLeft = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 3.5L5.5 8L10 12.5"
      stroke="currentColor"
      strokeWidth={size > 24 ? 0.75 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const iconSizeMap = { l: 16, xl: 20, "2xl": 40 };

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Built-in chevron direction; ignored when `icon` is provided */
  direction?: IconButtonDirection;
  /** Custom icon — overrides the built-in chevron */
  icon?: React.ReactNode;
}

export const IconButton = ({
  variant = "default",
  size = "l",
  direction = "right",
  icon,
  className,
  style,
  ...props
}: IconButtonProps) => {
  const iconSize = iconSizeMap[size];

  const sizeClass = {
    l: "size-10",
    xl: "size-14",
    "2xl": "size-[108px]",
  }[size];

  const variantClasses = {
    default: "bg-white/[0.08] hover:bg-white/[0.12]",
    vibrant:
      "bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.20] hover:border-white/[0.28]",
  }[variant];

  return (
    <button
      className={[
        "all-[unset] box-border cursor-pointer",
        "inline-flex items-center justify-center rounded-full",
        "text-white backdrop-blur-[6px] transition-colors [&>svg]:opacity-[0.64] hover:[&>svg]:opacity-[1]",
        sizeClass,
        variantClasses,
        className ?? "",
      ].join(" ")}
      style={{ ...style }}
      {...props}
    >
      {icon ??
        (direction === "left" ? (
          <ChevronLeft size={iconSize} />
        ) : (
          <ChevronRight size={iconSize} />
        ))}
    </button>
  );
};

export default IconButton;
