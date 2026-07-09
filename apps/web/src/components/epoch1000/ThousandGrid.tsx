const TOTAL = 1000;

interface Props {
  currentEpoch: number;
  /** Highlight the span from this epoch to current in `accent`. */
  firstEpoch?: number;
  accent?: string;
}

/**
 * The Thousand Grid: one cell per epoch, 0–999, filled to the current epoch.
 * The signature element of the campaign — also echoed on the shareable card.
 */
export default function ThousandGrid({
  currentEpoch,
  firstEpoch,
  accent,
}: Props) {
  return (
    <div
      className="grid w-full gap-px sm:gap-0.5"
      style={{ gridTemplateColumns: "repeat(50, minmax(0, 1fr))" }}
      role="img"
      aria-label={`${Math.min(currentEpoch, TOTAL)} of 1000 epochs elapsed`}
    >
      {Array.from({ length: TOTAL }, (_, i) => {
        const elapsed = i < currentEpoch;
        const isTip = i === currentEpoch;
        const inSpan =
          firstEpoch !== undefined &&
          i >= firstEpoch &&
          i <= Math.min(currentEpoch, TOTAL - 1);
        return (
          <div
            key={i}
            className={`aspect-square rounded-[1px] ${isTip ? "ep-cell-live" : ""}`}
            style={{
              backgroundColor:
                inSpan && accent
                  ? accent
                  : isTip
                    ? "#14f195"
                    : elapsed
                      ? "#3a3a3a"
                      : "#161616",
            }}
          />
        );
      })}
    </div>
  );
}
