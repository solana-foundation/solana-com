"use client";

import React from "react";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  className?: string;
  labelPrefix?: string;
}

export default function CarouselControls({
  onPrev,
  onNext,
  className = "",
  labelPrefix,
}: CarouselControlsProps) {
  const previousLabel = labelPrefix
    ? `Previous ${labelPrefix}`
    : "Previous item";
  const nextLabel = labelPrefix ? `Next ${labelPrefix}` : "Next item";
  const buttonClassName =
    "flex size-12 items-center justify-center border border-stroke-secondary text-white transition-colors hover:border-neutral-500 hover:bg-neutral-600 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white disabled:border-stroke-primary disabled:text-neutral-700 disabled:hover:bg-transparent";

  return (
    <div className={`flex gap-xs ${className}`.trim()}>
      <button
        type="button"
        onClick={onPrev}
        aria-label={previousLabel}
        className={buttonClassName}
      >
        <svg
          aria-hidden="true"
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1L1 8M1 8L8 15M1 8H19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label={nextLabel}
        className={buttonClassName}
      >
        <svg
          aria-hidden="true"
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 1L19 8M19 8L12 15M19 8H1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
