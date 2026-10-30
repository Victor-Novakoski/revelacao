import type { DayScript, Roll } from '../script'
import { bell, moods, narrate, say, seen } from './lines'

// Dia 2, terça-feira, 15 de outubro. O Elias traz a câmera achada na
// estrada. No rolo, um domingo na praça e alguém parado ao fundo em todas as
// fotos. Na última, mais perto da câmera do que o fotógrafo poderia estar.
// A polícia leva a câmera; o que estava nas fotos fica.

export const PRACA: Roll = {
  id: 'vilela-praca',
  customer: 'elias',
  film: '120',
  title: 'Domingo na praça',
  photos: [
    {
      id: 'coreto',
      verso: 'Praça, domingo. A banda. H.V.',
      exposure: 11,
      focus: 0.52,
      details: [seen('vilela-praca', 'coreto', 'Entre as árvores, lá no fundo, alguém parado. Todo mundo está andando, menos ele.')],
    },
    {
      id: 'pipoqueiro',
      verso: 'O pipoqueiro. H.V.',
      exposure: 10,
      focus: 0.52,
      details: [seen('vilela-praca', 'pipoqueiro', 'De pé, ao lado do banco do fundo. Alto demais para o banco.')],
    },
    {
      id: 'lago',
      verso: 'O lago. H.V.',
      exposure: 9,
      focus: 0.52,
      details: [seen('vilela-praca', 'lago', 'Na outra margem, na beira da água. As árvores têm reflexo. Ele não.')],
    },
    {
      id: 'familia',
      verso: 'Minha mulher e as meninas. H.V.',
      exposure: 11,
      focus: 0.52,
      details: [seen('vilela-praca', 'familia', 'Atrás da família, mais perto agora. Os braços descem até os joelhos.')],
    },
    {
      id: 'perto',
      verso: 'Sem anotação. Só um risco de lápis, como se a mão tivesse escorregado.',
      exposure: 12,
      focus: 0.52,
      details: [seen('vilela-praca', 'perto', 'Mais perto da câmera do que o fotógrafo poderia estar.')],
    },
  ],
}

export const DAY2: DayScript = {
  day: 2,
  title: 'Terça-feira',
  steps: [
    {
      kind: 'talk',
      lines: [
        narrate('Terça-feira, 15 de outubro. Garoa fina desde cedo.'),
        bell('elias', 'Bom dia! O senhor que é o Seu Augusto? Me falaram que aqui revela bem.'),
        say('augusto', 'Revela bem e revela rápido. Em que posso ajudar?'),
        say('elias', 'Elias Prado, motorista do Expresso Guilela. Achei isto na beira da estrada, descendo a serra. Caída no mato.'),
        narrate('Uma câmera de fole, amassada, com a lente rachada. Na bolsa de couro, duas iniciais gravadas: H. V.'),
        say('augusto', 'Ainda tem filme dentro. Se o senhor quiser, eu revelo. Quem sabe aparece o dono.'),
        say('elias', 'Era isso que eu queria. E já que estou aqui, revela o meu também, da rota da semana. Busco na quinta.'),
        narrate('Elias deixa dois rolos no balcão e volta para o caminhão. Na porta da cabine, uma luneta pintada.'),
      ],
    },
    {
      kind: 'tank',
      actions: [
        { text: 'Luz apagada. O rolo da câmera vai para o tanque primeiro. No escuro, o cheiro chega antes: vinagre.', label: 'Abrir o chassi', cue: 'cassette' },
        {
          text: 'O filme é velho e duro, enrolado há tempo demais. Ele resiste na espiral e volta a se enrolar sozinho.',
          label: 'Segure para enrolar',
          hold: 6,
        },
        { text: 'Na terceira volta, o filme cede. A espiral desce no tanque.', label: 'Fechar o tanque', cue: 'lid' },
        { text: 'Revelador, fixador, água. Os negativos secam, e a luz vermelha volta.', label: 'Acender a luz vermelha' },
      ],
    },
    { kind: 'roll', roll: PRACA },
    {
      kind: 'wall',
      hint: 'As cópias secaram. Passe a lupa no fundo de cada foto. Uma cópia que ficou mais tempo no revelador mostra mais.',
    },
    {
      kind: 'talk',
      lines: [
        say('augusto', 'Isso não é defeito do filme.'),
        narrate('Seu Augusto procura o cartão que o Elias deixou e liga para o Expresso Guilela.', { cue: 'phone' }),
        narrate('Meia hora depois, o caminhão para na porta.'),
      ],
    },
    {
      kind: 'deliver',
      roll: 'vilela-praca',
      before: [bell('elias', 'Vim correndo. O que tem nas fotos?'), say('augusto', 'Veja o senhor mesmo. Repare no fundo.')],
      after: moods('elias', {
        good: 'É gente na praça, ué... Espera. Esse aí está em todas. E nessa última está colado na lente. Quem segurava a câmera?',
        pale: 'Estão tão clarinhas que mal dá para ver o povo. O senhor disse para olhar o fundo... o que tem no fundo?',
        dark: 'Escuras, mas tem um vulto mais escuro que o resto. Em todas. Não é sombra de árvore, é?',
        blurry: 'Borradas... mas o borrão comprido lá atrás está em todas. Não é sujeira, é?',
        mixed: 'Umas boas, outras não. Mas esse sujeito alto está em todas, Seu Augusto.',
      }),
    },
    {
      kind: 'talk',
      lines: [
        say('augusto', 'Eu fiz mais de uma cópia. Ele está em todas, Elias. E a última foi tirada de onde ninguém poderia estar.'),
        say('elias', 'Isso é coisa de polícia. A câmera tem nome gravado. Alguém está procurando esse homem.'),
        narrate('Seu Augusto liga para a delegacia da rua de cima. Quem vem é o Inspetor Moura, de chapéu e guarda-chuva.'),
        bell('moura', 'Boa tarde. Uma câmera achada na estrada, é isso?'),
        say('elias', 'Achei descendo a serra. Nem mexi, só trouxe para revelar.'),
        say('moura', 'H. V. Vou ver se bate com alguma queixa. O negativo vai junto, e as cópias também.'),
        narrate('O inspetor embrulha a câmera, o rolo e as cópias num jornal e leva tudo. Elias vai embora logo depois, sem esperar o café.'),
        narrate('Mas Seu Augusto viu as fotos. E o que estava nelas não foi embrulhado no jornal.'),
        narrate('Seis da tarde. A garoa virou chuva.'),
        bell('amanda', 'O senhor está pálido, Seu Augusto. Viu assombração?'),
        say('augusto', 'Vi umas fotos estranhas. Já foram para a polícia.'),
        say('amanda', 'Que coincidência. Hoje é "O Retrato de Dorian Gray". Um moço bonito e um retrato que envelhece no lugar dele.'),
        say('augusto', 'E o retrato fica com as rugas.'),
        say('amanda', 'Fica com tudo o que ele esconde. Retrato guarda segredo, Seu Augusto. Cuidado com o que o senhor revela.'),
        narrate('Ela abre o guarda-chuva preto e some na chuva.'),
      ],
    },
    {
      kind: 'end',
      title: 'Fim do segundo dia',
      text: 'A câmera foi com a polícia. As fotos, não: elas ficaram com você.',
    },
  ],
}
