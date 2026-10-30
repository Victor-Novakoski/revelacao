# Arquitetura

O jogo é um site estático. Tudo acontece no navegador. O Go trabalha antes, na máquina do dev e na CI, transformando renders em rolos prontos.

```
Blender (camadas de cada foto)
   └─> tools/revela  (Go: confere, gera negativo, comprime em WebP, monta rolos.json)
         └─> web/public/rolls/  ──deploy──>  Vercel (site estático)
                                                 └─> navegador: React + Three.js
```

## No navegador

- **React** cuida das telas: título, menus, mural, legendas. O 3D fica no `<Canvas>` do React Three Fiber.
- **Sala 3D** (`scenes/darkroom`): poucos objetos, a luz vermelha faz o trabalho. Pós-processamento com bloom, grão e vinheta.
- **Os três gestos:** ampliador (foco e tempo de luz), bandeja (balançar o revelador), varal (secar). Depois o mural com lupa.
- **Shader de revelação** (`shaders/develop.frag`, etapa 2): a densidade de cada ponto da foto cresce com o tempo no revelador e com a agitação, com grão e manchas. A foto é a soma de camadas (fundo, figura, detalhes); a camada da figura tem curva de revelação mais lenta, então só aparece quando você revela mais.
- **A bandeja** (etapa 2): o modelo fica em `game/develop.ts`, sem Three.js e com testes. Arrastar inclina a bandeja; o líquido é uma mola com pouco amortecimento que vai e volta. Agitar renova o revelador perto do papel: revela mais rápido e por igual. Parada, revela devagar e manchada.
- **Mapa de revelação** (`shaders/accumulate.frag`): uma textura float pequena (256x192) que cobre o papel, somada a cada quadro (duas texturas que se alternam). Cada ponto revela conforme está coberto pelo líquido, então inclinar demais deixa uma ponta para trás. Sem float para escrever, usa meia precisão e soma a cada 0,12 s. `shaders/surface.glsl` tem a altura do líquido, a mesma conta do modelo em TS, usada pelo papel, pelo líquido (`liquid.vert/frag`) e pelo mapa.
- **Estado** (`game/`): Zustand, com persistência local (dia atual, fotos reveladas, escolhas). O sorteio de onde a figura aparece é feito com semente salva, para ser estável entre visitas.
- **Som** (`audio/`, etapa 4): Tone.js e Web Audio. Rádio com filtro AM, mudança de velocidade, som 3D (HRTF) e reverb da sala. O Tone.js só é baixado no clique de "Abrir a loja", que cria o contexto de áudio dentro do gesto. Cada fonte (lâmpada, torneira, rádio) tem um `Panner3D` na mesma posição do objeto na sala (`scenes/darkroom/layout.ts`), e o ouvido acompanha a câmera. O som entra em 4 s; o mudo corta rápido e volta devagar. As legendas (`audio/captions.ts`) aparecem mesmo no mudo.

## A ferramenta `revela` (Go)

- `revela check <dir>`: confere cada rolo: ids (letras minúsculas, números e hífen, porque viram pasta e URL), camadas que existem e ficam dentro da pasta do rolo, nomes de camada sem repetir.
- `revela build [-j N] [-q Q] <dir> <out>`: converte cada camada para tons de cinza (transparência vira preto), gera o negativo da foto, comprime tudo em WebP e escreve `rolos.json` com tamanhos e hashes. Cada foto é um trabalho de um pool de goroutines (`internal/pool`), uma por CPU por padrão; a ordem do `rolos.json` não depende de quem termina antes.
- Roda na CI (`check` e `build`): um PR com foto quebrada não passa.

### Entrada: `art/rolls/<rolo>/roll.json`

```json
{
  "id": "praca",
  "title": "Domingo na praça",
  "photos": [
    { "id": "p1", "note": "o coreto", "layers": ["p1/scene.png", "p1/figure.png"] }
  ]
}
```

As camadas são PNG ou JPEG do mesmo tamanho. A primeira é a cena; as outras (a figura, detalhes) são máscaras claras sobre fundo preto ou transparente.

### Saída: `<out>/rolos.json` e `<out>/<rolo>/<foto>/<camada>.webp`

```json
{
  "version": 1,
  "rolls": [{
    "id": "praca", "title": "Domingo na praça",
    "photos": [{
      "id": "p1", "note": "o coreto", "width": 1280, "height": 960,
      "layers": [{ "name": "scene", "src": "praca/p1/scene.webp", "bytes": 81234, "sha256": "…" }],
      "negative": { "name": "negative", "src": "praca/p1/negative.webp", "bytes": 80012, "sha256": "…" }
    }]
  }]
}
```

`src` é relativo ao `rolos.json`. O jogo usa o hash para furar o cache quando a foto muda. O negativo sai só da cena: a figura nunca aparece no filme, só no papel revelado. O nome `negative` é reservado. O `rolos.json` é escrito por último e de uma vez, então um build que falha não deixa manifesto pela metade.

## Por que sem backend

Ver [DECISIONS.md](DECISIONS.md). Em resumo: spoiler e recados entre jogadores não valem a pena sem público, e hospedagem precisa ser grátis.
