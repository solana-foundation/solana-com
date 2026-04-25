import type { ReactNode } from "react";
import { Link } from "@workspace/i18n/routing";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import { isRelativeHref } from "@/lib/links";

type HeroCta = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type SubpageHeroProps = {
  children?: ReactNode;
  cta?: HeroCta;
  eyebrow?: string;
  imageSrc?: string;
  imageTopClassName?: string;
  tintClassName?: string;
  title: string;
};

function HeroCtaLink({ href, label, variant = "primary" }: HeroCta) {
  const variantClasses =
    variant === "primary"
      ? "bg-white text-black hover:bg-[#e7d2f9]"
      : "border border-white text-white hover:bg-white hover:text-black";

  const className = `inline-flex h-10 items-center justify-center gap-3 px-5 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${variantClasses}`;
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
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
}

export default function SubpageHero({
  children,
  cta,
  eyebrow = "Breakpoint 2026",
  imageSrc = "/img/registration-hero-glitch.png",
  imageTopClassName = "top-[-320px] md:top-[-340px]",
  tintClassName = "bg-purple",
  title,
}: SubpageHeroProps) {
  return (
    <section className="relative h-[430px] overflow-hidden bg-black md:h-[467px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[360px] overflow-hidden"
      >
        <img
          src={imageSrc}
          alt=""
          width={1200}
          height={800}
          className={`absolute left-1/2 h-[960px] w-[1440px] max-w-none -translate-x-1/2 object-cover ${imageTopClassName}`}
        />
        <div
          className={`absolute inset-0 ${tintClassName} mix-blend-multiply`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.18)_54%,rgba(0,0,0,0.72)_100%)]" />
      </div>

      <img
        src="/assets/pixel-edge.svg"
        alt=""
        aria-hidden="true"
        width={1440}
        height={146}
        className="pointer-events-none absolute left-0 top-[160px] h-[200px] w-full min-w-[840px] object-cover"
      />

      <div className="absolute left-5 right-5 top-[236px] flex flex-col items-start gap-8 pb-3 text-white md:left-8 md:right-auto md:top-[252px] md:w-[1026px]">
        <p className="font-mono text-[14px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-white md:text-[16px]">
          {eyebrow}
        </p>
        <h1 className="font-sans text-[56px] font-normal leading-[0.98] tracking-[-0.06em] text-white md:text-[80px]">
          {title}
        </h1>
        {children}
        {cta && <HeroCtaLink {...cta} />}
      </div>
    </section>
  );
}
