// ASCII-мир для фона: небо с закатом сверху, внизу слева направо лес, поле, пляж и море.
// Прокрутка страницы (t: 0 — верх, небо; 1 — низ, земля) двигает слои с разной скоростью (параллакс).

export type RGB = readonly [number, number, number]

export interface Scene {
  columns: number
  rows: number
  chars: string[]
  /** Упакованный стиль клетки: r4 g4 b4 a4, 0 — клетка пустая. */
  styles: Uint16Array
}

interface Sprite {
  col: number
  /** 0 — дальние холмы, 1 — земля. */
  layer: 0 | 1
  lines: string[]
  leaf: RGB
  alpha: number
}

export interface World {
  columns: number
  rows: number
  /** Масштаб высот рельефа относительно высоты окна. */
  scale: number
  mountains: Int16Array
  hills: Int16Array
  /** Высота земли над базовой линией, может быть отрицательной (дно моря). */
  ground: Int16Array
  material: Uint8Array
  sprites: Sprite[]
  /** Границы биомов в долях ширины. */
  shore: Float32Array
}

export interface Layout {
  horizon: number
  hills: number
  ground: number
}

export const FOREST_END = 0.31
export const FIELD_END = 0.55
export const BEACH_END = 0.76

// Базовые линии слоёв (доля высоты окна) на самом низу страницы и путь, который слой проходит вверх.
// Чем дальше слой, тем меньше путь — отсюда параллакс.
const HORIZON = { base: 0.58, travel: 0.65 }
const HILLS = { base: 0.7, travel: 0.85 }
const GROUND = { base: 0.82, travel: 1.2 }

const SHORE_FAR = 0.46
const SHORE_NEAR = 0.74
const SUN_COLUMN = 0.76

const MATERIAL_FOREST = 0
const MATERIAL_FIELD = 1
const MATERIAL_BEACH = 2
const MATERIAL_SEABED = 3

const CURSOR_GLYPHS = '01<>/\\{}[]()=+*#$%&@!?;:~^|'
const LEAVES = '%&@8#'

const SKY_STOPS: ReadonlyArray<readonly [number, RGB]> = [
  [0, [255, 170, 70]],
  [0.12, [255, 110, 90]],
  [0.3, [215, 85, 150]],
  [0.55, [130, 80, 185]],
  [0.9, [70, 70, 160]],
  [1.3, [45, 45, 120]],
]

const WATER_NEAR: RGB = [40, 95, 150]
const WATER_FAR: RGB = [255, 170, 90]
const GLITTER: RGB = [255, 225, 140]
const MOUNTAIN: RGB = [135, 90, 160]
const HILL: RGB = [75, 120, 110]
const TRUNK: RGB = [140, 95, 60]
const GRASS_FOREST: RGB = [75, 160, 85]
const GRASS_FIELD: RGB = [165, 180, 75]
const DIRT: RGB = [135, 95, 65]
const SAND: RGB = [240, 210, 145]
const SEABED: RGB = [95, 135, 155]
const WHITE: RGB = [255, 255, 255]
const EMBER: RGB = [255, 200, 120]

const PINE = ['   ^   ', '  /^\\  ', ' /^^^\\ ', ' /^^^\\ ', '/^^^^^\\', '   |   ']
const ROUND_TREE = ['  ooo  ', ' ooooo ', 'ooooooo', ' ooooo ', '   |   ', '   |   ']
const PALM = [' _\\|/_ ', '/ \\|/ \\', '   |   ', '   |   ', '   |   ', '   |   ']
const BUSH = [' ooo ', 'ooooo']
const ROCK = [' __ ', '(__)']
const TINY_PINE = [' ^ ', '/^\\']

const scratch: [number, number, number] = [0, 0, 0]

export function hash(x: number, y = 0, z = 0): number {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 2246822519)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

function smoothstep(from: number, to: number, value: number): number {
  const x = Math.min(1, Math.max(0, (value - from) / (to - from)))
  return x * x * (3 - 2 * x)
}

function noise1(x: number): number {
  const i = Math.floor(x)
  const f = x - i
  const s = f * f * (3 - 2 * f)
  return hash(i, 7) * (1 - s) + hash(i + 1, 7) * s
}

function noise2(x: number, y: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)
  const top = hash(ix, iy) * (1 - sx) + hash(ix + 1, iy) * sx
  const bottom = hash(ix, iy + 1) * (1 - sx) + hash(ix + 1, iy + 1) * sx
  return top * (1 - sy) + bottom * sy
}

