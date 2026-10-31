# AGENTS.md

Guia para quem (pessoa ou IA) for mexer neste repositório. Leia antes de começar.

## O projeto

**Revelação** é um jogo de terror de tensão no navegador. Você é o revelador de fotos da Foto Íris, em São Paulo, 1957. Uma câmera quebrada chega à loja e, a partir dela, uma figura aparece nas suas fotos, cada vez mais perto. Nada de susto com barulho alto: o medo vem do ambiente.

É um projeto de portfólio do Victor Novakoski (dev full stack, Go + React). O objetivo é mostrar criatividade e acabamento, com a stack real dele.

- História: [docs/STORY.md](docs/STORY.md)
- Arquitetura: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Etapas e tarefas: [docs/ROADMAP.md](docs/ROADMAP.md)
- Decisões e o porquê: [docs/DECISIONS.md](docs/DECISIONS.md)
- Arte e som: [docs/ART_AND_AUDIO.md](docs/ART_AND_AUDIO.md)

## Stack

- `web/`: o jogo. Vite + React + TypeScript, Three.js com React Three Fiber, drei e postprocessing, Zustand, Tone.js (a partir da etapa de som). Site estático, sem backend.
- `tools/revela/`: CLI em Go que prepara as fotos (camadas, negativo, WebP, `rolos.json`). Roda no PC e na CI, nunca em produção.
- Deploy: Vercel (plano Hobby), só o `web/`.

## Comandos

```bash
# jogo
cd web
npm ci
npm run dev        # servidor local
npm run lint       # oxlint
npm test           # vitest
npm run build      # checagem de tipos + build

# ferramenta das fotos
cd tools/revela
go test ./...
go run ./cmd/revela check ../../art/rolls
go run ./cmd/revela build ../../art/rolls ../../web/public/rolls
```

## Regras do repositório

- Branch principal de trabalho: `develop`. Todo PR vai para a `develop`, nunca para a `main`.
- Commits com a identidade do Victor (`Victor-Novakoski`). Sem trailer `Co-Authored-By` de IA, sem link de sessão, sem assinatura de IA.
- Um commit por tarefa, com lint, testes e build passando entre eles.
- Textos do jogo em português do Brasil. Código, nomes de arquivo e identificadores em inglês.
- Não adicione backend, banco ou serviço pago. O jogo é 100% front (ver DECISIONS.md).

## Regras do jogo (não quebrar)

- **A criatura só existe nas fotografias.** Nunca aparece na sala 3D, nunca se mexe na tela, só muda de uma foto para a outra.
- **A criatura fica sempre meio escondida:** atrás de gente, de uma árvore, de um carro, ou cortada pela beirada da foto. Nunca solta no meio do quadro, de frente, como se flutuasse.
- **Sem jumpscare.** Nenhum som alto de repente, nenhuma imagem que salta. Volume sobe devagar; silêncio repentino é permitido.
- **Movimento reduzido:** com `prefers-reduced-motion`, a lâmpada não pisca, a câmera não balança e nada treme. O jogo continua completo.
- **Som só depois de um gesto** do jogador, com botão de mudo sempre visível. Todo som que importa para a história tem legenda.
- **Saída direta:** sempre existe um jeito de ver as fotos sem jogar ("Ver as fotos sem revelar").
- Celular é cidadão de primeira: testar a 390 px, alvos de toque de 44 px, `dpr` limitado a 2.
- **Licenças:** só arte e som próprios, em domínio público verificado ou CC0. Nada de música gerada por IA. Registrar a origem de cada arquivo em `docs/ART_AND_AUDIO.md`.

## Estrutura

```
web/src/
  scenes/darkroom/   a sala 3D
  scenes/wall/       o mural de fotos (etapa 5)
  shaders/           develop.frag, liquid.frag (etapa 2)
  game/              estado (Zustand), regras dos dias e rolos
  audio/             Tone.js (etapa 4)
  ui/                telas, menus e legendas
tools/revela/        a CLI em Go
art/                 Blender e camadas renderizadas (entrada da CLI)
docs/                história, arquitetura, roadmap, decisões
```
