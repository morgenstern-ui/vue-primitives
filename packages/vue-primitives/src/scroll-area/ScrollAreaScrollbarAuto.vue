<script setup lang="ts">
import { useDebounceFn, useResizeObserver } from '@vueuse/core'
import { shallowRef } from 'vue'
import { usePresence } from '../presence/index.ts'
import { forwardRef } from '../utils/vue.ts'
import type { ScrollAreaScrollbarAutoProps } from './ScrollAreaScrollbarAuto.ts'
import { useScrollAreaContext } from './ScrollArea.ts'
import ScrollAreaScrollbarVisible from './ScrollAreaScrollbarVisible.vue'

defineOptions({
  name: 'ScrollAreaScrollbarAuto',
})

const props = withDefaults(defineProps<ScrollAreaScrollbarAutoProps>(), {
  orientation: 'vertical',
})
const $el = shallowRef<HTMLElement>()
const forwardedRef = forwardRef($el)

const context = useScrollAreaContext('ScrollAreaScrollbarAuto')
const visible = shallowRef(false)

const handleResize = useDebounceFn(() => {
  const viewport = context.viewport.value
  if (viewport) {
    const isOverflowX = viewport.offsetWidth < viewport.scrollWidth
    const isOverflowY = viewport.offsetHeight < viewport.scrollHeight

    visible.value = props.orientation === 'horizontal' ? isOverflowX : isOverflowY
  }
}, 10)

useResizeObserver(context.viewport, handleResize)
useResizeObserver(context.content, handleResize)

const isPresent = usePresence($el, () => props.forceMount || visible.value)

defineExpose({
  $el,
})
</script>

<template>
  <ScrollAreaScrollbarVisible
    v-if="isPresent"
    :ref="forwardedRef"
    :as="as"
    :as-child="asChild"
    :orientation="orientation"
    :data-state="visible ? 'visible' : 'hidden'"
  >
    <slot />
  </ScrollAreaScrollbarVisible>
</template>