function mix(from: RGB, to: RGB, amount: number): RGB {
  const k = Math.min(1, Math.max(0, amount))
  scratch[0] = from[0] + (to[0] - from[0]) * k
  scratch[1] = from[1] + (to[1] - from[1]) * k
  scratch[2] = from[2] + (to[2] - from[2]) * k
  return scratch
}

function skyColor(altitude: number): RGB {
  const last = SKY_STOPS.length - 1
  if (altitude <= SKY_STOPS[0]![0]) return SKY_STOPS[0]![1]
  for (let i = 1; i <= last; i++) {
    const [stop, color] = SKY_STOPS[i]!
    if (altitude <= stop) {
      const [prevStop, prevColor] = SKY_STOPS[i - 1]!
      return mix(prevColor, color, (altitude - prevStop) / (stop - prevStop))
    }
  }
  return SKY_STOPS[last]![1]
}

export function packStyle(color: RGB, alpha: number): number {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 15)
  if (a === 0) return 0
  return ((color[0] >> 4) << 12) | ((color[1] >> 4) << 8) | ((color[2] >> 4) << 4) | a
}

export function styleToCss(style: number): string {
  const r = ((style >> 12) & 15) * 17
  const g = ((style >> 8) & 15) * 17
  const b = ((style >> 4) & 15) * 17
  return `rgba(${r},${g},${b},${((style & 15) / 15).toFixed(2)})`
}

export function createScene(columns: number, rows: number): Scene {
  return {
    columns,
    rows,
    chars: Array.from({ length: columns * rows }, () => ' '),
    styles: new Uint16Array(columns * rows),
  }
}

function put(scene: Scene, col: number, row: number, char: string, color: RGB, alpha: number) {
  if (col < 0 || col >= scene.columns || row < 0 || row >= scene.rows) return
  const index = row * scene.columns + col
  scene.chars[index] = char
  scene.styles[index] = packStyle(color, alpha)
}

export function layoutAt(rows: number, t: number): Layout {
  const away = 1 - t
  return {
    horizon: Math.round(rows * (HORIZON.base + HORIZON.travel * away)),
    hills: Math.round(rows * (HILLS.base + HILLS.travel * away)),
    ground: Math.round(rows * (GROUND.base + GROUND.travel * away)),
  }
}

function pickLeaves(lines: string[], seed: number): string[] {
  return lines.map((line, row) =>
    line.replace(
      /o/g,
      (_, offset: number) => LEAVES[Math.floor(hash(seed, row, offset) * LEAVES.length)]!,
    ),
  )
}

export function createWorld(columns: number, rows: number): World {
  const scale = Math.max(0.7, rows / 55)
  const mountains = new Int16Array(columns)
  const hills = new Int16Array(columns)
  const ground = new Int16Array(columns)
  const material = new Uint8Array(columns)
  const sprites: Sprite[] = []

  for (let col = 0; col < columns; col++) {
    const u = col / columns
    const mask = 1 - smoothstep(0.3, 0.56, u)
    const noise = noise1(col * 0.045) * 0.65 + noise1(col * 0.11 + 50) * 0.35
    const ridge = 1 - Math.abs(noise * 2 - 1)
    mountains[col] = Math.round(scale * (1 + 9 * ridge ** 1.5) * mask)
    hills[col] = Math.round(scale * (1 + 3 * noise1(col * 0.07 + 100)))

    const forest = 1 - smoothstep(0.28, 0.4, u)
    const level =
      5 -
      2 * smoothstep(0.28, 0.38, u) -
      4 * smoothstep(0.55, 0.72, u) -
      8 * smoothstep(0.72, 0.8, u) +
      2 * noise1(col * 0.08 + 200) * forest +
      noise1(col * 0.05 + 300) * (1 - forest) * (1 - smoothstep(0.55, 0.7, u))
    ground[col] = Math.round(scale * level)

    material[col] =
      u < FOREST_END
        ? MATERIAL_FOREST
        : u < FIELD_END
          ? MATERIAL_FIELD
          : u < BEACH_END
            ? MATERIAL_BEACH
            : MATERIAL_SEABED
  }

  for (let col = 2; col < columns * 0.5; col += 3 + Math.floor(hash(col, 11) * 4)) {
    if (hash(col, 12) < 0.25) continue
    sprites.push({ col, layer: 0, lines: TINY_PINE, leaf: HILL, alpha: 0.55 })
  }

  for (let col = 3; col < columns * FOREST_END; col += 5 + Math.floor(hash(col, 1) * 6)) {
    const pine = hash(col, 2) < 0.55
    sprites.push({
      col,
      layer: 1,
      lines: pine ? PINE : pickLeaves(ROUND_TREE, col),
      leaf: pine ? [45, 135, 100] : GRASS_FOREST,
      alpha: 0.85,
    })
  }

  for (
    let col = Math.round(columns * 0.36);
    col < columns * 0.52;
    col += 14 + Math.floor(hash(col, 3) * 8)
  ) {
    const tree = hash(col, 4) < 0.4
    sprites.push({
      col,
      layer: 1,
      lines: tree ? pickLeaves(ROUND_TREE, col) : pickLeaves(BUSH, col),
      leaf: tree ? GRASS_FOREST : GRASS_FIELD,
      alpha: 0.85,
    })
  }

  sprites.push(
    { col: Math.round(columns * 0.59), layer: 1, lines: PALM, leaf: [90, 175, 95], alpha: 0.9 },
    { col: Math.round(columns * 0.67), layer: 1, lines: PALM, leaf: [90, 175, 95], alpha: 0.9 },
    { col: Math.round(columns * 0.63), layer: 1, lines: ROCK, leaf: SAND, alpha: 0.8 },
  )

  return {
    columns,
    rows,
    scale,
    mountains,
    hills,
    ground,
    material,
    sprites,
    shore: new Float32Array(rows),
  }
}

