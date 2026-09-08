import type { Rng } from "./core";

export type Family = "mark" | "matter" | "field" | "being" | "pattern";

export interface System {
  id: string;
  name: string;
  /** what the system is actually doing — one line, no adjectives if avoidable */
  blurb: string;
  family: Family;
  /** flat systems opt out of the shared grain and vignette — it would only muddy them */
  flat?: boolean;
  /**
   * Draw one avatar into the 128x128 unit square. `out` collects the traits the
   * system rolled, so the page can show what makes this particular combination
   * the one it is.
   */
  draw(ctx: CanvasRenderingContext2D, r: Rng, out: string[]): void;
}
