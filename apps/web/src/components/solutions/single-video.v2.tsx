import { cn } from "@/app/components/utils";
import { Video, VideoProps } from "@/component-library/video";

const PLAY_BUTTON_CLASSNAME =
  "backdrop-blur-xs !bg-black/70 [&&&]:!shadow-[0_2px_4px_1px_rgba(0,0,0,0.17),0_-4px_12px_0_rgba(255,255,255,0.29)_inset,0_1px_0_0_rgba(255,255,255,0.40)_inset,0_-1px_0_0_rgba(255,255,255,0.20)_inset]";

export type SingleVideoProps = {
  title?: string;
  description?: string;
  alt?: string;
  thumbnail?: string;
  id: string;
  platform?: VideoProps["platform"];
  className?: string;
};

export const SingleVideo = ({
  title,
  description,
  alt,
  thumbnail,
  id,
  platform = "youtube",
  className,
}: SingleVideoProps) => {
  return (
    <section className={cn("relative text-white text-left", className)}>
      <div className="max-w-sm md:max-w-3xl xl:max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px]">
        <Video
          platform={platform}
          id={id}
          thumbnail={thumbnail}
          title={title}
          alt={alt}
          privacyMode={true}
          autoplay={false}
          aspectRatio="16:9"
          bgColorClass="!bg-black/70"
          playButtonClassName={cn(
            "max-md:w-10 max-md:h-10 md:w-12 md:h-12 xl:w-[72px] xl:h-[72px]",
            PLAY_BUTTON_CLASSNAME,
          )}
          playButtonIconClassName="max-md:!w-4 max-md:!h-4 md:!w-5 md:!h-5 xl:!w-6 xl:!h-6"
        />
        {title && (
          <h3 className="text-lg md:text-3xl xl:text-4xl font-semibold mt-4 xl:mt-6 mb-0 group-hover:underline">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-[#ABABBA] text-base md:text-lg xl:text-xl mt-2 mb-0">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};
