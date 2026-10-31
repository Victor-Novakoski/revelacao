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
          text: 'O ciclo recomeça. Na foto da Dona Cida, lá no fundo, tem um homem de gravata que ela não conhece. Seu Augusto conhece.',
          lines: [
            narrate('Álcool, fósforo, a pia. O rolo pega fogo, alto e branco.', { cue: 'match' }),
            narrate('Conforme queima, alívio. O mesmo alívio de sábado.'),
            narrate('Segunda-feira, 14 de outubro de 1957. Oito da manhã. A Foto Íris abre as portas.'),
            say('augusto', 'Gravata no lugar, balcão limpo, rádio ligado lá nos fundos. Bom dia, São Paulo.'),
            bell('cida', 'Bom dia, Seu Augusto! Trouxe o aniversário da Lúcia. Nove anos, acredita?'),
            narrate('Ele já ouviu isso. Tem certeza de que já ouviu isso.'),
            say('augusto', 'Nove já, Dona Cida? Parece que foi ontem que a senhora trouxe o batizado.'),
            narrate('A frase sai sozinha, igual da outra vez. Na prateleira, atrás do balcão, um envelope sem nome. Ninguém lembra quem deixou.'),
            narrate('À tarde, na cópia do quintal, bem no fundo, tem um homem de pé. Camisa, gravata, sempre arrumado. O rosto, borrado.'),
          ],
        },
        {
          id: 'revelar',
          label: 'Revelar até o fim',
          look: 'white',
          title: 'Revelar até o fim',
          text: 'Seu Augusto revelou tudo e foi junto, para dentro da foto. A Senhorita Amanda guarda a última cópia dentro de um livro, onde ninguém mais vai revelar.',
          lines: [
            narrate('Seu Augusto faz mais uma cópia da última foto e não tira da bandeja.'),
            narrate('Um minuto. Dois. A imagem escurece: o fogo, o seu rosto, ele.'),
            narrate('Escurece até não ter mais o que escurecer.', { cue: 'silence' }),
            narrate('E então fica branca.'),
            narrate('Uma semana depois. Na porta da Foto Íris, uma placa escrita à mão: "Fechado por motivo de doença".'),
            narrate('A Senhorita Amanda entra com a chave que ele deixava embaixo do vaso. A luz vermelha está acesa. Na bandeja, seca, uma última cópia.'),
            narrate('A câmara escura, vazia. No fundo, dois homens de pé, lado a lado. Um tem o rosto borrado. O outro está de gravata, e ela reconhece.'),
            say('amanda', 'Eu disse que olhava, Seu Augusto.'),
            narrate('Ela guarda a cópia dentro do livro e apaga a luz vermelha. Pela primeira vez em trinta anos, a Foto Íris fica no escuro.'),
          ],
        },
        {
          id: 'entregar',
          label: 'Entregar o rolo a um cliente',
          look: 'door',
          title: 'Entregar o rolo',
          text: 'Seu Augusto voltou a sair inteiro nas fotos. A Dona Cida e a Lúcia, não. Ele sabe, e aumenta o rádio.',
          lines: [
            narrate('Seu Augusto põe o rolo num envelope novo e escreve na frente, com a letra caprichada: "Revelar só as boas."'),
            narrate('Sexta-feira de manhã.'),
            bell('cida', 'Bom dia, Seu Augusto! O senhor está com uma cara ótima hoje.'),
            say('augusto', 'Dona Cida, achei isto no balcão. É da senhora? Tem cara de foto de família.'),
            say('cida', 'Deve ser do Juvenal, ele esquece tudo. Deixa que eu levo, revelo lá perto de casa.'),
            narrate('Ela põe o envelope na bolsa. O sino da porta toca quando ela sai.'),
            narrate('Duas semanas depois.'),
            bell('amanda', 'Seu Augusto, o senhor soube da Dona Cida?'),
            say('augusto', 'Faz uns dias que ela não aparece.'),
            say('amanda', 'Mandou revelar um rolo numa loja perto de casa. Desde então não sai mais. Dizem que a Lúcia não dorme de luz apagada. Fica olhando para o fundo do quintal.'),
            narrate('Seu Augusto não responde. No espelho atrás do balcão, ele aparece inteiro, nítido, de gravata.'),
            say('amanda', 'O senhor está com uma cara ótima. Engraçado, não é? Tem gente que melhora quando outro piora.'),
            narrate('Ela sai sem esperar resposta. No rádio, a valsa toca certinha. Ele aumenta o volume.'),
          ],
        },
      ],
    },
    { kind: 'end', title: 'Fim', text: '' },
  ],
}
