import type { CSSProperties, ComponentType } from "react";

export interface PixelBlastProps {
  variant?: "square" | "circle" | "triangle" | "diamond";
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  antialias?: boolean;
  patternScale?: number;
  patternDensity?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  liquidWobbleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
  noiseAmount?: number;
  /** Element to read pointer input from. Unused while ripples/liquid are off. */
  eventTarget?: HTMLElement | null;
}

declare const PixelBlast: ComponentType<PixelBlastProps>;
export default PixelBlast;
