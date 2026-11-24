<script setup lang="ts">
import { computed, ref } from 'vue'
import { techTagIcons } from '@/assets/icons/tech'
import calendarShot from '@/assets/potok/calendar.png'
import companyShot from '@/assets/potok/company.png'
import integrationsShot from '@/assets/potok/integrations.png'
import knowledgeShot from '@/assets/potok/knowledge.png'
import mailingsShot from '@/assets/potok/mailings.png'
import meetingsShot from '@/assets/potok/meetings.png'
import profileShot from '@/assets/potok/profile.png'
import templatesShot from '@/assets/potok/templates.png'
import Card from '@/ui-kit/card'
import Heading from '@/ui-kit/heading'
import List from '@/ui-kit/list'
import Section from '@/ui-kit/section'
import TagList from '@/ui-kit/tag-list'

const shots = [
  { src: calendarShot, alt: 'Календарь' },
  { src: meetingsShot, alt: 'Мои встречи' },
  { src: profileShot, alt: 'Профиль' },
  { src: companyShot, alt: 'Компания' },
  { src: templatesShot, alt: 'Шаблоны' },
  { src: mailingsShot, alt: 'Рассылки' },
  { src: integrationsShot, alt: 'Интеграции' },
  { src: knowledgeShot, alt: 'База знаний' },
]

const shotIndex = ref(0)

const currentShot = computed(() => shots[shotIndex.value]!)

function stepShot(delta: number) {
  shotIndex.value = (shotIndex.value + delta + shots.length) % shots.length
}
</script>

