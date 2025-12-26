import styled from "styled-components";
import StyledRoundedCard from "./StyledRoundedCard";

// The border radius is 1rem,
// therefore the computations below are needed to position the depth shadow accordingly
const StyledDepthClip = styled.div`
  position: absolute;
  z-index: -1;

  ${(props) =>
    props.$shadow === "top" || props.$shadow === "bottom"
      ? `height: 2.5rem;
        width: calc(100% - 0.5rem);
        left: 0.25rem;
        right: 0.25rem;

        ${
          props.$shadow === "top"
            ? `bottom: calc(100% - 0.5rem);
              clip-path: polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%);`
            : props.$shadow === "bottom"
              ? `top: calc(100% - 0.5rem);
              clip-path: polygon(0% 0%, 5% 100%, 95% 100%, 100% 0);`
              : ``
        }
       `
      : props.$shadow === "left" || props.$shadow === "right"
        ? `width: 2.5rem;
        height: calc(100% - ${
          props.$top && props.$bottom
            ? `${props.$top} - ${props.$bottom}`
            : `0.5rem`
        });
        top: ${props.$top ? props.$top : `0.25rem`};
        bottom: ${props.$bottom ? props.$bottom : `0.25rem`};

        ${
          props.$shadow === "left"
            ? `right: calc(100% - 0.5rem);
              clip-path: polygon(0% 20%, 100% 0%, 100% 100%, 0% 80%);`
            : props.$shadow === "right"
              ? `left: calc(100% - 0.5rem);
            clip-path: polygon(0% 0%, 100% 20%, 100% 80%, 0% 100%);`
              : ``
        }
        `
        : ``}

  background: linear-gradient(
    ${(props) =>
    props.$shadow === "top"
      ? "360deg"
      : props.$shadow === "right"
        ? "90deg"
        : props.$shadow === "bottom"
          ? "180deg"
          : "270deg"},
    ${(props) => props.depthClipColor || props.$bgColor || `#14f195`} -5.71%,
    transparent 100%
  );

  @media (min-width: 768px) {
    ${(props) =>
      props.$shadow === "top" || props.$shadow === "bottom"
        ? `height: 4rem;`
        : props.$shadow === "left" || props.$shadow === "right"
          ? `width: 4rem;`
          : ``}
  }
`;

/**
 * Renders a rounded card with a depth shadow
 *
 * @param {String}    bgColor           The card main color, fallbacks to
 *   #14f195 if missing
 * @param {String}    depthClipColor    The depth card shadow, fallbacks to
 *   bgColor if missing
 * @param {String}    color             The text color, fallbacks to #000 if
 *   missing
 * @param {String}    shadow            top|right|bottom|left depth shadow
 *   direction
 * @param children
 * @param $top
 * @param $bottom
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */

const RoundedDepthCard = ({
  bgColor,
  depthClipColor,
  color,
  shadow,
  children,
  $top,
  $bottom,
  ...props
}) => (
  <StyledRoundedCard bgColor={bgColor} color={color} shadow={shadow} {...props}>
    {children}
    <StyledDepthClip
      $bgColor={bgColor}
      $shadow={shadow}
      depthClipColor={depthClipColor}
      $top={$top}
      $bottom={$bottom}
      className="depth-clip"
    />
  </StyledRoundedCard>
);

export default RoundedDepthCard;
