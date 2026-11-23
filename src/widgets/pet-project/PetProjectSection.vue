<script setup lang="ts">
import { techTagIcons } from '@/assets/icons/tech'
import Card from '@/ui-kit/card'
import Placeholder from '@/ui-kit/placeholder'
import Section from '@/ui-kit/section'
import TagList from '@/ui-kit/tag-list'
</script>

<template>
  <Section title="// пет-проект">
    <Card>
      <template #header>Сервис портфеля</template>
      <template #header-additional>личный</template>
      <p>Учёт ИИС/брокерского счёта, импорт отчётов, графики, котировки MOEX.</p>
      <template #footer>
        <TagList :icons="techTagIcons" :tags="['Vue', 'Tailwind']" />
      </template>
      <template #screenshot>
        <Placeholder>[ скриншот проекта ]</Placeholder>
      </template>
    </Card>
  </Section>
</template>
