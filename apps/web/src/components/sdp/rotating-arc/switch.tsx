"use client";

import * as React from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";

import { cn } from "@workspace/ui/utils";
import { SwitchControl, type SwitchControlProps } from "./switch-control";

type SwitchLabelPosition = "left" | "right";

type SwitchProps = SwitchControlProps & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  position?: SwitchLabelPosition;
  containerClassName?: string;
};

export function Switch({
  label,
  description,
  position = "right",
  containerClassName,
  className,
  disabled,
  ...props
}: SwitchProps) {
  const hasLabel = Boolean(label);
  const hasDescription = Boolean(description);

  if (!hasLabel && !hasDescription) {
    return (
      <SwitchControl className={className} disabled={disabled} {...props} />
    );
  }

  const labelContent = (
    <span
      data-slot="label-text"
      className={cn(
        "flex min-w-0 flex-1 flex-col",
        hasLabel && hasDescription && "gap-[var(--space-2)]",
      )}
    >
      {hasLabel ? (
        <span
          data-slot="label"
          className={cn(
            "text-[length:var(--font-size-m)] font-[var(--font-weight-medium)] leading-[var(--line-height-m)]",
            disabled ? "text-content-muted" : "text-content-strong",
          )}
        >
          {label}
        </span>
      ) : null}
      {hasDescription ? (
        <FieldPrimitive.Description
          data-slot="description"
          className={cn(
            "text-[length:var(--font-size-xs)] font-[var(--font-weight-default)] leading-[var(--line-height-xs)]",
            disabled ? "text-content-muted" : "text-content-subtle",
          )}
        >
          {description}
        </FieldPrimitive.Description>
      ) : null}
    </span>
  );

  const control = (
    <span className="flex h-[var(--space-20)] shrink-0 items-center">
      <SwitchControl className={className} disabled={disabled} {...props} />
    </span>
  );

  return (
    <FieldPrimitive.Root
      data-slot="switch"
      data-disabled={disabled || undefined}
      disabled={disabled}
      className={cn(containerClassName)}
    >
      <FieldPrimitive.Label
        data-slot="switch-label"
        className={cn(
          "group inline-flex cursor-pointer gap-[var(--space-12)]",
          hasDescription ? "items-start" : "items-center",
          disabled && "cursor-not-allowed",
        )}
      >
        {position === "left" ? control : labelContent}
        {position === "left" ? labelContent : control}
      </FieldPrimitive.Label>
    </FieldPrimitive.Root>
  );
}

export type { SwitchLabelPosition };
