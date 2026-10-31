import type { DayScript, Roll } from '../script'
import { bell, moods, narrate, say } from './lines'

// Dia 7, segunda-feira, 21 de outubro. Calmaria: fotos normais, a primeira
// comunhão da Lúcia, na igreja cheia. A Marlene não vem buscar as fotos, e ninguém comenta.

const comunhao: Roll = {
  id: 'cida-comunhao',
  customer: 'cida',
  film: '35mm',
  title: 'Primeira comunhão da Lúcia',
  photos: [
    { id: 'porta', verso: 'Na porta da igreja, depois da missa. Domingo, 20/10/57', exposure: 9, focus: 0.64 },
    {
      id: 'altar',
      verso: 'O altar todo enfeitado. O padre pediu uma',
      exposure: 8,
      focus: 0.64,
      details: [{ id: 'flores', x: 0.27, y: 0.36, r: 0.05, text: 'Palmas no altar. Alguém acordou cedo para arrumar.' }],
    },
    {
      id: 'igreja',
      verso: 'A igreja cheia de anjinhos. A Lúcia está lá no meio',
      exposure: 10,
      focus: 0.64,
      details: [{ id: 'freira', x: 0.645, y: 0.47, r: 0.05, text: 'A irmã de olho nos meninos do banco da frente.' }],
    },
    { id: 'procissao', verso: 'A procissão. O Toninho e o Zezinho de camisa branca', exposure: 8, focus: 0.64 },
  ],
}

export const DAY7: DayScript = {
  day: 7,
  title: 'Segunda-feira',
  steps: [
    {
      kind: 'talk',
      lines: [
        narrate('Segunda-feira, 21 de outubro. Sol. A loja cheira a café, não a vinagre.'),
        say('augusto', 'Gravata no lugar, balcão limpo. Bom dia, São Paulo.'),
        bell('cida', 'Bom dia, Seu Augusto! A primeira comunhão da Lúcia. Ela estava um anjo.'),
        say('augusto', 'Vou caprichar, Dona Cida.'),
        say('cida', 'Só as boas, viu? E o senhor está com uma cara melhor hoje.'),
        narrate('Um rolo de 35 milímetros para o tanque. Nada de estranho no cheiro, nada de estranho na etiqueta.'),
      ],
    },
    { kind: 'roll', roll: comunhao },
    { kind: 'wall', hint: 'Confira as cópias com a lupa.' },
    {
      kind: 'deliver',
      roll: 'cida-comunhao',
      before: [bell('cida', 'Voltei! E o meu anjinho?'), say('augusto', 'Quatro, Dona Cida. Todas boas.')],
      after: moods('cida', {
        good: 'Ai, que coisa mais linda. Vou pôr no porta-retrato da sala, do lado do batizado.',
        pale: 'Clarinhas... combinou com o vestido branco, até.',
        dark: 'Escuras, Seu Augusto. O vestido branco ficou cinza.',
        blurry: 'Borradas. Logo hoje, que ela estava tão quietinha.',
        mixed: 'Umas boas, outras nem tanto. A da igreja cheia ficou um sonho.',
      }),
    },
    {
      kind: 'talk',
      lines: [
        narrate('Quatro da tarde. A Marlene não vem buscar as normalistas.'),
        narrate('O envelope fica na prateleira. Ninguém pergunta por ela.'),
        narrate('Seis da tarde.'),
        bell('amanda', 'Boa noite, Seu Augusto. O senhor está corado. Dormiu?'),
        say('augusto', 'Feito pedra. Fazia tempo.'),
        say('amanda', 'Hoje é Poe de novo. "O Coração Delator". Um homem faz uma coisa terrível e esconde embaixo do assoalho.'),
        say('augusto', 'E dá certo?'),
        say('amanda', 'Por um tempo. Depois ele começa a ouvir. Bem baixinho, debaixo das tábuas.'),
        say('augusto', 'Ouvir o quê?'),
        say('amanda', 'O que ele achou que tinha acabado. Boa noite, Seu Augusto.'),
      ],
    },
    {
      kind: 'end',
      title: 'Fim do sétimo dia',
      text: 'Um dia comum, igual aos de antes.',
    },
  ],
}
