"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/utils";

const feedbackTones = [
  "default",
  "info",
  "warning",
  "danger",
  "success",
] as const;
const decorativeTones = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;

type FeedbackTone = (typeof feedbackTones)[number];
type DecorativeTone = (typeof decorativeTones)[number];
type ButtonTone = FeedbackTone | DecorativeTone;

const feedbackToneClass: Record<FeedbackTone, string> = {
  default: "",
  info: "text-content-feedback-info-strong",
  warning: "text-content-feedback-warning-strong",
  danger: "text-content-feedback-danger-strong",
  success: "text-content-feedback-success-strong",
};

const decorativeToneClass: Record<DecorativeTone, string> = {
  red: "text-content-decorative-red-strong",
  orange: "text-content-decorative-orange-strong",
  amber: "text-content-decorative-amber-strong",
  yellow: "text-content-decorative-yellow-strong",
  lime: "text-content-decorative-lime-strong",
  green: "text-content-decorative-green-strong",
  emerald: "text-content-decorative-emerald-strong",
  teal: "text-content-decorative-teal-strong",
  cyan: "text-content-decorative-cyan-strong",
  sky: "text-content-decorative-sky-strong",
  blue: "text-content-decorative-blue-strong",
  indigo: "text-content-decorative-indigo-strong",
  violet: "text-content-decorative-violet-strong",
  purple: "text-content-decorative-purple-strong",
  fuchsia: "text-content-decorative-fuchsia-strong",
  pink: "text-content-decorative-pink-strong",
  rose: "text-content-decorative-rose-strong",
};

function isFeedbackTone(tone: ButtonTone): tone is FeedbackTone {
  return (feedbackTones as readonly string[]).includes(tone);
}

function getToneClass(tone: ButtonTone | undefined): string {
  if (!tone) return "";
  return isFeedbackTone(tone)
    ? feedbackToneClass[tone]
    : decorativeToneClass[tone];
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-max)] font-[var(--font-weight-medium)] text-[length:var(--font-size-m)] leading-[var(--line-height-m)] transition-[background-color,color,box-shadow,transform] outline-none select-none focus-visible:shadow-[0_0_0_1px_var(--color-utility-focus-inner),0_0_0_3px_var(--color-utility-focus-outer)] active:enabled:scale-[0.98] disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-actions-primary-default text-content-on-accent-strong hover:enabled:bg-actions-primary-hover disabled:bg-actions-primary-disabled disabled:text-content-on-accent-disabled",
        secondary:
          "bg-actions-secondary-default text-content-strong hover:enabled:bg-actions-secondary-hover disabled:bg-actions-secondary-disabled disabled:text-content-disabled",
        tertiary:
          "bg-actions-tertiary-default text-content-strong backdrop-blur-[12px] shadow-[0_1px_2px_0_var(--color-utility-shadow-l3),0_0_1px_0_var(--color-utility-shadow-l2),0_0_0_1px_var(--color-utility-shadow-l1)] hover:enabled:bg-actions-tertiary-hover disabled:bg-actions-tertiary-disabled disabled:text-content-disabled disabled:shadow-none overflow-hidden",
        ghost:
          "bg-transparent text-content-subtle hover:enabled:bg-actions-secondary-hover hover:enabled:text-content-strong disabled:text-content-disabled",
        link: "bg-transparent text-content-link-default hover:enabled:text-content-link-hover disabled:text-content-disabled",
        "link-neutral":
          "bg-transparent text-content-strong hover:enabled:text-content-strong disabled:text-content-disabled",
        danger:
          "bg-actions-danger-default text-[color:rgb(var(--content-inverse-strong))] hover:enabled:bg-actions-danger-hover hover:enabled:text-[color:rgb(var(--content-inverse-strong))] disabled:bg-actions-danger-disabled disabled:text-[color:rgb(var(--content-inverse-disabled))]",
      },
      size: {
        xs: "h-[var(--space-28)] gap-[var(--space-2)] px-[var(--space-10)]",
        s: "h-[var(--space-32)] gap-[var(--space-4)] px-[var(--space-12)]",
        m: "h-[var(--space-36)] gap-[var(--space-4)] px-[var(--space-16)]",
        l: "h-[var(--space-40)] gap-[var(--space-4)] px-[var(--space-16)]",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        className: "px-0 hover:enabled:underline underline-offset-4",
      },
      {
        variant: "link-neutral",
        className: "px-0 hover:enabled:underline underline-offset-2",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "m",
    },
  },
);

const labelVariants = cva("flex shrink-0 items-center justify-center");

const iconVariants = cva(
  "flex shrink-0 items-center justify-center text-current [&_svg]:size-full [&_svg]:shrink-0 [&_svg]:text-current",
  {
    variants: {
      size: {
        xs: "size-[var(--space-16)]",
        s: "size-[var(--space-16)]",
        m: "size-[var(--space-16)]",
        l: "size-[var(--space-18)]",
      },
    },
    defaultVariants: {
      size: "m",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    tone?: ButtonTone;
    unsafeClassName?: string;
  };

const defaultVariant = "primary";
const defaultSize = "m";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      unsafeClassName,
      variant,
      size,
      tone,
      leadingIcon,
      trailingIcon,
      children,
      ...props
    },
    ref,
  ) {
    const resolvedVariant = variant ?? defaultVariant;
    const resolvedSize = size ?? defaultSize;
    const hasLabel = React.Children.count(children) > 0;
    const hideIconFromAT = hasLabel ? true : undefined;
    const toneClass = getToneClass(tone);

    return (
      <button
        ref={ref}
        data-slot="button"
        data-variant={resolvedVariant}
        data-size={resolvedSize}
        data-tone={tone}
        className={cn(
          className,
          buttonVariants({ variant: resolvedVariant, size: resolvedSize }),
          toneClass,
          unsafeClassName,
        )}
        {...props}
      >
        {leadingIcon ? (
          <span
            aria-hidden={hideIconFromAT}
            data-slot="icon"
            className={cn(iconVariants({ size: resolvedSize }))}
          >
            {leadingIcon}
          </span>
        ) : null}
        {hasLabel ? (
          <span data-slot="label" className={cn(labelVariants())}>
            {children}
          </span>
        ) : null}
        {trailingIcon ? (
          <span
            aria-hidden={hideIconFromAT}
            data-slot="icon"
            className={cn(iconVariants({ size: resolvedSize }))}
          >
            {trailingIcon}
          </span>
        ) : null}
      </button>
    );
  },
);
