# Rascunho: o rolo do dia 2 com fotos reais

O rolo do H. Vilela vira uma viagem: cada foto é de um lugar, e o mesmo homem aparece em todas, cada vez mais perto. `rolo.png` mostra as cinco em ordem. A pessoa e o estilo (A) vêm de `art/experiments/coreto-real/`.

| Foto | Lugar | Fonte | Licença |
| --- | --- | --- | --- |
| 1 | Coreto da Praça João Pessoa, Anápolis (GO), anos 50 | Arquivo Nacional (ver `coreto-real/README.md`) | Domínio público no Brasil (PD-Brazil-URAA) |
| 2 | Jardim Carlos Gomes, Campinas (SP) | [Werner Haberkorn, Fotolabor 722](https://commons.wikimedia.org/wiki/File:Werner_Haberkorn_-_Jardim_Carlos_Gomes_-_Campinas_2.jpg), Museu Paulista da USP | Domínio público no Brasil (Museu Paulista PD-license, URAA) |
| 3 | Praça Bento Quirino, Campinas (SP) | [Werner Haberkorn, Fotolabor 716](https://commons.wikimedia.org/wiki/File:Werner_Haberkorn_-_Pra%C3%A7a_Bento_Quirino_-_Campinas_2.jpg), Museu Paulista da USP | Idem |
| 4 | Largo do Rosário, Campinas (SP) | [Werner Haberkorn, Fotolabor 720](https://commons.wikimedia.org/wiki/File:Werner_Haberkorn_-_Largo_do_Ros%C3%A1rio_-_Campinas_2.jpg), Museu Paulista da USP | Idem |
| 5 | Praça Antônio Pompeo, Campinas (SP) | [Werner Haberkorn](https://commons.wikimedia.org/wiki/File:Werner_Haberkorn_-_Vista_parcial_da_Pra%C3%A7a_Ant%C3%B4nio_Pompeo._Campinas-SP_3.jpg), Museu Paulista da USP | Idem |

Os cartões-postais da Fotolabor são dos anos 40 e começo dos 50, mas o Commons não traz a data de cada um. Mesmo aviso do coreto: confirmar a data e a situação nos EUA (URAA) antes de usar no jogo.

`rolo.py` recorta cada cartão no quadrado do filme 120, põe a pessoa (com `pessoa.py`) e cada foto é envelhecida com `revela age` (sementes 3 a 6).
