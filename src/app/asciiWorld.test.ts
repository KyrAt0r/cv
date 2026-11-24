import { describe, expect, it } from 'vite-plus/test'
import { createScene, createWorld, layoutAt, renderScene } from './asciiWorld'

const COLUMNS = 120
const ROWS = 60

describe('asciiWorld', () => {
  it('в самом верху страницы виден только небо', () => {
    const world = createWorld(COLUMNS, ROWS)
    const tallestMountain = Math.max(...world.mountains)
    expect(layoutAt(ROWS, 0).horizon - tallestMountain).toBeGreaterThanOrEqual(ROWS)
  })

  it('в самом низу страницы земля заполняет нижнюю строку', () => {
    const world = createWorld(COLUMNS, ROWS)
    const scene = createScene(COLUMNS, ROWS)
    renderScene(world, scene, 1, 0, 9.3, 15)
    const bottom = scene.styles.slice((ROWS - 1) * COLUMNS)
    expect(bottom.every((style) => style !== 0)).toBe(true)
  })

  it('дальние слои сдвигаются медленнее ближних', () => {
    const top = layoutAt(ROWS, 0)
    const bottom = layoutAt(ROWS, 1)
    const shift = (key: 'horizon' | 'hills' | 'ground') => top[key] - bottom[key]
    expect(shift('horizon')).toBeLessThan(shift('hills'))
    expect(shift('hills')).toBeLessThan(shift('ground'))
  })
})
