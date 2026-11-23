<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { vScramble } from '@/ui-kit/scramble'

const props = withDefaults(
  defineProps<{
    level?: 1 | 2 | 3
  }>(),
  { level: 2 },
)

const tag = computed(() => `h${props.level}`)
</script>

<template>
  <Primitive v-scramble :as="tag" class="ui-heading" :class="`ui-heading--${level}`">
    <slot />
  </Primitive>
</template>

<style scoped>
.ui-heading {
  margin: 0;
  font-weight: 500;
}

.ui-heading--1 {
  font-size: clamp(34px, 7vw, 64px);
  letter-spacing: -0.03em;
}

.ui-heading--2 {
  color: var(--dim);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.ui-heading--3 {
  font-size: 14px;
  letter-spacing: 0.04em;
}
</style>
