<script setup lang="ts">
import { computed } from 'vue'

import { Primitive } from 'reka-ui'
import { vScramble } from '@/ui-kit/scramble'

const props = defineProps<{
  href: string
  quiet?: boolean
  icon?: string
}>()

const external = computed(() => /^https?:\/\//.test(props.href))
</script>

<template>
  <Primitive
    as="a"
    class="ui-link"
    :class="{ 'ui-link--quiet': quiet, 'ui-link--with-icon': icon }"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <img v-if="icon" class="ui-link__icon" :src="icon" alt="" aria-hidden="true" />
    <span v-scramble><slot /></span>
  </Primitive>
</template>

<style scoped>
.ui-link {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-decoration-color: rgba(255, 255, 255, 0.35);
  text-underline-offset: 0.2em;
}

.ui-link:link,
.ui-link:visited {
  color: inherit;
}

.ui-link:hover,
.ui-link:focus-visible {
  color: var(--fg);
  text-decoration-color: currentColor;
}

.ui-link:focus-visible {
  outline: 1px solid var(--fg);
  outline-offset: 3px;
}

.ui-link--quiet {
  color: var(--dim);
  font-size: 13px;
  font-weight: 400;
}

.ui-link--quiet:link,
.ui-link--quiet:visited {
  color: var(--dim);
}

.ui-link--quiet:hover,
.ui-link--quiet:focus-visible {
  color: var(--fg);
}

.ui-link--with-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  vertical-align: middle;
  text-decoration: none;
}

.ui-link--with-icon span {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-decoration-color: rgba(255, 255, 255, 0.35);
  text-underline-offset: 0.2em;
}

.ui-link--with-icon:hover span,
.ui-link--with-icon:focus-visible span {
  text-decoration-color: currentColor;
}

.ui-link__icon {
  display: block;
  flex-shrink: 0;
  width: auto;
  height: 1em;
}
</style>
