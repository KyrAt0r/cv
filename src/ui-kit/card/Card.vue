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
  background: var(--card);
  border: 1px solid var(--line);
  backdrop-filter: blur(3px);
  transition: box-shadow 0.25s;
}

.ui-card:hover {
  box-shadow: 0 0 40px -12px rgba(255, 255, 255, 0.35);
}

.ui-card::before,
.ui-card::after {
  position: absolute;
  inset: -1px;
  pointer-events: none;
  content: '';
  opacity: 0;
  transition: opacity 0.25s;
}

.ui-card:hover::before,
.ui-card:hover::after {
  opacity: 1;
}

.ui-card::before {
  z-index: 2;
  padding: 1px;
  background: radial-gradient(
    var(--cursor-radius) circle at var(--x) var(--y),
    #fff,
    transparent 70%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
}

.ui-card::after {
  z-index: 0;
  background: radial-gradient(
    var(--cursor-radius) circle at var(--x) var(--y),
    rgba(255, 255, 255, 0.12),
    transparent 65%
  );
}

.ui-card__header,
.ui-card__body,
.ui-card__footer,
.ui-card__screenshot {
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
  filter: grayscale(1) contrast(1.1);
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
