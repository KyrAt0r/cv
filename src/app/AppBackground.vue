<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useAsciiField } from './useAsciiField'

const canvas = useTemplateRef<HTMLCanvasElement>('background')
useAsciiField(canvas)
</script>

<template>
  <canvas ref="background" class="background" aria-hidden="true"></canvas>
</template>

<style scoped>
.background {
  position: fixed;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
