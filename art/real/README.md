# Fotos reais

As fotos do jogo que não são desenhadas em código: fotos de arquivo e cartões-postais em domínio público, recortados no quadro do filme (quadrado no 120, 3:2 no 35 mm) e envelhecidos pelo `revela age`. A figura delas é um homem recortado de um retrato de 1870, com o rosto borrado.

Saída em `web/public/photos/`, usada por `web/src/photos/real.ts`.

## Como refazer

1. Baixe os originais (tabela abaixo) para uma pasta, com os nomes da coluna "Arquivo". `pessoa-recorte.png` é o retrato recortado com `rembg` (modelo `u2net_human_seg`).
2. `python3 prepare.py <originais> <tmp>` recorta as cenas e trata a pessoa.
3. Para cada cena: `go run ./cmd/revela age -seed N <tmp>/<cena>.png <tmp>/<cena>-aged.png` (sementes 2 a 6 para as do Vilela, 7 a 10 para as do piquenique e 11 a 14 para as do casamento, na ordem da tabela), e salve em JPEG qualidade 84 em `web/public/photos/<cena>.jpg`. `pessoa.png` vai como está.

## Origem

| Arquivo | Vira | Fonte | Licença |
| --- | --- | --- | --- |
| `anapolis.png` | `anapolis-coreto.jpg` | *Coreto na Praça João Pessoa, Anápolis (GO)*, década de 1950, Arquivo Nacional (BR_RJANRIO_O2_0_FOT_00501_002), [Commons](https://commons.wikimedia.org/wiki/File:Coreto_na_Pra%C3%A7a_Jo%C3%A3o_Pessoa,_An%C3%A1polis_(GO).tif) | Domínio público no Brasil (PD-Brazil-URAA) |
| `jardim-carlos-gomes-2.jpg` | `campinas-jardim.jpg` | Werner Haberkorn, *Jardim Carlos Gomes, Campinas*, Fotolabor 722, Museu Paulista da USP, [Commons](https://commons.wikimedia.org/wiki/File:Werner_Haberkorn_-_Jardim_Carlos_Gomes_-_Campinas_2.jpg) | Domínio público no Brasil (Museu Paulista PD-license, URAA) |
| `praca-bento-quirino-2.jpg` | `campinas-bento-quirino.jpg` | Werner Haberkorn, *Praça Bento Quirino, Campinas*, Fotolabor 716, [Commons](https://commons.wikimedia.org/wiki/File:Werner_Haberkorn_-_Pra%C3%A7a_Bento_Quirino_-_Campinas_2.jpg) | Idem |
| `largo-do-rosario-2.jpg` | `campinas-rosario.jpg` | Werner Haberkorn, *Largo do Rosário, Campinas*, Fotolabor 720, [Commons](https://commons.wikimedia.org/wiki/File:Werner_Haberkorn_-_Largo_do_Ros%C3%A1rio_-_Campinas_2.jpg) | Idem |
| `praca-antonio-pompeo-3.jpg` | `campinas-pompeo.jpg` | Werner Haberkorn, *Vista parcial da Praça Antônio Pompeo, Campinas*, [Commons](https://commons.wikimedia.org/wiki/File:Werner_Haberkorn_-_Vista_parcial_da_Pra%C3%A7a_Ant%C3%B4nio_Pompeo._Campinas-SP_3.jpg) | Idem |
| `amersfoort-schaftuur.jpg` | `amersfoort-toalha.jpg` | *Gezelschap picknickend op de hei bij Amersfoort ('t schaftuur)*, maio de 1924, Rijksmuseum (RP-F-F01203-BI), [Commons](https://commons.wikimedia.org/wiki/File:Gezelschap_picknickend_op_de_hei_bij_Amersfoort_%27t_schaftuur_(titel_op_object)_Pic-nic_op_de_hei_bij_Amersfoort,_mei_%2724_(titel_op_object),_RP-F-F01203-BI.jpg), miniatura de 960 px | CC0 (Rijksmuseum) |
| `amersfoort-genietend.jpg` | `amersfoort-turma.jpg` | *Gezelschap picknickend op de hei bij Amersfoort (Genietend van het prachtige weer)*, maio de 1924, Rijksmuseum (RP-F-F01203-BH), [Commons](https://commons.wikimedia.org/wiki/File:Gezelschap_picknickend_op_de_hei_bij_Amersfoort_Genietend_van_het_prachtige_weer_(titel_op_object)_Pic-nic_op_de_hei_bij_Amersfoort,_mei_%2724_(titel_op_object),_RP-F-F01203-BH.jpg), miniatura de 960 px | CC0 (Rijksmuseum) |
| `renee-gras.jpg` | `renee-soneca.jpg` | Willem van de Poll, *Stiefdochter Renée ligt in het gras*, 1932, Nationaal Archief (252-0512), [Commons](https://commons.wikimedia.org/wiki/File:Stiefdochter_Ren%C3%A9e_ligt_in_het_gras_met_een_krans_van_paardenbloemen_om_haar_nek,_Bestanddeelnr_252-0512.jpg), miniatura de 960 px | CC0 (Nationaal Archief) |
| `sarphatipark-eenden.jpg` | `sarphatipark-patos.jpg` | Wim van Rossem, *Eenden voeren in Sarphatiepark*, 1954, Anefo, Nationaal Archief (906-2796), [Commons](https://commons.wikimedia.org/wiki/File:Lucas_Bols_eenden_voerderen_in_Sarphatiepark,_Bestanddeelnr_906-2796.jpg), miniatura de 960 px | CC0 (Nationaal Archief) |
| `smulders-3812.jpg` | `cambuci-porta.jpg` | Joop van Bilsen, *Huwelijk van de heer Hans Smulders met Mary Sevenstern* (Het bruidspaar voor het huis), 4/1/1951, Anefo, Nationaal Archief (904-3812), [Commons](https://commons.wikimedia.org/wiki/File:Huwelijk_van_de_heer_Hans_Smulders_met_Mary_Sevenstern._Het_bruidspaar_voor_het_%2C_Bestanddeelnr_904-3812.jpg), miniatura de 960 px | CC0 (Nationaal Archief) |
| `smulders-3794.jpg` | `cambuci-altar.jpg` | Joop van Bilsen, *Huwelijk van de heer Hans Smulders met Mary Sevenstern* (Het bruidspaar tijdens het kerkelijk huwelijk), 4/1/1951, Anefo, Nationaal Archief (904-3794), [Commons](https://commons.wikimedia.org/wiki/File:Huwelijk_van_de_heer_Hans_Smulders_Het_bruidspaar_tijdens_het_kerkelijk_huwelij%2C_Bestanddeelnr_904-3794.jpg), miniatura de 960 px | CC0 (Nationaal Archief) |
| `smulders-3820.jpg` | `cambuci-bolo.jpg` | Joop van Bilsen, *Huwelijk van de heer Hans Smulders met Mary Sevenstern* (De bruid snijdt de bruidstaart), 4/1/1951, Anefo, Nationaal Archief (904-3820), [Commons](https://commons.wikimedia.org/wiki/File:Huwelijk_van_de_heer_Hans_Smulders_met_Mary_Sevenstern._De_bruid_snijdt_de_brui%E2%80%A6%2C_Bestanddeelnr_904-3820.jpg), miniatura de 960 px | CC0 (Nationaal Archief) |
| `smulders-3805.jpg` | `cambuci-retrato.jpg` | Joop van Bilsen, *Huwelijk van de heer Hans Smulders met Mary Sevenstern* (Het bruidspaar), 4/1/1951, Anefo, Nationaal Archief (904-3805), [Commons](https://commons.wikimedia.org/wiki/File:Huwelijk_van_de_heer_Hans_Smulders_met_Mary_Sevenstern._Het_bruidspaar%2C_Bestanddeelnr_904-3805.jpg), miniatura de 960 px | CC0 (Nationaal Archief) |
| `pessoa-recorte.png` | `pessoa.png` | *Full-length portrait of a man, standing, facing front*, 1870, Biblioteca do Congresso (LCCN 2005692477), [Commons](https://commons.wikimedia.org/wiki/File:Full-length_portrait_of_a_man,_standing,_facing_front_LCCN2005692477.jpg) | Domínio público no mundo todo (PD-old-100) |

**Pendência antes de lançar:** as fotos brasileiras (as do Vilela) estão em domínio público no Brasil segundo o Commons, mas a data de cada uma não está confirmada (a lei pede divulgação até 1955) e a marca URAA indica que nos EUA, onde a Vercel serve o site, elas podem ainda ter direitos. Confirmar com o Arquivo Nacional e o Museu Paulista, ou trocar por fotos sem essa dúvida.