<template>
  <Section title="// ключевой проект">
    <Card>
      <template #header>Поток</template>
      <template #header-additional>SoftMall · 2026</template>
      <p>
        Веб-приложение для планирования встреч, работы с протоколами и настройками компании.
        Отдельная админка суперадмина включает заявки, компании, пользователей, аудит и
        балансировщик. Публичная база знаний получает контент из Directus.
      </p>
      <p>
        <strong>Моя роль:</strong> frontend-разработчик. Отвечал за фичи целиком — от экрана и
        контракта API до модуля в FSD. Создал каркас проекта, слой данных и правила структуры,
        настроил поставку через GitLab CI.
      </p>

      <section class="case-section">
        <Heading :level="3">Архитектура и инженерные практики</Heading>
        <List>
          <li>
            Инициализировал Vue 3 + TypeScript проект и выстроил FSD: публичные API слоёв, сегменты
            entities, features и widgets, композицию интерфейсов в pages и widgets.
          </li>
          <li>
            Разрезал крупные модули настроек, тарифов и балансировщика на независимые слайсы; убрал
            лишние barrel-экспорты и зафиксировал границы через oxlint.
          </li>
          <li>
            Перевёл сторы Pinia на setup-стиль, persistence — на pinia-plugin-persistedstate,
            запросы — с TanStack Query на Pinia Colada.
          </li>
          <li>
            Собрал UI-kit в shared/ui на shadcn-vue и Storybook, убрал зависимости историй от
            доменных сущностей. Стандартизировал таблицы, навигацию, скролл и раскладки страниц.
          </li>
          <li>
            Зафиксировал договорённости по API, структуре и коммитам; настроил nano-staged, vue-tsc,
            oxlint, oxfmt и раздельный typecheck приложения и Storybook.
          </li>
        </List>
      </section>

      <section class="case-section">
        <Heading :level="3">Продуктовые фичи</Heading>
        <List>
          <li>
            <strong>Встречи и календарь:</strong> создание и перенос событий, недельный вид, фильтры
            по тегам и статусам, произвольный период, поиск с debounce, подключение внешних
            календарей и проверки допустимости переноса.
          </li>
          <li>
            <strong>Протокол:</strong> редактирование текста и спикеров транскрипта, перемотка
            записи по таймкодам, лениво загружаемый аудиоплеер и ресайз дравера. Реализовал экспорт
            отчётов в PDF, DOCX и Markdown, включая перенос markdown-списков в Word.
          </li>
          <li>
            <strong>База знаний:</strong> дерево тем, хлебные крошки, поиск, недавние статьи и
            пустые состояния. Подключил Directus, проксирование на стенде и адаптивную навигацию.
          </li>
          <li>
            <strong>Тарифы и заявки:</strong> конструктор с динамическими параметрами, расчёт
            доплаты от прироста объёма с точностью до копеек, черновик от текущего тарифа и
            ограничения повторной подачи.
          </li>
          <li>
            <strong>Админка:</strong> заявки на регистрацию и смену тарифа, проверка реквизитов,
            разграничение прав, компании, приглашение пользователей, аудит и связанные записи,
            мониторинг балансировщика с поиском и фильтрами.
          </li>
          <li>
            <strong>Оболочка:</strong> авторизация и восстановление пароля, refresh-сессия, права
            через access.functions, переключение темы и кадрирование фото профиля.
          </li>
        </List>
      </section>

      <section class="case-section">
        <Heading :level="3">Данные, качество и поставка</Heading>
        <List>
          <li>
            Настроил ofetch с Bearer и refresh при 401, привёл контракты к OpenAPI, календарные
            данные — к Zod. Перевёл API с демо-данных на HTTP и MSW, в том числе в Vitest.
          </li>
          <li>
            С нуля настроил GitLab CI: сборка, Vitest с coverage, ограничение версии Node, режимы
            окружений и прокси стенда. Учёл pnpm patches в Docker-образе.
          </li>
          <li>
            Закрыл уязвимости зависимостей без pnpm overrides и open redirect при перезагрузке
            чанка. Подключил аналитику Rybbit.
          </li>
          <li>
            Оптимизировал загрузку: self-hosted шрифты, отделение TipTap и плеера, точечный
            manualChunks для Vue, удаление devtools из production и разрыв циклического импорта.
          </li>
        </List>
      </section>

      <section class="case-section pride">
        <Heading :level="3">Чем горжусь</Heading>
        <List>
          <li>
            Не просто закрывал отдельные экраны, а собрал основу проекта: архитектуру, API-слой,
            UI-kit, тестовую инфраструктуру и CI — и затем развивал на ней продуктовые модули.
          </li>
          <li>
            Системно управлял сложностью: разделял разросшиеся модули, убирал циклы и лишние
            публичные API, превращал разрозненные решения в общие компоненты и договорённости.
          </li>
          <li>
            Брал на себя полный цикл задач — от пользовательского сценария и интеграции с backend до
            производительности, безопасности и стабильной поставки.
          </li>
        </List>
      </section>

      <template #footer>
        <TagList
          :icons="techTagIcons"
          :tags="[
            'Vue 3.5',
            'TypeScript',
            'Vue Router',
            'Pinia',
            'Pinia Colada',
            'TanStack Vue Form',
            'Zod',
            'Tailwind 4',
            'shadcn-vue',
            'ofetch',
            'MSW',
            'Vitest',
            'Storybook',
            'FSD',
            'GitLab CI',
          ]"
        />
      </template>
      <template #screenshot>
        <div class="shots">
          <img :src="currentShot.src" :alt="currentShot.alt" />
          <div class="shots__bar">
            <button type="button" aria-label="Предыдущий скриншот" @click="stepShot(-1)">←</button>
            <button
              v-for="(shot, index) in shots"
              :key="shot.alt"
              type="button"
              class="shots__dot"
              :class="{ 'is-active': index === shotIndex }"
              :aria-label="shot.alt"
              :aria-current="index === shotIndex ? 'true' : undefined"
              @click="shotIndex = index"
            />
            <button type="button" aria-label="Следующий скриншот" @click="stepShot(1)">→</button>
          </div>
        </div>
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

.shots {
  display: grid;
  gap: 10px;
}

.shots img {
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.shots__bar {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
}

.shots__bar button {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dim);
  font: inherit;
  cursor: pointer;
}

.shots__bar .shots__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--fg) 40%, transparent);
}

.shots__bar .shots__dot.is-active {
  background: var(--fg);
}
</style>
