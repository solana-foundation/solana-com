import type { HTMLAttributeAnchorTarget, ReactNode } from "react";
import Button from "@/components/Button";
import ImageTreatment, {
  type ImageTreatmentProps,
  type TreatmentColor,
} from "@/components/ImageTreatment";

type HeroCta = {
  href: string;
  label: string;
  rel?: string;
  target?: HTMLAttributeAnchorTarget;
  variant?: "primary" | "secondary";
};

type HeroVideoSource = {
  src: string;
  type: string;
};

type SubpageHeroProps = {
  background?: ReactNode;
  backgroundOverlay?: ReactNode;
  children?: ReactNode;
  contentClassName?: string;
  cta?: HeroCta | HeroCta[];
  eyebrow?: string;
  image?: boolean;
  imageHeightClassName?: string;
  imageSrc?: string;
  imageTreatment?: boolean | SubpageHeroImageTreatmentConfig;
  imageTopClassName?: string;
  pixelEdgeSrc?: string;
  tintClassName?: string;
  title: string;
  videoPosterSrc?: string;
  videoSources?: HeroVideoSource[];
};

type SubpageHeroImageTreatmentConfig = Partial<
  Omit<ImageTreatmentProps, "alt" | "className" | "src">
> & {
  alt?: string;
  className?: string;
  src?: string;
};

const DEFAULT_IMAGE_SRC = "/img/registration-hero-glitch.png";

const eyebrowClassName = "type-eyebrow text-white";

const titleClassName = "type-h1 w-full max-w-[1026px] text-white";

const mediaBaseClassName =
  "absolute left-1/2 h-[960px] w-full min-w-[1440px] max-w-none -translate-x-1/2 object-cover";

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function getImageTreatmentConfig(
  imageTreatment: SubpageHeroProps["imageTreatment"],
) {
  if (!imageTreatment) return null;
  return imageTreatment === true ? {} : imageTreatment;
}

function getTreatmentColor(tintClassName: string): TreatmentColor {
  if (tintClassName.includes("bg-green")) return "green";
  if (tintClassName.includes("bg-blue")) return "blue";
  if (tintClassName.includes("bg-white")) return "white";
  if (tintClassName.includes("bg-purple")) return "purple";
  return "purple";
}

function HeroTintOverlay({ tintClassName }: { tintClassName: string }) {
  if (!tintClassName) return null;

  return (
    <div className={`absolute inset-0 ${tintClassName} mix-blend-multiply`} />
  );
}

function HeroVideo({
  className,
  posterSrc,
  sources,
}: {
  className: string;
  posterSrc?: string;
  sources: HeroVideoSource[];
}) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={posterSrc}
      aria-hidden="true"
      className={className}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}

function HeroImage({ className, src }: { className: string; src: string }) {
  return (
    <img src={src} alt="" width={1200} height={800} className={className} />
  );
}

function HeroImageTreatment({
  className,
  config,
  imageSrc,
  tintClassName,
}: {
  className: string;
  config: SubpageHeroImageTreatmentConfig;
  imageSrc: string;
  tintClassName: string;
}) {
  const {
    alt = "",
    className: treatmentClassName,
    src,
    ...imageTreatmentProps
  } = config;

  return (
    <ImageTreatment
      src={src ?? imageSrc}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      glitchPattern="p1"
      intensity={60}
      lighting="even"
      color={getTreatmentColor(tintClassName)}
      className={treatmentClassName ?? className}
      {...imageTreatmentProps}
    />
  );
}

function HeroMedia({
  imageSrc,
  imageTopClassName,
  imageTreatmentConfig,
  tintClassName,
  videoPosterSrc,
  videoSources,
}: {
  imageSrc: string;
  imageTopClassName: string;
  imageTreatmentConfig: SubpageHeroImageTreatmentConfig | null;
  tintClassName: string;
  videoPosterSrc?: string;
  videoSources?: HeroVideoSource[];
}) {
  const className = cn(mediaBaseClassName, imageTopClassName);

  if (imageTreatmentConfig) {
    return (
      <HeroImageTreatment
        className={className}
        config={imageTreatmentConfig}
        imageSrc={imageSrc}
        tintClassName={tintClassName}
      />
    );
  }

  if (videoSources?.length) {
    return (
      <HeroVideo
        className={className}
        posterSrc={videoPosterSrc}
        sources={videoSources}
      />
    );
  }

  return <HeroImage className={className} src={imageSrc} />;
}

