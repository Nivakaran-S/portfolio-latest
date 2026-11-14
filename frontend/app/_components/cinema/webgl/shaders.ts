/** Drifting dust and embers with depth-of-field bokeh. */
export const HERO_POINTS_VERT = /* glsl */ `
uniform float uTime;
uniform float uFocus;
uniform float uPixelRatio;
attribute float aSeed;
varying float vAlpha;
varying float vHeat;
void main() {
  vec3 p = position;
  p.y = mod(position.y + 5.0 + uTime * (0.15 + aSeed * 0.3), 10.0) - 5.0;
  p.x += sin(uTime * 0.2 + aSeed * 40.0) * 0.35;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = max(-mv.z, 0.01);
  float coc = abs(dist - uFocus);
  gl_PointSize = (1.5 + coc * 3.0 + aSeed * 3.0) * uPixelRatio * (8.0 / max(dist, 0.5));
  vAlpha = clamp(1.0 / (1.0 + coc * 0.6), 0.08, 1.0) * smoothstep(0.0, 2.0, dist);
  vHeat = aSeed;
  gl_Position = projectionMatrix * mv;
}
`;

export const HERO_POINTS_FRAG = /* glsl */ `
varying float vAlpha;
varying float vHeat;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float disc = smoothstep(0.5, 0.35, d);
  vec3 col = mix(vec3(0.85, 0.45, 0.05), vec3(1.0, 0.78, 0.25), vHeat);
  gl_FragColor = vec4(col, disc * vAlpha * 0.55);
}
`;

/** Volumetric light cone falling from above and behind the portrait. */
export const RAYS_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const RAYS_FRAG = /* glsl */ `
uniform float uTime;
uniform float uProgress;
varying vec2 vUv;
void main() {
  vec2 d = vUv - vec2(0.5, 1.05);
  float ang = atan(d.x, -d.y);
  float r = length(d);
  float cone = smoothstep(0.65, 0.0, abs(ang));
  float fall = smoothstep(1.25, 0.0, r);
  float rays = 0.5 + 0.5 * sin(ang * 14.0 + uTime * 0.15) * sin(ang * 5.0 - uTime * 0.07);
  float a = cone * fall * (0.55 + 0.45 * rays) * 0.32 * (1.0 - uProgress * 0.8);
  gl_FragColor = vec4(vec3(1.0, 0.72, 0.22) * a, a);
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
  vec3 col = mix(vec3(1.0, 0.55, 0.1), vec3(1.0, 0.9, 0.6), vAlpha);
  gl_FragColor = vec4(col, vAlpha);
}
`;
