import { onMounted, onUnmounted, type ShallowRef } from 'vue'
import {
  applyCursor,
  createCursorGlyphs,
  createScene,
  createWorld,
  renderScene,
  styleToCss,
  type CursorGlyphs,
  type Scene,
  type World,
} from './asciiWorld'

const FRAME_INTERVAL_MS = 33
const SCROLL_EASING = 0.15

export interface AsciiFieldOptions {
  radius?: number
  fontSize?: number
}

function cursorRadius(): number {
  const parsed = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--cursor-radius'),
  )
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 160
}

function scrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}

export function useAsciiField(
  canvasRef: Readonly<ShallowRef<HTMLCanvasElement | null>>,
  options: AsciiFieldOptions = {},
): void {
  const fontSize = options.fontSize ?? 15
  const columnWidth = fontSize * 0.62
  let stop: (() => void) | undefined

  onMounted(() => {
    const canvas = canvasRef.value
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const canvasEl: HTMLCanvasElement = canvas
    const ctx: CanvasRenderingContext2D = context
    const radius = options.radius ?? cursorRadius()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const buckets = new Map<number, number[]>()
    const css = new Map<number, string>()
    let world: World
    let scene: Scene
    let cursorGlyphs: CursorGlyphs
    let width = 0
    let height = 0
    let target = scrollProgress()
    let current = target
    let mouseX = -9999
    let mouseY = -9999
    let animationFrame = 0
    let lastFrame = 0
    let visible = !document.hidden
    let active = true

    function draw(time: number, cursor: boolean) {
      renderScene(world, scene, current, time, columnWidth, fontSize)
      if (cursor)
        applyCursor(scene, cursorGlyphs, mouseX, mouseY, time, radius, columnWidth, fontSize)

      ctx.clearRect(0, 0, width, height)
      ctx.font = `${fontSize}px "JetBrains Mono", "Geist Mono", ui-monospace, monospace`
      ctx.textBaseline = 'top'

      const { styles, chars, columns } = scene
      for (let index = 0; index < styles.length; index++) {
        const style = styles[index]!
        if (style === 0) continue
        const bucket = buckets.get(style)
        if (bucket) bucket.push(index)
        else buckets.set(style, [index])
      }
      for (const [style, indexes] of buckets) {
        if (indexes.length === 0) continue
        let color = css.get(style)
        if (!color) {
          color = styleToCss(style)
          css.set(style, color)
        }
        ctx.fillStyle = color
        for (const index of indexes) {
          ctx.fillText(
            chars[index]!,
            (index % columns) * columnWidth,
            Math.floor(index / columns) * fontSize,
          )
        }
        indexes.length = 0
      }
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvasEl.width = Math.floor(width * ratio)
      canvasEl.height = Math.floor(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      const columns = Math.ceil(width / columnWidth)
      const rows = Math.ceil(height / fontSize)
      world = createWorld(columns, rows)
      scene = createScene(columns, rows)
      cursorGlyphs = createCursorGlyphs(columns, rows)
      target = scrollProgress()
      current = target
      draw(performance.now(), false)
    }

    function loop(time: number) {
      if (!active || !visible || reducedMotion.matches) return
      animationFrame = requestAnimationFrame(loop)
      if (time - lastFrame < FRAME_INTERVAL_MS) return
      lastFrame = time
      current += (target - current) * SCROLL_EASING
      if (Math.abs(target - current) < 0.0005) current = target
      draw(time, true)
    }

    function start() {
      cancelAnimationFrame(animationFrame)
      if (reducedMotion.matches) draw(performance.now(), false)
      else if (visible) animationFrame = requestAnimationFrame(loop)
    }

    function onScroll() {
      target = scrollProgress()
      if (reducedMotion.matches) {
        current = target
        draw(performance.now(), false)
      }
    }

    function onPointerMove(event: PointerEvent) {
      if (!finePointer.matches || event.pointerType === 'touch') {
        mouseX = -9999
        mouseY = -9999
        return
      }
      mouseX = event.clientX
      mouseY = event.clientY
    }

    function onPointerLeave() {
      mouseX = -9999
      mouseY = -9999
    }

    function onVisibilityChange() {
      visible = !document.hidden
      if (visible) start()
      else cancelAnimationFrame(animationFrame)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointerMove)
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)
    reducedMotion.addEventListener('change', start)
    resize()
    start()

    void document.fonts.ready.then(() => {
      if (!active) return
      target = scrollProgress()
      if (reducedMotion.matches) {
        current = target
        draw(performance.now(), false)
      }
    })

    stop = () => {
      active = false
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      reducedMotion.removeEventListener('change', start)
    }
  })

  onUnmounted(() => {
    stop?.()
  })
}
