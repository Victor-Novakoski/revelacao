# Teste: foto real no coreto (dia 2)

Teste de visual para a foto "Domingo na praça / coreto" (`vilela-praca/coreto`).
Nada daqui entra no jogo até o Victor escolher o caminho.

`comparacao.png` mostra três versões lado a lado:

1. **Hoje:** a foto desenhada em código (`web/src/photos/week1.ts`), como sai na cópia do jogo.
2. **Foto real envelhecida:** foto de domínio público do Arquivo Nacional, recortada e envelhecida com `revela age`. A figura é a mesma de hoje (`creature` em `web/src/photos/draw.ts`), pintada como camada separada na posição de `web/src/photos/figures.ts` e somada com a mesma conta da cópia (`printDensity`).
3. **Pixel art:** a versão 2 reduzida para 81 x 81 pixels, com 6 tons de sépia.

## A foto

- *Coreto na Praça João Pessoa, Anápolis (GO)*, década de 1950, fotógrafo não identificado.
- Acervo: Arquivo Nacional, código BR_RJANRIO_O2_0_FOT_00501_002.
- Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Coreto_na_Pra%C3%A7a_Jo%C3%A3o_Pessoa,_An%C3%A1polis_(GO).tif
- Licença no Commons: `{{Arquivo Nacional PD-license|URAA}}`, isto é, domínio público no Brasil (PD-Brazil-URAA). Atribuição pedida: "Domínio público / Acervo Arquivo Nacional".

**Atenção antes de usar no jogo:** a data é só "década de 1950", então não dá para confirmar que a foto saiu até 1955. E a marca URAA indica que nos EUA (onde a Vercel serve o site) ela pode não estar em domínio público. Para um uso final, confirmar a data com o Arquivo Nacional ou trocar por uma foto da FSA/OWI na Biblioteca do Congresso (domínio público nos EUA).

## Como foi feito

1. Miniatura de 1280 px do Commons, recorte quadrado (filme 120) de 300 px a partir de (682, 452), redimensionado para 324 px: `recorte.png`.
2. `go run ./cmd/revela age -seed 2 recorte.png envelhecida.png` (ferramenta do PR #11): `envelhecida.png`.
3. A cena entra na folha 480 x 360 no quadro do 120; a figura entra por cima com desfoque de 1 px, revelação 1,1 e exposição 1.
