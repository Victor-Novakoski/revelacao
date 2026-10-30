import type { DayScript, Line, Roll } from '../script'

// Dia 1, segunda-feira, 14 de outubro de 1957. Rotina: Dona Cida e Seu
// Nakamura trazem rolos, e o jogador aprende os três gestos (ampliador,
// bandeja, varal) e a lupa do mural. No fim da tarde, a Senhorita Amanda.
// Nenhuma figura em foto nenhuma: o dia 1 é para o jogador ver como é uma
// foto normal.

const cida: Roll = {
  id: 'cida-toninho',
  customer: 'cida',
  film: '35mm',
  title: 'Aniversário do Toninho',
  photos: [
    {
      id: 'bolo',
      verso: 'Toninho, 7 anos. O bolo. 13/10/57',
      exposure: 8,
      focus: 0.64,
      details: [{ id: 'dedo', x: 0.58, y: 0.5, r: 0.06, text: 'O Toninho já está com o dedo na cobertura.' }],
    },
    {
      id: 'portao',
      verso: 'Os netos no portão. Toninho, Lúcia e o Zezinho',
      exposure: 8,
      focus: 0.64,
    },
    {
      id: 'poltrona',
      verso: 'O Juvenal depois do almoço, como sempre',
      exposure: 10,
      focus: 0.64,
      details: [{ id: 'gato', x: 0.4, y: 0.79, r: 0.06, text: 'Tem um gato dormindo embaixo da poltrona também.' }],
    },
    {
      id: 'quintal',
      verso: 'Eu e a Lúcia no quintal. Quem tirou foi o Toninho',
      exposure: 7,
      focus: 0.64,
    },
  ],
}

const nakamura: Roll = {
  id: 'nakamura-casamento',
  customer: 'nakamura',
  film: '120',
  title: 'Casamento na Liberdade',
  photos: [
    {
      id: 'escadaria',
      verso: 'Noivos na escadaria. Sábado, 12/10/57. N.',
      exposure: 10,
      focus: 0.36,
    },
    {
      id: 'familia',
      verso: 'As duas famílias. N.',
      exposure: 12,
      focus: 0.36,
      details: [{ id: 'padrinho', x: 0.62, y: 0.39, r: 0.05, text: 'O padrinho piscou. Sempre tem um.' }],
    },
    {
      id: 'brinde',
      verso: 'O brinde. N.',
      exposure: 10,
      focus: 0.36,
    },
    {
      id: 'arroz',
      verso: 'Saída da igreja. N.',
      exposure: 9,
      focus: 0.36,
      details: [{ id: 'menino', x: 0.27, y: 0.8, r: 0.06, text: 'Um menino catando o arroz do chão.' }],
    },
  ],
}

const bell = (who: Line['who'], text: string): Line => ({ who, text, bell: true })

