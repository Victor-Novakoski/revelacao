# Fotos reais

As fotos do jogo que não são desenhadas em código: fotos de arquivo e cartões-postais em domínio público, recortados no quadrado do filme 120 e envelhecidos pelo `revela age`. A figura delas é um homem recortado de um retrato de 1870, com o rosto borrado.

Saída em `web/public/photos/`, usada por `web/src/photos/real.ts`.

## Como refazer

1. Baixe os originais (tabela abaixo) para uma pasta, com os nomes da coluna "Arquivo". `pessoa-recorte.png` é o retrato recortado com `rembg` (modelo `u2net_human_seg`).
2. `python3 prepare.py <originais> <tmp>` recorta as cenas e trata a pessoa.
3. Para cada cena: `go run ./cmd/revela age -seed N <tmp>/<cena>.png <tmp>/<cena>-aged.png` (sementes 2 a 6, na ordem da tabela), e salve em JPEG qualidade 84 em `web/public/photos/<cena>.jpg`. `pessoa.png` vai como está.

## Origem

| Arquivo | Vira | Fonte | Licença |
| --- | --- | --- | --- |
| `anapolis.png` | `anapolis-coreto.jpg` | *Coreto na Praça João Pessoa, Anápolis (GO)*, década de 1950, Arquivo Nacional (BR_RJANRIO_O2_0_FOT_00501_002), [Commons](https://commons.wikimedia.org/wiki/File:Coreto_na_Pra%C3%A7a_Jo%C3%A3o_Pessoa,_An%C3%A1polis_(GO).tif) | Domínio público no Brasil (PD-Brazil-URAA) |
| `jardim-carlos-gomes-2.jpg` | `campinas-jardim.jpg` | Werner Haberkorn, *Jardim Carlos Gomes, Campinas*, Fotolabor 722, Museu Paulista da USP, [Commons](https://commons.wikimedia.org/wiki/File:Werner_Haberkorn_-_Jardim_Carlos_Gomes_-_Campinas_2.jpg) | Domínio público no Brasil (Museu Paulista PD-license, URAA) |
| `praca-bento-quirino-2.jpg` | `campinas-bento-quirino.jpg` | Werner Haberkorn, *Praça Bento Quirino, Campinas*, Fotolabor 716, [Commons](https://commons.wikimedia.org/wiki/File:Werner_Haberkorn_-_Pra%C3%A7a_Bento_Quirino_-_Campinas_2.jpg) | Idem |
| `largo-do-rosario-2.jpg` | `campinas-rosario.jpg` | Werner Haberkorn, *Largo do Rosário, Campinas*, Fotolabor 720, [Commons](https://commons.wikimedia.org/wiki/File:Werner_Haberkorn_-_Largo_do_Ros%C3%A1rio_-_Campinas_2.jpg) | Idem |
| `praca-antonio-pompeo-3.jpg` | `campinas-pompeo.jpg` | Werner Haberkorn, *Vista parcial da Praça Antônio Pompeo, Campinas*, [Commons](https://commons.wikimedia.org/wiki/File:Werner_Haberkorn_-_Vista_parcial_da_Pra%C3%A7a_Ant%C3%B4nio_Pompeo._Campinas-SP_3.jpg) | Idem |
| `pessoa-recorte.png` | `pessoa.png` | *Full-length portrait of a man, standing, facing front*, 1870, Biblioteca do Congresso (LCCN 2005692477), [Commons](https://commons.wikimedia.org/wiki/File:Full-length_portrait_of_a_man,_standing,_facing_front_LCCN2005692477.jpg) | Domínio público no mundo todo (PD-old-100) |

**Pendência antes de lançar:** as fotos brasileiras estão em domínio público no Brasil segundo o Commons, mas a data de cada uma não está confirmada (a lei pede divulgação até 1955) e a marca URAA indica que nos EUA, onde a Vercel serve o site, elas podem ainda ter direitos. Confirmar com o Arquivo Nacional e o Museu Paulista, ou trocar por fotos sem essa dúvida.
