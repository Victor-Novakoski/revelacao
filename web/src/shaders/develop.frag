// O papel na bandeja. A densidade de prata cresce com o quanto cada ponto
// revelou (mapa uDev). A figura tem curva mais lenta: só aparece quando
// você deixa a foto mais tempo no revelador.
uniform sampler2D uPhoto;
uniform sampler2D uFigure;
uniform sampler2D uDev;
uniform vec2 uDevSize;
uniform vec3 uTint;
uniform float uLight;
// Luz no ampliador (1 = no ponto) e o quanto a projeção ficou fora de foco.
uniform float uExposure;
uniform float uBlur;

varying vec2 vUv;
varying vec2 vP;

// Curva do papel: sobe rápido e amacia perto do preto.
float paperCurve(float x) {
  return (1.0 - exp(-1.6 * x)) / (1.0 - exp(-1.6));
}

// O mapa é float sem filtro (nem todo celular filtra float), então a
// interpolação é feita aqui.
float sampleDev(vec2 uv) {
  vec2 t = uv * uDevSize - 0.5;
  vec2 i = floor(t);
  vec2 f = t - i;
  vec2 px = 1.0 / uDevSize;
  vec2 c = (i + 0.5) * px;
  float a = texture2D(uDev, c).r;
  float b = texture2D(uDev, c + vec2(px.x, 0.0)).r;
  float d = texture2D(uDev, c + vec2(0.0, px.y)).r;
  float e = texture2D(uDev, c + px).r;
  return mix(mix(a, b, f.x), mix(d, e, f.x), f.y);
}

// Fora de foco: média de um disco de amostras em volta do ponto.
vec2 sampleBlurred(vec2 uv) {
  if (uBlur < 0.01) return vec2(texture2D(uPhoto, uv).r, texture2D(uFigure, uv).r);
  float r = uBlur * 0.02;
  vec2 sum = vec2(texture2D(uPhoto, uv).r, texture2D(uFigure, uv).r);
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.785398;
    vec2 o = vec2(cos(a), sin(a) * 1.333) * r;
    sum += vec2(texture2D(uPhoto, uv + o).r, texture2D(uFigure, uv + o).r);
    sum += vec2(texture2D(uPhoto, uv + o * 0.5).r, texture2D(uFigure, uv + o * 0.5).r);
  }
  return sum / 17.0;
}

void main() {
  float depth = liquidHeight(vP) - PAPER_Y;
  float wet = smoothstep(0.0, 0.002, depth);
  vec2 grad = liquidGradient(vP);
  vec2 uv = vUv + vec2(grad.x, -grad.y) * 0.01 * wet;

  float dev = sampleDev(uv);
  float induction = max(dev - 0.08, 0.0) / 0.92;

  vec2 layers = sampleBlurred(uv);
  float exposure = pow(1.0 - layers.x, 1.1);
  float base = paperCurve(min(induction * exposure * uExposure, 1.6));

  float figure = layers.y * 0.85;
  float late = induction * smoothstep(0.75, 1.35, dev);
  float creature = paperCurve(figure * late);

  float density = 1.0 - (1.0 - base) * (1.0 - creature);
  density += 0.35 * pow(max(dev * uExposure - 1.15, 0.0), 1.3);

  // Grão parado, mais forte nos meios-tons. Não treme.
  float grain = hash(floor(vUv * vec2(1400.0, 1050.0)));
  density *= 1.0 + (grain - 0.5) * 0.22 * smoothstep(0.0, 0.3, density) * (1.0 - density * 0.5);
  density = clamp(density, 0.0, 1.0);

  vec3 color = uTint * uLight * (1.0 - 0.94 * density);
  color *= mix(1.0, 0.8, wet);
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
