import type { DayScript, Roll } from '../script'
import { bell, moods, narrate, say, seen } from './lines'

// Dia 9, quarta-feira, 23 de outubro. A figura volta, perto, nas fotos de
// todo mundo. Os clientes não veem nada. Só nas fotos da Senhorita Amanda
// ela não está.

const quintal: Roll = {
  id: 'cida-quintal',
  customer: 'cida',
  film: '35mm',
  title: 'O quintal',
  photos: [
    {
      id: 'lencois',
      verso: 'Lençol novo no varal',
      exposure: 7,
      focus: 0.64,
      details: [seen('cida-quintal', 'lencois', 'Na frente do lençol, alguém alto. Não tem sombra no chão.')],
    },
    {
      id: 'roda',
      verso: 'Os meninos brincando de roda',
      exposure: 8,
      focus: 0.64,
      details: [seen('cida-quintal', 'roda', 'Na roda das crianças tem uma pessoa a mais.')],
    },
    {
      id: 'poltrona',
      verso: 'O Juvenal, como sempre',
      exposure: 10,
      focus: 0.64,
      details: [seen('cida-quintal', 'poltrona', 'Atrás da poltrona do Seu Juvenal. A mão quase no ombro dele.')],
    },
    {
      id: 'portao',
      verso: 'Os três no portão, de novo. Como cresceram',
      exposure: 8,
      focus: 0.64,
      details: [seen('cida-quintal', 'portao', 'Do lado de dentro do portão, bem atrás das crianças.')],
    },
  ],
}

const mooca: Roll = {
  id: 'nakamura-mooca',
  customer: 'nakamura',
  film: '120',
  title: 'Casamento na Mooca',
  photos: [
    {
      id: 'escadaria',
      verso: 'Noivos na escadaria. N.',
      exposure: 10,
      focus: 0.36,
      details: [seen('nakamura-mooca', 'escadaria', 'Entre os convidados, o mais alto de todos. Ninguém fica perto dele.')],
    },
    {
      id: 'familia',
      verso: 'As duas famílias. N.',
      exposure: 12,
      focus: 0.36,
      details: [seen('nakamura-mooca', 'familia', 'Bem no meio das duas fileiras, uma cabeça a mais.')],
    },
    {
      id: 'brinde',
      verso: 'O brinde. N.',
      exposure: 10,
      focus: 0.36,
      details: [seen('nakamura-mooca', 'brinde', 'Todo mundo de braço erguido. Ele não. Está logo atrás da noiva.')],
    },
    {
      id: 'saida',
      verso: 'Saída da igreja. N.',
      exposure: 9,
      focus: 0.36,
      details: [seen('nakamura-mooca', 'saida', 'No meio do arroz, parado. Em volta dele não cai nenhum grão.')],
    },
  ],
}

const livraria: Roll = {
  id: 'amanda-livraria',
  customer: 'amanda',
  film: '35mm',
  title: 'A livraria',
  photos: [
    { id: 'vitrine', verso: 'A vitrine de Natal (ainda sem os enfeites)', exposure: 9, focus: 0.7 },
    {
      id: 'estantes',
      verso: 'A estante de terror, minha favorita',
      exposure: 11,
      focus: 0.7,
      details: [{ id: 'fora', x: 0.635, y: 0.44, r: 0.05, text: 'Um livro deitado fora do lugar: "Drácula".' }],
    },
    {
      id: 'gato',
      verso: 'O verdadeiro dono da livraria',
      exposure: 9,
      focus: 0.7,
      details: [{ id: 'poe', x: 0.75, y: 0.84, r: 0.05, text: 'O gato se chama Poe. Está escrito na tigela.' }],
    },
    {
      id: 'balcao',
      verso: 'Eu, com o disparador automático. Sorria!',
      exposure: 10,
      focus: 0.7,
      details: [{ id: 'atras', x: 0.5, y: 0.5, r: 0.12, text: 'Atrás dela, só livros. Nem sombra.' }],
    },
  ],
}

