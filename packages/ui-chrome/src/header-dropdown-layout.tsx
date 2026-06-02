import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { HeaderBanner } from "./header-banner";
import type { NavBannerDefinition, NavBannerPosition } from "./nav-types";

const BANNER_BASE_CLASS = "xl:w-[300px] xl:shrink-0 w-full";

interface HeaderDropdownLayoutProps {
  banner?: NavBannerDefinition;
  bannerPosition?: NavBannerPosition;
  children: React.ReactNode;
  className?: string;
}

export function HeaderDropdownLayout({
  banner,
  bannerPosition,
  children,
  className,
}: HeaderDropdownLayoutProps) {
  const t = useTranslations();

  const position: NavBannerPosition =
    bannerPosition ?? banner?.position ?? "left";

  const isExpired =
    banner?.expiresAt && new Date() >= new Date(banner.expiresAt);

  const bannerNode =
    banner && !isExpired
      ? (() => {
          const content = t.raw(banner.translationKey) as {
            title?: string;
            description?: string;
            cta?: string;
            location?: string;
            date?: string;
          };
          const Logo = banner.Logo;
          return (
            <HeaderBanner
              className={twMerge(BANNER_BASE_CLASS, banner.className)}
              backgroundClassName={banner.backgroundClassName}
              logo={
                Logo ? (
                  <Logo width={banner.logoWidth} height={banner.logoHeight} />
                ) : undefined
              }
              title={content?.title}
              description={content?.description}
              cta={content?.cta}
              ctaHref={banner.href}
              location={content?.location}
              date={content?.date}
            />
          );
        })()
      : null;

  return (
    <div
      className={twMerge(
        "xl:w-[960px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-3 xl:items-start",
        className,
      )}
    >
      {bannerNode && position === "left" && bannerNode}
      <div className="flex-1 xl:min-w-0 w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-5">
        {children}
      </div>
      {bannerNode && position === "right" && bannerNode}
    </div>
  );
}

interface NavDropdownColumnProps {
  children: React.ReactNode;
  className?: string;
  width?: "primary" | "grow" | "equal";
}

export function NavDropdownColumn({
  children,
  className,
  width = "equal",
}: NavDropdownColumnProps) {
  const widthClass =
    width === "primary"
      ? "xl:flex-[1.2] xl:min-w-0"
      : width === "grow"
        ? "grow xl:min-w-0"
        : "xl:flex-1 xl:min-w-0";

  return (
    <div className={twMerge("px-2 xl:px-3", widthClass, className)}>
      {children}
    </div>
  );
}
