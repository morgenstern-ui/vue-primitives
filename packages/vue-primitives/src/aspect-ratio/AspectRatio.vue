<script setup lang="ts">
import { shallowRef } from 'vue'
import { Primitive } from '../primitive/index.ts'
import type { AspectRatioProps } from './AspectRatio.ts'

defineOptions({
  name: 'AspectRatio',
  inheritAttrs: false,
})

withDefaults(defineProps<AspectRatioProps>(), {
  ratio: 1,
})

const elRef = shallowRef<HTMLElement>()

defineExpose({
  $el: elRef,
})
</script>

<template>
  <div
    :style="{
      // ensures inner element is contained
      position: 'relative',
      // ensures padding bottom trick maths works
      width: '100%',
      paddingBottom: `${100 / ratio}%`,
    }"
    data-radix-aspect-ratio-wrapper=""
  >
    <Primitive
      :ref="(el: any) => elRef = el?.$el"
      :as="as"
      :as-child="asChild"
      v-bind="$attrs"
      :style="{
        // ensures children expand in ratio
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }"
    >
      <slot />
    </Primitive>
  </div>
</template>
