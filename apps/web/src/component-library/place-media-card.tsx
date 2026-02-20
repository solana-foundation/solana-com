import Image from "next/image";
import { cn } from "@/app/components/utils";
import CalendarTodayIcon from "@@/public/src/img/icons/CalenderToday.inline.svg";
import SendIcon from "@@/public/src/img/icons/Send.inline.svg";
import { Badge } from "./badge";
import { format } from "date-fns";

export type PlaceMediaCardProps = {
  className?: string;
  style?: React.CSSProperties;
  imageSrc: string;
  title?: string;
  date?: string;
  location?: string;
  href?: string;
};

export const PlaceMediaCard: React.FC<PlaceMediaCardProps> = ({
  className,
  style,
  imageSrc,
  title,
  date,
  location,
  href,
}) => {
  const content = (
    <>
      <div className="relative w-full aspect-square rounded-xl overflow-hidden group">
        <Image
          src={imageSrc}
          alt={title || ""}
          fill
          className="object-cover z-0"
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
        />
      </div>
      <h3 className="nd-heading-s mt-6">{title}</h3>
      {(location || date) && (
        <div className="mt-2 flex gap-1 flex-wrap">
          {date && (
            <Badge
              title={format(new Date(date), "EEE, MMM d")}
              LeftIcon={CalendarTodayIcon}
            />
          )}
          {location && <Badge title={location} LeftIcon={SendIcon} />}
        </div>
      )}
    </>
  );

  return href ? (
    <a
      className={cn(
        "flex flex-col w-full self-start min-w-0 text-inherit",
        className,
      )}
      style={style}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    <div
      className={cn("flex flex-col w-full self-start min-w-0", className)}
      style={style}
    >
      {content}
    </div>
  );
};
