import type { DayScript, Roll } from '../script'
import { bell, moods, narrate, say, seen } from './lines'

// Dia 9, quarta-feira, 23 de outubro. A figura volta, perto, nas fotos de
// todo mundo, até nas da Lúcia. Os clientes não veem nada. Só nas fotos da Senhorita Amanda
// ela não está.

const quintal: Roll = {
  id: 'cida-quintal',
  customer: 'cida',
  film: '35mm',
  title: 'O quintal',
  photos: [
    {
      id: 'bolhas',
      verso: 'A Lúcia e as bolinhas de sabão',
      exposure: 7,
      focus: 0.64,
      details: [seen('cida-quintal', 'bolhas', 'Do lado dela, alguém alto. A sombra da Lúcia está na parede. A dele, não.')],
    },
    {
      id: 'gramado',
      verso: 'As três no gramado, dividindo a bala',
      exposure: 8,
      focus: 0.64,
      details: [seen('cida-quintal', 'gramado', 'De pé, logo atrás das meninas. Elas não olham.')],
    },
    {
      id: 'gato',
      verso: 'A Lúcia e o Bichano, na poltrona do Juvenal',
      exposure: 10,
      focus: 0.64,
      details: [seen('cida-quintal', 'gato', 'Atrás da poltrona. A mão quase no ombro dela.')],
    },
    {
      id: 'escada',
      verso: 'As três subindo para casa. Como cresceram',
      exposure: 8,
      focus: 0.64,
      details: [seen('cida-quintal', 'escada', 'Na porta de casa, lá em cima, esperando por elas.')],
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
      id: 'convidados',
      verso: 'A noiva entre os convidados. N.',
      exposure: 10,
      focus: 0.36,
      details: [seen('nakamura-mooca', 'convidados', 'Todo mundo sentado. Ele não. De pé atrás da fileira, o mais alto de todos.')],
    },
    {
      id: 'familia',
      verso: 'As duas famílias. N.',
      exposure: 12,
      focus: 0.36,
      details: [seen('nakamura-mooca', 'familia', 'Bem no meio das duas famílias, uma cabeça a mais.')],
    },
    {
      id: 'noivos',
      verso: 'Os noivos, no altar. N.',
      exposure: 10,
      focus: 0.36,
      details: [seen('nakamura-mooca', 'noivos', 'Logo atrás da noiva. Mais perto dela do que o noivo.')],
    },
    {
      id: 'saida',
      verso: 'Saída da igreja. N.',
      exposure: 9,
      focus: 0.36,
      details: [seen('nakamura-mooca', 'saida', 'Entre os fotógrafos, o único sem câmera. Ele não olha para os noivos: olha para cá.')],
    },
  ],
}

const livraria: Roll = {
  id: 'amanda-livraria',
  customer: 'amanda',
  film: '35mm',
  title: 'A livraria',
  photos: [
    {
      id: 'vitrine',
      verso: 'A vitrine, ainda sem os enfeites de Natal',
      exposure: 9,
      focus: 0.7,
      details: [{ id: 'mocas', x: 0.5, y: 0.42, r: 0.1, text: 'Duas moças de cara no vidro. Na vitrine, só capas de livro.' }],
    },
    {
      id: 'estantes',
      verso: 'O Seu Mendes e o filho, que lê de graça há um ano',
      exposure: 11,
      focus: 0.7,
      details: [{ id: 'gibi', x: 0.44, y: 0.5, r: 0.08, text: 'Um gibi estrangeiro, de capa amassada. O menino nem viu a câmera.' }],
    },
    {
      id: 'gato',
      verso: 'O verdadeiro dono da livraria',
      exposure: 9,
      focus: 0.7,
      details: [{ id: 'poe', x: 0.5, y: 0.58, r: 0.06, text: 'O Poe e a tigela de leite. Os camundongos da gaiola nem se mexem.' }],
    },
    {
      id: 'balcao',
      verso: 'Eu, com o disparador automático. Sorria!',
      exposure: 10,
      focus: 0.7,
      details: [
        {
          id: 'atras',
          x: 0.39,
          y: 0.56,
          r: 0.1,
          text: 'O disparador correu: ela não chegou a entrar. Só uma freguesa de costas, nos cartões-postais. Nem sombra de mais ninguém.',
        },
      ],
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
        bell('cida', 'Seu Augusto, o quintal! A Lúcia com as amigas, o gato na poltrona. Coisa à toa, mas eu gosto.'),
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
        good: 'Que beleza! O Bichano no colo dela, nem parece bravo.',
        pale: 'Clarinhas, mas a Lúcia ficou um anjo. Era o que eu queria mostrar.',
        dark: 'Escuras, Seu Augusto. Parece que foi de noite.',
        blurry: 'Borradas. O senhor voltou a ficar cansado?',
        mixed: 'Umas boas, outras nem tanto. Mas estão todos aí, é o que importa.',
      }),
    },
    {
      kind: 'talk',
      lines: [
        say('augusto', 'Dona Cida... a senhora não vê ninguém atrás da Lúcia, na poltrona?'),
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
        dark: 'Escuras. O vestido da noiva ficou cinza.',
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
        dark: 'Escuras. Parece livraria de romance policial. Gostei.',
        blurry: 'Borradas. Livro não pisca, mas o revelador pelo jeito sim.',
        mixed: 'Umas boas, outras nem tanto. A do Poe ficou ótima. A minha nem fui eu.',
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
