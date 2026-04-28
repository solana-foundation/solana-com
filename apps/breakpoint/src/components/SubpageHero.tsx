import type { ReactNode } from "react";
import { Link } from "@workspace/i18n/routing";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import ImageTreatment, {
  type ImageTreatmentProps,
  type TreatmentColor,
} from "@/components/ImageTreatment";
import { isRelativeHref } from "@/lib/links";

type HeroCta = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type SubpageHeroProps = {
  background?: ReactNode;
  backgroundOverlay?: ReactNode;
  children?: ReactNode;
  cta?: HeroCta | HeroCta[];
  eyebrow?: string;
  image?: boolean;
  imageSrc?: string;
  imageTreatment?: boolean | SubpageHeroImageTreatmentConfig;
  imageTopClassName?: string;
  tintClassName?: string;
  title: string;
};

type SubpageHeroImageTreatmentConfig = Partial<
  Omit<ImageTreatmentProps, "alt" | "className" | "src">
> & {
  alt?: string;
  className?: string;
  src?: string;
};

const DEFAULT_IMAGE_SRC = "/img/registration-hero-glitch.png";

const eyebrowClassName =
  "font-mono text-[16px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-white";

const titleClassName =
  "w-full font-sans text-[60px] font-normal leading-[0.98] tracking-[-0.06em] text-white md:text-[80px]";

function DefaultHeroBackground({
  imageTreatment,
  imageSrc,
  imageTopClassName,
  tintClassName,
}: {
  imageTreatment?: boolean | SubpageHeroImageTreatmentConfig;
  imageSrc: string;
  imageTopClassName: string;
  tintClassName: string;
}) {
  const imageClassName = `absolute left-1/2 h-[960px] w-[1440px] max-w-none -translate-x-1/2 object-cover ${imageTopClassName}`;
  const imageTreatmentConfig = getImageTreatmentConfig(imageTreatment);

  if (imageTreatmentConfig) {
    const {
      alt = "",
      className,
      src,
      ...imageTreatmentProps
    } = imageTreatmentConfig;

    return (
      <>
        <ImageTreatment
          src={src ?? imageSrc}
          alt={alt}
          aria-hidden={alt ? undefined : true}
          glitchPattern="p1"
          intensity={60}
          lighting="even"
          color={getTreatmentColor(tintClassName)}
          className={className ?? imageClassName}
          {...imageTreatmentProps}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.18)_54%,rgba(0,0,0,0.72)_100%)]" />
      </>
    );
  }

  return (
    <>
      <img
        src={imageSrc}
        alt=""
        width={1200}
        height={800}
        className={imageClassName}
      />
      <div className={`absolute inset-0 ${tintClassName} mix-blend-multiply`} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.18)_54%,rgba(0,0,0,0.72)_100%)]" />
    </>
  );
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

function HeroCtaLink({ href, label, variant = "primary" }: HeroCta) {
  const variantClasses =
    variant === "primary"
      ? "bg-white text-black hover:bg-purple"
      : "border border-white bg-transparent text-white hover:bg-white hover:text-black";

  const className = `inline-flex h-10 w-full items-center justify-center gap-3 px-5 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:w-auto ${variantClasses}`;
  const content = (
    <>
      {label}
      <span className="inline-flex size-3 items-center justify-center">
        <ArrowUpRightIcon />
      </span>
    </>
  );

  if (isRelativeHref(href)) {
    return (
      <Link href={href} className={className} data-bp-hero-cta>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={className} data-bp-hero-cta>
      {content}
    </a>
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

export default function SubpageHero({
  background,
  backgroundOverlay,
  children,
  cta,
  eyebrow = "Breakpoint 2026",
  image = true,
  imageSrc = DEFAULT_IMAGE_SRC,
  imageTreatment = false,
  imageTopClassName = "top-[-320px] md:top-[-340px]",
  tintClassName = "bg-purple",
  title,
}: SubpageHeroProps) {
  if (!image) {
    return (
      <section className="bg-black px-4 md:px-8" data-bp-subpage-hero="plain">
        <div className="flex w-full flex-col items-start gap-6 pb-3 pt-[180px] text-white md:items-center md:justify-center md:gap-8 md:text-center">
          <p className={eyebrowClassName} data-bp-hero-eyebrow>
            {eyebrow}
          </p>
          <h1 className={titleClassName} data-bp-hero-title>
            {title}
          </h1>
          {children}
          {cta && <HeroCtas cta={cta} />}
        </div>
      </section>
    );
  }

  const backgroundContent = background ?? (
    <DefaultHeroBackground
      imageTreatment={imageTreatment}
      imageSrc={imageSrc}
      imageTopClassName={imageTopClassName}
      tintClassName={tintClassName}
    />
  );

  return (
    <section
      className="relative h-[480px] overflow-hidden bg-black md:h-[467px]"
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
        src="/assets/pixel-edge.svg"
        alt=""
        aria-hidden="true"
        width={1440}
        height={146}
        className="pointer-events-none absolute left-1/2 top-[160px] h-[200px] w-[1078px] max-w-none -translate-x-1/2 object-cover md:left-0 md:w-full md:min-w-[840px] md:translate-x-0"
        data-bp-hero-pixel-edge
      />

      <div className="absolute left-4 right-4 top-[252px] flex flex-col items-start gap-5 pb-3 text-white md:left-8 md:right-auto md:top-[252px] md:w-[1026px] md:gap-8">
        <p className={eyebrowClassName} data-bp-hero-eyebrow>
          {eyebrow}
        </p>
        <h1 className={titleClassName} data-bp-hero-title>
          {title}
        </h1>
        {children}
        {cta && <HeroCtas cta={cta} />}
      </div>
    </section>
  );
}
