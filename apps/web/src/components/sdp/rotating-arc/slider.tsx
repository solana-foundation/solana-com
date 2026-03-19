"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { mergeProps } from "@base-ui/react/merge-props";
import { animate, motion, type Transition } from "motion/react";
import NumberFlow from "@number-flow/react";

import { usePrefersReducedMotion } from "./utils";
import { cn } from "@workspace/ui/utils";

const instantTransition: Transition = {
  duration: 0,
};

type CubicBezier = [number, number, number, number];

type SliderSpringAnimation = {
  bounce: number;
  duration: number;
};

type SliderFadeAnimation = {
  duration: number;
  ease: CubicBezier;
};

type SliderFadeOutAnimation = SliderFadeAnimation & {
  delay: number;
};

type SliderNumberFlowAnimation = {
  duration: number;
  easing: "linear" | "ease-in" | "ease-out" | "ease-in-out";
};

type SliderAnimationConfig = {
  root: {
    drag: {
      duration: number;
      ease: CubicBezier;
    };
    trackPress: SliderSpringAnimation;
  };
  thumb: {
    default: SliderSpringAnimation;
    segmented: SliderSpringAnimation;
    adjustment: {
      drag: SliderSpringAnimation;
      edgeSnap: SliderSpringAnimation;
      size: SliderSpringAnimation;
      fadeIn: SliderFadeAnimation;
      fadeOut: SliderFadeOutAnimation;
    };
  };
  value: {
    adjustment: SliderSpringAnimation;
  };
  numberFlow: {
    transform: SliderNumberFlowAnimation;
    spin: SliderNumberFlowAnimation;
    opacity: SliderNumberFlowAnimation;
  };
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    __sliderAnimConfig?: DeepPartial<SliderAnimationConfig>;
  }
}

const defaultSliderAnimConfig: SliderAnimationConfig = {
  root: {
    drag: { duration: 0.12, ease: [0.22, 1, 0.36, 1] },
    trackPress: { bounce: 0.1, duration: 0.2 },
  },
  thumb: {
    default: { bounce: 0.1, duration: 0.2 },
    segmented: { bounce: 0, duration: 0.2 },
    adjustment: {
      drag: { bounce: 0.1, duration: 0.12 },
      edgeSnap: { bounce: 0.2, duration: 0.18 },
      size: { bounce: 0.25, duration: 0.2 },
      fadeIn: { duration: 0.12, ease: [0.23, 1, 0.32, 1] },
      fadeOut: { duration: 0.12, ease: [0.23, 1, 0.32, 1], delay: 0.04 },
    },
  },
  value: {
    adjustment: { bounce: 0.15, duration: 0.18 },
  },
  numberFlow: {
    transform: { duration: 200, easing: "ease-out" },
    spin: { duration: 200, easing: "ease-out" },
    opacity: { duration: 120, easing: "ease-out" },
  },
};

function resolveBezier(
  customEase: Partial<CubicBezier> | undefined,
  fallbackEase: CubicBezier,
): CubicBezier {
  return [
    customEase?.[0] ?? fallbackEase[0],
    customEase?.[1] ?? fallbackEase[1],
    customEase?.[2] ?? fallbackEase[2],
    customEase?.[3] ?? fallbackEase[3],
  ];
}

