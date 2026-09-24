/**
 * Twenty-one generative avatar systems. One seed string in, one 128x128 face out,
 * deterministic everywhere.
 *
 *   render(ctx, system, "agent://harbor-7")
 *
 * The seed is namespaced by system id, so the same agent gets a completely
 * unrelated (but equally stable) face under each system — you can switch the
 * house style without renaming anyone.
 */

import { S, finish, rng } from "./core";
import { System } from "./system";
import { marks } from "./marks";
import { matters } from "./matter";
import { fields } from "./fields";
import { beings } from "./beings";
import { patterns } from "./motif";

export * from "./core";
export type { System, Family } from "./system";

export const SYSTEMS: System[] = [
  ...marks,
  ...matters,
  ...fields,
  ...beings,
  ...patterns,
];
export const BY_ID = Object.fromEntries(
  SYSTEMS.map((s) => [s.id, s]),
) as Record<string, System>;

/** Draw into a context already scaled so that the 128-unit square fills it. */
export function render(
  ctx: CanvasRenderingContext2D,
  sys: System,
  seed: string,
  grain = true,
): string[] {
  const traits: string[] = [];
  ctx.save();
  ctx.clearRect(0, 0, S, S);
  ctx.beginPath();
  ctx.rect(0, 0, S, S);
  ctx.clip();
  try {
    sys.draw(ctx, rng(`${sys.id}::${seed}`), traits);
    if (grain && !sys.flat) finish(ctx, rng(`finish::${sys.id}::${seed}`));
  } catch (err) {
    // one unlucky seed in a generative system must not take the page with it
    console.error(`avatar: ${sys.id} failed on seed "${seed}"`, err);
    ctx.fillStyle = "#12151b";
    ctx.fillRect(0, 0, S, S);
  } finally {
    ctx.restore();
  }
  return traits;
}

/** An off-screen canvas at any pixel size — for exports and sprite sheets. */
export function renderToCanvas(
  sys: System,
  seed: string,
  px = 128,
  grain = true,
): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = px;
  cv.height = px;
  const ctx = cv.getContext("2d")!;
  ctx.setTransform(px / S, 0, 0, px / S, 0, 0);
  render(ctx, sys, seed, grain);
  return cv;
}

export function download(sys: System, seed: string, px = 512, grain = true) {
  const url = renderToCanvas(sys, seed, px, grain).toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sys.id}-${seed.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${px}.png`;
  a.click();
}