function drawSky(
  world: World,
  scene: Scene,
  layout: Layout,
  time: number,
  cellWidth: number,
  cellHeight: number,
) {
  const { columns, rows } = world
  const horizon1 = Math.round(rows * HORIZON.base)
  const shift = layout.horizon - horizon1
  const sunColumn = columns * SUN_COLUMN
  const sunRadius = Math.min(90, Math.max(36, rows * cellHeight * 0.075))
  const sunRow = layout.horizon - Math.round((sunRadius / cellHeight) * 0.25)
  const lastRow = Math.min(layout.horizon, rows)

  for (let row = 0; row < lastRow; row++) {
    const altitude = (layout.horizon - row) / rows
    const glowBase = Math.exp(-altitude * 2.8)
    const starChance = 0.035 * smoothstep(0.35, 0.8, altitude)
    const cloudY = row - horizon1 - shift * 0.75
    const cloudAltitude = -cloudY / rows
    const cloudEnvelope =
      smoothstep(0.02, 0.1, cloudAltitude) * (1 - smoothstep(0.4, 0.7, cloudAltitude))

    for (let col = 0; col < columns; col++) {
      const dx = (col - sunColumn) * cellWidth
      const dy = (row - sunRow) * cellHeight
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < sunRadius) {
        const f = distance / sunRadius
        const char = f < 0.35 ? '@' : f < 0.65 ? '#' : f < 0.85 ? 'O' : 'o'
        put(scene, col, row, char, mix([255, 245, 190], [255, 190, 90], f), 0.95)
        continue
      }

      const dn = (col - sunColumn) / (columns * 0.45)
      const glow = glowBase * (0.5 + 0.5 * Math.exp(-dn * dn))
      const halo = Math.max(0, 1 - (distance - sunRadius) / (sunRadius * 2.4)) ** 2
      const value = Math.max(glow * 0.9, halo) + (hash(col, row) - 0.5) * 0.12
      const base = skyColor(altitude)
      const tinted = halo > 0 ? mix(base, [255, 190, 90], halo) : base
      const char =
        value > 0.75 ? '=' : value > 0.55 ? '-' : value > 0.38 ? ':' : value > 0.2 ? '.' : ' '
      if (char !== ' ') put(scene, col, row, char, tinted, 0.08 + 0.4 * Math.min(1, value))

      if (starChance > 0 && hash(col, row - Math.round(shift * 0.4), 3) < starChance) {
        const twinkle =
          0.5 + 0.5 * Math.sin(time * 0.003 + hash(col, row - Math.round(shift * 0.4), 4) * 6.28)
        const star = twinkle > 0.8 ? '*' : twinkle > 0.4 ? '+' : '.'
        put(scene, col, row, star, [235, 235, 255], 0.2 + 0.6 * twinkle)
      }

      if (cloudEnvelope > 0.01) {
        const nx = col * 0.045 + time * 0.00004
        const ny = cloudY * 0.16
        const n = noise2(nx, ny) * 0.65 + noise2(nx * 2.1 + 7, ny * 2.1 + 3) * 0.35
        const density = n - (1 - cloudEnvelope) * 0.5
        if (density > 0.56) {
          const cloud = density > 0.72 ? '#' : density > 0.66 ? '=' : density > 0.61 ? '-' : '.'
          const lit = mix(skyColor(cloudAltitude * 0.9), WHITE, 0.2)
          put(scene, col, row, cloud, lit, Math.min(0.65, 0.2 + (density - 0.56) * 1.6))
        }
      }
    }
  }
}

