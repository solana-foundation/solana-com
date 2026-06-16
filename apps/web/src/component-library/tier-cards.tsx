"use client";

import { cn } from "@/app/components/utils";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export type TierCard = {
  key: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  cta: string;
  ctaHref: string;
};

type TierCardsProps = {
  className?: string;
  tiers: TierCard[];
};

/**
 * Displays a row of pricing/membership tier cards: name, price, description,
 * and a pill CTA per tier. Cards reveal with the standard staggered fade-in.
 */
export const TierCards = ({ className, tiers }: TierCardsProps) => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLUListElement>({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <ul
      ref={ref}
      className={cn(
        "p-0 m-0 list-none grid grid-cols-1 md:grid-cols-3 gap-3",
        className,
      )}
    >
      {tiers.map((tier, index) => (
        <li
          key={tier.key}
          className={cn(
            "flex flex-col justify-between gap-8 rounded-xl border border-nd-border-light bg-white/[0.04] p-6 xl:p-8",
            { "animate-fade-in-up": isIntersecting },
          )}
          style={
            isIntersecting
              ? { animationDelay: `${0.1 + index * 0.1}s` }
              : { opacity: 0 }
          }
        >
          <div>
            <p className="nd-body-m font-medium text-nd-mid-em-text mb-0">
              {tier.name}
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-[40px] xl:text-[52px] font-light leading-none">
                {tier.price}
              </span>
              {tier.period && (
                <span className="nd-body-s text-nd-mid-em-text">
                  {tier.period}
                </span>
              )}
            </div>
            <p className="nd-body-m text-nd-mid-em-text mt-4 mb-0">
              {tier.description}
            </p>
          </div>
          <div>
            <a
              href={tier.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-white text-black px-5 py-2.5 nd-body-m font-medium hover:bg-white/90 transition-colors"
            >
              {tier.cta}
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
};
