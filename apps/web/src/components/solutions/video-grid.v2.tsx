import Image from "next/image";
import { VideoTrigger } from "@/component-library/video-modal";
import Carousel, { CarouselControls } from "@/component-library/carousel";
import { useRef } from "react";
import { cn } from "@/app/components/utils";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useTranslations } from "next-intl";

const NAV_BUTTON_CLASSNAME =
  "backdrop-blur-xs !bg-black/80 [&&&]:!shadow-[0_2px_4px_1px_rgba(0,0,0,0.17),0_-4px_12px_0_rgba(255,255,255,0.08)_inset,0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(255,255,255,0.12)_inset]";

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

export type VideoItem = {
  id: string;
  thumbnail: string;
  title: string;
  description?: string;
  alt: string;
  badge?: VideoBadgeType;
};

export type VideoGridProps = {
  title: string;
  subtitle: string;
  videos: VideoItem[];
};

/**
 * Displays a grid of videos with a title and subtitle.
 *
 * @component
 * @param {VideoGridProps} props - The props for the component.
 * @param {string} props.title - The title of the video grid.
 * @param {string} props.subtitle - The subtitle of the video grid.
 * @param {VideoItem[]} props.videos - The videos to display in the grid.
 * @returns {JSX.Element} The rendered VideoGrid component.
 *
 * @example
 * <VideoGrid
 *   title="Video Grid Title"
 *   subtitle="Video Grid Subtitle"
 *   videos={[{
 *     id: "1",
 *     thumbnail: "https://example.com/thumbnail.jpg",
 *     title: "Video Title",
 *     description: "Video Description",
 *     alt: "Video Alt"
 *   }]}
 * />
 */
export const VideoGrid = ({ title, subtitle, videos }: VideoGridProps) => {
  const carouselRef = useRef(null);
  const t = useTranslations();

  const { ref: statsRef, isIntersecting } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.2,
      triggerOnce: true,
    });

  const videoCards = videos.map((video, index) => (
    <div
      key={video.id}
      className={cn("flex flex-col w-full self-start px-1 min-w-0", {
        "animate-fade-in-right": isIntersecting,
      })}
      style={
        isIntersecting
          ? { animationDelay: `${0.1 + index * 0.1}s` }
          : { opacity: 0 }
      }
    >
      <div className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer group">
        <Image
          src={video.thumbnail}
          alt={video.alt}
          fill
          className="object-cover z-0"
          sizes="(max-width: 768px) 120vw, 50vw"
        />
        <VideoTrigger
          platform="youtube"
          id={video.id}
          title={video.title}
          bgColorClass="!bg-black/70"
          className={cn(
            "max-md:w-10 max-md:h-10 md:w-12 md:h-12 xl:w-[72px] xl:h-[72px] left-5 top-auto bottom-5 !translate-x-0 !translate-y-0",
            PLAY_BUTTON_CLASSNAME,
          )}
          iconClassName="max-md:!w-4 max-md:!h-4 md:!w-5 md:!h-5 xl:!w-6 xl:!h-6"
        />
        {video.badge && (
          <div
            className="absolute right-2 xl:right-3 bottom-2 xl:bottom-3 p-0.5 text-black rounded-sm text-xs xl:text-sm leading-none uppercase font-medium"
            style={{
              backgroundColor: BG_MAP[video.badge],
            }}
          >
            <Image
              className="inline-block align-middle mr-1.5 max-xl:size-[18px] rounded-[2px]"
              src={ICON_MAP[video.badge]}
              width={22}
              height={22}
              alt=""
            />
            <span className="pr-1 inline-block align-middle pt-0.5 tracking-[1px]">
              {t(`video-badge.${video.badge}`)}
            </span>
          </div>
        )}
      </div>
      <h3 className="text-lg md:text-3xl xl:text-4xl font-medium mt-6 mb-0 tracking-[-0.54px] md:tracking-[-0.96px] xl:tracking-[-1.08px]  leading-[1.33] md:leading-[1.25] xl:leading-[1.22]">
        {video.title}
      </h3>
      {video.description && (
        <p className="text-[#ABABBA] max-md:text-base md:text-lg xl:text-xl mt-1 mb-0 tracking-[-0.16px] md:tracking-[-0.18px] xl:tracking-[-0.2px] leading-[1.5] md:leading-[1.77] xl:leading-[1.6]">
          {video.description}
        </p>
      )}
    </div>
  ));

  return (
    <section className="relative overflow-hidden text-white text-left">
      <div className="py-[64px] md:py-[112px] xl:py-[160px]">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] mb-[32px] xl:mb-[48px] flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
          {(title || subtitle) && (
            // Title and subtitle
            <div className="max-w-xl">
              {title && (
                <h2 className="font-brand font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] mb-0 tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-[#ABABBA] text-lg md:text-2xl max-xl:mt-2 xl:mt-5 mb-0 tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {videos.length > 1 ? (
            // Carousel controls
            <div className="inline-flex">
              <CarouselControls
                carouselRef={carouselRef}
                className="p-2 bg-black rounded-full border-t border-white/10"
                prevButtonClassName={cn(
                  "max-md:!w-10 max-md:!h-10 md:!w-12 md:!h-12 xl:!w-14 xl:!h-14",
                  NAV_BUTTON_CLASSNAME,
                )}
                nextButtonClassName={cn(
                  "max-md:!w-10 max-md:!h-10 md:!w-12 md:!h-12 xl:!w-14 xl:!h-14",
                  NAV_BUTTON_CLASSNAME,
                )}
              />
            </div>
          ) : null}
        </div>
        {videos.length > 1 ? (
          // Carousel
          <div
            className="max-w-[1440px] mx-auto px-5 md:px-[32px]"
            ref={statsRef}
          >
            <Carousel
              ref={carouselRef}
              controlsInline={false}
              panels={1}
              className="w-full md:w-5/6 xl:w-[800px] !m-0 [&>div]:!overflow-visible [&>div]:!p-0"
            >
              {videoCards}
            </Carousel>
          </div>
        ) : (
          // Already stacks on mobile, no change needed
          <div
            className="max-w-[1440px] mx-auto px-5 md:px-[32px] flex flex-col gap-4 xl:gap-8"
            ref={statsRef}
          >
            {videoCards}
          </div>
        )}
      </div>
    </section>
  );
};
