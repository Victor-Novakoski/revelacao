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
- **Sala 3D** (`scenes/darkroom`): poucos objetos, a luz vermelha faz o trabalho. Pós-processamento com bloom, grão e vinheta. As posições das peças que fazem som ficam em `layout.ts`. Duas lâmpadas de segurança: a do teto, que faz sombra e zumbe, e uma fraca sobre o ampliador. Nada na sala se mexe sozinho além da lâmpada.
- **Os três gestos:** ampliador (foco e tempo de luz), bandeja (balançar o revelador), varal (secar). Depois o mural com lupa.
- **Shader de revelação** (`shaders/develop.frag`, etapa 2): a densidade de cada ponto da foto cresce com o tempo no revelador e com a agitação, com grão e manchas. A foto é a soma de camadas (fundo, figura, detalhes); a camada da figura tem curva de revelação mais lenta, então só aparece quando você revela mais.
- **A bandeja** (etapa 2): o modelo fica em `game/develop.ts`, sem Three.js e com testes. Arrastar inclina a bandeja; o líquido é uma mola com pouco amortecimento que vai e volta. Agitar renova o revelador perto do papel: revela mais rápido e por igual. Parada, revela devagar e manchada.
- **Mapa de revelação** (`shaders/accumulate.frag`): uma textura float pequena (256x192) que cobre o papel, somada a cada quadro (duas texturas que se alternam). Cada ponto revela conforme está coberto pelo líquido, então inclinar demais deixa uma ponta para trás. Sem float para escrever, usa meia precisão e soma a cada 0,12 s. `shaders/surface.glsl` tem a altura do líquido, a mesma conta do modelo em TS, usada pelo papel, pelo líquido (`liquid.vert/frag`) e pelo mapa.
- **Estado** (`game/`): Zustand, com persistência local (dia atual, fotos reveladas, escolhas). O sorteio de onde a figura aparece é feito com semente salva, para ser estável entre visitas.
- **O dia** (etapa 5): o roteiro de cada dia é dado puro em `game/days/` (formato em `game/script.ts`): conversas no balcão, rolos, mural, entregas e o fim. `game/day.ts` anda pelo roteiro com um cursor (passo, fala ou foto, e o gesto da foto: ampliador, bandeja, varal) e tem as contas do ampliador (foco vira desfoque, segundos de luz viram um fator que multiplica a densidade) e da qualidade da cópia. O tom da cópia é revelação vezes luz; a figura depende só do tempo no revelador. `game/store.ts` guarda no navegador o cursor, as cópias, as anotações e os achados da lupa; a tela que aparece (`viewOf`) sai do cursor.
- **A história** (etapa 6): dez dias em `game/days/`, com atalhos em `days/lines.ts`. Dois passos novos no roteiro: `burn` (o rolo queimado, um gesto por botão, com fogo na tela) e `choice` (os três finais; o escolhido fica em `ending` no estado e decide as falas e o cartão do fim). No fim de cada dia, `nextDay` abre a loja no dia seguinte; as cópias ficam guardadas pelo id do rolo, que é único no jogo. Uma fala pode ter um `cue` de som (telefone, linha, rangido, fósforo, silêncio), sempre com legenda. O rádio desafina enquanto a figura surge na bandeja e a valsa ganha a nota errada no último dia. "Ver as fotos sem revelar" tem um botão por dia.
- **O tanque** (etapa 7): o passo `tank` do roteiro. A tela apaga de vez (a sala para de desenhar e a lâmpada para de zumbir), e o jogador abre o chassi, segura o botão para enrolar o filme na espiral (`reel` em `game/day.ts`; soltar pausa, não perde) e fecha a tampa. Cada dente da espiral é um estalo baixinho e, no celular, uma vibração curta; tudo com legenda. Segurar funciona com mouse, dedo e com Espaço ou Enter.
- **Carregamento:** `App.tsx` carrega a sala com `React.lazy`. O título aparece com React e o jogo (~105 kB gzip), e o Three.js chega num pedaço próprio enquanto o jogador lê. O Tone.js já vinha só no clique.
- **Movimento reduzido e celular fraco:** com `prefers-reduced-motion`, a lâmpada fica parada, a câmera corta de um lugar para o outro em vez de voar, o grão animado sai e o líquido da bandeja não ondula. Um `PerformanceMonitor` (drei) baixa o `dpr` para 1 quando os quadros caem. Se a sala não carregar (sem WebGL), `SceneBoundary` some com ela e o resto do jogo continua.
- **As fotos** (`photos/`): enquanto as do Blender não chegam, cada foto é desenhada em código numa folha de 480x360, com a margem branca do papel e o quadro do filme (3:2 no 35 mm, quadrado no 120). O rolo do Vilela (dias 2 e 6), o piquenique da Dona Cida e as normalistas da Marlene (dia 3), o casamento no Cambuci e a rota do Elias (dia 4), os retratos do estúdio (dia 5), a comunhão da Lúcia (dia 7), o quintal da Dona Cida, o casamento na Mooca e a livraria da Senhorita Amanda (dia 9) e os retratos do Seu Augusto no rolo sem nome (dia 10) usam fotos reais em domínio público ou CC0 (`photos/real.ts`, origem em `art/real/`), baixadas antes da sala abrir; a figura nelas é um homem recortado de foto, com tom próprio. Em algumas, uma máscara das pessoas da cena (`<cena>-frente.png`) o deixa atrás delas, em vez de colado por cima. Na camada da figura, o vermelho é a figura desenhada (só escurece) e o verde e o azul são a de foto (onde ela está e o tom dela), então o rosto pode sair mais claro que o fundo. A conta é a mesma no shader e em `printDensity`. As camadas vão para o shader da bandeja; a cópia seca (para o varal e o mural) é calculada no processador com a mesma conta do shader (`game/print.ts`). O varal recebe a cópia sem a camada da figura: a sala nunca mostra a criatura.
- **O mural** (`ui/Wall.tsx`): React, por cima da sala escurecida. A lupa amplia 2,6x onde passa o mouse, o dedo (com a lente acima do dedo) ou as setas. Cada foto tem detalhes pequenos (`details` no roteiro) que a lupa acha e anota no verso, ao lado das anotações do jogador.
- **Som** (`audio/`, etapa 4): Tone.js e Web Audio. Rádio com filtro AM, mudança de velocidade, som 3D (HRTF) e reverb da sala. O Tone.js só é baixado no clique de "Abrir a loja", que cria o contexto de áudio dentro do gesto. Cada fonte (lâmpada, torneira, rádio) tem um `Panner3D` na mesma posição do objeto na sala (`scenes/darkroom/layout.ts`), e o ouvido acompanha a câmera. O som entra em 4 s; o mudo corta rápido e volta devagar. As legendas (`audio/captions.ts`) aparecem mesmo no mudo.

## A ferramenta `revela` (Go)

- `revela check <dir>`: confere cada rolo: ids (letras minúsculas, números e hífen, porque viram pasta e URL), camadas que existem e ficam dentro da pasta do rolo, nomes de camada sem repetir.
- `revela build [-j N] [-q Q] <dir> <out>`: converte cada camada para tons de cinza (transparência vira preto), gera o negativo da foto, comprime tudo em WebP e escreve `rolos.json` com tamanhos e hashes. Cada foto é um trabalho de um pool de goroutines (`internal/pool`), uma por CPU por padrão; a ordem do `rolos.json` não depende de quem termina antes.
- `revela age [-seed N] <foto> <saída.png>`: envelhece uma foto de hoje ou de arquivo para parecer uma cópia de balcão de 1957 (lente mole, halo nas luzes, preto levantado, vinheta, grão, poeira e riscos), para conferir o resultado. No `build`, `"age": true` na foto do `roll.json` aplica o mesmo filtro só na cena (a primeira camada); a figura entra limpa. A semente sai do id do rolo e da foto, então o build continua reproduzível.
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
