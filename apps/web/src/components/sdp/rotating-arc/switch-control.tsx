"use client";

import { Switch } from "@base-ui/react/switch";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type Transition } from "motion/react";
import { cn } from "@workspace/ui/utils";

import {
  omitMotionConflictingEventHandlers,
  usePrefersReducedMotion,
} from "./utils";

const switchControlVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center rounded-[var(--radius-max)] p-[var(--space-4)] outline-none transition-[background-color] duration-200 ease-out disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        default: "h-[var(--space-20)] w-[var(--space-36)]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type SwitchControlProps = Omit<Switch.Root.Props, "className"> &
  VariantProps<typeof switchControlVariants> & {
    className?: string;
    unsafeClassName?: string;
  };

const thumbTransition: Transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.25,
};

export function SwitchControl({
  className,
  unsafeClassName,
  ...props
}: SwitchControlProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const instantTransition = { duration: 0 };

  return (
    <Switch.Root
      data-slot="switch-control"
      className={cn(
        className,
        switchControlVariants(),
        "group",
        "bg-actions-secondary-default hover:bg-actions-secondary-hover",
        "data-[checked]:bg-actions-primary-default data-[checked]:hover:bg-actions-primary-hover",
        "data-[disabled]:bg-actions-secondary-disabled data-[disabled]:cursor-not-allowed",
        "data-[disabled]:data-[checked]:bg-actions-primary-disabled",
        "focus-visible:shadow-[0_0_0_1px_var(--color-utility-focus-inner),0_0_0_3px_var(--color-utility-focus-outer)]",
        unsafeClassName,
      )}
      {...props}
    >
      <Switch.Thumb
        className={cn(
          "block size-[var(--space-12)] rounded-full",
          "bg-content-inverse-strong",
          "shadow-[0_2px_4px_0_var(--color-utility-shadow-l3),0_1px_2px_0_var(--color-utility-shadow-l3),0_0_1px_0_var(--color-utility-shadow-l3),0_0_0_1px_var(--color-utility-shadow-l1)]",
          "group-data-[checked]:bg-content-on-accent-strong",
          "group-data-[disabled]:bg-content-muted",
          "group-data-[disabled]:group-data-[checked]:bg-content-on-accent-disabled",
        )}
        render={(thumbProps, state) => {
          const motionProps = omitMotionConflictingEventHandlers(thumbProps);

          return (
            <motion.span
              {...motionProps}
              className={thumbProps.className}
              initial={false}
              animate={{
                transform: state.checked
                  ? "translateX(16px)"
                  : "translateX(0px)",
              }}
              transition={
                prefersReducedMotion ? instantTransition : thumbTransition
              }
            />
          );
        }}
      />
    </Switch.Root>
  );
}

export type { SwitchControlProps };
