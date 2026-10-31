import type { DayScript, Line, Roll } from '../script'

// Dia 1, segunda-feira, 14 de outubro de 1957. Rotina: Dona Cida e Seu
// Nakamura trazem rolos, e o jogador aprende os três gestos (ampliador,
// bandeja, varal) e a lupa do mural. No fim da tarde, a Senhorita Amanda.
// Nenhuma figura em foto nenhuma: o dia 1 é para o jogador ver como é uma
// foto normal.

const cida: Roll = {
  id: 'cida-lucia',
  customer: 'cida',
  film: '35mm',
  title: 'Aniversário da Lúcia',
  photos: [
    {
      id: 'presente',
      verso: 'Lúcia, 9 anos. O presente. 13/10/57',
      exposure: 8,
      focus: 0.64,
      details: [{ id: 'trico', x: 0.51, y: 0.68, r: 0.07, text: 'A boneca veio de touca e vestido de tricô. Ponto de quem tem paciência.' }],
    },
    {
      id: 'netos',
      verso: 'Os netos e os primos, no banco do retratista',
      exposure: 8,
      focus: 0.64,
      details: [{ id: 'rosinha', x: 0.5, y: 0.38, r: 0.05, text: 'A Lúcia não larga a boneca nem para a foto.' }],
    },
    {
      id: 'boneca',
      verso: 'A Lúcia e a Rosinha',
      exposure: 9,
      focus: 0.64,
      details: [{ id: 'fala', x: 0.375, y: 0.5, r: 0.06, text: 'A boneca tem a boca aberta. A Lúcia jura que ela fala.' }],
    },
    {
      id: 'quintal',
      verso: 'Eu com a minha irmã e as meninas. Quem tirou foi o Toninho',
      exposure: 7,
      focus: 0.64,
      details: [{ id: 'toco', x: 0.79, y: 0.65, r: 0.07, text: 'Um toco de cerca bem na frente. Coisa de quem tem sete anos.' }],
    },
  ],
}

const nakamura: Roll = {
  id: 'nakamura-casamento',
  customer: 'nakamura',
  film: '120',
  title: 'Casamento no Bom Retiro',
  photos: [
    {
      id: 'chegada',
      verso: 'Os noivos chegando. Sábado, 12/10/57. N.',
      exposure: 10,
      focus: 0.36,
      details: [{ id: 'menina', x: 0.635, y: 0.65, r: 0.06, text: 'Uma menina de vestido branco atrás da noiva, de olho em tudo.' }],
    },
    {
      id: 'dossel',
      verso: 'Debaixo do dossel, no quintal. N.',
      exposure: 12,
      focus: 0.36,
      details: [{ id: 'xale', x: 0.467, y: 0.44, r: 0.06, text: 'O dossel é um pano esticado em quatro varas. Os noivos ficam embaixo.' }],
    },
    {
      id: 'brinde',
      verso: 'O brinde. N.',
      exposure: 10,
      focus: 0.36,
      details: [{ id: 'andares', x: 0.3, y: 0.54, r: 0.06, text: 'Bolo de três andares. Ninguém teve coragem de cortar ainda.' }],
    },
    {
      id: 'danca',
      verso: 'A dança, já de noite. N.',
      exposure: 9,
      focus: 0.36,
      details: [{ id: 'arcos', x: 0.4, y: 0.45, r: 0.06, text: 'Arcos de flores. As moças dançam com eles nas mãos.' }],
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
        bell('cida', 'Bom dia, Seu Augusto! Trouxe o aniversário da Lúcia. Nove anos, acredita?'),
        { who: 'augusto', text: 'Nove já, Dona Cida? Parece que foi ontem que a senhora trouxe o batizado.' },
        { who: 'cida', text: 'Revela só as boas, viu? Metade eu tirei com o dedo na frente.' },
        { who: 'narrator', text: 'Dona Cida deixa um rolo de 35 milímetros no balcão e promete voltar depois do almoço.' },
        bell('nakamura', 'Bom dia, Augusto-san. O casamento de sábado, lá no Bom Retiro. Dançaram até meia-noite.'),
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
      roll: 'cida-lucia',
      before: [
        bell('cida', 'Voltei, Seu Augusto! Ficaram prontas?'),
        { who: 'augusto', text: 'Estão aqui no envelope, Dona Cida. Quatro, só as boas.' },
      ],
      after: {
        good: [
          { who: 'cida', text: 'Ai, que beleza! A Lúcia agarrada na boneca nova. Vou mandar uma para a minha irmã em Bauru.' },
        ],
        pale: [{ who: 'cida', text: 'Estão clarinhas, não estão? Parece que foi tirada na garoa. Bom, dá para ver quem é quem.' }],
        dark: [
          {
            who: 'cida',
            text: 'Nossa, como estão escuras! A Lúcia e a boneca viraram uma sombra só. Ainda bem que eu sei como elas são.',
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
        dark: [{ who: 'nakamura', text: 'Escuras demais. A dança de noite virou um breu só. Amanhã refazemos.' }],
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
        { who: 'amanda', text: 'É o que todo mundo diz no primeiro capítulo.' },
        { who: 'augusto', text: 'E no último?' },
        { who: 'amanda', text: 'No último ninguém diz mais nada. Boa noite, Seu Augusto. Tranque bem a porta.' },
        {
          who: 'narrator',
          text: 'Ela sai devagar, o livro aberto debaixo do braço. Seu Augusto passa a tranca, apaga a luz da frente e fica um instante parado no escuro da loja.',
        },
        { who: 'narrator', text: 'Lá nos fundos, o rádio ainda toca a valsa, baixinho, para ninguém.' },
      ],
    },
    {
      kind: 'end',
      title: 'Fim do primeiro dia',
      text: 'Um dia comum na Foto Íris. Amanhã é terça-feira.',
    },
  ],
}
