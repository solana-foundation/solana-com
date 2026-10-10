import type { ElementType, HTMLAttributes, ReactNode } from "react";
import Image from "next/image";

import { cn } from "../lib/utils";

export interface LandingImage {
  src: string;
  alt?: string;
}

export interface LandingPerson {
  thumbnail?: LandingImage;
  name?: string;
  role?: string;
  company?: string;
}

export interface ActionButtonProps {
  url?: string;
  label?: ReactNode;
  children?: ReactNode;
  hierarchy?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "outline"
    | "purpleGradient"
    | "greenGradient"
    | "link"
    | "disabled";
  size?: "sm" | "md" | "lg" | "xl";
  startIcon?: string;
  endIcon?: string;
  iconSize?: "sm" | "md" | "lg" | "xl";
  iconClassName?: string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function ActionIcon({ id, className }: { id: string; className?: string }) {
  if (id === "none") return null;
  if (id === "check-circle") {
    return (
      <svg
        className={cn("size-4", className)}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="m8 12 2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg
      className={cn("size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={
          id === "arrow-up-right"
            ? "M5 19 19 5M8 5h11v11"
            : "M4 12h16m-7-7 7 7-7 7"
        }
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ActionButton({
  url,
  label,
  children,
  hierarchy = "primary",
  size = "md",
  startIcon,
  endIcon,
  iconClassName,
  className,
  disabled,
  type = "button",
  onClick,
}: ActionButtonProps) {
  const classes = cn(
    "inline-flex w-fit items-center justify-center gap-3 rounded-full font-brand-mono text-xs uppercase tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CA9FF5] disabled:pointer-events-none disabled:opacity-50",
    size === "sm" && "px-3 py-1.5",
    size === "md" && "px-4 py-[9px] text-sm leading-[18px]",
    size === "lg" && "w-full px-[18px] py-[13px] text-base leading-6 sm:w-fit",
    size === "xl" && "px-6 py-5",
    (hierarchy === "primary" || hierarchy === "purpleGradient") &&
      "bg-[#9945FF] text-white hover:bg-[#b26aff]",
    (hierarchy === "secondary" || hierarchy === "greenGradient") &&
      "bg-[#14F195] text-black hover:bg-[#14F195]/80",
    hierarchy === "tertiary" && "bg-[#00D4FF] text-black hover:bg-[#00D4FF]/80",
    hierarchy === "outline" &&
      "border border-white/50 text-white hover:bg-white hover:text-black",
    hierarchy === "link" && "px-0 py-0 text-white hover:text-[#CA9FF5]",
    hierarchy === "disabled" &&
      "pointer-events-none bg-neutral-500 text-neutral-700",
    className,
  );
  const content = (
    <>
      {startIcon && <ActionIcon id={startIcon} className={iconClassName} />}
      <span>{children || label}</span>
      {endIcon && <ActionIcon id={endIcon} className={iconClassName} />}
    </>
  );

  if (url && !disabled) {
    if (url.startsWith("#")) {
      return (
        <a href={url} className={classes}>
          {content}
        </a>
      );
    }
    if (url.startsWith("/")) {
      return (
        <a href={url} className={classes}>
          {content}
        </a>
      );
    }
    if (/^(mailto:|tel:)/i.test(url)) {
      return (
        <a href={url} className={classes}>
          {content}
        </a>
      );
    }
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        if (
          parsed.hostname === "solana.com" ||
          parsed.hostname === "www.solana.com"
        ) {
          return (
            <a href={url} className={classes}>
              {content}
            </a>
          );
        }
        return (
          <a
            href={url}
            className={classes}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        );
      }
    } catch {
      // An invalid URL has no navigation target.
    }
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || hierarchy === "disabled"}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export function ActionList({
  buttons,
  className,
}: {
  buttons?: ActionButtonProps[];
  className?: string;
}) {
  if (!buttons?.length) return null;
  return (
    <div
      className={cn("flex flex-col gap-2 sm:flex-row sm:flex-wrap", className)}
    >
      {buttons.map((button, index) => (
        <ActionButton key={`${button.url || "button"}-${index}`} {...button} />
      ))}
    </div>
  );
}

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  fullWidth?: boolean;
  noPadding?: "noPaddingX" | "noPaddingY" | "noPaddingAll";
  wrapperClass?: string;
  sectionId?: string;
  backgroundImage?: string;
}

export function Section({
  as: Component = "section",
  fullWidth,
  noPadding,
  wrapperClass,
  sectionId,
  backgroundImage,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <div
      id={sectionId}
      className={cn("relative isolate [contain:layout]", wrapperClass)}
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="-z-10 object-cover"
        />
      )}
      <Component
        className={cn(
          "mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20",
          fullWidth && "max-w-none",
          noPadding === "noPaddingX" && "px-0 sm:px-0 lg:px-0",
          noPadding === "noPaddingY" && "py-0 sm:py-0 lg:py-0",
          noPadding === "noPaddingAll" && "p-0 sm:p-0 lg:p-0",
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="font-brand-mono text-sm leading-[18px] uppercase tracking-[0.12em] text-[#CA9FF5]">
      {children}
    </span>
  );
}
