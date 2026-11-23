<script setup lang="ts">
import { computed } from 'vue'

import Tag from '@/ui-kit/tag'

export interface TagItem {
  label: string
  icon?: string | readonly string[]
}

export type TagIconMap = Record<string, string | readonly string[]>

const props = defineProps<{
  tags: readonly (string | TagItem)[]
  icons?: TagIconMap
}>()

const normalized = computed<TagItem[]>(() =>
  props.tags.map((tag) =>
    typeof tag === 'string' ? { label: tag, icon: props.icons?.[tag] } : tag,
  ),
)
</script>

<template>
  <div class="ui-tag-list" aria-label="Технологии">
    <Tag v-for="(tag, index) in normalized" :key="index" :icon="tag.icon">
      {{ tag.label }}
    </Tag>
  </div>
</template>

<style scoped>
.ui-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
</style>