function getSliderAnimConfig(): SliderAnimationConfig {
  if (typeof window === "undefined" || !window.__sliderAnimConfig) {
    return defaultSliderAnimConfig;
  }

  const custom = window.__sliderAnimConfig;

  return {
    root: {
      drag: {
        duration:
          custom.root?.drag?.duration ??
          defaultSliderAnimConfig.root.drag.duration,
        ease: resolveBezier(
          custom.root?.drag?.ease,
          defaultSliderAnimConfig.root.drag.ease,
        ),
      },
      trackPress: {
        bounce:
          custom.root?.trackPress?.bounce ??
          defaultSliderAnimConfig.root.trackPress.bounce,
        duration:
          custom.root?.trackPress?.duration ??
          defaultSliderAnimConfig.root.trackPress.duration,
      },
    },
    thumb: {
      default: {
        bounce:
          custom.thumb?.default?.bounce ??
          defaultSliderAnimConfig.thumb.default.bounce,
        duration:
          custom.thumb?.default?.duration ??
          defaultSliderAnimConfig.thumb.default.duration,
      },
      segmented: {
        bounce:
          custom.thumb?.segmented?.bounce ??
          defaultSliderAnimConfig.thumb.segmented.bounce,
        duration:
          custom.thumb?.segmented?.duration ??
          defaultSliderAnimConfig.thumb.segmented.duration,
      },
      adjustment: {
        drag: {
          bounce:
            custom.thumb?.adjustment?.drag?.bounce ??
            defaultSliderAnimConfig.thumb.adjustment.drag.bounce,
          duration:
            custom.thumb?.adjustment?.drag?.duration ??
            defaultSliderAnimConfig.thumb.adjustment.drag.duration,
        },
        edgeSnap: {
          bounce:
            custom.thumb?.adjustment?.edgeSnap?.bounce ??
            defaultSliderAnimConfig.thumb.adjustment.edgeSnap.bounce,
          duration:
            custom.thumb?.adjustment?.edgeSnap?.duration ??
            defaultSliderAnimConfig.thumb.adjustment.edgeSnap.duration,
        },
        size: {
          bounce:
            custom.thumb?.adjustment?.size?.bounce ??
            defaultSliderAnimConfig.thumb.adjustment.size.bounce,
          duration:
            custom.thumb?.adjustment?.size?.duration ??
            defaultSliderAnimConfig.thumb.adjustment.size.duration,
        },
        fadeIn: {
          duration:
            custom.thumb?.adjustment?.fadeIn?.duration ??
            defaultSliderAnimConfig.thumb.adjustment.fadeIn.duration,
          ease: resolveBezier(
            custom.thumb?.adjustment?.fadeIn?.ease,
            defaultSliderAnimConfig.thumb.adjustment.fadeIn.ease,
          ),
        },
        fadeOut: {
          duration:
            custom.thumb?.adjustment?.fadeOut?.duration ??
            defaultSliderAnimConfig.thumb.adjustment.fadeOut.duration,
          ease: resolveBezier(
            custom.thumb?.adjustment?.fadeOut?.ease,
            defaultSliderAnimConfig.thumb.adjustment.fadeOut.ease,
          ),
          delay:
            custom.thumb?.adjustment?.fadeOut?.delay ??
            defaultSliderAnimConfig.thumb.adjustment.fadeOut.delay,
        },
      },
    },
    value: {
      adjustment: {
        bounce:
          custom.value?.adjustment?.bounce ??
          defaultSliderAnimConfig.value.adjustment.bounce,
        duration:
          custom.value?.adjustment?.duration ??
          defaultSliderAnimConfig.value.adjustment.duration,
      },
    },
    numberFlow: {
      transform: {
        duration:
          custom.numberFlow?.transform?.duration ??
          defaultSliderAnimConfig.numberFlow.transform.duration,
        easing:
          custom.numberFlow?.transform?.easing ??
          defaultSliderAnimConfig.numberFlow.transform.easing,
      },
      spin: {
        duration:
          custom.numberFlow?.spin?.duration ??
          defaultSliderAnimConfig.numberFlow.spin.duration,
        easing:
          custom.numberFlow?.spin?.easing ??
          defaultSliderAnimConfig.numberFlow.spin.easing,
      },
      opacity: {
        duration:
          custom.numberFlow?.opacity?.duration ??
          defaultSliderAnimConfig.numberFlow.opacity.duration,
        easing:
          custom.numberFlow?.opacity?.easing ??
          defaultSliderAnimConfig.numberFlow.opacity.easing,
      },
    },
  };
}

const springTransition = (config: SliderSpringAnimation): Transition => ({
  type: "spring",
  bounce: config.bounce,
  duration: config.duration,
});

const fadeTransition = (config: SliderFadeAnimation): Transition => ({
  duration: config.duration,
  ease: config.ease,
});

const fadeOutTransition = (config: SliderFadeOutAnimation): Transition => ({
  duration: config.duration,
  ease: config.ease,
  delay: config.delay,
});

