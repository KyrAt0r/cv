<script setup lang="ts">
defineProps<{
  src: string
}>()
</script>

<template>
  <span class="ui-logo">
    <img class="ui-logo__image" :src="src" alt="" />
    <slot />
  </span>
</template>

<style scoped>
.ui-logo {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  max-width: 100%;
}

.ui-logo__image {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
}
</style>
