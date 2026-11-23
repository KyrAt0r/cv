<script setup lang="ts">
import { companies } from '@/assets/companies'
import Section from '@/ui-kit/section'
import ExperienceCard from './ExperienceCard.vue'

export interface Experience {
  company: string
  brand: (typeof companies)[keyof typeof companies]
  date: string
  description: string
  tags: readonly string[]
}

const experience: readonly Experience[] = [
  {
    company: 'SoftMall',
    brand: companies.softmall,
    date: '03.26 — 11.26',
    description:
      'Разрабатываю Vue-приложения и архитектуру по Feature-Sliced Design: от каркаса проекта и слоя данных до продуктовых фич и CI/CD. Настраивал self-hosted GitLab, проверки качества и Secret Detection, оптимизировал production-сборки и закрывал уязвимости.',
    tags: ['Vue 3', 'TypeScript', 'FSD', 'Pinia', 'Vite', 'GitLab CI/CD'],
  },
  {
    company: 'PARMA Technologies Group',
    brand: companies.parma,
    date: '07.19 — 02.26',
    description:
      'Проектировал фронтенд enterprise-систем на React и Angular: архитектура на FSD и Effector, миграция с Angular 12 и JavaScript на React 18 и TypeScript, модули авторизации, UI-kit, CI/CD и интеграции с SharePoint и GraphQL. Декомпозировал задачи, вёл code review, консультировал коллег, участвовал во внутренних митапах и работал с аналитиками, тестировщиками, бэкендом, дизайнерами и заказчиком.',
    tags: ['React', 'Angular', 'TypeScript', 'Effector', 'FSD', 'GraphQL'],
  },
]
</script>

<template>
  <Section title="// опыт работы">
    <ExperienceCard
      v-for="item in experience"
      :key="item.company"
      :company="item.company"
      :brand="item.brand"
      :date="item.date"
      :description="item.description"
      :tags="item.tags"
    />
  </Section>
</template>
