# Roadmap

A meta da primeira entrega é uma foto revelada que já dê arrepio. Só depois vem o resto.

## Etapa 1 · Fundação
- [x] Repo com `main` e `develop`
- [x] `web/` com Vite + React + TS + Three.js e uma cena de abertura
- [x] `tools/revela` com `check` e testes
- [x] CI (lint, testes, build, Go)
- [x] AGENTS.md e docs
- [ ] Conectar o repo na Vercel (feito pelo Victor no painel)

## Etapa 2 · A revelação (fatia vertical)
- [x] Uma bandeja e uma foto de teste
- [x] Shader de revelação: densidade por tempo e agitação, grão
- [x] Gesto de balançar a bandeja (mouse e toque), líquido reagindo
- [ ] Critério: balançar e ver a imagem surgir tem que ser gostoso (validar jogando)

## Etapa 3 · A ferramenta das fotos
- [x] `revela build`: tons de cinza, negativo, WebP, `rolos.json`
- [x] Pool de goroutines e testes
- [x] CLI na CI

## Etapa 4 · A sala
- [x] Câmara escura 3D completa, ampliador e varal
- [x] Som ambiente: lâmpada, gotas, rádio (Tone.js), botão de mudo, legendas

## Etapa 5 · O primeiro dia
- [x] Clientes fixos, mural com lupa, anotações
- [x] Um dia jogável do começo ao fim
- [ ] Critério: o dia 1 ensina os três gestos sem precisar ler manual (validar jogando)

## Etapa 6 · A história completa
- [x] Todos os dias do roteiro (docs/STORY.md)
- [x] Os três finais
- [ ] Critério: jogar os dez dias de uma vez e ver se a calmaria dos dias 7 e 8 dura o bastante (validar jogando)

## Etapa 7 · Polimento e lançamento
- [x] O tanque no escuro total (dias 1, 2 e 6)
- [x] Bundle dividido: a sala 3D carrega depois do título
- [x] Desempenho no celular, movimento reduzido, "Ver as fotos sem revelar"
- [ ] README com GIF e entrada no portfólio
