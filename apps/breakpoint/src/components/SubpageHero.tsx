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

type SubpageHeroProps = {
  children?: ReactNode;
  contentClassName?: string;
  cta?: HeroCta | HeroCta[];
  eyebrow?: string;
  glitch?: boolean | SubpageHeroGlitchConfig;
  heroImage?: SubpageHeroImageKey | false;
  title: string;
};

type SubpageHeroGlitchConfig = Partial<
  Omit<
    ImageTreatmentProps,
    "alt" | "aria-hidden" | "className" | "foregroundSrc" | "src"
  >
>;

type SubpageHeroImageConfig = {
  color: TreatmentColor;
  heightClassName: string;
  pixelEdgeSrc?: string;
  src: string;
};

export type SubpageHeroImageKey =
  | "schedule"
  | "speakers"
  | "travel"
  | "registration"
  | "sponsors";

const SUBPAGE_HERO_IMAGES: Record<SubpageHeroImageKey, SubpageHeroImageConfig> =
  {
    schedule: {
      color: "purple",
      heightClassName: "h-[480px] md:h-[467px]",
      src: "/img/subpage-heroes/schedule-hero.webp",
    },
    speakers: {
      color: "green",
      heightClassName: "h-[480px] md:h-[467px]",
      src: "/img/subpage-heroes/speakers-hero.webp",
    },
    travel: {
      color: "blue",
      heightClassName: "h-[480px] md:h-[467px]",
      pixelEdgeSrc: "/assets/pixel-edge-travel.svg",
      src: "/img/subpage-heroes/travel-hero.webp",
    },
    registration: {
      color: "purple",
      heightClassName: "h-[482px] md:h-[395px]",
      src: "/img/subpage-heroes/registration-hero.webp",
    },
    sponsors: {
      color: "purple",
      heightClassName: "h-[480px] md:h-[467px]",
      src: "/img/subpage-heroes/sponsors-hero.webp",
    },
  };

const DEFAULT_HERO_IMAGE: SubpageHeroImageKey = "schedule";

const eyebrowClassName = "type-eyebrow text-white";

const titleClassName = "type-h1 w-full max-w-[1026px] text-white";

const mediaBaseClassName = "absolute inset-0 h-full w-full";

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function getGlitchConfig(glitch: SubpageHeroProps["glitch"]) {
  if (glitch === false) return { glitchPattern: "none" } as const;
  return glitch === true || glitch === undefined ? {} : glitch;
}

function HeroBackground({
  glitch,
  image,
}: {
  glitch: SubpageHeroProps["glitch"];
  image: SubpageHeroImageConfig;
}) {
  const { src, color } = image;

  return (
    <ImageTreatment
      src={src}
      alt=""
      aria-hidden="true"
      glitchPattern="p1"
      intensity={60}
      lighting="even"
      color={color}
      motion
      flicker
      mouseReactive
      mouseRadius={180}
      objectFit="cover"
      className={mediaBaseClassName}
      {...getGlitchConfig(glitch)}
    />
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
  children,
  contentClassName,
  cta,
  eyebrow = "Breakpoint 2026",
  glitch,
  heroImage = DEFAULT_HERO_IMAGE,
  title,
}: SubpageHeroProps) {
  if (!heroImage) {
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

  const image = SUBPAGE_HERO_IMAGES[heroImage];
  const pixelEdgeSrc = image.pixelEdgeSrc ?? "/assets/pixel-edge.svg";

  return (
    <section
      className={`relative overflow-hidden bg-black ${image.heightClassName}`}
      data-bp-subpage-hero="image"
      data-bp-subpage-hero-image={heroImage}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[360px] overflow-hidden"
      >
        <HeroBackground glitch={glitch} image={image} />
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
