import type { DayScript, Roll } from '../script'
import { bell, moods, narrate, say } from './lines'

// Dia 8, terça-feira, 22 de outubro. Outro dia calmo, longo o bastante para
// o jogador relaxar. As bodas de prata dos Bastos.

const bodas: Roll = {
  id: 'nakamura-bodas',
  customer: 'nakamura',
  film: '120',
  title: 'Bodas de prata',
  photos: [
    {
      id: 'presente',
      verso: 'O envelope dos colegas da firma. N.',
      exposure: 10,
      focus: 0.36,
      details: [{ id: 'cravo', x: 0.385, y: 0.44, r: 0.05, text: 'O Sr. Bastos de cravo na lapela, como no dia do casamento.' }],
    },
    { id: 'album', verso: 'O álbum do casamento, 25 anos depois. N.', exposure: 11, focus: 0.36 },
    {
      id: 'valsa',
      verso: 'A valsa do casamento, de novo. N.',
      exposure: 12,
      focus: 0.36,
      details: [{ id: 'piano', x: 0.55, y: 0.6, r: 0.07, text: 'Ele mesmo tocou a valsa. Errou a mesma nota de 1932, ela disse.' }],
    },
    { id: 'familia', verso: 'Os filhos. N.', exposure: 10, focus: 0.36 },
    { id: 'casal', verso: 'No fim, só os dois. N.', exposure: 13, focus: 0.36 },
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
        bell('nakamura', 'Augusto-san. Bodas de prata dos Bastos. Vinte e cinco anos, e ele ainda toca a valsa para ela.'),
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
        good: 'Bom trabalho. A Dona Olga vai chorar. O senhor voltou, Augusto-san.',
        pale: 'Pálidas. Bodas de prata, não de neblina.',
        dark: 'Escuras. A sala já era escura, Augusto-san.',
        blurry: 'Fora de foco. O senhor estava indo tão bem.',
        mixed: 'Umas boas. A dos dois sozinhos eu levo de qualquer jeito.',
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