export const DAY1: DayScript = {
  day: 1,
  title: 'Segunda-feira',
  steps: [
    {
      kind: 'talk',
      lines: [
        { who: 'narrator', text: 'Segunda-feira, 14 de outubro de 1957. Oito da manhã. A Foto Íris abre as portas.' },
        { who: 'augusto', text: 'Gravata no lugar, balcão limpo, rádio ligado lá nos fundos. Bom dia, São Paulo.' },
        bell('cida', 'Bom dia, Seu Augusto! Trouxe o aniversário do Toninho. Sete anos, acredita?'),
        { who: 'augusto', text: 'Sete já, Dona Cida? Parece que foi ontem que a senhora trouxe o batizado.' },
        { who: 'cida', text: 'Revela só as boas, viu? Metade eu tirei com o dedo na frente.' },
        { who: 'narrator', text: 'Dona Cida deixa um rolo de 35 milímetros no balcão e promete voltar depois do almoço.' },
        bell('nakamura', 'Bom dia, Augusto-san. O casamento de sábado, lá na Liberdade.'),
        { who: 'augusto', text: 'Filme 120, como sempre. O senhor não confia em outro.' },
        { who: 'nakamura', text: 'Negativo grande perdoa noivo nervoso. Escolhi quatro chapas. A família quer ver hoje.' },
        { who: 'augusto', text: 'Às cinco estão no envelope, Seu Nakamura.' },
      ],
    },
    {
      kind: 'tank',
      actions: [
        {
          text: 'Antes das cópias, os negativos. Seu Augusto apaga até a luz vermelha: o filme não pode ver luz nenhuma. No escuro total, nem a mão aparece.',
          label: 'Abrir o chassi',
          cue: 'cassette',
        },
        {
          text: 'Pelo tato, a ponta do filme entra na espiral. Agora é enrolar devagar, sem dobrar. Mantenha o botão apertado; se soltar, a mão acha a ponta de novo.',
          label: 'Segure para enrolar',
          hold: 4,
        },
        {
          text: 'Os dois filmes na espiral. A espiral desce no tanque.',
          label: 'Fechar o tanque',
          cue: 'lid',
        },
        {
          text: 'Revelador, fixador, água corrente. Quando os negativos secam, Seu Augusto acende a luz vermelha para fazer as cópias.',
          label: 'Acender a luz vermelha',
        },
      ],
    },
    {
      kind: 'roll',
      roll: cida,
      hints: {
        enlarger:
          'Gire o foco até o negativo ficar nítido. Depois escolha os segundos de luz e acenda o ampliador. Uns 8 segundos costumam dar certo; negativo mais escuro pede mais.',
        tray: 'Balance a bandeja e espere a imagem surgir. Tire na hora certa: cedo sai pálida, tarde sai escura.',
        line: 'Arraste a cópia até o varal para secar.',
      },
    },
    { kind: 'roll', roll: nakamura },
    {
      kind: 'wall',
      hint: 'As cópias secaram. Confira cada uma com a lupa antes de pôr no envelope. Abra uma foto para ver de perto e vire para ler o verso.',
    },
    {
      kind: 'deliver',
      roll: 'cida-toninho',
      before: [
        bell('cida', 'Voltei, Seu Augusto! Ficaram prontas?'),
        { who: 'augusto', text: 'Estão aqui no envelope, Dona Cida. Quatro, só as boas.' },
      ],
      after: {
        good: [
          { who: 'cida', text: 'Ai, que beleza! O Toninho com a cara toda de glacê. Vou mandar uma para a minha irmã em Bauru.' },
        ],
        pale: [{ who: 'cida', text: 'Estão clarinhas, não estão? Parece que foi tirada na garoa. Bom, dá para ver quem é quem.' }],
        dark: [
          {
            who: 'cida',
            text: 'Nossa, como estão escuras! O Juvenal sumiu inteirinho na poltrona. Ainda bem que eu sei que ele estava lá.',
          },
        ],
        blurry: [{ who: 'cida', text: 'Estão borradas, Seu Augusto. Os óculos são meus, mas o defeito não é.' }],
        mixed: [{ who: 'cida', text: 'Umas boas, outras nem tanto. Mas estão todos aí, é o que importa.' }],
      },
    },
    {
      kind: 'deliver',
      roll: 'nakamura-casamento',
      before: [
        bell('nakamura', 'Augusto-san.'),
        { who: 'augusto', text: 'Seu Nakamura. Quatro cópias, como o senhor pediu.' },
      ],
      after: {
        good: [{ who: 'nakamura', text: 'Bom trabalho. A noiva vai chorar de novo. Até sábado que vem.' }],
        pale: [{ who: 'nakamura', text: 'Pálidas. Vestido de noiva já é branco, Augusto-san. Não precisa ajudar.' }],
        dark: [{ who: 'nakamura', text: 'Escuras demais. O noivo de terno preto virou uma sombra. Amanhã refazemos.' }],
        blurry: [{ who: 'nakamura', text: 'Fora de foco. Na minha câmera não estava assim. O senhor está cansado?' }],
        mixed: [{ who: 'nakamura', text: 'Algumas eu aproveito. As outras o senhor refaz amanhã. Obrigado.' }],
      },
    },
    {
      kind: 'talk',
      lines: [
        { who: 'narrator', text: 'Seis da tarde. Quando ele vira a plaquinha para "Fechado", o sino toca mais uma vez.' },
        bell('amanda', 'Ainda dá tempo, Seu Augusto? Só vim devolver o guarda-chuva que o senhor esqueceu na livraria.'),
        { who: 'narrator', text: 'Sempre de preto. Na outra mão, um livro velho com o dedo marcando a página.' },
        { who: 'augusto', text: 'Obrigado, Senhorita Amanda. E o livro de hoje?' },
        { who: 'amanda', text: '"Noite na Taverna". Uns rapazes bebendo numa taverna e contando histórias horríveis, uma pior que a outra.' },
        { who: 'augusto', text: 'E a senhorita lê isso antes de dormir?' },
        { who: 'amanda', text: 'É o melhor horário. O senhor devia experimentar. Quem mexe com fotografia tem cara de quem gosta de assombração.' },
        { who: 'augusto', text: 'Eu só revelo o que estava na frente da lente, senhorita.' },
        { who: 'amanda', text: 'É o que todo mundo diz no primeiro capítulo. Boa noite, Seu Augusto.' },
        { who: 'narrator', text: 'Ela sai. Lá nos fundos, o rádio ainda toca a valsa.' },
      ],
    },
    {
      kind: 'end',
      title: 'Fim do primeiro dia',
      text: 'Um dia comum na Foto Íris. Amanhã é terça-feira.',
    },
  ],
}
