<script setup lang="ts">
import { shallowRef } from 'vue'
import { Primitive } from '../primitive/index.ts'
import { type AvatarProps, type ImageLoadingStatus, provideAvatarContext } from './Avatar.ts'

defineOptions({
  name: 'Avatar',
})

withDefaults(defineProps<AvatarProps>(), {
  as: 'span',
})

const imageLoadingStatus = shallowRef<ImageLoadingStatus>('idle')

provideAvatarContext({
  imageLoadingStatus,
  onImageLoadingStatusChange(newStatus) {
    imageLoadingStatus.value = newStatus
  },
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
  >
    <slot />
  </Primitive>
</template>