function drawWater(world: World, scene: Scene, layout: Layout, time: number) {
  const { columns, rows, shore } = world
  const sunColumn = columns * SUN_COLUMN
  const span = Math.max(1, layout.ground - layout.horizon)
  const flicker = Math.floor(time / 180)
  const foamTick = Math.floor(time / 250)

  for (let row = Math.max(0, layout.horizon); row < rows; row++) {
    const depth = Math.min(1.2, (row - layout.horizon) / span)
    const color = mix(WATER_FAR, WATER_NEAR, depth * 1.5)
    const frequency = 0.9 - 0.5 * Math.min(1, depth)
    const halfWidth = 1.5 + (row - layout.horizon) * 0.7
    const start = Math.max(0, Math.ceil(shore[row]!))

    for (let col = start; col < columns; col++) {
      const wave = Math.sin(col * frequency + row * 1.3 - time * 0.0025 + Math.sin(row * 0.7) * 2)
      const distance = Math.abs(col - sunColumn)
      if (distance < halfWidth) {
        const chance = (1 - distance / halfWidth) * (1 - Math.min(1, depth) * 0.55) * 0.85
        if (hash(col, row, flicker) < chance) {
          const glint = hash(col, row, 5)
          put(
            scene,
            col,
            row,
            glint < 0.4 ? '=' : glint < 0.75 ? '-' : '~',
            GLITTER,
            0.55 + glint * 0.4,
          )
          continue
        }
      }
      if (wave > 0.5) put(scene, col, row, '~', color, 0.32 - 0.1 * Math.min(1, depth))
      else if (wave > 0) put(scene, col, row, '-', color, 0.22)
      else if (wave > -0.5) put(scene, col, row, '.', color, 0.15)
    }

    const edge = Math.floor(shore[row]!)
    for (let col = edge; col < edge + 3; col++) {
      if (hash(col, row, foamTick) < 0.7) {
        put(
          scene,
          col,
          row,
          hash(col, row, 6) < 0.5 ? '~' : '.',
          WHITE,
          0.55 * (1 - (col - shore[row]!) / 3),
        )
      }
    }
  }
}

function slopeChar(top: number, previous: number, next: number): string {
  if (top < previous && top < next) return '^'
  if (next < previous) return '/'
  if (next > previous) return '\\'
  return '_'
}

function fillLand(
  world: World,
  scene: Scene,
  heights: Int16Array,
  baseRow: number,
  color: RGB,
  fillAlpha: number,
) {
  const { columns, rows, shore } = world
  for (let col = 0; col < columns; col++) {
    const top = baseRow - heights[col]!
    const previous = baseRow - heights[Math.max(0, col - 1)]!
    const next = baseRow - heights[Math.min(columns - 1, col + 1)]!
    for (let row = Math.max(0, top); row < rows; row++) {
      if (col >= shore[row]!) continue
      if (row === top) {
        put(scene, col, row, slopeChar(top, previous, next), color, fillAlpha + 0.25)
        continue
      }
      const depth = row - top
      put(
        scene,
        col,
        row,
        hash(col, row) < 0.5 ? ':' : '.',
        color,
        fillAlpha * (1 - Math.min(depth, 12) / 20),
      )
    }
  }
}

function drawSprites(
  world: World,
  scene: Scene,
  layer: 0 | 1,
  heights: Int16Array,
  baseRow: number,
) {
  for (const sprite of world.sprites) {
    if (sprite.layer !== layer) continue
    const bottom = baseRow - heights[sprite.col]! + 1
    if (layer === 0 && sprite.col >= world.shore[Math.min(world.rows - 1, Math.max(0, bottom))]!)
      continue
    const height = sprite.lines.length
    const left = sprite.col - (sprite.lines[0]!.length >> 1)
    for (let i = 0; i < height; i++) {
      const line = sprite.lines[i]!
      const row = bottom - height + i
      for (let j = 0; j < line.length; j++) {
        const char = line[j]!
        if (char === ' ') continue
        put(scene, left + j, row, char, char === '|' ? TRUNK : sprite.leaf, sprite.alpha)
      }
    }
  }
}

