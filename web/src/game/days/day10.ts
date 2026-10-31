import type { DayScript, Roll } from '../script'
import { bell, narrate, say, seen } from './lines'

// Dia 10, quinta-feira, 24 de outubro. Um rolo sem nome com retratos seus,
// num estúdio em que você nunca posou. A cada foto, o seu rosto mais
// borrado. A última é você de cigarro aceso, no sábado em que queimou o rolo.
// Depois, a escolha, sem resposta certa.

const semNome: Roll = {
  id: 'sem-nome',
  customer: 'menino',
  film: '35mm',
  title: 'Sem nome',
  photos: [
    {
      id: 'cadeira',
      verso: 'Sem anotação',
      exposure: 12,
      focus: 0.58,
      details: [
        { id: 'voce', x: 0.5, y: 0.45, r: 0.08, text: 'É você, sentado num estúdio. Você nunca posou para foto nenhuma.' },
        seen('sem-nome', 'cadeira', 'No canto claro, de pé. Esperando.'),
      ],
    },
    {
      id: 'olhar',
      verso: 'Sem anotação',
      exposure: 12,
      focus: 0.58,
      details: [seen('sem-nome', 'olhar', 'Lá atrás, no fundo. Você olha para a câmera; ele, para você.')],
    },
    {
      id: 'cintura',
      verso: 'Sem anotação',
      exposure: 11,
      focus: 0.58,
      details: [
        { id: 'fumaca', x: 0.12, y: 0.2, r: 0.06, text: 'A fumaça do cigarro sobe reta. Você não fuma desde 1940.' },
        seen('sem-nome', 'cintura', 'Atrás do seu ombro, entre a cabeça e o cotovelo.'),
      ],
    },
    {
      id: 'cigarro',
      verso: 'Sem anotação',
      exposure: 11,
      focus: 0.58,
      details: [
        { id: 'rosto-arrastado', x: 0.4, y: 0.4, r: 0.08, text: 'O seu rosto saiu arrastado para os lados. Só o rosto.' },
        seen('sem-nome', 'cigarro', 'Mais perto. Mais alto que você, mesmo de pé lá atrás.'),
      ],
    },
    {
      id: 'rosto',
      verso: 'Sem anotação',
      exposure: 12,
      focus: 0.58,
      details: [
        { id: 'gravata', x: 0.45, y: 0.85, r: 0.05, text: 'De frente. Não sobrou rosto. Só o nó da gravata.' },
        seen('sem-nome', 'rosto', 'Logo atrás do seu ombro.'),
      ],
    },
    {
      id: 'fogo',
      verso: 'Sábado, 19/10',
      exposure: 10,
      focus: 0.58,
      details: [
        { id: 'fogo', x: 0.47, y: 0.62, r: 0.07, text: 'O cigarro aceso. O mesmo fósforo de sábado, o que queimou o rolo.' },
        seen('sem-nome', 'fogo', 'Ele estava do seu lado o tempo todo.'),
      ],
    },
  ],
}

export const DAY10: DayScript = {
  day: 10,
  title: 'Quinta-feira',
  steps: [
    {
      kind: 'talk',
      lines: [
        narrate('Quinta-feira, 24 de outubro.'),
        say('radio', 'Rádio Garoa, oito horas. Notícias da cidade.'),
        say('radio', 'A Foto Íris está aberta. O revelador está nos fundos, sozinho. A luz vermelha está acesa.', { cue: 'silence' }),
        narrate('O locutor para. Depois volta a valsa, com uma nota errada.'),
        bell('menino', 'Moço! Tava aqui na porta, com dinheiro em cima e um papel: "Revelar. Seu Augusto sabe."'),
        say('augusto', 'Quem deixou?'),
        say('menino', 'Sei não, moço. Quando eu cheguei já tava aí.'),
        narrate('O menino pega o trocado e sai correndo. O rolo é de 35 milímetros, sem nome.'),
        narrate('Seu Augusto não lembra de ter fotografado nada. Revela assim mesmo.'),
      ],
    },
    { kind: 'roll', roll: semNome },
    { kind: 'wall', hint: 'A última cópia secou. Olhe cada uma.' },
    {
      kind: 'choice',
      prompt: 'O que você faz com o rolo?',
      options: [
        {
          id: 'queimar',
          label: 'Queimar de novo',
          look: 'fire',
          title: 'Queimar de novo',
          text: 'O ciclo recomeça. Na prateleira, um envelope que ninguém lembra de quem é.',
          lines: [
            narrate('Álcool, fósforo, a pia. O rolo pega fogo, alto e branco.', { cue: 'match' }),
            narrate('Conforme queima, alívio. O mesmo alívio de sábado.'),
            narrate('Segunda-feira, 14 de outubro de 1957. Oito da manhã. A Foto Íris abre as portas.'),
            say('augusto', 'Gravata no lugar, balcão limpo, rádio ligado lá nos fundos. Bom dia, São Paulo.'),
          ],
        },
        {
          id: 'revelar',
          label: 'Revelar até o fim',
          look: 'white',
          title: 'Revelar até o fim',
          text: 'A imagem escureceu até estourar em branco. Na Foto Íris, a luz vermelha continua acesa, e não tem ninguém na bancada.',
          lines: [
            narrate('Seu Augusto faz mais uma cópia da última foto e não tira da bandeja.'),
            narrate('Um minuto. Dois. A imagem escurece: o fogo, o seu rosto, ele.'),
            narrate('Escurece até não ter mais o que escurecer.', { cue: 'silence' }),
            narrate('E então fica branca.'),
          ],
        },
        {
          id: 'entregar',
          label: 'Entregar o rolo a um cliente',
          look: 'door',
          title: 'Entregar o rolo',
          text: 'Seu Augusto voltou a sair inteiro nas fotos. Na casa da Dona Cida, alguém vai revelar um rolo sem nome.',
          lines: [
            narrate('Seu Augusto põe o rolo num envelope novo e escreve na frente, com a letra caprichada: "Revelar só as boas."'),
            narrate('Sexta-feira de manhã.'),
            bell('cida', 'Bom dia, Seu Augusto! O senhor está com uma cara ótima hoje.'),
            say('augusto', 'Dona Cida, achei isto no balcão. É da senhora? Tem cara de foto de família.'),
            say('cida', 'Deve ser do Juvenal, ele esquece tudo. Deixa que eu levo, revelo lá perto de casa.'),
            narrate('Ela põe o envelope na bolsa. O sino da porta toca quando ela sai.'),
            narrate('No rádio, a valsa toca certinha.'),
          ],
        },
      ],
    },
    { kind: 'end', title: 'Fim', text: '' },
  ],
}
