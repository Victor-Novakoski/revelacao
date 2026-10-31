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

## Rodada 2: uma pessoa real no lugar da silhueta

A silhueta desenhada destoa da foto (lembra o Slenderman). `figuras.png` compara quatro opções: a silhueta de hoje, uma pessoa real parada, a mesma pessoa com o rosto borrado (como se tivesse mexido a cabeça durante a exposição) e só esse rosto aparecendo na borda do arbusto.

- A pessoa vem de *Full-length portrait of a man, standing, facing front*, carte de visite de 1870, Biblioteca do Congresso (LCCN 2005692477), via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Full-length_portrait_of_a_man,_standing,_facing_front_LCCN2005692477.jpg. Domínio público no mundo todo (mais de 150 anos; `PD-old-100-1923`).
- Recorte com `rembg` (modelo `u2net_human_seg`): `pessoa-recorte.png`.
- `pessoa.py` põe a pessoa no `recorte.png` (mesmo tom, desfoque e posição de `figures.ts`), e depois `revela age -seed 2` envelhece tudo junto, para o grão e a lente valerem para os dois.

## Rodada 3: destacar a opção 3

`destaque.png` compara a opção 3 com três jeitos de chamar mais atenção para ela: maior e com mais contraste no mesmo lugar (A), no caminho claro em frente ao coreto (B) e no caminho, mais perto da câmera (C). Em B e C o casaco escuro contrasta com o chão claro, e dá para ver que ele não tem sombra. Se B ou C entrar no jogo, a posição em `figures.ts` muda (B fica perto de x 0,51 e pés em 0,57 da folha).
