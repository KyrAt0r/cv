<script setup lang="ts">
import { computed } from 'vue'

import { Primitive } from 'reka-ui'

const props = defineProps<{
  icon?: string | readonly string[]
}>()

const icons = computed(() =>
  props.icon ? (Array.isArray(props.icon) ? props.icon : [props.icon]) : [],
)
</script>

<template>
  <Primitive as="span" class="ui-tag">
    <img
      v-for="src in icons"
      :key="src"
      class="ui-tag__icon"
      :src="src"
      alt=""
      aria-hidden="true"
    />
    <slot />
  </Primitive>
</template>

<style scoped>
.ui-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border: 1px solid var(--line);
  font-size: 12px;
}

.ui-tag__icon {
  height: 14px;
  width: auto;
}
</style>
