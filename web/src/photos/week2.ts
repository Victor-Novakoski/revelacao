import type { Scene } from './day1'
import { realScene } from './real'
import { coreto, lago, pertoVolta, pipoqueiro } from './week1'

// As fotos dos dias 6 a 10. Como em week1.ts, a figura fica na camada
// própria (photos/figures.ts).

// Dia 7 · Dona Cida, "Primeira comunhão da Lúcia" (35 mm). Fotos de
// verdade, ver photos/real.ts.

const comunhaoPorta = realScene('comunhao-porta')
const comunhaoAltar = realScene('comunhao-altar')
const comunhaoIgreja = realScene('comunhao-igreja')
const procissao = realScene('comunhao-procissao')

// Dia 8 · Seu Nakamura, "Bodas de prata" (120). Fotos de verdade, de uma
// festa de 25 anos de casados em casa.

const presente = realScene('bodas-presente')
const album = realScene('bodas-album')
const valsa = realScene('bodas-valsa')
const familiaBodas = realScene('bodas-familia')
const casal = realScene('bodas-casal')

// Dia 9 · Dona Cida, "O quintal" (35 mm). A figura perto, em todas. Fotos
// de verdade, ver photos/real.ts: a Lúcia é a mesma menina que dormiu no
// mato no piquenique.

const bolhas = realScene('quintal-bolhas')
const gramado = realScene('quintal-gramado')
const gatoQuintal = realScene('quintal-gato')
const escada = realScene('quintal-escada')

// Dia 9 · Seu Nakamura, "Casamento na Mooca" (120). Fotos de verdade, ver
// photos/real.ts.

const moocaConvidados = realScene('mooca-convidados')
const moocaFamilia = realScene('mooca-familia')
const moocaNoivos = realScene('mooca-noivos')
const moocaSaida = realScene('mooca-saida')

// Dia 9 · a Senhorita Amanda, "A livraria" (35 mm). Sem figura nenhuma.

const vitrine = realScene('livraria-vitrine')
const estantes = realScene('livraria-estantes')
const gato = realScene('livraria-gato')
const balcao = realScene('livraria-balcao')

// Dia 10 · "Sem nome" (35 mm). Retratos do Seu Augusto que ele não lembra de
// ter posado. A cada foto, o rosto mais borrado (já vem assim de
// art/real/prepare.py).

const cadeira = realScene('augusto-cadeira')
const olhar = realScene('augusto-olhar')
const cintura = realScene('augusto-cintura')
const cigarro = realScene('augusto-cigarro')
const rosto = realScene('augusto-rosto')
const fogo = realScene('augusto-fogo')

export const WEEK2_SCENES: Record<string, Scene> = {
  'vilela-volta/coreto': coreto,
  'vilela-volta/pipoqueiro': pipoqueiro,
  'vilela-volta/lago': lago,
  'vilela-volta/perto': pertoVolta,
  'cida-comunhao/porta': comunhaoPorta,
  'cida-comunhao/altar': comunhaoAltar,
  'cida-comunhao/igreja': comunhaoIgreja,
  'cida-comunhao/procissao': procissao,
  'nakamura-bodas/presente': presente,
  'nakamura-bodas/album': album,
  'nakamura-bodas/valsa': valsa,
  'nakamura-bodas/familia': familiaBodas,
  'nakamura-bodas/casal': casal,
  'cida-quintal/bolhas': bolhas,
  'cida-quintal/gramado': gramado,
  'cida-quintal/gato': gatoQuintal,
  'cida-quintal/escada': escada,
  'nakamura-mooca/convidados': moocaConvidados,
  'nakamura-mooca/familia': moocaFamilia,
  'nakamura-mooca/noivos': moocaNoivos,
  'nakamura-mooca/saida': moocaSaida,
  'amanda-livraria/vitrine': vitrine,
  'amanda-livraria/estantes': estantes,
  'amanda-livraria/gato': gato,
  'amanda-livraria/balcao': balcao,
  'sem-nome/cadeira': cadeira,
  'sem-nome/olhar': olhar,
  'sem-nome/cintura': cintura,
  'sem-nome/cigarro': cigarro,
  'sem-nome/rosto': rosto,
  'sem-nome/fogo': fogo,
}
