<script setup lang="ts">
import Heading from '@/ui-kit/heading'
</script>

<template>
  <Heading :level="1" class="page-title">Вадим Латыпов</Heading>
  <p class="sub">
    Frontend-разработчик из Перми, более 7 лет в коммерческой разработке. Проектирую приложения на
    Vue 3, React и TypeScript по FSD — от каркаса, API-слоя и UI-kit до CI/CD. Вёл миграцию с
    Angular на React, собирал авторизацию и ролевые модели для enterprise и госсистем, сократил
    бандл production-приложения на 68%.
  </p>
</template>

<style scoped>
.page-title {
  margin-bottom: 8px;
}

.sub {
  max-width: 560px;
  margin: 0 0 56px;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.6;
  text-shadow:
    0 0 5px #000,
    0 0 5px #000,
    0 0 5px #000;
}
</style>
