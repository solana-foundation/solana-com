"use client";

import * as React from "react";
import { Facebook, Linkedin, Send, Link2 } from "lucide-react";
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
  variant?: "default" | "dark" | "light";
}

const defaultIconSize = "size-5";

const variantStyles = {
  default: "text-purple-400 hover:text-purple-300",
  dark: "text-white hover:opacity-60",
  light: "text-gray-700 hover:text-gray-900",
};

/**
 * SocialShare component for sharing content across social media platforms
 *
 * @example
 * // Dynamic sharing (for individual posts)
 * <SocialShare
 *   url={shareUrl}
 *   title={shareTitle}
 *   variant="default"
 * />
 *
 * @example
 * // Static links (for homepage/listing pages)
 * <SocialShare
 *   items={customSocialItems}
 *   variant="dark"
 * />
 */
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

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use provided URL or fallback to current page URL (only on client after mount)
  const shareUrl =
    url ||
    (mounted && typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || "";

  const handleCopyLink = React.useCallback(() => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {
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

  const baseItemClassName = cn(
    "group flex items-center justify-center transition",
    variantStyles[variant],
    itemClassName
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
        )
      )}
    </div>
  );
}
