<script setup lang="ts">
import { useForwardElement } from '../hooks/index.ts'
import { Primitive } from '../primitive/index.ts'
import { useScrollAreaContext } from './ScrollAreaRoot.ts'

defineOptions({
  name: 'ScrollAreaViewport',
})

const context = useScrollAreaContext('ScrollAreaViewport')
const forwardedViewportRef = useForwardElement(context.viewport)
</script>

<template>
  <Primitive
    :ref="forwardedViewportRef"
    data-radix-scroll-area-viewport=""
    :style="{
      /**
       * We don't support `visible` because the intention is to have at least one scrollbar
       * if this component is used and `visible` will behave like `auto` in that case
       * https://developer.mozilla.org/en-US/docs/Web/CSS/overflowed#description
       *
       * We don't handle `auto` because the intention is for the native implementation
       * to be hidden if using this component. We just want to ensure the node is scrollable
       * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
       * the browser from having to work out whether to render native scrollbars or not,
       * we tell it to with the intention of hiding them in CSS.
       */
      overflowX: context.scrollbarXEnabled.value ? 'scroll' : 'hidden',
      overflowY: context.scrollbarYEnabled.value ? 'scroll' : 'hidden',
    }"
  >
    <slot />
  </Primitive>
</template>
