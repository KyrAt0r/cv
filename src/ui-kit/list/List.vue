<template>
  <ul class="ui-list">
    <slot />
  </ul>
</template>

<style scoped>
.ui-list {
  padding-left: 20px;
  margin: 16px 0 0;
  color: var(--dim);
  font-size: 14px;
  line-height: 1.6;
}

.ui-list :deep(li + li) {
  margin-top: 8px;
}
</style>
