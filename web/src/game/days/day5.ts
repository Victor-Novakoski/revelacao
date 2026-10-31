import type { DayScript, Roll } from '../script'
import { bell, moods, narrate, say, seen } from './lines'

// Dia 5, sexta-feira, 18 de outubro. O Elias não atende: do outro lado da
// linha, só uma goteira e a valsa. O Inspetor Moura não lembra dele, só de
// Seu Augusto entregando a câmera. Só a Senhorita Amanda lembra.

const estudio: Roll = {
  id: 'nakamura-estudio',
  customer: 'nakamura',
  film: '120',
  title: 'Retratos do estúdio',
  photos: [
    {
      id: 'keiko',
      verso: 'Keiko, 5 anos. N.',
      exposure: 9,
      focus: 0.36,
      details: [{ id: 'laco', x: 0.4, y: 0.3, r: 0.05, text: 'O laço é maior que a cabeça dela.' }],
    },
    { id: 'okada', verso: 'Dona Okada, 80 anos, e a neta. N.', exposure: 11, focus: 0.36 },
    {
      id: 'rapaz',
      verso: 'Formatura do filho dos Tanaka. N.',
      exposure: 12,
      focus: 0.36,
      details: [seen('nakamura-estudio', 'rapaz', 'No fundo pintado, atrás do rapaz, alguém que não é pintura. E não estava no estúdio.')],
    },
    { id: 'ito', verso: 'Família Ito. N.', exposure: 10, focus: 0.36 },
  ],
}

export const DAY5: DayScript = {
  day: 5,
  title: 'Sexta-feira',
  steps: [
    {
      kind: 'talk',
      lines: [
        narrate('Sexta-feira, 18 de outubro. O envelope do Elias amanheceu na prateleira.'),
        bell('nakamura', 'Augusto-san. Os retratos do estúdio, da semana. Busco no fim do dia.'),
        say('augusto', 'Pode deixar, Seu Nakamura.'),
        narrate('No cartão do Elias, embaixo do nome do Expresso Guilela, um número de casa escrito a lápis.'),
        narrate('Seu Augusto disca.', { cue: 'phone' }),
        say('augusto', 'Alô? Elias? É da Foto Íris. O seu rolo está pronto.'),
        narrate('Alguém atende. Ninguém fala. Do outro lado, uma goteira e, bem baixinho, a mesma valsa do rádio da bancada.', {
          cue: 'line',
        }),
        narrate('Seu Augusto desliga devagar.'),
        say('augusto', 'Polícia, então.'),
        narrate('Ele liga para a delegacia e pede pelo Inspetor Moura. Meia hora depois, o inspetor está no balcão.'),
        bell('moura', 'Seu Augusto. Em que posso ajudar?'),
        say('augusto', 'É sobre o Elias. O motorista que achou a câmera do Vilela. Ele sumiu.'),
        say('moura', 'Motorista? A câmera quem me entregou foi o senhor. Estava aqui no balcão, o senhor ligou e eu vim buscar.'),
        say('augusto', 'O Elias estava aqui do lado. Expresso Guilela, um caminhão com a porta riscada a giz.'),
        say('moura', 'Eu anoto tudo, Seu Augusto. Olhe.'),
        narrate(
          'Ele abre o caderno. "Terça, 15/10. Câmera de fole entregue por Augusto Ferraz, Foto Íris. Rolo e cópias anexados." Nenhum outro nome.',
        ),
        say('moura', 'O Vilela continua sumido. O senhor devia descansar. Revelador tem cheiro forte.'),
        narrate('O inspetor vai embora. Seu Augusto volta para a câmara escura. Ainda tem trabalho.'),
      ],
    },
    { kind: 'roll', roll: estudio },
    { kind: 'wall', hint: 'Confira as cópias com a lupa.' },
    {
      kind: 'deliver',
      roll: 'nakamura-estudio',
      before: [bell('nakamura', 'Augusto-san. Os retratos?'), say('augusto', 'Aqui, Seu Nakamura.')],
      after: moods('nakamura', {
        good: 'Bons. A Keiko vai gostar do laço. Obrigado.',
        pale: 'Pálidas. A Dona Okada vai parecer um fantasma. Ela não vai gostar.',
        dark: 'Escuras. No estúdio a luz era boa, Augusto-san.',
        blurry: 'Fora de foco. Duas vezes na mesma semana. Descanse.',
        mixed: 'Umas boas. As outras eu mesmo refaço.',
      }),
    },
    {
      kind: 'talk',
      lines: [
        say('augusto', 'Seu Nakamura, o senhor lembra do moço do caminhão? Esteve aqui na terça.'),
        say('nakamura', 'Na terça eu não vim, Augusto-san.'),
        narrate('Seis da tarde. Seu Augusto não espera a Senhorita Amanda: vai até a livraria ao lado.'),
        say('amanda', 'Seu Augusto, na minha livraria! Hoje é "Drácula". Quer emprestado?'),
        say('augusto', 'Senhorita, a senhorita lembra de um moço que esteve na loja na terça? Motorista, de boné.'),
        say('amanda', 'Aquele moço do caminhão? Com a porta toda riscada a giz? Lembro. Estacionou em cima da minha calçada.'),
        say('augusto', 'A senhorita lembra.'),
        say('amanda', 'Por que não lembraria? No "Drácula" tem um homem que não aparece no espelho. O senhor está com a cara de quem percebeu.'),
        say('augusto', 'Percebeu o quê?'),
        say('amanda', 'Que o problema não é o espelho. É quem está olhando.'),
        say('augusto', 'E o que se faz, então?'),
        say('amanda', 'No livro? Fecham as janelas, penduram alho e rezam. Na vida, eu não sei. Boa noite, Seu Augusto. Durma de luz acesa.'),
        narrate('Ele volta pela calçada e, pela primeira vez em anos, deixa a luz vermelha da câmara escura acesa a noite inteira.'),
      ],
    },
    {
      kind: 'end',
      title: 'Fim do quinto dia',
      text: 'Ninguém lembra do Elias. Só a Senhorita Amanda. E você.',
    },
  ],
}
