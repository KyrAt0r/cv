import type { Directive } from 'vue'

const GLYPHS = '01<>/\\{}[]()=+*#$%&@!?;:~^|'
const STEP_MS = 35

interface ScrambleState {
  timer: ReturnType<typeof setInterval> | undefined
  original: string
  onEnter: () => void
}

const states = new WeakMap<HTMLElement, ScrambleState>()

function glyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? ' '
}

export const vScramble: Directive<HTMLElement> = {
  mounted(el) {
    const state: ScrambleState = {
      timer: undefined,
      original: '',
      onEnter: () => {
        if (el.children.length > 0) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        if (state.timer) {
          clearInterval(state.timer)
          state.timer = undefined
          el.textContent = state.original
        }

        state.original = (el.textContent ?? '').trim()
        if (state.original === '') return

        let step = 0
        const tick = () => {
          if (step >= state.original.length) {
            if (state.timer) clearInterval(state.timer)
            state.timer = undefined
            el.textContent = state.original
            return
          }

          el.textContent = state.original
            .split('')
            .map((character, index) => {
              if (character === ' ' || index < step) return character
              return glyph()
            })
            .join('')
          step += 1
        }

        tick()
        state.timer = setInterval(tick, STEP_MS)
      },
    }

    el.addEventListener('pointerenter', state.onEnter)
    states.set(el, state)
  },
  unmounted(el) {
    const state = states.get(el)
    if (!state) return
    el.removeEventListener('pointerenter', state.onEnter)
    if (state.timer) clearInterval(state.timer)
    states.delete(el)
  },
}
