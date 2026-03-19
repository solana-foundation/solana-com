"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { motion, type Transition } from "motion/react";
import NumberFlow from "@number-flow/react";

import { usePrefersReducedMotion } from "./utils";
import { cn } from "@workspace/ui/utils";

const fillTransition: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.25,
};

const reducedMotionTransition: Transition = {
  duration: 0,
};

const numberFlowTiming = {
  transform: { duration: 200, easing: "ease-out" as const },
  spin: { duration: 200, easing: "ease-out" as const },
  opacity: { duration: 120, easing: "ease-out" as const },
};

type AdjustmentSliderProps = Omit<
  SliderPrimitive.Root.Props,
  "className" | "children"
> & {
  className?: string;
  unsafeClassName?: string;
  label: string;
  renderValue?: (_value: number) => React.ReactNode;
};

export function AdjustmentSlider({
  className,
  unsafeClassName,
  label,
  renderValue,
  defaultValue,
  value: controlledValue,
  onValueChange,
  disabled,
  ...props
}: AdjustmentSliderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [internalValue, setInternalValue] = React.useState<
    number | readonly number[]
  >(() => controlledValue ?? defaultValue ?? 0);
  const currentValue = controlledValue ?? internalValue;
  const displayValue = Array.isArray(currentValue)
    ? currentValue[0]
    : currentValue;
  const min = props.min ?? 0;
  const max = props.max ?? 100;

  const fillPercentage = React.useMemo(() => {
    const range = max - min;
    return range > 0 ? (((displayValue as number) - min) / range) * 100 : 0;
  }, [displayValue, min, max]);

  const handleValueChange = React.useCallback(
    (
      newValue: number | readonly number[],
      details: SliderPrimitive.Root.ChangeEventDetails,
    ) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue, details);
    },
    [controlledValue, onValueChange],
  );

  return (
    <SliderPrimitive.Root
      data-slot="adjustment-slider"
      className={cn(className, "relative w-full", unsafeClassName)}
      defaultValue={defaultValue}
      value={controlledValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      {...props}
    >
      <SliderPrimitive.Control
        data-slot="adjustment-slider-control"
        className="flex h-[var(--space-36)] w-full touch-none items-center cursor-pointer data-[disabled]:cursor-not-allowed"
      >
        <SliderPrimitive.Track
          data-slot="adjustment-slider-track"
          className={cn(
            "group/adjustment relative h-full w-full overflow-hidden rounded-[var(--radius-10)]",
            "bg-surface-interactive-default",
            "data-[disabled]:bg-surface-interactive-default data-[disabled]:backdrop-blur-sm",
            "has-[:focus-visible]:shadow-[0_0_0_1px_var(--color-utility-focus-inner),0_0_0_3px_var(--color-utility-focus-outer)]",
          )}
        >
          <motion.div
            data-slot="adjustment-slider-indicator"
            data-disabled={disabled || undefined}
            className={cn(
              "absolute left-0 top-0 h-full rounded-none",
              "bg-actions-secondary-default group-hover/adjustment:bg-actions-secondary-hover",
              "data-[disabled]:bg-actions-secondary-disabled data-[disabled]:group-hover/adjustment:bg-actions-secondary-disabled",
            )}
            initial={false}
            animate={{ width: `${fillPercentage}%` }}
            transition={
              prefersReducedMotion ? reducedMotionTransition : fillTransition
            }
          />

          <div className="pointer-events-none absolute inset-0 z-10 flex items-center gap-[var(--space-8)] px-[var(--space-12)]">
            <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-m)] font-medium leading-[var(--line-height-m)] text-content-strong">
              {label}
            </span>
            <span className="shrink-0 text-[length:var(--font-size-s)] font-normal leading-[var(--line-height-s)] text-content-strong">
              {renderValue ? (
                renderValue(displayValue as number)
              ) : (
                <NumberFlow
                  value={Math.round(displayValue as number)}
                  transformTiming={numberFlowTiming.transform}
                  spinTiming={numberFlowTiming.spin}
                  opacityTiming={numberFlowTiming.opacity}
                  willChange
                  respectMotionPreference
                />
              )}
            </span>
          </div>

          <SliderPrimitive.Thumb
            data-slot="adjustment-slider-thumb"
            className="block size-0 opacity-0"
          />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}
