import type { DayScript, Roll } from '../script'
import { bell, moods, narrate, say, seen } from './lines'

// Dia 4, quinta-feira, 17 de outubro. A figura, mais perto, no fundo da
// igreja de um casamento do Nakamura. E o rolo que o Elias deixou: ele vai
// sumindo de foto em foto. Ele não vem buscar.

const cambuci: Roll = {
  id: 'nakamura-cambuci',
  customer: 'nakamura',
  film: '120',
  title: 'Casamento no Cambuci',
  photos: [
    { id: 'porta', verso: 'Noivos na porta. Quarta, 16/10/57. N.', exposure: 10, focus: 0.36 },
    {
      id: 'altar',
      verso: 'O altar. N.',
      exposure: 14,
      focus: 0.36,
      details: [seen('nakamura-cambuci', 'altar', 'Ao lado do altar, entre as colunas, alguém alto. Mais perto do que no parque.')],
    },
    { id: 'bolo', verso: 'O bolo. N.', exposure: 10, focus: 0.36 },
    {
      id: 'retrato',
      verso: 'Retrato dos noivos. N.',
      exposure: 9,
      focus: 0.36,
      details: [{ id: 'maos', x: 0.51, y: 0.6, r: 0.05, text: 'A noiva aperta a mão do noivo com força.' }],
    },
  ],
}

const rota: Roll = {
  id: 'elias-rota',
  customer: 'elias',
  film: '35mm',
  title: 'A rota de Santos',
  photos: [
    {
      id: 'caminhao',
      verso: 'Eu e o caminhão. Expresso Guilela',
      exposure: 8,
      focus: 0.5,
      details: [
        { id: 'luneta', x: 0.79, y: 0.62, r: 0.05, text: 'A luneta pintada na porta da cabine.' },
        { id: 'elias-claro', x: 0.84, y: 0.5, r: 0.06, text: 'O Elias saiu mais claro que o caminhão. Deve ser o sol.' },
      ],
    },
    {
      id: 'serra',
      verso: 'Na serra, de manhã cedo',
      exposure: 7,
      focus: 0.5,
      details: [{ id: 'elias-serra', x: 0.26, y: 0.6, r: 0.07, text: 'Dá para ver a neblina da serra através do Elias.' }],
    },
    {
      id: 'bar',
      verso: 'Café no posto, como toda semana',
      exposure: 10,
      focus: 0.5,
      details: [{ id: 'xicara', x: 0.485, y: 0.56, r: 0.05, text: 'No balcão, a xícara dele. Ele mesmo quase não está.' }],
    },
    {
      id: 'cabine',
      verso: 'Eu na boleia',
      exposure: 12,
      focus: 0.5,
      details: [{ id: 'bone', x: 0.68, y: 0.55, r: 0.06, text: 'O boné dele no banco. A cabine está vazia.' }],
    },
  ],
}

export const DAY4: DayScript = {
  day: 4,
  title: 'Quinta-feira',
  steps: [
    {
      kind: 'talk',
      lines: [
        narrate('Quinta-feira, 17 de outubro. O dia em que o Elias vem buscar o rolo dele.'),
        bell('nakamura', 'Augusto-san. Outro casamento, no Cambuci. Igreja cheia.'),
        say('augusto', 'O senhor não para, Seu Nakamura.'),
        say('nakamura', 'Outubro é mês de noiva. Quatro chapas, as melhores. Hoje, por favor.'),
        narrate('Dois rolos para o tanque: o casamento do Nakamura e o rolo que o Elias deixou na terça.'),
      ],
    },
    { kind: 'roll', roll: cambuci },
    { kind: 'roll', roll: rota },
    { kind: 'wall', hint: 'Confira as cópias com a lupa. O fundo também.' },
    {
      kind: 'deliver',
      roll: 'nakamura-cambuci',
      before: [bell('nakamura', 'Augusto-san.'), say('augusto', 'Quatro, Seu Nakamura.')],
      after: moods('nakamura', {
        good: 'Muito bem. A igreja ficou bonita, até o fundo.',
        pale: 'Pálidas. Igreja escura e cópia clara não combinam, Augusto-san.',
        dark: 'Escuras. Não se vê o altar. A noiva vai perguntar onde casou.',
        blurry: 'Fora de foco. O senhor está bem?',
        mixed: 'Algumas eu aproveito. As outras o senhor refaz.',
      }),
    },
    {
      kind: 'talk',
      lines: [
        say('augusto', 'Seu Nakamura, na do altar... o senhor lembra de alguém em pé lá na frente, perto das colunas?'),
        say('nakamura', 'Na hora da foto, ninguém fica perto do altar. Só o padre e Deus.'),
        narrate('Ele olha a cópia de perto, devagar.'),
        say('nakamura', 'Não vejo nada. Mas o senhor está com cara de quem viu.'),
        narrate('Seis da tarde. O Elias não vem buscar o rolo.'),
        bell('amanda', 'Fechando, Seu Augusto? Trouxe um que o senhor vai gostar: "O Retrato Oval", do Poe.'),
        say('augusto', 'Do que se trata?'),
        say(
          'amanda',
          'Um pintor pinta a mulher tão bem, tão bem, que quando termina o retrato ela está morta. A vida foi toda para a tela.',
        ),
        say('augusto', 'E se fosse o contrário? Se a pessoa fosse sumindo do retrato?'),
        say('amanda', 'Aí ela estaria indo para outro lugar. Que pergunta, Seu Augusto.'),
        narrate('Ela deixa o livro no balcão. O envelope do Elias fica na prateleira, ao lado do da Marlene.'),
      ],
    },
    {
      kind: 'end',
      title: 'Fim do quarto dia',
      text: 'O Elias não veio. Nas fotos dele, ele já quase não estava.',
    },
  ],
}
