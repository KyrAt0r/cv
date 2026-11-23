<script setup lang="ts">
import { trioooUrl } from '@/assets/companies'
import { techTagIcons } from '@/assets/icons/tech'
import Card from '@/ui-kit/card'
import Heading from '@/ui-kit/heading'
import Link from '@/ui-kit/link'
import List from '@/ui-kit/list'
import Placeholder from '@/ui-kit/placeholder'
import Section from '@/ui-kit/section'
import TagList from '@/ui-kit/tag-list'

interface CaseSection {
  title: string
  points: readonly string[]
  pride?: boolean
}

export interface Project {
  title: string
  href?: string
  companyLabel: string
  extra?: {
    href: string
    label: string
  }
  description: string
  role?: string
  points?: readonly string[]
  sections?: readonly CaseSection[]
  tags: readonly string[]
  screenshot?: boolean
}

const projects: readonly Project[] = [
  {
    title: 'ТриО',
    href: trioooUrl,
    companyLabel: 'SoftMall',
    extra: { href: trioooUrl, label: 'triooo.ru' },
    description: 'Платформа обучения информационной безопасности на Vue 3 и TypeScript.',
    points: [
      'Развивал production-функциональность и архитектуру приложения по FSD.',
      'Оптимизировал загрузку: lazy-loading для vue-pdf, grapesjs и jszip, tree-shaking, разделение чанков и bundle budget. Сократил размер бандла на 68%.',
      'Разбил крупные модули на слайсы и сегменты, убрал лишние barrel-экспорты.',
      'Разрабатывал Vue/TypeScript-компоненты и работал с UI на PrimeVue и Tailwind.',
    ],
    tags: [
      'Vue 3',
      'TypeScript',
      'Pinia',
      'Pinia Colada',
      'PrimeVue',
      'Tailwind',
      'Vite',
      'Vitest',
    ],
    screenshot: true,
  },
  {
    title: 'Диспетчер информационной безопасности',
    companyLabel: 'PARMA TG',
    description:
      'Приложение для управления доступами, сертификатами и правами пользователей. Внедрено в инфраструктуру, где ошибка в доступах напрямую влияет на безопасность и соблюдение регламентов.',
    role: 'frontend-разработчик. Выбирал стек и проектировал архитектуру, переносил бизнес-логику с Angular, отвечал за авторизацию и доступы, тесты, декомпозицию задач и документацию.',
    sections: [
      {
        title: 'Архитектура и миграция',
        points: [
          'Спроектировал фронтенд на React 18: Feature-Sliced Design, Effector, TanStack Router и Query, Vite и CSS Modules — с учётом требований безопасности.',
          'Провёл миграцию с Angular 12 на React 18: архитектура, выбор стека и перенос бизнес-логики.',
          'Декомпозировал и распределял задачи, вёл документацию и консультировал разработчиков по архитектуре и коду.',
        ],
      },
      {
        title: 'Авторизация и доступ',
        points: [
          'Собрал модули авторизации: JWT, ролевая модель и двухфакторная аутентификация через сертификаты КриптоПро.',
          'Закрыл XSS экранированием данных на клиенте.',
        ],
      },
      {
        title: 'Качество',
        points: [
          'Покрыл основные UI-компоненты unit-тестами на Vitest.',
          'Участвовал в code review: проверял pull requests и держал стандарты кодирования.',
        ],
      },
      {
        title: 'Чем горжусь',
        pride: true,
        points: [
          'Собрал не набор экранов, а контур продукта: архитектуру, модель доступа и проверку качества — и довёл приложение до внедрения в критичную инфраструктуру.',
          'Держал безопасность внутри той же архитектуры, на которой пишутся фичи: роли, JWT, сертификаты КриптоПро и защита от XSS.',
        ],
      },
    ],
    tags: [
      'React',
      'TypeScript',
      'Effector',
      'TanStack Query',
      'TanStack Router',
      'FSD',
      'Vite',
      'Vitest',
      'CSS',
    ],
  },
  {
    title: 'Система ведения нормативно-справочной информации и метаданных',
    companyLabel: 'PARMA TG',
    description:
      'Веб-приложение для автоматизации процессов и ведения нормативно-справочных данных в одном из ключевых ведомств РФ.',
    role: 'разрабатывал интерфейсы и бизнес-логику своего модуля, оценивал и декомпозировал задачи.',
    sections: [
      {
        title: 'Интерфейсы и логика',
        points: [
          'Собирал экраны с большим числом таблиц и форм внутри масштабной документационной системы.',
          'Вёл асинхронные процессы и интеграцию с API на RxJS.',
        ],
      },
      {
        title: 'Данные и сопровождение',
        points: [
          'Оптимизировал таблицы на больших объёмах: разбиение на чанки, lazy-loading, фильтрация и пагинация через GraphQL.',
          'Закрывал критические баги и подключал новые интеграции с внутренними сервисами.',
        ],
      },
    ],
    tags: ['Angular', 'TypeScript', 'NgRx', 'RxJS', 'GraphQL', 'SCSS'],
  },
  {
    title: 'Мониторинг криминогенной обстановки',
    companyLabel: 'PARMA TG',
    description: 'Система для анализа и отображения информации о происшествиях.',
    role: 'поддерживал и развивал существующий проект: багфиксы, новые функции, оценка трудозатрат и общение с заказчиком.',
    sections: [
      {
        title: 'Продукт и процессы',
        points: [
          'Оптимизировал ключевые сценарии: таблицы, отчёты и фильтры по событиям.',
          'Внедрял алгоритмы обработки данных и визуализации.',
          'Улучшал разработку и сопровождение и автоматизировал процессы в команде.',
        ],
      },
    ],
    tags: ['AngularJS', 'Angular', 'TypeScript', 'RxJS'],
  },
  {
    title: 'Мониторинг криминогенной обстановки',
    companyLabel: 'PARMA TG',
    description:
      'Пилотное мобильное приложение для сотрудников оперативных служб: просмотр камер и работа дежурной службы.',
    role: 'разрабатывал интерфейс пилота и участвовал в интеграции с backend.',
    sections: [
      {
        title: 'Интерфейс и интеграция',
        points: [
          'Собрал экраны приложения, подключил видеостримы и запросы к backend-сервисам.',
          'Учитывал требования к безопасности мобильных данных и вносил правки вместе с командой.',
        ],
      },
    ],
    tags: ['Flutter', 'Dart'],
  },
  {
    title: 'Parma DataGo',
    companyLabel: 'PARMA TG',
    description: 'Low-code платформа для быстрого анализа данных.',
    role: "переводил аналитические модули с JavaScript на TypeScript и развивал раздел 'Отчёты'.",
    sections: [
      {
        title: 'Миграция и отчёты',
        points: [
          'Перевёл дашборды и модули аналитики с React (JavaScript) на React (TypeScript).',
          'Привёл структуру компонентов в порядок, разобрал проблемы исходного кода и собрал новые отчёты по сложным метрикам.',
          'Подключал модули к внешним источникам данных.',
        ],
      },
    ],
    tags: ['React', 'TypeScript', 'JavaScript', 'Effector'],
  },
  {
    title: 'Мини-приложения внутреннего портала',
    companyLabel: 'PARMA TG',
    description:
      'Набор внутренних приложений для автоматизации бизнес-процессов и интеграции с Microsoft SharePoint. Стоят в ИТ-инфраструктуре компании с разветвлённой оргструктурой.',
    role: 'переписывал приложения с Angular на React и отвечал за публикацию и интеграцию с корпоративными сервисами.',
    sections: [
      {
        title: 'Миграция и поставка',
        points: [
          'Перенёс мини-приложения на React и встроил их в Microsoft SharePoint, включая права доступа.',
          'Собрал пайплайны публикации в Azure DevOps и сократил ручную работу в релизе и сопровождении.',
        ],
      },
    ],
    tags: ['React', 'Angular', 'TypeScript', 'Azure DevOps', 'SharePoint'],
  },
  {
    title: 'Управление ресурсами проектов',
    companyLabel: 'PARMA TG',
    description:
      'Внутреннее приложение для управления проектами. Им пользуются несколько отделов организации.',
    role: 'дорабатывал таблицы и отдельные модули под повседневные задачи пользователей.',
    sections: [
      {
        title: 'Таблицы и модули',
        points: [
          'Исправлял баги в таблицах, внедрял улучшения и оптимизации.',
          'Рефакторил отдельные модули и внедрял новые бизнес-фичи.',
        ],
      },
    ],
    tags: ['Angular', 'TypeScript', 'RxJS', 'SCSS'],
  },
  {
    title: 'Внутренний UI Kit',
    companyLabel: 'PARMA TG',
    description:
      'Библиотека компонентов, чтобы интерфейсы внутренних продуктов выглядели и вели себя одинаково.',
    role: 'развивал библиотеку и согласовывал новые компоненты с другими командами.',
    sections: [
      {
        title: 'Компоненты и стандарты',
        points: [
          'Сделал Tabs и Snackbar, доработал Grid для таблиц.',
          'Зафиксировал единые стандарты визуальных компонентов и участвовал в согласовании новых фич.',
        ],
      },
    ],
    tags: ['Angular', 'TypeScript', 'SCSS'],
  },
]
</script>

