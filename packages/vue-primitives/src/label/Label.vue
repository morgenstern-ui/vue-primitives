<script setup lang="ts">
import { Primitive } from '../primitive/index.ts'
import type { LabelEmits, LabelProps } from './Label.ts'

defineOptions({
  name: 'RadixLabel',
})

withDefaults(defineProps<LabelProps>(), {
  as: 'label',
})
const emit = defineEmits<LabelEmits>()

function onMousedown(event: MouseEvent) {
  // only prevent text selection if clicking inside the label itself
  const target = event.target as HTMLElement
  if (target.closest('button, input, select, textarea'))
    return

  emit('mousedown', event)
  // prevent text selection when double clicking label
  if (!event.defaultPrevented && event.detail > 1)
    event.preventDefault()
}
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    @mousedown="onMousedown"
  >
    <slot />
  </Primitive>
</template>