function DefaultHeroBackground({
  imageTreatment,
  imageSrc,
  imageTopClassName,
  tintClassName,
  videoPosterSrc,
  videoSources,
}: {
  imageTreatment?: boolean | SubpageHeroImageTreatmentConfig;
  imageSrc: string;
  imageTopClassName: string;
  tintClassName: string;
  videoPosterSrc?: string;
  videoSources?: HeroVideoSource[];
}) {
  const imageTreatmentConfig = getImageTreatmentConfig(imageTreatment);

  return (
    <>
      <HeroMedia
        imageSrc={imageSrc}
        imageTopClassName={imageTopClassName}
        imageTreatmentConfig={imageTreatmentConfig}
        tintClassName={tintClassName}
        videoPosterSrc={videoPosterSrc}
        videoSources={videoSources}
      />
      {!imageTreatmentConfig && (
        <HeroTintOverlay tintClassName={tintClassName} />
      )}
    </>
  );
}

function HeroCtaLink({
  href,
  label,
  rel,
  target,
  variant = "primary",
}: HeroCta) {
  return (
    <Button
      arrow
      className="w-full md:w-auto"
      href={href}
      label={label}
      rel={rel}
      target={target}
      variant={variant}
    />
  );
}

function HeroCtas({ cta }: { cta: HeroCta | HeroCta[] }) {
  const ctas = Array.isArray(cta) ? cta : [cta];

  return (
    <div className="flex w-full flex-col items-start gap-4 md:w-auto md:flex-row">
      {ctas.map((item) => (
        <HeroCtaLink key={`${item.href}-${item.label}`} {...item} />
      ))}
    </div>
  );
}

function HeroContent({
  children,
  className,
  cta,
  eyebrow,
  title,
}: {
  children?: ReactNode;
  className: string;
  cta?: HeroCta | HeroCta[];
  eyebrow: string;
  title: string;
}) {
  return (
    <div className={className}>
      <p className={eyebrowClassName} data-bp-hero-eyebrow>
        {eyebrow}
      </p>
      <h1 className={titleClassName} data-bp-hero-title>
        {title}
      </h1>
      {children}
      {cta && <HeroCtas cta={cta} />}
    </div>
  );
}

export default function SubpageHero({
  background,
  backgroundOverlay,
  children,
  contentClassName,
  cta,
  eyebrow = "Breakpoint 2026",
  image = true,
  imageHeightClassName = "h-[480px] md:h-[467px]",
  imageSrc = DEFAULT_IMAGE_SRC,
  imageTreatment = false,
  imageTopClassName = "top-[-320px] md:top-[-340px]",
  pixelEdgeSrc = "/assets/pixel-edge.svg",
  tintClassName = "bg-purple",
  title,
  videoPosterSrc,
  videoSources,
}: SubpageHeroProps) {
  if (!image) {
    return (
      <section className="bg-black px-4 md:px-8" data-bp-subpage-hero="plain">
        <HeroContent
          className="flex w-full flex-col items-start gap-6 pb-3 pt-[180px] text-white md:items-center md:justify-center md:gap-8 md:text-center"
          cta={cta}
          eyebrow={eyebrow}
          title={title}
        >
          {children}
        </HeroContent>
      </section>
    );
  }

  const backgroundContent = background ?? (
    <DefaultHeroBackground
      imageTreatment={imageTreatment}
      imageSrc={imageSrc}
      imageTopClassName={imageTopClassName}
      tintClassName={tintClassName}
      videoPosterSrc={videoPosterSrc}
      videoSources={videoSources}
    />
  );

  return (
    <section
      className={`relative overflow-hidden bg-black ${imageHeightClassName}`}
      data-bp-subpage-hero="image"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[360px] overflow-hidden"
      >
        {backgroundContent}
        {backgroundOverlay}
      </div>

      <img
        src={pixelEdgeSrc}
        alt=""
        aria-hidden="true"
        width={1440}
        height={146}
        className="pointer-events-none absolute left-1/2 top-[160px] h-[200px] w-[1078px] max-w-none -translate-x-1/2 object-cover md:left-0 md:w-full md:min-w-[840px] md:translate-x-0"
        data-bp-hero-pixel-edge
      />

      <HeroContent
        className={cn(
          "container absolute left-1/2 top-[252px] flex w-full -translate-x-1/2 flex-col items-start gap-5 pb-3 text-white md:top-[252px] md:gap-8",
          contentClassName,
        )}
        cta={cta}
        eyebrow={eyebrow}
        title={title}
      >
        {children}
      </HeroContent>
    </section>
  );
}
