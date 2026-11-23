<script setup lang="ts">
import { techTagIcons } from '@/assets/icons/tech'
import Card from '@/ui-kit/card'
import Link from '@/ui-kit/link'
import Logo from '@/ui-kit/logo'
import TagList from '@/ui-kit/tag-list'

defineProps<{
  company: string
  brand: {
    logo: string
    site: string
    career: string
  }
  date: string
  description: string
  tags: readonly string[]
}>()
</script>

<template>
  <Card>
    <template #header>
      <Logo :src="brand.logo">
        <Link :href="brand.site">{{ company }}</Link>
        <Link :href="brand.career" quiet :aria-label="`Хабр Карьера — ${company}`">
          Хабр Карьера
        </Link>
      </Logo>
    </template>
    <template #header-additional>{{ date }}</template>
    <p>{{ description }}</p>
    <template #footer>
      <TagList :tags="tags" :icons="techTagIcons" />
    </template>
  </Card>
</template>
