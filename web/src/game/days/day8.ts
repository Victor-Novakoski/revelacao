import type { DayScript, Roll } from '../script'
import { bell, moods, narrate, say } from './lines'

// Dia 8, terça-feira, 22 de outubro. Outro dia calmo, longo o bastante para
// o jogador relaxar. As bodas de prata dos Yamada.

const bodas: Roll = {
  id: 'nakamura-bodas',
  customer: 'nakamura',
  film: '120',
  title: 'Bodas de prata',
  photos: [
    { id: 'casal', verso: 'Sr. e Sra. Yamada. N.', exposure: 10, focus: 0.36 },
    { id: 'bolo', verso: 'O bolo dos 25 anos. N.', exposure: 11, focus: 0.36 },
    {
      id: 'danca',
      verso: 'A primeira valsa, de novo. N.',
      exposure: 12,
      focus: 0.36,
      details: [{ id: 'valsa', x: 0.5, y: 0.6, r: 0.07, text: 'Os dois rindo. Ele pisou no pé dela.' }],
    },
    { id: 'familia', verso: 'Os filhos e as noras. N.', exposure: 10, focus: 0.36 },
    { id: 'salao', verso: 'No fim, só os dois. N.', exposure: 13, focus: 0.36 },
  ],
}

export const DAY8: DayScript = {
  day: 8,
  title: 'Terça-feira',
  steps: [
    {
      kind: 'talk',
      lines: [
        narrate('Terça-feira, 22 de outubro. Garoa de manhã, sol à tarde.'),
        bell('nakamura', 'Augusto-san. Bodas de prata dos Yamada. Vinte e cinco anos, e ainda dançam.'),
        say('augusto', 'Bonito isso, Seu Nakamura.'),
        say('nakamura', 'Cinco chapas. Hoje escolhi uma a mais. A última é a melhor.'),
        narrate('Um rolo de 120 para o tanque.'),
      ],
    },
    { kind: 'roll', roll: bodas },
    { kind: 'wall', hint: 'Confira as cópias com a lupa.' },
    {
      kind: 'deliver',
      roll: 'nakamura-bodas',
      before: [bell('nakamura', 'Augusto-san.'), say('augusto', 'Cinco, Seu Nakamura. A última é a melhor mesmo.')],
      after: moods('nakamura', {
        good: 'Bom trabalho. A Sra. Yamada vai chorar. O senhor voltou, Augusto-san.',
        pale: 'Pálidas. Bodas de prata, não de neblina.',
        dark: 'Escuras. O salão já era escuro, Augusto-san.',
        blurry: 'Fora de foco. O senhor estava indo tão bem.',
        mixed: 'Umas boas. A do salão vazio eu levo de qualquer jeito.',
      }),
    },
    {
      kind: 'talk',
      lines: [
        narrate('À tarde, o rádio toca a valsa, depois um choro, depois a valsa de novo.'),
        narrate('Na prateleira, o envelope da Marlene. Seu Augusto passa o espanador por cima e não pensa nisso.'),
        say('augusto', 'Amanhã é quarta.'),
      ],
    },
    {
      kind: 'end',
      title: 'Fim do oitavo dia',
      text: 'Nada aconteceu. Nada mesmo.',
    },
  ],
}
