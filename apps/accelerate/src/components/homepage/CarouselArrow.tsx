import { useTranslations } from "@workspace/i18n/client";

interface CarouselArrowProps {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  ariaControls?: string;
}

export function CarouselArrow({
  direction,
  disabled,
  onClick,
  ariaControls,
}: CarouselArrowProps) {
  const t = useTranslations("accelerate.homepage.accessibility");

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={t(direction === "left" ? "scrollLeft" : "scrollRight")}
      aria-controls={ariaControls}
      className="flex h-9 w-9 shrink-0 items-center justify-center transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accelerate-green disabled:cursor-not-allowed disabled:opacity-30"
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        className={direction === "left" ? "rotate-180" : ""}
        aria-hidden="true"
      >
        <circle cx="18" cy="18" r="18" fill="#838191" />
        <g transform="translate(9, 10)">
          <path
            d="M17.79 8.56L11.07 15.77C10.93 15.92 10.76 16 10.55 16C10.35 16 10.17 15.92 10.03 15.77C9.89 15.62 9.82 15.44 9.82 15.22C9.82 15 9.89 14.81 10.03 14.66L15.51 8.78H0.73C0.63 8.79 0.54 8.76 0.45 8.73C0.37 8.69 0.29 8.64 0.21 8.56C0.07 8.4 0 8.22 0 8C0 7.78 0.07 7.6 0.21 7.44C0.29 7.36 0.37 7.31 0.45 7.27C0.54 7.24 0.63 7.21 0.73 7.2L15.51 7.22L10.03 1.34C9.89 1.19 9.82 1 9.82 0.78C9.82 0.56 9.89 0.38 10.03 0.23C10.17 0.08 10.35 0 10.55 0C10.76 0 10.93 0.08 11.07 0.23L17.79 7.44C17.93 7.6 18 7.78 18 8C18 8.22 17.93 8.4 17.79 8.56Z"
            fill="black"
          />
        </g>
      </svg>
    </button>
  );
}
