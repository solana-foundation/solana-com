import type { SeriesPoint } from "./time-series-chart";

export function ProviderSparkline({
  color,
  points,
  minimumRange = 1,
}: {
  color: string;
  points: SeriesPoint[];
  minimumRange?: number;
}) {
  const width = 96;
  const height = 28;
  const padding = 2;
  const definedValues = points
    .filter((point) => point.defined !== false && Number.isFinite(point.value))
    .map((point) => point.value);

  if (definedValues.length === 0) {
    return <span className="block h-7 w-24 bg-nd-border-light/20" />;
  }

  const minValue = Math.min(...definedValues);
  const maxValue = Math.max(...definedValues);
  const valueRange = Math.max(
    maxValue - minValue,
    minimumRange,
    Number.EPSILON,
  );
  const pointStep =
    points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  const segments: string[] = [];
  let currentSegment: string[] = [];

  points.forEach((point, index) => {
    if (point.defined === false || !Number.isFinite(point.value)) {
      if (currentSegment.length > 0) {
        segments.push(currentSegment.join(" "));
        currentSegment = [];
      }
      return;
    }

    const x = padding + index * pointStep;
    const y =
      height -
      padding -
      ((point.value - minValue) / valueRange) * (height - padding * 2);

    currentSegment.push(
      `${currentSegment.length === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`,
    );
  });

  if (currentSegment.length > 0) {
    segments.push(currentSegment.join(" "));
  }

  return (
    <svg
      aria-hidden="true"
      className="block h-7 w-24 overflow-visible"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <line
        stroke="rgba(236, 228, 253, 0.12)"
        x1={0}
        x2={width}
        y1={height - 1}
        y2={height - 1}
      />
      {segments.map((segment, index) => (
        <path
          d={segment}
          fill="none"
          key={`${segment}-${index}`}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      ))}
    </svg>
  );
}
