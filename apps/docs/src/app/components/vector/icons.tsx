import styles from "./vector.module.css";

/* Minimal stroke icons shared across the Vector family. */

export function Icon({
  paths,
  size = 16,
  strokeWidth = 1.8,
}: {
  paths: string[];
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function CodeChevronsIcon() {
  return (
    <Icon
      paths={["m8 6-6 6 6 6", "M16 6l6 6-6 6"]}
      size={14}
      strokeWidth={2.2}
    />
  );
}

export function CopyIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ReturnsArrowIcon({ stroke }: { stroke: string }) {
  return (
    <svg
      width={18}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ConnectorArrowIcon() {
  return (
    <svg
      className={styles.connectorArrow}
      width={15}
      height={20}
      viewBox="0 0 24 30"
      fill="none"
      stroke="#9945FF"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v22M6 19l6 6 6-6" />
    </svg>
  );
}
