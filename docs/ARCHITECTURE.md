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
- **Estado** (`game/`): Zustand, com persistência local (dia atual, fotos reveladas, escolhas). O sorteio de onde a figura aparece é feito com semente salva, para ser estável entre visitas.
- **Som** (`audio/`, etapa 4): Tone.js e Web Audio. Rádio com filtro AM, mudança de velocidade, som 3D (HRTF) e reverb da sala.

## A ferramenta `revela` (Go)

- `revela check <dir>`: confere se cada rolo tem `roll.json` e as camadas que ele cita.
- `revela build <dir> <out>` (etapa 3): converte para tons de cinza, gera o negativo, comprime em WebP e escreve `rolos.json` com tamanhos e hashes. Processa as fotos em paralelo com um pool de goroutines.
- Roda na CI: um PR com foto quebrada não passa.

## Por que sem backend

Ver [DECISIONS.md](DECISIONS.md). Em resumo: spoiler e recados entre jogadores não valem a pena sem público, e hospedagem precisa ser grátis.
