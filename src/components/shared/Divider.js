import styled from "styled-components";

const StyledDivider = styled.div`
  height: ${(props) => props.height || "auto"};
  ${(props) =>
    props.$axis === "x"
      ? "border-top"
      : props.$axis === "y"
        ? "border-right"
        : "border"}: 1px solid
    rgba(
      ${(props) =>
    props.$theme === "light"
      ? "255, 255, 255"
      : props.$theme === "dark"
        ? "0, 0, 0"
        : "100, 100, 100"},
      ${(props) => props.$alpha || 0.4}
    );
`;

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
const Divider = ({ theme, alpha, axis, height, className }) => (
  <StyledDivider
    role="separator"
    $theme={theme}
    $alpha={alpha}
    $axis={axis}
    height={height}
    className={className}
  />
);

export default Divider;
