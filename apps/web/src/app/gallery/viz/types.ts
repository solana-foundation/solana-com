import type React from "react";

/** The small contract shared by the stream renderer and its canvas host. */
export type VizControls = Record<string, unknown>;

export interface VizPointer {
  x: number;
  y: number;
  inside: boolean;
  clicked: boolean;
}

export type VizFrame = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  dt: number,
  pointer: VizPointer,
  controls: VizControls,
) => void;

export type VizQuality = "card" | "full";

export type VizComponent = (props: {
  quality: VizQuality;
}) => React.ReactElement | null;

export interface Viz {
  id: string;
  title: string;
  blurb: string;
  tags: string[];
  aspect?: number;
  controls?: Record<string, unknown>;
  span?: boolean;
  shader?: boolean;
  poster: number;
  create?: (quality: VizQuality) => VizFrame;
  Component?: VizComponent;
}