export const DAY9: DayScript = {
  day: 9,
  title: 'Quarta-feira',
  steps: [
    {
      kind: 'talk',
      lines: [
        narrate('Quarta-feira, 23 de outubro. Três rolos no balcão antes das nove.'),
        bell('cida', 'Seu Augusto, o quintal! Lençol novo, os meninos brincando. Coisa à toa, mas eu gosto.'),
        bell('nakamura', 'Augusto-san. Casamento na Mooca. O último do mês.'),
        bell('amanda', 'Hoje eu sou a cliente, Seu Augusto. Fotografei a livraria para o catálogo de Natal.'),
        say('augusto', 'A senhorita fotografa?'),
        say('amanda', 'Só livros. Livro não pisca.'),
        narrate('Três rolos para o tanque. Seu Augusto assobia a valsa enquanto trabalha.'),
      ],
    },
    { kind: 'roll', roll: quintal },
    { kind: 'roll', roll: mooca },
    { kind: 'roll', roll: livraria },
    { kind: 'wall', hint: 'Confira as cópias com a lupa. Todas.' },
    {
      kind: 'deliver',
      roll: 'cida-quintal',
      before: [bell('cida', 'Voltei, Seu Augusto! E o meu quintal?'), say('augusto', 'Aqui, Dona Cida.')],
      after: moods('cida', {
        good: 'Que beleza! O Juvenal dormindo de novo. Esse homem dorme até em foto.',
        pale: 'Clarinhas, mas o lençol ficou branquinho. Era o que eu queria mostrar.',
        dark: 'Escuras, Seu Augusto. Parece que foi de noite.',
        blurry: 'Borradas. O senhor voltou a ficar cansado?',
        mixed: 'Umas boas, outras nem tanto. Mas estão todos aí, é o que importa.',
      }),
    },
    {
      kind: 'talk',
      lines: [
        say('augusto', 'Dona Cida... a senhora não vê ninguém atrás do Seu Juvenal?'),
        say('cida', 'Atrás da poltrona? Só a parede, Seu Augusto. O senhor anda vendo coisa.'),
      ],
    },
    {
      kind: 'deliver',
      roll: 'nakamura-mooca',
      before: [bell('nakamura', 'Augusto-san.'), say('augusto', 'Quatro, Seu Nakamura.')],
      after: moods('nakamura', {
        good: 'Bom trabalho. Um casamento bonito para fechar o mês.',
        pale: 'Pálidas. Os noivos merecem mais, Augusto-san.',
        dark: 'Escuras. O arroz sumiu no céu.',
        blurry: 'Fora de foco. De novo.',
        mixed: 'Algumas boas. Eu escolho.',
      }),
    },
    {
      kind: 'talk',
      lines: [
        say('augusto', 'Seu Nakamura, o senhor não vê nada de estranho nelas?'),
        say('nakamura', 'Vejo um casamento. O senhor vê outra coisa?'),
        say('augusto', 'Nada. Até a próxima.'),
      ],
    },
    {
      kind: 'deliver',
      roll: 'amanda-livraria',
      before: [bell('amanda', 'E as minhas, Seu Augusto?'), say('augusto', 'Aqui, senhorita. Quatro.')],
      after: moods('amanda', {
        good: 'Perfeitas. O Poe saiu com cara de dono da livraria. E é.',
        pale: 'Clarinhas. Os livros parecem ainda mais velhos. Gostei.',
        dark: 'Escuras. Combina com a estante de terror, pelo menos.',
        blurry: 'Borradas. Livro não pisca, mas o revelador pelo jeito sim.',
        mixed: 'Umas boas, outras nem tanto. A do Poe ficou ótima.',
      }),
    },
    {
      kind: 'talk',
      lines: [
        say('amanda', 'O senhor está com uma cara, Seu Augusto. De quem está sumindo um pouco.'),
        say('augusto', 'Sumindo?'),
        say(
          'amanda',
          'Hoje é "O Espelho", do Machado. Um alferes fica sozinho numa casa e, quando olha no espelho, não se vê inteiro. Só uma figura vaga.',
        ),
        say('amanda', 'Ele só volta a aparecer quando veste a farda. Precisa que alguém olhe para ele.'),
        say('augusto', 'E se ninguém mais olhar?'),
        say('amanda', 'Eu olho, Seu Augusto. Boa noite.'),
        narrate('Ela sai. Seu Augusto fica sozinho, apagando as luzes da loja uma por uma.'),
        narrate('Na câmara escura, só a lâmpada vermelha. Atrás dele, à esquerda, a madeira range. Uma vez.', { cue: 'creak' }),
        narrate('Ele não se vira.'),
      ],
    },
    {
      kind: 'end',
      title: 'Fim do nono dia',
      text: 'Ela voltou, nas fotos de todo mundo. Menos nas da Senhorita Amanda.',
    },
  ],
}
