export type DividerTheme = "light" | "dark";

export type DividerAxis = "x" | "y";

export interface DividerProps {
  /**
   * "light" or "dark" mode, changes the RGB color mode
   */
  theme?: DividerTheme;

  /**
   * A value between 0 and 1 that specifies the alpha transparency value for the RGB color
   */
  alpha?: number;

  /**
   * "x" or "y" specifies the axis that helps rendering a horizontal or vertical divider
   */
  axis?: DividerAxis;

  /**
   * A string px value, e.g. "20px" that defines the height of the y axis divider
   */
  height?: string;

  /**
   * Custom HTML classes
   */
  className?: string;
}

declare const Divider: (_props: DividerProps) => JSX.Element;

export default Divider;
