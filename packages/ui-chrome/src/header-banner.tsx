import { twMerge } from "tailwind-merge";
import { Link } from "./link";
import ChevronRightSmallIcon from "./assets/icons/chevron-right-small.inline.svg";
import ArrowIcon from "./assets/nav/banner/arrow.inline.svg";
import CalendarTodayIcon from "./assets/nav/banner/calendar-today.inline.svg";

interface HeaderBannerProps {
  className?: string;
  backgroundClassName?: string;
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
  backgroundClassName = `xl:bg-[url(/src/img/nav/nav-banner-bg.webp)] bg-[url(/src/img/nav/nav-banner-bg-mobile.webp)]`,
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
        "p-4 xl:p-5 rounded-xl flex flex-col items-start justify-between gap-4 min-h-[200px] xl:min-h-[260px] text-[14px] xl:text-[15px] leading-[1.5]",
        className,
        `bg-cover bg-center bg-no-repeat bg-black`,
        backgroundClassName,
      )}
    >
      <div>
        {logo && <div>{logo}</div>}
        {title && (
          <div className="font-medium text-white text-[17px] xl:text-[20px] leading-[1.2] tracking-[-0.32px] xl:tracking-[-0.4px] mt-1">
            {title}
          </div>
        )}
        {description && (
          <div className="font-medium text-[rgba(255,255,255,0.64)] mt-1.5 text-[13px] xl:text-[14px] leading-[1.45]">
            {description}
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-1.5">
        {date && (
          <div className="pr-3 pl-2 h-[28px] xl:h-[30px] font-medium text-white text-[12px] xl:text-[13px] leading-none tracking-[-0.14px] bg-[rgba(25,24,27,0.4)] rounded-full backdrop-blur-[12px] flex items-center">
            <CalendarTodayIcon className="mr-1.5 size-4" />
            {date}
          </div>
        )}
        {location && (
          <div className="pr-3 pl-2 h-[28px] xl:h-[30px] text-white text-[12px] xl:text-[13px] leading-none tracking-[-0.14px] bg-[rgba(25,24,27,0.4)] rounded-full backdrop-blur-[12px] flex items-center">
            <ArrowIcon className="mr-1.5 size-4" />
            {location}
          </div>
        )}
        {cta && ctaHref && (
          <div className={date || location ? "mt-2" : ""}>
            <Link
              to={ctaHref}
              className="block group/cta pl-4 pr-2 h-[34px] font-medium text-black text-[14px] leading-[34px] tracking-[-0.16px] bg-white hover:bg-white/90 transition-colors rounded-full text-nowrap"
            >
              {cta}
              <ChevronRightSmallIcon className="ml-1 size-5 group-hover/cta:translate-x-[2px] transition-transform duration-200 inline-flex" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