const adjustmentEdgeThreshold = 12;
const adjustmentThumbHideFallbackThreshold = 93;
const adjustmentValueInlineEnd = 12;
const adjustmentThumbCollisionGap = 4;
const adjustmentThumbWidth = 3;
const adjustmentThumbHeights = {
  s: 20,
  m: 24,
  l: 24,
};
const adjustmentValueMaxShift = 4;
const clampPercentage = (value: number) => Math.min(100, Math.max(0, value));
const thumbHeightValues = {
  s: { normal: 20, full: 32 },
  m: { normal: 24, full: 36 },
  l: { normal: 24, full: 40 },
};

function useMeasuredWidth<T extends HTMLElement>() {
  const [width, setWidth] = React.useState(0);
  const observerRef = React.useRef<ResizeObserver | null>(null);

  const measure = React.useCallback((element: T) => {
    const nextWidth = element.getBoundingClientRect().width;
    setWidth((prevWidth) =>
      Math.abs(prevWidth - nextWidth) < 0.5 ? prevWidth : nextWidth,
    );
  }, []);

  const setElement = React.useCallback(
    (element: T | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!element) {
        setWidth(0);
        return;
      }

      measure(element);

      if (typeof ResizeObserver === "undefined") {
        return;
      }

      const observer = new ResizeObserver(() => measure(element));
      observer.observe(element);
      observerRef.current = observer;
    },
    [measure],
  );

  React.useEffect(() => () => observerRef.current?.disconnect(), []);

  return [width, setElement] as const;
}

type SliderVariant = "default" | "adjustment" | "segmented";
type SliderSize = "s" | "m" | "l";
type SliderChangeReason =
  | "input-change"
  | "track-press"
  | "drag"
  | "keyboard"
  | "none";

type SliderContextValue = {
  variant: SliderVariant;
  size: SliderSize;
  percentage: number;
  animatedPercentage: number;
  disabled: boolean;
  dragging: boolean;
  changeReason: SliderChangeReason;
  adjustmentTrackWidth: number;
  adjustmentValueWidth: number;
  setAdjustmentTrackElement: (_element: HTMLDivElement | null) => void;
  setAdjustmentValueElement: (_element: HTMLElement | null) => void;
};

const SliderContext = React.createContext<SliderContextValue>({
  variant: "default",
  size: "m",
  percentage: 0,
  animatedPercentage: 0,
  disabled: false,
  dragging: false,
  changeReason: "none",
  adjustmentTrackWidth: 0,
  adjustmentValueWidth: 0,
  setAdjustmentTrackElement: () => {},
  setAdjustmentValueElement: () => {},
});

function useSliderContext() {
  return React.useContext(SliderContext);
}

function useSliderVariant() {
  return useSliderContext().variant;
}

const sizeConfig = {
  s: {
    control: "h-[var(--space-32)]",
    track: "h-[var(--space-32)] rounded-[var(--radius-8)]",
    thumb: "h-[var(--space-20)]",
    padding: "px-[var(--space-10)]",
  },
  m: {
    control: "h-[var(--space-36)]",
    track: "h-[var(--space-36)] rounded-[var(--radius-10)]",
    thumb: "h-[var(--space-24)]",
    padding: "px-[var(--space-12)]",
  },
  l: {
    control: "h-[var(--space-40)]",
    track: "h-[var(--space-40)] rounded-[var(--radius-12)]",
    thumb: "h-[var(--space-24)]",
    padding: "px-[var(--space-12)]",
  },
};

type SliderRootProps = Omit<SliderPrimitive.Root.Props, "className"> & {
  className?: string;
  variant?: SliderVariant;
  size?: SliderSize;
};

function SliderRoot({
  className,
  variant = "default",
  size = "m",
  render,
  onValueChange,
  ...props
}: SliderRootProps) {
  const lastChangeReasonRef = React.useRef<SliderChangeReason>("none");

  const handleValueChange = React.useCallback(
    (
      value: number | readonly number[],
      details: SliderPrimitive.Root.ChangeEventDetails,
    ) => {
      lastChangeReasonRef.current = details.reason;
      onValueChange?.(value as never, details);
    },
    [onValueChange],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      data-variant={variant}
      data-size={size}
      className={cn("flex w-full flex-col gap-[var(--space-12)]", className)}
      render={(rootProps, state) => (
        <SliderRootInner
          rootProps={rootProps}
          state={state}
          variant={variant}
          size={size}
          render={render}
          changeReasonRef={lastChangeReasonRef}
        />
      )}
      onValueChange={handleValueChange}
      {...props}
    />
  );
}

