import React from "react";
import Link from "../utils/Link";

export type ButtonVariant = "cta" | "primary" | "secondary" | "tertiary";
export type ButtonSize = "xl" | "l" | "m";

const ArrowLeft = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.25 9H3.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.25 13.5L3.75 9L8.25 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.75 9H14.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.75 4.5L14.25 9L9.75 13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Custom left icon; defaults to ArrowLeft */
  leftIcon?: React.ReactNode;
  /** Custom right icon; defaults to ArrowRight */
  rightIcon?: React.ReactNode;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  newTab?: boolean;
  to?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export const Button = ({
  variant = "cta",
  size = "m",
  leftIcon,
  rightIcon,
  showLeftIcon = false,
  showRightIcon = false,
  children = "Join waitlist",
  className,
  newTab,
  to,
  ...props
}: ButtonProps) => {
  const iconSize = size === "m" ? 16 : 18;
  const isCta = variant === "cta";
  const isLight = variant === "cta" || variant === "primary";

  const heightClass = { xl: "h-14", l: "h-12", m: "h-10" }[size];

  const outerPadding = isCta
    ? { xl: "px-3", l: "px-2", m: "px-1" }[size]
    : "px-4";

  const variantClasses = {
    cta: "[&&&]:bg-white [&&&]:hover:bg-[#ececec]",
    primary: "[&&&]:bg-white [&&&]:hover:bg-[#ececec]",
    secondary: "[&&&]:bg-white/[0.08] [&&&]:hover:bg-white/[0.12]",
    tertiary:
      "[&&&]:border [&&&]:border-white/[0.28] [&&&]:hover:border-white/[0.20]",
  }[variant];

  const textColor = isLight ? "[&&&]:text-black" : "[&&&]:text-white";

  const textSizeClass =
    size === "m"
      ? "font-normal text-[length:16px] tracking-[-0.16px] leading-[22px] [font-style:normal]"
      : "font-normal text-[length:18px] tracking-[-0.18px] leading-[24px] [font-style:normal]";

  const labelPadding = isCta
    ? size === "xl"
      ? "px-4"
      : "px-3"
    : size === "xl"
      ? variant === "primary"
        ? "px-4"
        : "px-3"
      : size === "l"
        ? "px-1"
        : "px-0.5";

  const renderIcon = (icon: React.ReactNode, direction: "left" | "right") => {
    const defaultIcon =
      direction === "left" ? (
        <ArrowLeft size={iconSize} />
      ) : (
        <ArrowRight size={iconSize} />
      );

    if (isCta) {
      return (
        <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-black rounded-full text-white">
          {icon ?? defaultIcon}
        </div>
      );
    }

    return <span className="shrink-0">{icon ?? defaultIcon}</span>;
  };

  const Tag = to ? Link : "button";
  const tagProps = to
    ? {
        to,
        target: newTab ? "_blank" : undefined,
        rel: newTab ? "noopener noreferrer" : undefined,
      }
    : { type: "button" as const };

  return (
    <Tag
      className={[
        "all-[unset] box-border cursor-pointer",
        "inline-flex items-center justify-center rounded-[800px]",
        "transition-colors",
        isCta ? "" : "gap-1",
        heightClass,
        outerPadding,
        variantClasses,
        textColor,
        className ?? "",
      ].join(" ")}
      {...tagProps}
      {...props}
    >
      {showLeftIcon && renderIcon(leftIcon, "left")}
      <span className={`whitespace-nowrap ${textSizeClass} ${labelPadding}`}>
        {children}
      </span>
      {showRightIcon && renderIcon(rightIcon, "right")}
    </Tag>
  );
};

export default Button;
