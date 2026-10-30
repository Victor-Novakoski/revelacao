varying vec3 vWorld;
varying vec3 vNormal;
varying float vDepth;

void main() {
  vec2 p = position.xz;
  // Não passa da borda da bandeja (0,05 m).
  float h = min(liquidHeight(p), 0.045);
  vec2 grad = liquidGradient(p);
  vNormal = normalize(mat3(modelMatrix) * normalize(vec3(-grad.x, 1.0, -grad.y)));
  vec4 world = modelMatrix * vec4(p.x, h, p.y, 1.0);
  vWorld = world.xyz;
  vDepth = h - PAPER_Y;
  gl_Position = projectionMatrix * viewMatrix * world;
}