type SliderRootInnerProps = {
  rootProps: React.ComponentPropsWithRef<"div">;
  state: SliderPrimitive.Root.State;
  variant: SliderVariant;
  size: SliderSize;
  render?: SliderRootProps["render"];
  changeReasonRef: React.MutableRefObject<SliderChangeReason>;
};

function SliderRootInner({
  rootProps,
  state,
  variant,
  size,
  render,
  changeReasonRef,
}: SliderRootInnerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animationConfig = getSliderAnimConfig();
  const currentValue = state.values[0] ?? state.min;
  const range = state.max - state.min;
  const rawPercentage =
    range > 0 ? ((currentValue - state.min) / range) * 100 : 0;
  const percentage = Number.isFinite(rawPercentage)
    ? Math.min(100, Math.max(0, rawPercentage))
    : 0;
  const changeReason = changeReasonRef.current;
  const [animatedPercentage, setAnimatedPercentage] =
    React.useState(percentage);
  const animatedPercentageRef = React.useRef(percentage);
  const [adjustmentTrackWidth, setAdjustmentTrackElement] =
    useMeasuredWidth<HTMLDivElement>();
  const [adjustmentValueWidth, setAdjustmentValueElement] =
    useMeasuredWidth<HTMLElement>();

  React.useEffect(() => {
    if (prefersReducedMotion) {
      animatedPercentageRef.current = percentage;
      setAnimatedPercentage(percentage);
      return;
    }

    const isDragMove = state.dragging && changeReason === "drag";
    const trackPressTransition: Transition = {
      type: "spring",
      bounce: animationConfig.root.trackPress.bounce,
      duration: animationConfig.root.trackPress.duration,
    };
    const transition: Transition = isDragMove
      ? {
          duration: animationConfig.root.drag.duration,
          ease: animationConfig.root.drag.ease,
        }
      : changeReason === "track-press" || changeReason === "keyboard"
        ? trackPressTransition
        : { duration: 0 };

    const controls = animate(animatedPercentageRef.current, percentage, {
      ...transition,
      onUpdate: (latest) => {
        animatedPercentageRef.current = latest;
        setAnimatedPercentage(latest);
      },
    });

    return () => controls.stop();
  }, [
    animationConfig.root.drag.duration,
    animationConfig.root.drag.ease,
    animationConfig.root.trackPress.bounce,
    animationConfig.root.trackPress.duration,
    percentage,
    prefersReducedMotion,
    changeReason,
    state.dragging,
  ]);

  const element = render ? (
    typeof render === "function" ? (
      render(rootProps, state)
    ) : (
      React.cloneElement(
        render as React.ReactElement<React.ComponentPropsWithRef<"div">>,
        {
          ...mergeProps(
            rootProps,
            (render as React.ReactElement<React.ComponentPropsWithRef<"div">>)
              .props,
          ),
          ref: rootProps.ref,
        },
      )
    )
  ) : (
    <div {...rootProps} />
  );

  return (
    <SliderContext.Provider
      value={{
        variant,
        size,
        percentage,
        animatedPercentage,
        disabled: state.disabled,
        dragging: state.dragging,
        changeReason,
        adjustmentTrackWidth,
        adjustmentValueWidth,
        setAdjustmentTrackElement,
        setAdjustmentValueElement,
      }}
    >
      {element}
    </SliderContext.Provider>
  );
}

type SliderControlProps = Omit<SliderPrimitive.Control.Props, "className"> & {
  className?: string;
};

function SliderControl({ className, ...props }: SliderControlProps) {
  const { variant, size } = useSliderContext();

  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      data-variant={variant}
      data-size={size}
      className={cn(
        "flex w-full touch-none items-center cursor-pointer data-[disabled]:cursor-not-allowed",
        variant === "default" && "h-[var(--space-20)]",
        (variant === "adjustment" || variant === "segmented") &&
          sizeConfig[size].control,
        className,
      )}
      {...props}
    />
  );
}

type SliderTrackProps = Omit<SliderPrimitive.Track.Props, "className"> & {
  className?: string;
};

