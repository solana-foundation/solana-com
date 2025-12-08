import { twMerge } from "tailwind-merge";
import { Link } from "./link";
import ChevronRightSmallIcon from "./assets/chevron-right-small.inline.svg";
import ArrowIcon from "./assets/nav/banner/arrow.inline.svg";
import CalendarTodayIcon from "./assets/nav/banner/calendar-today.inline.svg";

interface HeaderBannerProps {
  className?: string;
  title?: string;
  description?: string;
  logo?: React.ReactNode;
  cta?: string;
  ctaHref?: string;
  location?: string;
  date?: string;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  className,
  title,
  description,
  logo,
  cta,
  ctaHref,
  location,
  date,
}) => {
  return (
    <div
      className={twMerge(
        "aspect-[5/4] xl:aspect-square p-4 rounded-xl flex flex-col items-start justify-between gap-2.5 max-xl:py-3 xl:py-2.5 text-[14px] xl:text-[16px] leading-[1.5]",
        className,
        `bg-cover bg-center bg-no-repeat bg-black`,
        `xl:bg-[url(/src/img/nav/nav-banner-bg.webp)] bg-[url(/src/img/nav/nav-banner-bg-mobile.webp)]`,
      )}
    >
      <div>
        {logo && <div>{logo}</div>}
        {title && (
          <div className="font-medium text-white text-[18px] xl:text-[24px] tracking-[-0.36px] xl:tracking-[-0.48px]">
            {title}
          </div>
        )}
        {description && (
          <div className="font-medium text-[rgba(255,255,255,0.64)] mt-1 text-[16px] xl:text-[18px]">
            {description}
          </div>
        )}
      </div>
      <div className="flex flex-col items-start">
        {date && (
          <div className="mb-1 pr-4 pl-2.5 h-[28px] xl:h-[36px] font-medium text-white text-[14px] xl:text-[16px] leading-[28px] xl:leading-[36px] tracking-[-0.14px] xl:tracking-[-0.18px] bg-[rgba(25,24,27,0.4)] rounded-full backdrop-blur-[12px] flex items-center">
            <CalendarTodayIcon className="mr-2 size-5" />
            {date}
          </div>
        )}
        {location && (
          <div className="mb-1 pr-4 pl-2.5 h-[28px] xl:h-[36px] text-white text-[14px] xl:text-[16px] leading-[28px] xl:leading-[36px] tracking-[-0.14px] xl:tracking-[-0.18px] bg-[rgba(25,24,27,0.4)] rounded-full backdrop-blur-[12px] flex items-center">
            <ArrowIcon className="mr-2 size-5" />
            {location}
          </div>
        )}
        {cta && ctaHref && (
          <div className="mt-5">
            <Link
              to={ctaHref}
              className="block group/cta pl-4 pr-2 h-[36px] font-medium text-black text-[16px] leading-[36px] tracking-[-0.16px] xl:tracking-[-0.18px] bg-white rounded-full text-nowrap"
            >
              {cta}
              <ChevronRightSmallIcon className="ml-1 size-6 group-hover/cta:translate-x-[2px] transition-transform duration-200 inline-flex" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
