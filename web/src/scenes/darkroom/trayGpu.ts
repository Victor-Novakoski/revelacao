import {
  Camera,
  Color,
  FloatType,
  HalfFloatType,
  Mesh,
  NearestFilter,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type WebGLRenderer,
} from 'three'
import { PAPER, TRAY, freshSpeed, type DevelopSim } from '../../game/develop'
import { createTestPhoto } from './testPhoto'
import { LAMP } from './layout'
import noise from '../../shaders/noise.glsl?raw'
import surface from '../../shaders/surface.glsl?raw'
import quadVert from '../../shaders/quad.vert?raw'
import accumulateFrag from '../../shaders/accumulate.frag?raw'
import paperVert from '../../shaders/paper.vert?raw'
import developFrag from '../../shaders/develop.frag?raw'
import liquidVert from '../../shaders/liquid.vert?raw'
import liquidFrag from '../../shaders/liquid.frag?raw'

// Mapa de revelação: quanto cada ponto do papel já revelou.
const MAP = { width: 256, height: 192 }
const LIGHT_POS = new Vector3(...LAMP)

const lib = (...chunks: string[]) => chunks.join('\n')

type FrameInput = { sim: DevelopSim; delta: number; active: boolean; reducedMotion: boolean; light: number }

// Tudo o que a bandeja tem na placa de vídeo: o papel, o líquido e o mapa de
// revelação, que é somado num par de texturas que se alternam.
export class TrayGpu {
  readonly paper: ShaderMaterial
  readonly liquid: ShaderMaterial
  readonly paperGeometry = new PlaneGeometry(PAPER.width, PAPER.depth).rotateX(-Math.PI / 2)
  readonly liquidGeometry = new PlaneGeometry(TRAY.width, TRAY.depth, 96, 72).rotateX(-Math.PI / 2)

  private readonly float: boolean
  private readonly targets: WebGLRenderTarget[]
  private readonly photo = createTestPhoto()
  private readonly accumulate: ShaderMaterial
  private readonly quad: Mesh
  private readonly scene = new Scene()
  private readonly camera = new Camera()
  private readonly shared = {
    uSlope: { value: new Vector2() },
    uRipple: { value: 0 },
    uTime: { value: 0 },
    uLight: { value: 1 },
  }
  private sinceStep = 0

  constructor(gl: WebGLRenderer) {
    // Com float de verdade dá para somar a cada quadro. Em meia precisão o
    // passo some no arredondamento, então soma-se de tempos em tempos.
    this.float = gl.extensions.has('EXT_color_buffer_float')
    const target = () =>
      new WebGLRenderTarget(MAP.width, MAP.height, {
        type: this.float ? FloatType : HalfFloatType,
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        depthBuffer: false,
      })
    this.targets = [target(), target()]

    this.accumulate = new ShaderMaterial({
      vertexShader: quadVert,
      fragmentShader: lib(noise, surface, accumulateFrag),
      uniforms: {
        ...this.shared,
        uPrev: { value: null },
        uStep: { value: 0 },
        uFresh: { value: 1 },
        uPaper: { value: new Vector2(PAPER.width, PAPER.depth) },
      },
      depthTest: false,
      depthWrite: false,
    })
    this.quad = new Mesh(new PlaneGeometry(2, 2), this.accumulate)
    this.quad.frustumCulled = false
    this.scene.add(this.quad)

    this.paper = new ShaderMaterial({
      vertexShader: lib(surface, paperVert),
      fragmentShader: lib(noise, surface, developFrag),
      uniforms: {
        ...this.shared,
        uPhoto: { value: this.photo.photo },
        uFigure: { value: this.photo.figure },
        uDev: { value: this.targets[0].texture },
        uDevSize: { value: new Vector2(MAP.width, MAP.height) },
        uTint: { value: new Color(0.9, 0.16, 0.11) },
      },
    })

    this.liquid = new ShaderMaterial({
      vertexShader: lib(surface, liquidVert),
      fragmentShader: lib(surface, liquidFrag),
      uniforms: { ...this.shared, uLightPos: { value: LIGHT_POS } },
      transparent: true,
      depthWrite: false,
    })
  }

  // Papel branco de novo.
  clear(gl: WebGLRenderer) {
    this.sinceStep = 0
    const color = gl.getClearColor(new Color())
    const alpha = gl.getClearAlpha()
    gl.setClearColor(0x000000, 0)
    for (const t of this.targets) {
      gl.setRenderTarget(t)
      gl.clear()
    }
    gl.setRenderTarget(null)
    gl.setClearColor(color, alpha)
  }

  frame(gl: WebGLRenderer, { sim, delta, active, reducedMotion, light }: FrameInput) {
    this.shared.uSlope.value.set(sim.slope.x, sim.slope.y)
    this.shared.uRipple.value = reducedMotion ? 0 : sim.agitation
    this.shared.uTime.value += reducedMotion ? 0 : delta
    this.shared.uLight.value = light

    if (!active || !sim.running) return
    this.sinceStep += Math.min(delta, 0.1)
    if (!this.float && this.sinceStep < 0.12) return

    // A parte da cobertura o shader faz ponto a ponto.
    const [read, write] = this.targets
    this.accumulate.uniforms.uPrev.value = read.texture
    this.accumulate.uniforms.uStep.value = freshSpeed(sim.freshness) * this.sinceStep
    this.accumulate.uniforms.uFresh.value = sim.freshness
    this.sinceStep = 0
    gl.setRenderTarget(write)
    gl.render(this.scene, this.camera)
    gl.setRenderTarget(null)
    this.targets.reverse()
    this.paper.uniforms.uDev.value = write.texture
  }

  dispose() {
    this.targets.forEach((t) => t.dispose())
    this.photo.photo.dispose()
    this.photo.figure.dispose()
    this.accumulate.dispose()
    this.quad.geometry.dispose()
    this.paper.dispose()
    this.liquid.dispose()
    this.paperGeometry.dispose()
    this.liquidGeometry.dispose()
  }
}
