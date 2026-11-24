<script setup lang="ts">
import { Primitive } from 'reka-ui'

defineSlots<{
  header?: () => unknown
  'header-additional'?: () => unknown
  default?: () => unknown
  screenshot?: () => unknown
  footer?: () => unknown
}>()

function trackPointer(event: PointerEvent) {
  const card = event.currentTarget
  if (!(card instanceof HTMLElement)) return
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--x', `${event.clientX - rect.left}px`)
  card.style.setProperty('--y', `${event.clientY - rect.top}px`)
}
</script>

<template>
  <Primitive as="article" class="ui-card" @pointerenter="trackPointer" @pointermove="trackPointer">
    <header v-if="$slots.header || $slots['header-additional']" class="ui-card__header">
      <div v-if="$slots.header" class="ui-card__main"><slot name="header" /></div>
      <div class="ui-card__additional"><slot name="header-additional" /></div>
    </header>
    <div class="ui-card__body"><slot /></div>
    <footer v-if="$slots.footer" class="ui-card__footer"><slot name="footer" /></footer>
    <div v-if="$slots.screenshot" class="ui-card__screenshot"><slot name="screenshot" /></div>
  </Primitive>
</template>

<style scoped>
.ui-card {
  --x: 50%;
  --y: 50%;

  position: relative;
  isolation: isolate;
  padding: 20px;
  margin-bottom: 14px;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.16),
      rgba(255, 255, 255, 0.04) 45%,
      rgba(255, 255, 255, 0.08)
    ),
    var(--card);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.06),
    0 10px 30px -8px rgba(0, 0, 0, 0.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  backdrop-filter: blur(20px) saturate(1.8);
  transition:
    border-color 0.25s,
    box-shadow 0.25s;
}

.ui-card:hover {
  border-color: rgba(255, 190, 120, 0.4);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.06),
    0 10px 40px -8px rgba(255, 150, 80, 0.35);
}

.ui-card::after {
  position: absolute;
  inset: -1px;
  z-index: 0;
  pointer-events: none;
  content: '';
  background: radial-gradient(
    calc(var(--cursor-radius) * 2.5) circle at var(--x) var(--y),
    rgba(255, 170, 90, 0.16),
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.25s;
}

.ui-card:hover::after {
  opacity: 1;
}

.ui-card__header,
.ui-card__body,
.ui-card__footer,
.ui-card__screenshot {
  padding-top: 20px;
  position: relative;
  z-index: 1;
}

.ui-card__header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.ui-card__main {
  font-size: 17px;
  font-weight: 700;
}

.ui-card__additional {
  color: var(--dim);
  font-size: 13px;
}

.ui-card__screenshot :deep(img) {
  display: block;
  width: 100%;
  height: auto;
}

.ui-card :deep(p) {
  margin: 10px 0 0;
  color: var(--dim);
  font-size: 14px;
  line-height: 1.6;
}

.ui-card :deep(strong) {
  color: var(--fg);
  font-weight: 500;
}
</style>
