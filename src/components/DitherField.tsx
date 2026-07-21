import { useEffect, useRef } from "react";

/**
 * Two-tone animated Bayer-dither noise field, self-contained raw WebGL —
 * no three.js. Black ink on white paper. animate=false renders exactly one
 * static frame (reduced motion / previews).
 */
const VERT = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_pixel;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

float bayer4(vec2 cell) {
  vec2 m = floor(mod(cell, 4.0));
  int idx = int(m.x) + int(m.y) * 4;
  float b = 0.0;
  if (idx == 0) b = 0.0;  else if (idx == 1) b = 8.0;  else if (idx == 2) b = 2.0;  else if (idx == 3) b = 10.0;
  else if (idx == 4) b = 12.0; else if (idx == 5) b = 4.0;  else if (idx == 6) b = 14.0; else if (idx == 7) b = 6.0;
  else if (idx == 8) b = 3.0;  else if (idx == 9) b = 11.0; else if (idx == 10) b = 1.0; else if (idx == 11) b = 9.0;
  else if (idx == 12) b = 15.0; else if (idx == 13) b = 7.0; else if (idx == 14) b = 13.0; else b = 5.0;
  return (b + 0.5) / 16.0;
}

uniform vec3 u_ink;
uniform vec3 u_paper;

void main() {
  vec2 cell = floor(gl_FragCoord.xy / u_pixel);
  vec2 uv = (cell * u_pixel) / u_res;
  uv.x *= u_res.x / u_res.y;
  float v = fbm(uv * 3.0 + vec2(u_time * 0.06, u_time * 0.03));
  v = smoothstep(0.35, 0.75, v);
  float ink = step(bayer4(cell), v);
  gl_FragColor = vec4(mix(u_paper, u_ink, ink), 1.0);
}
`;

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

interface DitherFieldProps {
  animate?: boolean;
  pixelSize?: number; // CSS px per dither cell
  speed?: number;
  ink?: string;   // hex color of the dither dots
  paper?: string; // hex color of the field behind them
  className?: string;
}

export default function DitherField({ animate = true, pixelSize = 2.5, speed = 1, ink = "#000000", paper = "#FFFFFF", className = "" }: DitherFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) return; // graceful degradation: section textures carry the hero

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
      return shader;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uPixel = gl.getUniformLocation(program, "u_pixel");
    gl.uniform3fv(gl.getUniformLocation(program, "u_ink"), hexToRgb(ink));
    gl.uniform3fv(gl.getUniformLocation(program, "u_paper"), hexToRgb(paper));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = canvas.clientWidth; const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uPixel, Math.max(1, Math.round(pixelSize * dpr)));
    };

    const start = performance.now();
    const draw = () => {
      gl.uniform1f(uTime, ((performance.now() - start) / 1000) * speed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0; let timer = 0; let running = false;
    let inView = true; let pageVisible = !document.hidden;

    const loop = () => {
      draw();
      // ponytail: 30fps cap via setTimeout+rAF; it's a texture, not a game
      timer = window.setTimeout(() => { raf = requestAnimationFrame(loop); }, 1000 / 30);
    };
    const syncLoop = () => {
      const shouldRun = animate && inView && pageVisible;
      if (shouldRun && !running) { running = true; loop(); }
      if (!shouldRun && running) { running = false; clearTimeout(timer); cancelAnimationFrame(raf); }
    };

    resize();
    draw(); // always paint at least one frame

    const ro = new ResizeObserver(() => { resize(); if (!running) draw(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncLoop(); });
    io.observe(canvas);
    const onVis = () => { pageVisible = !document.hidden; syncLoop(); };
    document.addEventListener("visibilitychange", onVis);
    syncLoop();

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [animate, pixelSize, speed, ink, paper]);

  return <canvas ref={canvasRef} aria-hidden className={`block h-full w-full ${className}`} />;
}
