import React from "react";
import StyledRoundedCard from "./StyledRoundedCard";

type Shadow = "top" | "right" | "bottom" | "left";

function getDepthClipStyle(
  shadow: Shadow | undefined,
  bgColor: string | undefined,
  depthClipColor: string | undefined,
  $top: string | undefined,
  $bottom: string | undefined,
): React.CSSProperties {
  const color = depthClipColor ?? bgColor ?? "#14f195";
  const gradientDir =
    shadow === "top"
      ? "360deg"
      : shadow === "right"
        ? "90deg"
        : shadow === "bottom"
          ? "180deg"
          : "270deg";
  const base: React.CSSProperties = {
    position: "absolute",
    zIndex: -1,
    background: `linear-gradient(${gradientDir}, ${color} -5.71%, transparent 100%)`,
  };

  if (shadow === "top" || shadow === "bottom") {
    const heightCalc =
      $top && $bottom ? `calc(100% - ${$top} - ${$bottom})` : "2.5rem";
    return {
      ...base,
      height: heightCalc,
      width: "calc(100% - 0.5rem)",
      left: "0.25rem",
      right: "0.25rem",
      ...(shadow === "top"
        ? {
            bottom: "calc(100% - 0.5rem)",
            clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
          }
        : {
            top: "calc(100% - 0.5rem)",
            clipPath: "polygon(0% 0%, 5% 100%, 95% 100%, 100% 0)",
          }),
    };
  }

  if (shadow === "left" || shadow === "right") {
    const heightCalc =
      $top && $bottom
        ? `calc(100% - ${$top} - ${$bottom})`
        : "calc(100% - 0.5rem)";
    return {
      ...base,
      width: "2.5rem",
      height: heightCalc,
      top: $top ?? "0.25rem",
      bottom: $bottom ?? "0.25rem",
      ...(shadow === "left"
        ? {
            right: "calc(100% - 0.5rem)",
            clipPath: "polygon(0% 20%, 100% 0%, 100% 100%, 0% 80%)",
          }
        : {
            left: "calc(100% - 0.5rem)",
            clipPath: "polygon(0% 0%, 100% 20%, 100% 80%, 0% 100%)",
          }),
    };
  }

  return base;
}

/**
 * Renders a rounded card with a depth shadow
 *
 * @param {String}    bgColor           The card main color, fallbacks to #14f195 if missing
 * @param {String}    depthClipColor    The depth card shadow, fallbacks to bgColor if missing
 * @param {String}    color             The text color, fallbacks to #000 if missing
 * @param {String}    shadow            top|right|bottom|left depth shadow direction
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
}: {
  bgColor?: string;
  depthClipColor?: string;
  color?: string;
  shadow?: Shadow;
  children?: React.ReactNode;
  $top?: string;
  $bottom?: string;
  [key: string]: unknown;
}) => (
  <StyledRoundedCard bgColor={bgColor} color={color} shadow={shadow} {...props}>
    {children}
    <div
      className="depth-clip"
      style={getDepthClipStyle(shadow, bgColor, depthClipColor, $top, $bottom)}
    />
  </StyledRoundedCard>
);

export default RoundedDepthCard;
