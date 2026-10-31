import type { DayScript, Roll } from '../script'
import { bell, moods, narrate, say, seen } from './lines'

// Dia 3, quarta-feira, 16 de outubro. O rádio noticia o sumiço de um tal
// Vilela. De volta à rotina, a figura aparece ao longe no piquenique da
// Dona Cida, no alto do morro do sítio. A Marlene deixa as normalistas para buscar na segunda.

const piquenique: Roll = {
  id: 'cida-piquenique',
  customer: 'cida',
  film: '35mm',
  title: 'Piquenique no sítio',
  photos: [
    {
      id: 'toalha',
      verso: 'O piquenique no sítio do compadre. Sábado, 12/10/57',
      exposure: 8,
      focus: 0.64,
      details: [
        { id: 'colete', x: 0.34, y: 0.62, r: 0.06, text: 'O Juvenal de colete, sem o paletó. A Dona Cida tinha razão.' },
        { id: 'gravata', x: 0.73, y: 0.49, r: 0.05, text: 'O compadre de gravata-borboleta, mesmo no mato.' },
      ],
    },
    {
      id: 'turma',
      verso: 'A turma toda (menos eu, que tirei)',
      exposure: 8,
      focus: 0.64,
      details: [seen('cida-piquenique', 'turma', 'Lá longe, no alto do morro, alguém parado. De frente para a câmera.')],
    },
    {
      id: 'soneca',
      verso: 'A Lúcia dormiu no mato, com colar de flor',
      exposure: 9,
      focus: 0.64,
      details: [{ id: 'colar', x: 0.3, y: 0.63, r: 0.06, text: 'O colar é de carrapicho. Coisa do Toninho, aposto.' }],
    },
    {
      id: 'patos',
      verso: 'Na volta, os patos do Jardim da Luz',
      exposure: 8,
      focus: 0.64,
    },
  ],
}

const normalistas: Roll = {
  id: 'marlene-normal',
  customer: 'marlene',
  film: '35mm',
  title: 'As normalistas',
  photos: [
    {
      id: 'passeio',
      verso: 'A turma da Normal no passeio. Sáb 12/10',
      exposure: 9,
      focus: 0.44,
      details: [{ id: 'arvore', x: 0.66, y: 0.55, r: 0.06, text: 'Debaixo do pinheiro, o único pedaço de sombra do morro.' }],
    },
    {
      id: 'banco',
      verso: 'Eu, a Célia e a Dirce. Ampliar esta!',
      exposure: 8,
      focus: 0.44,
      details: [{ id: 'trancas', x: 0.28, y: 0.38, r: 0.05, text: 'A Marlene de tranças, como no primeiro dia de aula.' }],
    },
    { id: 'lanche', verso: 'O lanche, na caixa de frutas', exposure: 7, focus: 0.44 },
    {
      id: 'marlene',
      verso: 'De novo, as três (a Ivone que tirou)',
      exposure: 8,
      focus: 0.44,
      details: [{ id: 'tremida', x: 0.21, y: 0.5, r: 0.1, text: 'A Marlene saiu tremida. Só ela. As outras duas e o banco estão nítidos.' }],
    },
  ],
}

export const DAY3: DayScript = {
  day: 3,
  title: 'Quarta-feira',
  steps: [
    {
      kind: 'talk',
      lines: [
        narrate('Quarta-feira, 16 de outubro. Seu Augusto dormiu mal.'),
        say(
          'radio',
          'Rádio Garoa, sete e meia. A polícia procura o senhor Hélio Vilela, fotógrafo amador, que não volta para casa desde domingo.',
        ),
        say('augusto', 'Vilela. H. V.'),
        bell('cida', 'Bom dia, Seu Augusto! Fizemos piquenique no sítio do meu compadre, no sábado. O Juvenal até tirou o paletó.'),
        say('augusto', 'Milagre, Dona Cida.'),
        say('cida', 'Só as boas, viu? Volto à tarde.'),
        bell('marlene', 'Bom dia, Seu Augusto! As meninas da Normal, do passeio de sábado.'),
        say('augusto', 'Bom dia, Marlene. Cópia simples, como sempre?'),
        say('marlene', 'Simples. E uma ampliação daquela no banco, se sair bonita. Busco na segunda, depois da aula.'),
        narrate('Dois rolos de 35 milímetros vão para o tanque, no escuro.'),
      ],
    },
    { kind: 'roll', roll: piquenique },
    { kind: 'roll', roll: normalistas },
    { kind: 'wall', hint: 'Confira as cópias com a lupa antes de pôr nos envelopes.' },
    {
      kind: 'deliver',
      roll: 'cida-piquenique',
      before: [bell('cida', 'Voltei! E o piquenique?'), say('augusto', 'Aqui está, Dona Cida.')],
      after: moods('cida', {
        good: 'Que lindo! Olha o Juvenal de colete, parece outro homem. E a Lúcia dormindo, um anjo.',
        pale: 'Clarinhas como dia de sol. Combina com piquenique, não é?',
        dark: 'Escureceu tudo, parece que choveu no piquenique.',
        blurry: 'Borradinhas... o senhor anda cansado, Seu Augusto?',
        mixed: 'Umas boas, outras nem tanto. Mas estão todos aí, é o que importa.',
      }),
    },
    {
      kind: 'talk',
      lines: [
        say('augusto', 'Dona Cida... na foto da turma. A senhora viu alguém lá no alto do morro?'),
        say('cida', 'No morro? Só se for o caseiro, Seu Augusto. Por quê?'),
        say('augusto', 'Por nada. Coisa de revelador.'),
        narrate('Ela guarda o envelope na bolsa e vai embora. Leva a foto com ela.'),
        narrate('No fim da tarde, o rádio dá a notícia de novo.'),
        say('radio', 'O senhor Hélio Vilela foi visto pela última vez em Campinas, no domingo, a caminho da capital. A família pede notícias.'),
        narrate('Da câmera achada na estrada, o locutor não diz nada. Do Elias, também não.'),
        narrate('O envelope da Marlene fica na prateleira, esperando segunda-feira.'),
      ],
    },
    {
      kind: 'end',
      title: 'Fim do terceiro dia',
      text: 'Lá longe, no alto do morro. Talvez fosse só o caseiro.',
    },
  ],
}
