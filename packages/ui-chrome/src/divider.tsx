/**
 * A customizable divider, vertical or horizontal, styled with Tailwind CSS.
 *
 * @param {"light" | "dark"}   [theme='default'] - "light" (white), "dark" (black), or default (neutral gray).
 * @param {string}             [alpha='0.4'] - A value between 0 and 1 for the color's alpha transparency.
 * @param {"x" | "y"}          [axis='x'] - Renders a horizontal ('x') or vertical ('y') divider.
 * @param {string}             [height] - The height for a vertical divider (e.g., "20px", "100%").
 * @param {string}             [className] - Additional custom classes to apply.
 */
export function Divider({
  theme = "default",
  alpha = "0.4",
  axis = "x",
  height,
  className,
}: {
  theme?: "light" | "dark" | "default";
  alpha?: string;
  axis?: "x" | "y";
  height?: string;
  className?: string;
}) {
  // Build the Tailwind classes dynamically based on props
  const classes = [
    // 1. Set the border direction based on the axis
    axis === "y" ? "border-r" : "border-t w-full",

    // 2. Set the border color and opacity using arbitrary values
    {
      light: `border-white/[${alpha}]`,
      dark: `border-black/[${alpha}]`,
      default: `border-neutral-500/[${alpha}]`,
    }[theme],

    // 3. Include any extra classes passed in
    className,
  ]
    .filter(Boolean) // Remove any null/undefined values
    .join(" "); // Join into a single string

  return (
    <div
      role="separator"
      className={classes}
      // Apply height directly for vertical dividers, as it's a dynamic value
      style={axis === "y" ? { height: height || "auto" } : {}}
    />
  );
}
