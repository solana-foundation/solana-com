/**
 * A CSS cubic-bezier() curve as a function of progress (0 to 1), for motion
 * that is stepped by hand in requestAnimationFrame.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (t: number, a: number, b: number) =>
    (((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t + 3 * a) * t;
  const slope = (t: number, a: number, b: number) =>
    3 * (1 - 3 * b + 3 * a) * t * t + 2 * (3 * b - 6 * a) * t + 3 * a;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    // Newton's method finds the curve parameter for x; bisection takes over
    // where the curve is too flat for it.
    let t = x;
    for (let i = 0; i < 8; i++) {
      const s = slope(t, x1, x2);
      if (Math.abs(s) < 1e-6) break;
      t -= (at(t, x1, x2) - x) / s;
    }
    if (!(t >= 0 && t <= 1) || Math.abs(at(t, x1, x2) - x) > 1e-5) {
      let lo = 0;
      let hi = 1;
      for (let i = 0; i < 24; i++) {
        t = (lo + hi) / 2;
        if (at(t, x1, x2) < x) lo = t;
        else hi = t;
      }
    }
    return at(t, y1, y2);
  };
}
