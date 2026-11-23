<script setup lang="ts">
import Heading from '@/ui-kit/heading'

defineProps<{
  title: string
}>()
</script>

<template>
  <section class="ui-section">
    <Heading :level="2" class="ui-section__title">{{ title }}</Heading>
    <slot />
  </section>
</template>

<style scoped>
.ui-section__title {
  margin: 56px 0 16px;
}
</style>
