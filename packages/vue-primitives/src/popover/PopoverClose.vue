<script setup lang="ts">
import Primitive from '../primitive/Primitive.vue'
import { composeEventHandlers } from '../utils/vue.ts'
import { usePopoverContext } from './PopoverRoot.ts'
import type { PopoverCloseEmits, PopoverCloseProps } from './PopoverClose.ts'

defineOptions({
  name: 'PopoverClose',
})

withDefaults(defineProps<PopoverCloseProps>(), {
  as: 'button',
})
const emit = defineEmits<PopoverCloseEmits>()

const context = usePopoverContext('PopoverClose')

const onClick = composeEventHandlers<MouseEvent>((event) => {
  emit('click', event)
}, () => {
  context.onOpenChange(false)
})
</script>

<template>
  <Primitive
    :as="as"
    type="button"
    @click="onClick"
  >
    <slot />
  </Primitive>
</template>
