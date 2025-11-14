import Image from "next/image";
import { cn } from "@/app/components/utils";
import { Button } from "@/app/components/ui/button";

export type BigBannerCardProps = {
  className?: string;
  style?: React.CSSProperties;
  imageSrc: string;
  title?: string;
  description?: string;
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
          alt={title}
          fill
          className="object-cover z-0"
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
        />
      </div>
      <div className="w-full xl:w-1/3 bg-[#0D0C11] p-twd-5 xl:p-twd-8 rounded-bl-xl rounded-br-xl xl:rounded-bl-none xl:rounded-tr-xl xl:flex xl:flex-1 xl:flex-col">
        <h3 className="nd-heading-m xl:order-1">{title}</h3>
        {description && (
          <p className="text-nd-mid-em-text nd-body-l font-medium max-xl:mt-twd-3 xl:mt-twd-8 xl:pt-twd-8 xl:border-t xl:border-nd-border-light xl:order-3">
            {description}
          </p>
        )}
        {href && (
          <div className="mt-[25px] xl:mt-twd-8 xl:order-2 xl:grow">
            <Button
              className="w-full xl:w-auto nd-body-m"
              asChild
              variant="secondary-outline"
              size="lg"
              rounded
              aria-label={title}
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
