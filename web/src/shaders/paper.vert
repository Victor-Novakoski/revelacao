varying vec2 vUv;
varying vec2 vP;

void main() {
  vUv = uv;
  vP = position.xz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