function SliderTrack({ className, ...props }: SliderTrackProps) {
  const { variant, size } = useSliderContext();

  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      data-variant={variant}
      data-size={size}
      className={cn(
        "relative w-full transition-colors duration-200 ease-out",
        variant === "default" && [
          "h-[var(--space-4)] rounded-[var(--radius-max)]",
          "bg-actions-secondary-default data-[disabled]:bg-actions-secondary-disabled data-[disabled]:backdrop-blur-sm",
        ],
        variant === "adjustment" && ["h-full w-full", "bg-transparent"],
        variant === "segmented" && [
          sizeConfig[size].track,
          "bg-transparent",
          "cursor-grab active:cursor-grabbing",
          "px-[4px]",
        ],
        className,
      )}
      {...props}
    />
  );
}

type SliderAdjustmentTrackProps = {
  className?: string;
  children?: React.ReactNode;
};

function SliderAdjustmentTrack({
  className,
  children,
}: SliderAdjustmentTrackProps) {
  const { variant, size, disabled, setAdjustmentTrackElement } =
    useSliderContext();

  if (variant !== "adjustment") {
    return <>{children}</>;
  }

  return (
    <div
      ref={setAdjustmentTrackElement}
      data-slot="slider-adjustment-track"
      data-size={size}
      data-disabled={disabled || undefined}
      className={cn(
        "group/adjustment relative w-full overflow-hidden",
        sizeConfig[size].track,
        "bg-surface-interactive-default",
        disabled && "bg-surface-interactive-default backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

type SliderIndicatorProps = Omit<
  SliderPrimitive.Indicator.Props,
  "className"
> & {
  className?: string;
};

const adjustmentRadiusConfig = {
  s: { full: "rounded-[var(--radius-8)]", left: "rounded-l-[var(--radius-8)]" },
  m: {
    full: "rounded-[var(--radius-10)]",
    left: "rounded-l-[var(--radius-10)]",
  },
  l: {
    full: "rounded-[var(--radius-12)]",
    left: "rounded-l-[var(--radius-12)]",
  },
};

function SliderIndicator({
  className,
  render,
  style,
  ...props
}: SliderIndicatorProps) {
  const { variant, size, percentage, animatedPercentage, disabled } =
    useSliderContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const visualPercentage = clampPercentage(
    prefersReducedMotion ? percentage : animatedPercentage,
  );

  if (variant === "segmented") {
    return null;
  }

  const isAtMax = visualPercentage >= 100;

  if (variant === "adjustment") {
    const indicatorScale = Math.min(1, Math.max(0, visualPercentage / 100));

    return (
      <div
        data-slot="slider-indicator"
        data-variant={variant}
        data-size={size}
        data-disabled={disabled || undefined}
        className={cn(
          "absolute left-0 top-0 h-full w-full origin-left",
          isAtMax
            ? adjustmentRadiusConfig[size].full
            : [
                adjustmentRadiusConfig[size].left,
                "rounded-r-[var(--radius-4)]",
              ],
          "bg-actions-secondary-default group-hover/adjustment:bg-actions-secondary-hover",
          "data-[disabled]:bg-actions-secondary-disabled data-[disabled]:group-hover/adjustment:bg-actions-secondary-disabled",
          className,
        )}
        style={{ transform: `scaleX(${indicatorScale})`, ...style }}
        {...props}
      />
    );
  }

  const indicatorStyle = prefersReducedMotion
    ? undefined
    : {
        insetInlineStart: 0,
        width: `${visualPercentage}%`,
      };

  return (
    <SliderPrimitive.Indicator
      data-slot="slider-indicator"
      data-variant={variant}
      data-size={size}
      render={render}
      className={cn(
        "absolute h-full rounded-[var(--radius-max)]",
        "bg-actions-primary-default data-[disabled]:bg-actions-primary-disabled",
        className,
      )}
      style={{ ...indicatorStyle, ...style }}
      {...props}
    />
  );
}

type SliderThumbProps = Omit<
  SliderPrimitive.Thumb.Props,
  "className" | "render"
> & {
  className?: string;
};

function SliderThumb({ className, style, ...props }: SliderThumbProps) {
  const animationConfig = getSliderAnimConfig();
  const [thumbPressed, setThumbPressed] = React.useState(false);
  const {
    variant,
    size,
    percentage,
    animatedPercentage,
    dragging,
    changeReason,
    adjustmentTrackWidth,
    adjustmentValueWidth,
  } = useSliderContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const visualPercentage = clampPercentage(
    prefersReducedMotion ? percentage : animatedPercentage,
  );

  React.useEffect(() => {
    if (!thumbPressed) {
      return;
    }

    const handlePointerRelease = () => setThumbPressed(false);
    window.addEventListener("pointerup", handlePointerRelease);
    window.addEventListener("pointercancel", handlePointerRelease);

    return () => {
      window.removeEventListener("pointerup", handlePointerRelease);
      window.removeEventListener("pointercancel", handlePointerRelease);
    };
  }, [thumbPressed]);

  if (variant === "adjustment") {
    const isAtAbsoluteMax = percentage >= 100;
    const adjustedVisualPercentage = isAtAbsoluteMax ? 100 : visualPercentage;
    const edgeOffset = 11;
    const midOffset = edgeOffset - 2;
    const edgeThreshold = adjustmentEdgeThreshold;

    let thumbX: number;
    if (adjustedVisualPercentage <= edgeThreshold) {
      thumbX = edgeOffset;
    } else if (adjustedVisualPercentage >= 100) {
      thumbX = -edgeOffset;
    } else {
      thumbX = midOffset;
    }

    const isAtEdge =
      adjustedVisualPercentage <= edgeThreshold ||
      adjustedVisualPercentage >= 100;
    const hasAdjustmentMeasurements =
      adjustmentTrackWidth > 0 && adjustmentValueWidth > 0;
    const thumbRightPx =
      (adjustedVisualPercentage / 100) * adjustmentTrackWidth +
      thumbX +
      adjustmentThumbWidth;
    const valueLeftPx =
      adjustmentTrackWidth - adjustmentValueInlineEnd - adjustmentValueWidth;
    const shouldHideThumb =
      changeReason !== "keyboard" &&
      !isAtAbsoluteMax &&
      (hasAdjustmentMeasurements
        ? thumbRightPx >= valueLeftPx - adjustmentThumbCollisionGap
        : adjustedVisualPercentage >= adjustmentThumbHideFallbackThreshold);
    const thumbHeight = adjustmentThumbHeights[size];
    const edgeHeight = thumbHeight - 3;
    const isThumbAtRest = !dragging && !thumbPressed;
    const shouldShortenThumb = isThumbAtRest || shouldHideThumb;
    const shouldRevealImmediately = isAtAbsoluteMax && !shouldHideThumb;
    const thumbInteractionProps = mergeProps(props, {
      onPointerDown: () => setThumbPressed(true),
      onPointerUp: () => setThumbPressed(false),
      onPointerCancel: () => setThumbPressed(false),
      onBlur: () => setThumbPressed(false),
    });

    return (
      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        data-variant={variant}
        data-size={size}
        className={cn(
          "relative z-20 block w-[3px] overflow-hidden rounded-[var(--radius-4)]",
          sizeConfig[size].thumb,
          "bg-actions-secondary-default",
          "before:absolute before:inset-0 before:rounded-[var(--radius-4)] before:bg-actions-secondary-default before:opacity-60 before:content-['']",
          "after:absolute after:inset-0 after:rounded-[var(--radius-4)] after:bg-actions-secondary-default after:opacity-40 after:content-['']",
          "data-[disabled]:bg-actions-secondary-disabled data-[disabled]:before:bg-actions-secondary-disabled data-[disabled]:before:opacity-100",
          "data-[disabled]:after:bg-actions-secondary-disabled data-[disabled]:after:opacity-100",
          "focus-visible:shadow-[0_0_0_1px_var(--color-utility-focus-inner),0_0_0_3px_var(--color-utility-focus-outer)]",
          "has-[:focus-visible]:shadow-[0_0_0_1px_var(--color-utility-focus-inner),0_0_0_3px_var(--color-utility-focus-outer)]",
          className,
        )}
        style={{ insetInlineStart: `${adjustedVisualPercentage}%`, ...style }}
        render={
          <motion.span
            initial={false}
            animate={{
              x: thumbX,
              height: shouldShortenThumb ? edgeHeight : thumbHeight,
              opacity: shouldHideThumb ? 0 : 1,
              scale: shouldHideThumb ? 0.6 : 1,
            }}
            transition={
              prefersReducedMotion
                ? instantTransition
                : {
                    x: shouldRevealImmediately
                      ? instantTransition
                      : dragging
                        ? springTransition(
                            animationConfig.thumb.adjustment.drag,
                          )
                        : isAtEdge
                          ? springTransition(
                              animationConfig.thumb.adjustment.edgeSnap,
                            )
                          : springTransition(animationConfig.thumb.default),
                    height: springTransition(
                      animationConfig.thumb.adjustment.size,
                    ),
                    opacity: shouldRevealImmediately
                      ? instantTransition
                      : shouldHideThumb
                        ? fadeOutTransition(
                            animationConfig.thumb.adjustment.fadeOut,
                          )
                        : fadeTransition(
                            animationConfig.thumb.adjustment.fadeIn,
                          ),
                    scale: shouldRevealImmediately
                      ? instantTransition
                      : springTransition(animationConfig.thumb.adjustment.size),
                  }
            }
          />
        }
        {...thumbInteractionProps}
      />
    );
  }

  if (variant === "segmented") {
    const isAtEdge = visualPercentage <= 0 || visualPercentage >= 100;
    const heights = thumbHeightValues[size];

    return (
      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        data-variant={variant}
        data-size={size}
        data-at-edge={isAtEdge || undefined}
        className={cn(
          "relative z-10 block w-[3px] overflow-hidden rounded-[var(--radius-4)]",
          "cursor-grab active:cursor-grabbing",
          "bg-actions-secondary-default",
          "before:absolute before:inset-0 before:rounded-[var(--radius-4)] before:bg-actions-secondary-default before:opacity-60 before:content-['']",
          "after:absolute after:inset-0 after:rounded-[var(--radius-4)] after:bg-actions-secondary-default after:opacity-40 after:content-['']",
          "data-[disabled]:bg-actions-secondary-disabled data-[disabled]:before:bg-actions-secondary-disabled data-[disabled]:before:opacity-100",
          "data-[disabled]:after:bg-actions-secondary-disabled data-[disabled]:after:opacity-100",
          "focus-visible:shadow-[0_0_0_1px_var(--color-utility-focus-inner),0_0_0_3px_var(--color-utility-focus-outer)]",
          "has-[:focus-visible]:shadow-[0_0_0_1px_var(--color-utility-focus-inner),0_0_0_3px_var(--color-utility-focus-outer)]",
          className,
        )}
        style={{ insetInlineStart: `${visualPercentage}%`, ...style }}
        render={
          <motion.span
            initial={false}
            animate={{ height: isAtEdge ? heights.full : heights.normal }}
            transition={
              prefersReducedMotion
                ? instantTransition
                : springTransition(animationConfig.thumb.segmented)
            }
          />
        }
        {...props}
      />
    );
  }

  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      data-variant={variant}
      data-size={size}
      className={cn(
        "block size-[var(--space-16)] rounded-full",
        "bg-content-inverse-strong",
        "shadow-[0_2px_4px_0_var(--color-utility-shadow-l3),0_1px_2px_0_var(--color-utility-shadow-l3),0_0_1px_0_var(--color-utility-shadow-l3),0_0_0_1px_var(--color-utility-shadow-l1)]",
        "focus-visible:shadow-[0_2px_4px_0_var(--color-utility-shadow-l3),0_1px_2px_0_var(--color-utility-shadow-l3),0_0_1px_0_var(--color-utility-shadow-l3),0_0_0_1px_var(--color-utility-shadow-l1),inset_0_0_0_1px_var(--color-utility-focus-inner),inset_0_0_0_3px_var(--color-utility-focus-outer)]",
        "has-[:focus-visible]:shadow-[0_2px_4px_0_var(--color-utility-shadow-l3),0_1px_2px_0_var(--color-utility-shadow-l3),0_0_1px_0_var(--color-utility-shadow-l3),0_0_0_1px_var(--color-utility-shadow-l1),inset_0_0_0_1px_var(--color-utility-focus-inner),inset_0_0_0_3px_var(--color-utility-focus-outer)]",
        className,
      )}
      style={{ insetInlineStart: `${visualPercentage}%`, ...style }}
      render={
        <motion.span
          whileHover={prefersReducedMotion ? undefined : { scale: 1.25 }}
          whileFocus={prefersReducedMotion ? undefined : { scale: 1.25 }}
          transition={
            prefersReducedMotion
              ? instantTransition
              : springTransition(animationConfig.thumb.default)
          }
        />
      }
      {...props}
    />
  );
}

type SliderValueProps = Omit<SliderPrimitive.Value.Props, "className"> & {
  className?: string;
};

function SliderValue({
  className,
  render,
  children,
  ...props
}: SliderValueProps) {
  const animationConfig = getSliderAnimConfig();
  const {
    variant,
    size,
    percentage,
    animatedPercentage,
    disabled,
    setAdjustmentValueElement,
  } = useSliderContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (variant === "adjustment") {
    const visualPercentage = clampPercentage(
      prefersReducedMotion ? percentage : animatedPercentage,
    );
    const isAtAbsoluteMax = percentage >= 100;
    const adjustedVisualPercentage = isAtAbsoluteMax ? 100 : visualPercentage;
    const valueX =
      adjustedVisualPercentage >= 100 ? -adjustmentValueMaxShift : 0;
    const hasCustomChildren = typeof children !== "undefined";
    const valueChildren = hasCustomChildren
      ? children
      : (_formattedValues: readonly string[], values: readonly number[]) => {
          const displayValue = values[0] ?? 0;
          return (
            <NumberFlow
              value={Math.round(displayValue)}
              transformTiming={animationConfig.numberFlow.transform}
              spinTiming={animationConfig.numberFlow.spin}
              opacityTiming={animationConfig.numberFlow.opacity}
              willChange
              respectMotionPreference
            />
          );
        };
    const valueRender =
      render ??
      ((valueProps: React.ComponentPropsWithRef<"output">) => {
        const {
          onDrag: _onDrag,
          onDragStart: _onDragStart,
          onDragEnd: _onDragEnd,
          onDragEnter: _onDragEnter,
          onDragLeave: _onDragLeave,
          onDragOver: _onDragOver,
          onDrop: _onDrop,
          onAnimationStart: _onAnimationStart,
          ...rest
        } = valueProps;

        return (
          <motion.output
            {...rest}
            initial={false}
            animate={{ x: valueX }}
            transition={
              prefersReducedMotion || isAtAbsoluteMax
                ? instantTransition
                : springTransition(animationConfig.value.adjustment)
            }
          />
        );
      });

    return (
      <div
        ref={(element) => setAdjustmentValueElement(element)}
        className="pointer-events-none absolute right-[var(--space-12)] top-1/2 z-10 inline-flex -translate-y-1/2"
      >
        <SliderPrimitive.Value
          data-slot="slider-value"
          data-variant={variant}
          data-size={size}
          className={cn(
            "inline-flex items-center text-[length:var(--font-size-m)] font-normal leading-[var(--line-height-m)]",
            disabled
              ? "text-content-disabled"
              : percentage === 0
                ? "text-content-muted"
                : "text-content-strong",
            className,
          )}
          render={valueRender}
          {...props}
        >
          {valueChildren}
        </SliderPrimitive.Value>
      </div>
    );
  }

  return (
    <SliderPrimitive.Value
      data-slot="slider-value"
      data-variant={variant}
      data-size={size}
      className={cn(
        "pointer-events-none absolute right-[var(--space-12)] top-1/2 z-10 -translate-y-1/2 text-[length:var(--font-size-m)] font-normal leading-[var(--line-height-m)]",
        disabled
          ? "text-content-disabled"
          : percentage === 0
            ? "text-content-muted"
            : "text-content-strong",
        className,
      )}
      {...props}
    />
  );
}

const Slider = Object.assign(SliderRoot, {
  Control: SliderControl,
  Track: SliderTrack,
  Indicator: SliderIndicator,
  Thumb: SliderThumb,
  Value: SliderValue,
  AdjustmentTrack: SliderAdjustmentTrack,
});

export {
  Slider,
  SliderRoot,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
  SliderValue,
  SliderAdjustmentTrack,
  useSliderVariant,
  useSliderContext,
  defaultSliderAnimConfig,
};

export type {
  SliderRootProps,
  SliderControlProps,
  SliderTrackProps,
  SliderIndicatorProps,
  SliderThumbProps,
  SliderValueProps,
  SliderAdjustmentTrackProps,
  SliderVariant,
  SliderSize,
  SliderAnimationConfig,
  CubicBezier,
};
