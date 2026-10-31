// A superfície do revelador: quase transparente, só o brilho da lâmpada
// vermelha correndo nas ondas.
uniform vec3 uLightPos;
uniform float uLight;

varying vec3 vWorld;
varying vec3 vNormal;
varying float vDepth;

void main() {
  vec3 n = normalize(vNormal);
  vec3 view = normalize(cameraPosition - vWorld);
  vec3 light = normalize(uLightPos - vWorld);
  float spec = pow(max(dot(reflect(-light, n), view), 0.0), 220.0);
  float fresnel = pow(1.0 - max(dot(n, view), 0.0), 4.0);
  float edge = smoothstep(0.0, 0.0015, vDepth);

  vec3 color = vec3(0.05, 0.012, 0.008) + vec3(1.0, 0.22, 0.15) * (spec * 0.7 + fresnel * 0.2) * uLight;
  float alpha = (0.2 + spec * 0.5 + fresnel * 0.25) * edge;
  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
