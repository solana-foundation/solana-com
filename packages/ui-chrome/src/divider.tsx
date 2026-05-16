/**
 * A customizable divider, vertical or horizontal, including theme (dark/light), opacity or axis direction
 */
const Divider = ({
  theme,
  alpha,
  axis,
  height,
  className,
}: {
  theme?: "light" | "dark";
  alpha?: number;
  axis?: "x" | "y";
  height?: string;
  className?: string;
}) => {
  const rgb =
    theme === "light"
      ? "255, 255, 255"
      : theme === "dark"
        ? "0, 0, 0"
        : "100, 100, 100";
  const borderValue = `1px solid rgba(${rgb}, ${alpha ?? 0.4})`;
  const style: React.CSSProperties = {
    height: height || "auto",
    ...(axis === "x"
      ? { borderTop: borderValue }
      : axis === "y"
        ? { borderRight: borderValue }
        : { border: borderValue }),
  };

  return <div role="separator" className={className} style={style} />;
};

export { Divider };
