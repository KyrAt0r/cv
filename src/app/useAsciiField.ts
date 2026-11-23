import { onMounted, onUnmounted, type ShallowRef } from 'vue'

const GLYPHS = '01<>/\\{}[]()=+*#$%&@!?;:~^|'
const RAMP = ' .:-=+*#%@'

export interface AsciiCell {
  glyph: string
  nextChange: number
}

export interface AsciiSample {
  char: string
  alpha: number
}

export interface AsciiFieldSettings {
  radius: number
  glyphs: string
  ramp: string
  changeIntervalMs: readonly [number, number]
}

export interface AsciiFieldOptions {
  radius?: number
  fontSize?: number
  glyphs?: string
  ramp?: string
  changeIntervalMs?: readonly [number, number]
}

export function waveAt(x: number, y: number, time: number): number {
  return (Math.sin(x * 0.012 + time * 0.0006) * Math.cos(y * 0.015 - time * 0.0005) + 1) / 2
}

export function resolveAsciiCell(
  cell: AsciiCell,
  x: number,
  y: number,
  time: number,
  mouseX: number,
  mouseY: number,
  field: AsciiFieldSettings,
  out: AsciiSample,
  random: () => number = Math.random,
): void {
  const distance = Math.hypot(x - mouseX, y - mouseY)
  const proximity = field.radius > 0 ? Math.max(0, 1 - distance / field.radius) : 0

  if (proximity > 0) {
    if (time >= cell.nextChange) {
      const index = Math.floor(random() * field.glyphs.length)
      cell.glyph = field.glyphs[index] ?? ' '
      const [min, max] = field.changeIntervalMs
      cell.nextChange = time + min + random() * (max - min)
    }
    out.char = cell.glyph
    out.alpha = 0.35 + proximity * 0.65
    return
  }

  const wave = waveAt(x, y, time)
  const index = Math.min(
    field.ramp.length - 1,
    Math.max(0, Math.floor(wave * (field.ramp.length - 1))),
  )
  out.char = field.ramp[index] ?? ' '
  out.alpha = 0.05 + wave * 0.12
}

function cursorRadius(): number {
  const parsed = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--cursor-radius'),
  )
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 160
}

export function useAsciiField(
  canvasRef: Readonly<ShallowRef<HTMLCanvasElement | null>>,
  options: AsciiFieldOptions = {},
): void {
  const fontSize = options.fontSize ?? 15
  const columnWidth = fontSize * 0.62
  const field: AsciiFieldSettings = {
    radius: options.radius ?? 60,
    glyphs: options.glyphs ?? GLYPHS,
    ramp: options.ramp ?? RAMP,
    changeIntervalMs: options.changeIntervalMs ?? [250, 700],
  }
  const sample: AsciiSample = { char: ' ', alpha: 0 }
  let stop: (() => void) | undefined

  onMounted(() => {
    const canvas = canvasRef.value
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    if (options.radius === undefined) field.radius = cursorRadius()

    const canvasEl: HTMLCanvasElement = canvas
    const ctx: CanvasRenderingContext2D = context

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let width = 0
    let height = 0
    let columns = 0
    let rows = 0
    let cells: AsciiCell[] = []
    let mouseX = -9999
    let mouseY = -9999
    let animationFrame = 0
    let visible = !document.hidden
    let active = true

    function draw(time: number, cursor: boolean) {
      const pointerX = cursor ? mouseX : -9999
      const pointerY = cursor ? mouseY : -9999
      ctx.clearRect(0, 0, width, height)
      ctx.font = `${fontSize}px "JetBrains Mono", "Geist Mono", ui-monospace, monospace`
      ctx.textBaseline = 'top'

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const cell = cells[row * columns + column]
          if (!cell) continue
          const x = column * columnWidth
          const y = row * fontSize
          resolveAsciiCell(cell, x, y, time, pointerX, pointerY, field, sample)
          ctx.fillStyle = `rgba(255,255,255,${sample.alpha})`
          ctx.fillText(sample.char, x, y)
        }
      }
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvasEl.width = Math.floor(width * ratio)
      canvasEl.height = Math.floor(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      columns = Math.ceil(width / columnWidth)
      rows = Math.ceil(height / fontSize)
      cells = Array.from({ length: columns * rows }, () => ({ glyph: ' ', nextChange: 0 }))
      draw(performance.now(), visible && !reducedMotion.matches)
    }

    function loop(time: number) {
      if (!active || !visible || reducedMotion.matches) return
      draw(time, true)
      animationFrame = requestAnimationFrame(loop)
    }

    function start() {
      cancelAnimationFrame(animationFrame)
      if (reducedMotion.matches) draw(performance.now(), false)
      else if (visible) animationFrame = requestAnimationFrame(loop)
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
    window.addEventListener('pointermove', onPointerMove)
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)
    reducedMotion.addEventListener('change', start)
    resize()
    start()

    void document.fonts.ready.then(() => {
      if (!active || !reducedMotion.matches) return
      draw(performance.now(), false)
    })

    stop = () => {
      active = false
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
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
