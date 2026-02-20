import Image from "next/image";
import { cn } from "@/app/components/utils";
import { Button } from "@/app/components/ui/button";

export type BigBannerCardProps = {
  className?: string;
  style?: React.CSSProperties;
  imageSrc: string;
  title?: string;
  description?: React.ReactNode;
  href?: string;
  buttonLabel?: string;
};

export const BigBannerCard: React.FC<BigBannerCardProps> = ({
  className,
  style,
  imageSrc,
  title,
  description,
  href,
  buttonLabel,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col xl:flex-row w-full self-start min-w-0",
        className,
      )}
      style={style}
    >
      <div className="relative w-full xl:w-2/3 aspect-[16/9] xl:aspect-[875/492] rounded-tl-xl rounded-tr-xl xl:rounded-tr-none xl:rounded-bl-xl overflow-hidden group">
        <Image
          src={imageSrc}
          alt={title || ""}
          fill
          className="object-cover z-0"
          sizes="(max-width: 1280px) 100vw, 66vw"
          loading="lazy"
        />
      </div>
      <div className="w-full xl:w-1/3 bg-[#0D0C11] p-5 xl:p-8 rounded-bl-xl rounded-br-xl xl:rounded-bl-none xl:rounded-tr-xl xl:flex xl:flex-1 xl:flex-col min-w-0 overflow-hidden">
        <h3 className="nd-heading-m xl:order-1 line-clamp-4">{title}</h3>
        {description && (
          <p className="text-nd-mid-em-text nd-body-l font-medium max-xl:mt-3 xl:mt-8 xl:pt-8 xl:border-t xl:border-nd-border-light xl:order-3 line-clamp-5">
            {description}
          </p>
        )}
        {href && buttonLabel && (
          <div className="mt-[25px] xl:mt-8 xl:order-2 xl:grow">
            <Button
              className="w-full xl:w-auto nd-body-m"
              asChild
              variant="secondary-outline"
              size="lg"
              rounded
              aria-label={title || buttonLabel}
            >
              <a
                className="text-inherit"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {buttonLabel}
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
