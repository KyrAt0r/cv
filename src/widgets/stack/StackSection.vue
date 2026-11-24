<script setup lang="ts">
import { techTagIcons } from '@/assets/icons/tech'
import Card from '@/ui-kit/card'
import Section from '@/ui-kit/section'
import TagList from '@/ui-kit/tag-list'

const groups = [
  {
    title: 'фреймворки и языки',
    tags: [
      'Vue',
      'Vue Router',
      'TanStack Router',
      'React',
      'Angular',
      'AngularJS',
      'TypeScript',
      'JavaScript',
      'Dart',
      'Flutter',
    ],
  },
  {
    title: 'состояние',
    tags: ['Pinia', 'Pinia Colada', 'Effector', 'NgRx', 'RxJS'],
  },
  {
    title: 'интерфейс',
    tags: [
      'HTML',
      'CSS',
      'SCSS',
      'Tailwind CSS',
      'Ant Design',
      'shadcn-vue',
      'PrimeVue',
      'TanStack Vue Form',
    ],
  },
  {
    title: 'данные',
    tags: ['REST', 'GraphQL', 'WebSocket', 'ofetch', 'Zod', 'TanStack Query'],
  },
  {
    title: 'архитектура',
    tags: ['Feature-Sliced Design', 'Module Federation'],
  },
  {
    title: 'сборка',
    tags: ['Vite', 'Webpack'],
  },
  {
    title: 'качество',
    tags: ['Vitest', 'MSW', 'Storybook'],
  },
  {
    title: 'поставка',
    tags: ['Docker', 'GitLab CI/CD', 'Azure DevOps'],
  },
  {
    title: 'платформы',
    tags: ['SharePoint'],
  },
] as const
</script>

<template>
  <Section title="// стек">
    <Card class="skills-card">
      <section v-for="group in groups" :key="group.title" class="skills-group">
        <h3 class="skills-group__title">// {{ group.title }}</h3>
        <TagList :tags="group.tags" :icons="techTagIcons" />
      </section>
    </Card>
  </Section>
</template>

<style scoped>
.skills-group + .skills-group {
  margin-top: 18px;
}

.skills-group__title {
  margin: 0;
  color: var(--dim);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.skills-card :deep(.ui-tag-list) {
  margin-top: 8px;
}
</style>
