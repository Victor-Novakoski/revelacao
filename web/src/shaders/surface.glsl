// A superfície do revelador, no espaço da bandeja (metros, x e z).
// Mesma conta de game/develop.ts (liquidDepth), mais as ondinhas.
uniform vec2 uSlope;
uniform float uRipple;
uniform float uTime;

const float LIQUID_BASE = 0.012;
const float PAPER_Y = 0.0015;

float liquidHeight(vec2 p) {
  float w = sin(p.x * 38.0 - uTime * 5.1 + sin(p.y * 21.0)) * 0.6
          + sin(p.y * 47.0 + uTime * 4.3 + p.x * 12.0) * 0.4
          + sin((p.x + p.y) * 63.0 - uTime * 6.7) * 0.25;
  return LIQUID_BASE + dot(uSlope, p) + uRipple * 0.0022 * w;
}

vec2 liquidGradient(vec2 p) {
  vec2 e = vec2(0.002, 0.0);
  return vec2(
    liquidHeight(p + e.xy) - liquidHeight(p - e.xy),
    liquidHeight(p + e.yx) - liquidHeight(p - e.yx)
  ) / (2.0 * e.x);
}
