"use client";

import * as React from "react";
import { Facebook, Linkedin, Send, Link2, Check } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { cn } from "@/lib/utils";

export interface SocialItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
}

export interface SocialShareProps {
  /**
   * Optional array of social items. If not provided, defaults to sharing the current page.
   */
  items?: SocialItem[];
  /**
   * The URL to share. If not provided, uses current page URL.
   */
  url?: string;
  /**
   * The title/text to share. Used for Twitter/Telegram share text.
   */
  title?: string;
  /**
   * Custom class name for the container
   */
  className?: string;
  /**
   * Custom class name for individual icon buttons/links
   */
  itemClassName?: string;
  /**
   * Icon size class (default: "size-5")
   */
  iconSize?: string;
  /**
   * Visual variant for styling
   */
  variant?: "default" | "dark" | "light" | "card";
}

const defaultIconSize = "size-5";

const variantStyles = {
  default: "text-purple-400 hover:text-purple-300",
  dark: "text-white hover:opacity-60",
  light: "text-gray-700 hover:text-gray-900",
  card: "",
};

export function SocialShare({
  items,
  url,
  title,
  className,
  itemClassName,
  iconSize = defaultIconSize,
  variant = "default",
}: SocialShareProps) {
  const [mounted, setMounted] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Resolve the share URL to an absolute URL only after mount to avoid hydration mismatch
  const shareUrl = React.useMemo(() => {
    if (!mounted || typeof window === "undefined") {
      return url || "";
    }
    if (!url) {
      return window.location.href;
    }
    // Convert relative URLs to absolute
    if (url.startsWith("/")) {
      return `${window.location.origin}${url}`;
    }
    return url;
  }, [url, mounted]);
  const shareTitle = title || "";

  const handleCopyLink = React.useCallback(() => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          /* no-op */
        });
    }
  }, [shareUrl]);

  // If custom items are provided, use them
  const socialItems: SocialItem[] = items || [
    {
      label: "Share on X",
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
    {
      label: "Share on Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "Share on LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "Share on Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
    {
      label: "Copy link",
      icon: Link2,
      onClick: handleCopyLink,
    },
  ];

  if (variant === "card") {
    const CopyIcon = copied ? Check : Link2;
    return (
      <div
        className={cn(
          "mt-16 border-t border-b border-white/10 pt-8 pb-8",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Share this article
          </span>
          <div className="flex items-center gap-2">
            {socialItems.map(({ label, icon: Icon, href, onClick }) => {
              const isCopy = label === "Copy link";
              const DisplayIcon = isCopy ? CopyIcon : Icon;
              const sharedClassName = cn(
                "flex items-center justify-center size-10 rounded-full",
                "bg-white/[0.04] border border-white/[0.08]",
                "text-white/40 transition-all duration-300",
                "hover:bg-white/[0.08] hover:border-white/15 hover:text-[#CA9FF5]",
                isCopy &&
                  copied &&
                  "!border-emerald-500/30 !bg-emerald-500/10 !text-emerald-400",
              );

              return href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={sharedClassName}
                  aria-label={label}
                >
                  <DisplayIcon className="size-4" />
                </a>
              ) : (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className={cn(sharedClassName, "cursor-pointer")}
                  aria-label={isCopy && copied ? "Copied!" : label}
                >
                  <DisplayIcon className="size-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const baseItemClassName = cn(
    "group flex cursor-pointer items-center justify-center transition",
    variantStyles[variant],
    itemClassName,
  );

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {socialItems.map(({ label, icon: Icon, href, onClick }) =>
        href ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(baseItemClassName, "size-12")}
            aria-label={label}
          >
            <Icon className={iconSize} />
          </a>
        ) : (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className={cn(baseItemClassName, "size-12 cursor-pointer")}
            aria-label={label}
          >
            <Icon className={iconSize} />
          </button>
        ),
      )}
    </div>
  );
}