function drawGround(world: World, scene: Scene, baseRow: number) {
  const { columns, rows, ground, material } = world
  for (let col = 0; col < columns; col++) {
    const top = baseRow - ground[col]!
    const kind = material[col]!
    const grass = kind === MATERIAL_FOREST ? GRASS_FOREST : GRASS_FIELD

    if (kind === MATERIAL_FOREST || kind === MATERIAL_FIELD) {
      if (kind === MATERIAL_FIELD && hash(col, 9) < 0.07) {
        put(scene, col, top - 1, '*', hash(col, 10) < 0.5 ? [255, 200, 80] : [255, 130, 170], 0.9)
      } else if (hash(col, 8) < 0.3) {
        put(scene, col, top - 1, hash(col, 13) < 0.5 ? '"' : 'w', grass, 0.6)
      }
    }

    for (let row = Math.max(0, top); row < rows; row++) {
      const depth = row - top
      const h = hash(col, row)
      if (kind === MATERIAL_BEACH) {
        const char = depth === 0 ? (h < 0.5 ? '.' : ',') : h < 0.5 ? ':' : '.'
        put(scene, col, row, char, SAND, depth === 0 ? 0.8 : 0.55 / (1 + depth * 0.15) + 0.08)
      } else if (kind === MATERIAL_SEABED) {
        put(
          scene,
          col,
          row,
          h < 0.5 ? ':' : '.',
          SEABED,
          depth === 0 ? 0.55 : 0.4 / (1 + depth * 0.15) + 0.06,
        )
      } else if (depth === 0) {
        put(scene, col, row, h < 0.4 ? '"' : h < 0.7 ? ',' : 'v', grass, 0.8)
      } else {
        put(scene, col, row, '#%=+:'[Math.floor(h * 5)]!, DIRT, 0.35 / (1 + depth * 0.2) + 0.05)
      }
    }
  }
}

function updateShore(world: World, layout: Layout, time: number) {
  const { columns, rows, shore } = world
  const span = Math.max(1, layout.ground - layout.horizon)
  for (let row = 0; row < rows; row++) {
    if (row < layout.horizon) {
      shore[row] = columns
      continue
    }
    const progress = Math.min(1, (row - layout.horizon) / span)
    const shoreline = SHORE_FAR + (SHORE_NEAR - SHORE_FAR) * progress
    shore[row] = shoreline * columns + Math.sin(row * 0.6 + time * 0.001) * 1.2
  }
}

/** Рисует мир целиком в `scene`. `t` — прогресс прокрутки: 0 — небо, 1 — земля. */
export function renderScene(
  world: World,
  scene: Scene,
  t: number,
  time: number,
  cellWidth: number,
  cellHeight: number,
) {
  const layout = layoutAt(world.rows, t)
  scene.chars.fill(' ')
  scene.styles.fill(0)
  updateShore(world, layout, time)

  drawSky(world, scene, layout, time, cellWidth, cellHeight)
  drawWater(world, scene, layout, time)
  fillLand(world, scene, world.mountains, layout.horizon, MOUNTAIN, 0.18)
  fillLand(world, scene, world.hills, layout.hills, HILL, 0.24)
  drawSprites(world, scene, 0, world.hills, layout.hills)
  drawGround(world, scene, layout.ground)
  drawSprites(world, scene, 1, world.ground, layout.ground)
}

export interface CursorGlyphs {
  glyphs: string[]
  nextChange: Float64Array
}

export function createCursorGlyphs(columns: number, rows: number): CursorGlyphs {
  return {
    glyphs: Array.from({ length: columns * rows }, () => ' '),
    nextChange: new Float64Array(columns * rows),
  }
}

/** Вокруг курсора символы превращаются в мерцающий «код». */
export function applyCursor(
  scene: Scene,
  state: CursorGlyphs,
  x: number,
  y: number,
  time: number,
  radius: number,
  cellWidth: number,
  cellHeight: number,
  random: () => number = Math.random,
) {
  const { columns, rows } = scene
  const firstColumn = Math.max(0, Math.floor((x - radius) / cellWidth))
  const lastColumn = Math.min(columns - 1, Math.ceil((x + radius) / cellWidth))
  const firstRow = Math.max(0, Math.floor((y - radius) / cellHeight))
  const lastRow = Math.min(rows - 1, Math.ceil((y + radius) / cellHeight))

  for (let row = firstRow; row <= lastRow; row++) {
    for (let col = firstColumn; col <= lastColumn; col++) {
      const proximity = 1 - Math.hypot(col * cellWidth - x, row * cellHeight - y) / radius
      if (proximity <= 0) continue
      const index = row * columns + col
      if (time >= state.nextChange[index]!) {
        state.glyphs[index] = CURSOR_GLYPHS[Math.floor(random() * CURSOR_GLYPHS.length)] ?? ' '
        state.nextChange[index] = time + 250 + random() * 450
      }
      scene.chars[index] = state.glyphs[index]!
      scene.styles[index] = packStyle(EMBER, 0.35 + proximity * 0.65)
    }
  }
}
