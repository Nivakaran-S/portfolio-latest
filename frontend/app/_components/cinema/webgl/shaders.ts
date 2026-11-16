/**
 * Palette: dark steel, arc-reactor cyan, white-hot cores, orange heat.
 * Every shape is hard-edged: no soft bokeh, no glitter.
 */

export const FULLSCREEN_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * The arc-reactor behind the portrait: a cyan core, a halo, a hard horizontal
 * anamorphic streak, and the ignition blast (white flash + expanding shockwave).
 */
export const REACTOR_FRAG = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uIgnite;
uniform float uAspect;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - vec2(0.5, 0.40)) * vec2(uAspect, 1.0);
  float r = length(p);
  float pulse = 0.85 + 0.15 * sin(uTime * 1.7);
  vec3 cyan = vec3(0.30, 0.80, 1.0);

  float core = exp(-r * 5.5);
  float halo = exp(-r * 2.2) * 0.35;
  float streak = exp(-abs(p.y) * 90.0) * exp(-abs(p.x) * 0.9);
  vec3 col = (cyan * (core * 0.9 + halo) + vec3(0.7, 0.95, 1.0) * streak * 0.9) * pulse;

  float k = 1.0 - uIgnite;
  float flash = pow(k, 3.0) * exp(-r * 2.0);
  float ring = smoothstep(0.045, 0.0, abs(r - uIgnite * 1.8)) * pow(k, 1.2);
  col += vec3(1.0, 0.97, 0.9) * flash * 1.4 + cyan * ring * 1.2;

  col *= 1.0 - uProgress * 0.85;
  float a = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}
`;

/** Light streaks rushing at the camera. Each segment has a tail (aEnd = 0) and head (aEnd = 1). */
export const WARP_VERT = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
uniform float uProgress;
attribute float aSeed;
attribute float aEnd;
attribute float aAngle;
attribute float aRadius;
varying float vAlpha;
void main() {
  float speed = 12.0 + aSeed * 18.0;
  float z = mod(aSeed * 60.0 + uProgress * speed * 6.0 + uTime * speed * 0.15 * uIntensity, 60.0) - 55.0;
  float len = 0.4 + uIntensity * 6.0 * (0.3 + aSeed);
  z += aEnd * len;
  vec3 p = vec3(cos(aAngle) * aRadius, sin(aAngle) * aRadius, z);
  vAlpha = uIntensity * aEnd * smoothstep(-55.0, -20.0, z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const WARP_FRAG = /* glsl */ `
varying float vAlpha;
void main() {
  vec3 col = mix(vec3(0.25, 0.62, 1.0), vec3(0.95, 0.98, 1.0), vAlpha);
  gl_FragColor = vec4(col, vAlpha);
}
`;

/** The warp's landing: a white-cyan flash and a shockwave ring sweeping outward. */
export const IMPACT_FRAG = /* glsl */ `
uniform float uFlash;
uniform float uRing;
uniform float uAspect;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - vec2(0.5)) * vec2(uAspect, 1.0);
  float r = length(p);
  float flash = uFlash * exp(-r * 2.4);
  float ring = smoothstep(0.05, 0.0, abs(r - uRing * 1.9)) * (1.0 - uRing) * step(0.0001, uRing);
  vec3 col = vec3(0.92, 0.97, 1.0) * flash * 1.3 + vec3(0.3, 0.8, 1.0) * ring * 1.2;
  float a = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}
`;
