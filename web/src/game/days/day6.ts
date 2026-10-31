import type { DayScript, Roll } from '../script'
import { PRACA } from './day2'
import { narrate, say, seen } from './lines'

// Dia 6, sábado, 19 de outubro. A loja fechada. Por baixo da porta, o rolo
// que a polícia levou, sem remetente. Seu Augusto revela, vê, estraga o
// filme e põe fogo. Conforme queima, alívio.

const photo = (id: string) => PRACA.photos.find((p) => p.id === id)!

const volta: Roll = {
  id: 'vilela-volta',
  customer: 'narrator',
  film: '120',
  title: 'De Anápolis a Campinas, de novo',
  photos: [
    {
      ...photo('coreto'),
      details: [seen('vilela-volta', 'coreto', 'Agora ele não está ao lado do arbusto. Está atrás do arbusto da frente, bem mais perto, olhando para a lente.')],
    },
    {
      ...photo('pipoqueiro'),
      details: [seen('vilela-volta', 'pipoqueiro', 'Meio escondido atrás da palmeira, grande demais para a distância. As pessoas passam por ele sem olhar.')],
    },
    {
      ...photo('lago'),
      details: [seen('vilela-volta', 'lago', 'Atrás do carro, deste lado da rua agora. Só aparece do peito para cima.')],
    },
    {
      ...photo('perto'),
      verso: 'De Anápolis a Campinas. A letra é a sua.',
      details: [seen('vilela-volta', 'perto', 'Na beirada, tão perto que só cabe meio peito. Do outro lado, desfocada, uma vitrine: FOTO ÍRIS.')],
    },
  ],
}

export const DAY6: DayScript = {
  day: 6,
  title: 'Sábado',
  steps: [
    {
      kind: 'talk',
      lines: [
        narrate('Sábado, 19 de outubro. Seu Augusto pendura a plaquinha na porta: "Fechado para balanço".'),
        say('augusto', 'Hoje eu não revelo nada.'),
        narrate('Embaixo da porta, um envelope pardo. Sem selo, sem remetente. Dentro, um rolo de 120.'),
        narrate('Ele reconhece o cheiro de vinagre antes de ler a etiqueta. A etiqueta diz "De Anápolis a Campinas". A letra é a dele.'),
        say('augusto', 'O rolo que o inspetor levou.'),
      ],
    },
    {
      kind: 'tank',
      actions: [
        { text: 'Ele diz que não vai revelar. Mas a luz já está apagada, e as mãos já abriram o chassi.', label: 'Achar a ponta do filme', cue: 'cassette' },
        { text: 'Desta vez o filme velho não resiste. Entra na espiral como se quisesse.', label: 'Segure para enrolar', hold: 3 },
        { text: 'A tampa fecha. Os negativos secam. Ele acende a luz vermelha.', label: 'Acender a luz vermelha', cue: 'lid' },
      ],
    },
    { kind: 'roll', roll: volta },
    { kind: 'wall', hint: 'As cópias secaram. Você sabe o que vai achar.' },
    {
      kind: 'burn',
      actions: [
        { text: 'Seu Augusto tira o negativo do varal. Ainda está úmido.', label: 'Abrir o filme na luz' },
        {
          text: 'A luz branca da sala bate no negativo inteiro e vela tudo. O filme escurece de ponta a ponta. Não basta.',
          label: 'Molhar de álcool',
        },
        { text: 'O álcool escorre pela pia. O cheiro de vinagre sobe junto. As cópias vão para a pia também.', label: 'Riscar o fósforo' },
        {
          text: 'O filme pega fogo de uma vez, alto e branco. Filme velho, de nitrato: queima rápido e forte.',
          label: 'Ficar olhando',
          cue: 'match',
          fire: true,
        },
        {
          text: 'Em um minuto, sobra uma casca preta e enrolada na pia. As cópias se dobram uma por uma, e ele junto com elas.',
          label: 'Abrir a janela',
          fire: true,
        },
        { text: 'O ar frio da rua entra. Pela primeira vez em uma semana, Seu Augusto respira fundo.', label: 'Continuar' },
      ],
    },
    {
      kind: 'talk',
      lines: [
        narrate('Lá fora, a São Paulo de sábado. Bonde, buzina, um vendedor de bilhete de loteria.'),
        say('augusto', 'Acabou.'),
        narrate('O rádio da bancada volta a tocar a valsa. Afinadinha.'),
      ],
    },
    {
      kind: 'end',
      title: 'Fim do sexto dia',
      text: 'O rolo virou cinza. Segunda-feira a loja abre como sempre.',
    },
  ],
}
