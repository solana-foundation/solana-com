/** Tailwind equivalents of the `nd-*` type scale in `globals.css`.
 * The page root resets legacy SCSS margins, so `mt-*` applies directly.
 */
export const typeScale = {
  heading2xl:
    "font-brand text-[40px] font-medium leading-[1.1] tracking-[-1.2px] md:text-[56px] md:leading-none md:tracking-[-1.68px] xl:text-[88px] xl:tracking-[-2.64px]",
  headingL:
    "font-brand text-[32px] font-medium leading-[1.25] tracking-[-1.28px] md:text-[40px] md:leading-[1.1] md:tracking-[-1.6px] xl:text-[64px] xl:leading-[1.125] xl:tracking-[-2.56px]",
  headingM:
    "font-brand text-[18px] font-medium leading-[1.333] tracking-[-0.54px] md:text-[32px] md:leading-[1.25] md:tracking-[-0.96px] xl:text-[36px] xl:leading-[1.222] xl:tracking-[-1.08px]",
  headingXs:
    "font-brand text-[16px] font-medium leading-[1.5] md:text-[18px] md:leading-[1.333] xl:text-[22px] xl:leading-[1.273]",
  bodyXl:
    "text-[18px] leading-[1.33] tracking-[-0.36px] md:text-[24px] md:tracking-[-0.48px]",
  bodyL:
    "text-[16px] leading-[1.375] tracking-[-0.16px] md:text-[18px] md:leading-[1.33] md:tracking-[-0.18px] xl:text-[20px] xl:leading-[1.5] xl:tracking-[-0.2px]",
  bodyM:
    "text-[16px] leading-[1.25] tracking-[-0.16px] md:text-[18px] md:leading-[1.44] md:tracking-[-0.18px] xl:leading-[1.33]",
  bodyS:
    "text-[14px] leading-[1.42] tracking-[-0.14px] md:text-[16px] md:leading-[1.5] md:tracking-[-0.16px]",
} as const;
