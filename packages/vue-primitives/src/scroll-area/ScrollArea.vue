<script setup lang="ts">
import { shallowRef } from 'vue'
import { useDirection } from '../direction/index.ts'
import Primitive from '../primitive/Primitive.vue'
import { forwardRef } from '../utils/vue.ts'
import {
  type ScrollAreaElement,
  type ScrollAreaProps,
  type ScrollAreaScrollbarElement,
  type ScrollAreaViewportElement,
  provideScrollAreaContext,
} from './ScrollArea.ts'

defineOptions({
  name: 'ScrollArea',
})

const props = withDefaults(defineProps<ScrollAreaProps>(), {
  type: 'hover',
  scrollHideDelay: 600,
})

const scrollArea = shallowRef<ScrollAreaElement>()
const forwardedRef = forwardRef(scrollArea)
const viewport = shallowRef<ScrollAreaViewportElement>()
const content = shallowRef<HTMLDivElement>()
const scrollbarX = shallowRef<ScrollAreaScrollbarElement>()
const scrollbarY = shallowRef<ScrollAreaScrollbarElement>()
const cornerWidth = shallowRef(0)
const cornerHeight = shallowRef(0)
const scrollbarXEnabled = shallowRef(false)
const scrollbarYEnabled = shallowRef(false)

const direction = useDirection(() => props.dir)

provideScrollAreaContext({
  type() {
    return props.type
  },
  dir: direction,
  scrollHideDelay() {
    return props.scrollHideDelay
  },
  scrollArea,
  viewport,
  content,
  scrollbarX,
  scrollbarXEnabled,
  onScrollbarXEnabledChange(rendered) {
    scrollbarXEnabled.value = rendered
  },
  scrollbarY,
  scrollbarYEnabled,
  onScrollbarYEnabledChange(rendered) {
    scrollbarYEnabled.value = rendered
  },
  onCornerWidthChange(width) {
    cornerWidth.value = width
  },
  onCornerHeightChange(height) {
    cornerHeight.value = height
  },
})
</script>

<template>
  <Primitive
    :ref="forwardedRef"
    :dir="direction"
    :style="{
      'position': 'relative',
      // Pass corner sizes as CSS vars to reduce re-renders of context consumers
      '--radix-scroll-area-corner-width': `${cornerWidth}px`,
      '--radix-scroll-area-corner-height': `${cornerHeight}px`,
    }"
  >
    <slot />
  </Primitive>
</template>
