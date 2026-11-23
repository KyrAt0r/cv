<template>
  <div class="ui-placeholder"><slot /></div>
</template>

<style scoped>
.ui-placeholder {
  display: grid;
  place-items: center;
  aspect-ratio: 16/9;
  margin-top: 14px;
  color: var(--dim);
  font-size: 12px;
  background: repeating-linear-gradient(
    45deg,
    transparent 0 8px,
    rgba(255, 255, 255, 0.04) 8px 9px
  );
  border: 1px dashed var(--line);
}
</style>
