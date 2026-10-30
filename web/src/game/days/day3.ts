import type { DayScript, Roll } from '../script'
import { bell, moods, narrate, say, seen } from './lines'

// Dia 3, quarta-feira, 16 de outubro. O rádio noticia o sumiço de um tal
// Vilela. De volta à rotina, a figura aparece ao longe numa foto da Dona
// Cida. A Marlene deixa as normalistas para buscar na segunda.

const piquenique: Roll = {
  id: 'cida-piquenique',
  customer: 'cida',
  film: '35mm',
  title: 'Piquenique no parque',
  photos: [
    {
      id: 'toalha',
      verso: 'O piquenique. Sábado, 12/10/57',
      exposure: 8,
      focus: 0.64,
      details: [{ id: 'guardanapo', x: 0.44, y: 0.8, r: 0.05, text: 'A Lúcia escondeu um pedaço de bolo no guardanapo.' }],
    },
    {
      id: 'correndo',
      verso: 'Os meninos atrás da bola',
      exposure: 8,
      focus: 0.64,
      details: [seen('cida-piquenique', 'correndo', 'Lá longe, na fileira de árvores, alguém parado. De frente para a câmera.')],
    },
    {
      id: 'chapeu',
      verso: 'O Juvenal sem paletó!',
      exposure: 9,
      focus: 0.64,
      details: [{ id: 'chapeu', x: 0.24, y: 0.66, r: 0.06, text: 'Seu Juvenal dormiu de novo, de chapéu na cara.' }],
    },
    {
      id: 'patos',
      verso: 'Eu e o Zezinho dando pão aos patos',
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
    { id: 'escada', verso: 'Nós na escadaria da Escola. Sáb 12/10', exposure: 9, focus: 0.44 },
    {
      id: 'banco',
      verso: 'Eu, a Célia e a Dirce. Ampliar esta!',
      exposure: 8,
      focus: 0.44,
      details: [{ id: 'chifrinho', x: 0.38, y: 0.4, r: 0.05, text: 'A Dirce está fazendo chifrinho na Célia.' }],
    },
    { id: 'sorvete', verso: 'Sorvete depois da aula', exposure: 7, focus: 0.44 },
    {
      id: 'marlene',
      verso: 'Eu (a Célia que tirou)',
      exposure: 8,
      focus: 0.44,
      details: [{ id: 'tremida', x: 0.5, y: 0.6, r: 0.08, text: 'A Marlene saiu tremida. Só ela. O poste ao lado está nítido.' }],
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
        bell('cida', 'Bom dia, Seu Augusto! Fizemos piquenique no parque no sábado. O Juvenal até tirou o paletó.'),
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
        good: 'Que lindo! Olha o Juvenal de chapéu na cara. E os meninos correndo, que alegria.',
        pale: 'Clarinhas como dia de sol. Combina com piquenique, não é?',
        dark: 'Escureceu tudo, parece que choveu no piquenique.',
        blurry: 'Borradinhas... o senhor anda cansado, Seu Augusto?',
        mixed: 'Umas boas, outras nem tanto. Mas estão todos aí, é o que importa.',
      }),
    },
    {
      kind: 'talk',
      lines: [
        say('augusto', 'Dona Cida... na foto dos meninos correndo. A senhora viu alguém lá perto das árvores?'),
        say('cida', 'No parque? Tinha gente para todo lado, Seu Augusto. Por quê?'),
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
      text: 'Lá longe, entre as árvores. Talvez fosse só alguém no parque.',
    },
  ],
}
