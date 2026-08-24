"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
out float vFilled;
out float vScan;

void main() {
  float id = float(gl_VertexID);
  float lane = mod(id, 1000.0);
  float payment = floor(id / 1000.0);
  float second = fract(uTime);
  float progress = payment / 999.0;
  float angle = (lane / 1000.0) * 6.28318530718 + uTime * 0.13;
  float radius = sqrt(progress) * 0.88;
  vec2 position = vec2(cos(angle), sin(angle)) * radius;
  position.x *= uResolution.y / uResolution.x;
  vFilled = step(progress, second);
  vScan = 1.0 - smoothstep(0.0, 0.008, abs(progress - second));
  gl_Position = vec4(position, 0.0, 1.0);
  gl_PointSize = max(1.0, min(uResolution.x, uResolution.y) / 1000.0 * 1.35);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in float vFilled;
in float vScan;
out vec4 outColor;

void main() {
  vec3 idle = vec3(0.035, 0.055, 0.05);
  vec3 paid = vec3(0.08, 0.95, 0.58);
  vec3 scan = vec3(0.92, 1.0, 0.94);
  vec3 color = mix(idle, paid, vFilled);
  color = mix(color, scan, vScan);
  outColor = vec4(color, 1.0);
}`;

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export function MillionPaymentCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    // WebGL2 implementations can require a VAO even when every vertex is
    // generated from gl_VertexID. Bind one explicitly to avoid a blank canvas
    // on drivers that reject drawArrays without it.
    const vertexArray = gl.createVertexArray();
    if (!vertexArray) return;
    gl.bindVertexArray(vertexArray);

    const timeLocation = gl.getUniformLocation(program, "uTime");
    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    let visible = true;

    const render = (now: number) => {
      frame = 0;
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width * ratio));
      const height = Math.max(1, Math.floor(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.useProgram(program);
      gl.uniform1f(timeLocation, now / 1000);
      gl.uniform2f(resolutionLocation, width, height);
      gl.clearColor(0.02, 0.025, 0.025, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, 1_000_000);
      if (countRef.current) {
        countRef.current.textContent = Math.floor(
          ((now / 1000) % 1) * 1_000_000,
        ).toLocaleString();
      }
      if (!reducedMotion && visible) frame = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reducedMotion && !frame)
        frame = requestAnimationFrame(render);
    });
    observer.observe(canvas);
    render(performance.now());

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteVertexArray(vertexArray);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-label="One million logical payment cells rendered per second"
        className="absolute inset-0 z-0 block size-full"
      />
      <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center px-5 text-center sm:px-7">
        <div className="border border-nd-border-prominent bg-black/90 px-5 py-4 sm:px-7">
          <span
            ref={countRef}
            className="font-brand-mono text-5xl tabular-nums text-nd-highlight-lime sm:text-7xl"
          >
            0
          </span>
          <p className="mt-2 font-brand-mono text-xs uppercase text-nd-mid-em-text">
            logical payments completed this second
          </p>
        </div>
      </div>
    </>
  );
}
