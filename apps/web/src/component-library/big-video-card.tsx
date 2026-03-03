import Image from "next/image";
import { VideoTrigger } from "@/component-library/video-modal";
import { cn } from "@/app/components/utils";
import { useTranslations } from "next-intl";

const PLAY_BUTTON_CLASSNAME =
  "backdrop-blur-xs !bg-black/70 [&&&]:!shadow-[0_2px_4px_1px_rgba(0,0,0,0.17),0_-4px_12px_0_rgba(255,255,255,0.29)_inset,0_1px_0_0_rgba(255,255,255,0.40)_inset,0_-1px_0_0_rgba(255,255,255,0.20)_inset]";

export type VideoBadgeType =
  | "event"
  | "interview"
  | "podcast"
  | "originals"
  | "learn";

export const VideoBadge = {
  Event: "event",
  Interview: "interview",
  Podcast: "podcast",
  Originals: "originals",
  Learn: "learn",
} as const;

const ICON_MAP = {
  [VideoBadge.Event]: "/src/img/video-badge/event-icon.svg",
  [VideoBadge.Interview]: "/src/img/video-badge/interview-icon.svg",
  [VideoBadge.Learn]: "/src/img/video-badge/learn-icon.svg",
  [VideoBadge.Originals]: "/src/img/video-badge/originals-icon.svg",
  [VideoBadge.Podcast]: "/src/img/video-badge/podcast-icon.svg",
};

const BG_MAP = {
  [VideoBadge.Event]: "#9C71EC",
  [VideoBadge.Interview]: "#ECE271",
  [VideoBadge.Learn]: "#EC71EC",
  [VideoBadge.Originals]: "#71E0EC",
  [VideoBadge.Podcast]: "#91EAA4",
};

export type BigVideoCardProps = {
  className?: string;
  id: string;
  thumbnail: string;
  title: string;
  description?: string;
  alt: string;
  badge?: VideoBadgeType;
  style?: React.CSSProperties;
};

export const BigVideoCard: React.FC<BigVideoCardProps> = ({
  className,
  id,
  thumbnail,
  title,
  description,
  alt,
  badge,
  style,
}) => {
  const t = useTranslations();

  return (
    <div
      className={cn("flex flex-col w-full self-start min-w-0", className)}
      style={style}
    >
      <div className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer group">
        <Image
          src={thumbnail}
          alt={alt}
          fill
          className="object-cover z-0"
          sizes="(max-width: 768px) 120vw, 80vw"
        />
        <VideoTrigger
          platform="youtube"
          id={id}
          title={title}
          bgColorClass="!bg-black/70"
          className={cn(
            "max-md:w-10 max-md:h-10 md:w-12 md:h-12 xl:w-[72px] xl:h-[72px] left-5 top-auto bottom-5 !translate-x-0 !translate-y-0",
            PLAY_BUTTON_CLASSNAME,
          )}
          iconClassName="max-md:!w-4 max-md:!h-4 md:!w-5 md:!h-5 xl:!w-6 xl:!h-6"
        />
        {badge && (
          <div
            className="absolute right-2 xl:right-3 bottom-2 xl:bottom-3 p-0.5 text-black rounded-sm text-xs xl:text-sm leading-none uppercase font-medium"
            style={{
              backgroundColor: BG_MAP[badge],
            }}
          >
            <Image
              className="inline-block align-middle mr-1.5 max-xl:size-[18px] rounded-[2px]"
              src={ICON_MAP[badge]}
              width={22}
              height={22}
              alt=""
            />
            <span className="pr-1 inline-block align-middle pt-0.5 tracking-[1px]">
              {t(`video-badge.${badge}`)}
            </span>
          </div>
        )}
      </div>
      <h3 className="nd-heading-m max-xl:mt-5 xl:mt-7">{title}</h3>
      {description && (
        <p className="nd-body-xl text-nd-mid-em-text !mt-1">{description}</p>
      )}
    </div>
  );
};
