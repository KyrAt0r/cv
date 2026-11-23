<script setup lang="ts">
import {
  ContactsSection,
  ExperienceSection,
  KeyProjectSection,
  PetProjectSection,
  ProjectsSection,
  StackSection,
} from '@/widgets'
import AppBackground from './AppBackground.vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
</script>

<template>
  <AppBackground />
  <main>
    <AppHeader />
    <StackSection />
    <ExperienceSection />
    <KeyProjectSection />
    <ProjectsSection />
    <PetProjectSection />

    <ContactsSection />
    <AppFooter />
  </main>
</template>

<style scoped>
main {
  position: relative;
  z-index: 1;
  max-width: 880px;
  margin: 0 auto;
  padding: 12vh 20px 80px;
}
</style>