<template>
  <Section title="// проекты">
    <Card v-for="project in projects" :key="project.title">
      <template #header>
        <Link v-if="project.href" :href="project.href">{{ project.title }}</Link>
        <template v-else>{{ project.title }}</template>
      </template>
      <template #header-additional>
        {{ project.companyLabel }}
        <template v-if="project.extra">
          <span aria-hidden="true"> · </span>
          <Link :href="project.extra.href">{{ project.extra.label }}</Link>
        </template>
      </template>
      <p>{{ project.description }}</p>
      <p v-if="project.role">
        <strong>Моя роль:</strong>
        {{ project.role }}
      </p>
      <List v-if="project.points">
        <li v-for="point in project.points" :key="point">{{ point }}</li>
      </List>
      <section
        v-for="block in project.sections"
        :key="block.title"
        class="case-section"
        :class="{ pride: block.pride }"
      >
        <Heading :level="3">{{ block.title }}</Heading>
        <List>
          <li v-for="point in block.points" :key="point">{{ point }}</li>
        </List>
      </section>
      <template #footer>
        <TagList :icons="techTagIcons" :tags="project.tags" />
      </template>
      <template v-if="project.screenshot" #screenshot>
        <Placeholder>[ скриншот проекта ]</Placeholder>
      </template>
    </Card>
  </Section>
</template>

<style scoped>
.case-section {
  padding-top: 22px;
  margin-top: 28px;
  border-top: 1px solid var(--line);
}

.pride {
  border-top-color: var(--fg);
}
</style>
