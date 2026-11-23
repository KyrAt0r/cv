<script setup lang="ts">
import { techTagIcons } from '@/assets/icons/tech'
import Card from '@/ui-kit/card'
import Section from '@/ui-kit/section'
import TagList from '@/ui-kit/tag-list'

const tags = [
  'Vue',
  'React',
  'Angular',
  'AngularJS',
  'TypeScript',
  'JavaScript',
  'Pinia',
  'Effector',
  'NgRx',
  'RxJS',
  'TanStack',
  'HTML',
  'CSS',
  'SCSS',
  'Tailwind CSS',
  'REST',
  'GraphQL',
  'Vite',
  'Webpack',
  'Vitest',
  'Storybook',
  'Feature-Sliced Design',
  'Docker',
  'GitLab CI/CD',
  'Azure DevOps',
  'Flutter',
]
</script>

<template>
  <Section title="// стек">
    <Card class="skills-card">
      <TagList :tags="tags" :icons="techTagIcons" />
    </Card>
  </Section>
</template>

<style scoped>
.skills-card :deep(.ui-tag-list) {
  margin-top: 0;
}
</style>
