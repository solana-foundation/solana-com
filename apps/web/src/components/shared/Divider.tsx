import React from "react";

/**
 * A customizable divider, vertical or horizontal, including theme (dark/light), opacity or axis direction
 *
 * @param {String}   theme         "light" or "dark" mode, changes the RGB color mode
 * @param {Number}   alpha         A value between 0 and 1 that specifies the alpha transparency value for the RGB color
 * @param {String}   axis          "x" or "y" specifies the axis that helps rendering a horizontal or vertical divider
 * @param {String}   height        A string px value, e.g. "20px" that defines the height of the y axis divider
 * @param {String}   className    Custom HTML classes
 * @returns {JSX.Element}
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
  const borderColor = `rgba(${rgb}, ${alpha ?? 0.4})`;
  const borderValue = `1px solid ${borderColor}`;

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

export default Divider;
