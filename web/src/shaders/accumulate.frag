// Um passo da revelação: soma no mapa o quanto cada ponto do papel revelou.
// Onde o líquido não cobre, quase para. Onde o revelador está cansado
// (bandeja parada), revela manchado.
uniform sampler2D uPrev;
uniform float uStep;
uniform float uFresh;
uniform vec2 uPaper;

varying vec2 vUv;

void main() {
  vec2 p = vec2(vUv.x - 0.5, 0.5 - vUv.y) * uPaper;
  float depth = liquidHeight(p) - PAPER_Y;
  float covered = smoothstep(0.0, 0.0025, depth);
  float mottle = 0.3 + 1.4 * fbm(vUv * vec2(5.0, 3.8) + 7.0);
  float streak = 0.85 + 0.3 * valueNoise(vec2(vUv.x * 2.5, vUv.y * 14.0));
  float uneven = mottle * streak;
  float rate = (0.6 + 0.4 * covered) * mix(uneven, 1.0, uFresh);
  float prev = texture2D(uPrev, vUv).r;
  gl_FragColor = vec4(prev + uStep * rate, 0.0, 0.0, 1.0);
}
