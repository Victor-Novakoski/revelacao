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

// As camadas num ponto: x a cena, y a figura desenhada, z onde está a
// figura de foto real e w o tom dela vezes z (ver photos/real.ts).
vec4 sampleLayers(vec2 uv) {
  return vec4(texture2D(uPhoto, uv).r, texture2D(uFigure, uv).rgb);
}

// Fora de foco: média de um disco de amostras em volta do ponto.
vec4 sampleBlurred(vec2 uv) {
  if (uBlur < 0.01) return sampleLayers(uv);
  float r = uBlur * 0.02;
  vec4 sum = sampleLayers(uv);
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.785398;
    vec2 o = vec2(cos(a), sin(a) * 1.333) * r;
    sum += sampleLayers(uv + o);
    sum += sampleLayers(uv + o * 0.5);
  }
  return sum / 17.0;
}

// A mesma curva da cena, para um tom qualquer.
float silver(float gray, float induction) {
  return paperCurve(min(induction * pow(1.0 - gray, 1.1) * uExposure, 1.6));
}

void main() {
  float depth = liquidHeight(vP) - PAPER_Y;
  float wet = smoothstep(0.0, 0.002, depth);
  vec2 grad = liquidGradient(vP);
  vec2 uv = vUv + vec2(grad.x, -grad.y) * 0.01 * wet;

  float dev = sampleDev(uv);
  float induction = max(dev - 0.08, 0.0) / 0.92;

  vec4 layers = sampleBlurred(uv);
  float base = silver(layers.x, induction);

  float figure = layers.y * 0.85;
  float late = induction * smoothstep(0.75, 1.35, dev);
  float creature = paperCurve(figure * late);

  float density = 1.0 - (1.0 - base) * (1.0 - creature);
  if (layers.z > 0.0) {
    float tone = layers.w / layers.z;
    density = mix(density, silver(tone, induction), min(1.0, layers.z * late));
  }
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
