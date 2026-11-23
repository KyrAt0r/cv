<script setup lang="ts">
import { github, gmail, telegram, vk } from '@/assets/icons/links'
import Card from '@/ui-kit/card'
import Link from '@/ui-kit/link'
import Section from '@/ui-kit/section'

const contacts = [
  { href: 'https://github.com/KyrAt0r', label: 'github.com/KyrAt0r', icon: github },
  { href: 'https://t.me/kykyryznik_k', label: 't.me/kykyryznik_k', icon: telegram },
  { href: 'https://vk.ru/toxiccobra', label: 'vk.ru/toxiccobra', icon: vk },
  { href: 'mailto:seldpodiiiyboi@gmail.com', label: 'seldpodiiiyboi@gmail.com', icon: gmail },
] as const
</script>

<template>
  <Section title="// контакты">
    <Card class="contacts">
      <template v-for="(contact, index) in contacts" :key="contact.href">
        <template v-if="index > 0"> · </template>
        <Link :href="contact.href" :icon="contact.icon">{{ contact.label }}</Link>
      </template>
    </Card>
  </Section>
</template>
