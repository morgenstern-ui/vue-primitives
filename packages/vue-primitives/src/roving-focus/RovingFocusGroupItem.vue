<script setup lang="ts">
import { computed, shallowRef, useAttrs, watch, watchEffect } from 'vue'
import { Primitive } from '../primitive/index.ts'
import { useId } from '../hooks/index.ts'
import { composeEventHandlers, forwardRef } from '../utils/vue.ts'
import { ITEM_DATA_ATTR } from '../collection/Collection.ts'
import { isFunction } from '../utils/is.ts'
import { focusFirst, getFocusIntent, wrapArray } from './utils.ts'
import { Collection, type ItemData, useCollection, useRovingFocusContext } from './RovingFocusGroup.ts'
import type { RovingFocusGroupItemProps } from './RovingFocusGroupItem.ts'

defineOptions({
  name: 'RovingFocusGroupItem',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<RovingFocusGroupItemProps>(), {
  focusable: true,
  active: true,
  as: 'span',
})
const attrs = useAttrs()
const $el = shallowRef<HTMLElement>()
const forwardedRef = forwardRef($el)

const id = computed(() => props.tabStopId || useId())
const context = useRovingFocusContext()
const isCurrentTabStop = computed(() => context.currentTabStopId.value === id.value)

const getItems = useCollection()

const { onFocusableItemAdd, onFocusableItemRemove } = context

watch(() => props.focusable, (value, _, onCleanup) => {
  if (value) {
    onFocusableItemAdd()
    onCleanup(onFocusableItemRemove)
  }
}, { immediate: true })

const itemData: ItemData = { id: id.value, focusable: props.focusable, active: props.active }
watchEffect(() => {
  itemData.active = props.active
  itemData.focusable = props.focusable
  itemData.id = id.value
})
Collection.useCollectionItem($el, itemData)

const onMousedown = composeEventHandlers((event) => {
  isFunction(attrs.onMousedown) && attrs.onMousedown(event)
}, (event) => {
  // We prevent focusing non-focusable items on `mousedown`.
  // Even though the item has tabIndex={-1}, that only means take it out of the tab order.
  if (!props.focusable)
    event.preventDefault()
  // Safari doesn't focus a button when clicked so we run our logic on mousedown also
  else context.onItemFocus(id.value)
})

const onFocus = composeEventHandlers((event) => {
  isFunction(attrs.onFocus) && attrs.onFocus(event)
}, () => context.onItemFocus(id.value))

const onKeydown = composeEventHandlers<KeyboardEvent>((event) => {
  isFunction(attrs.onKeydown) && attrs.onKeydown(event)
}, (event) => {
  if (event.key === 'Tab' && event.shiftKey) {
    context.onItemShiftTab()
    return
  }

  if (event.target !== event.currentTarget)
    return

  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
    return

  const focusIntent = getFocusIntent(event, context.orientation(), context.dir.value)

  if (!focusIntent)
    return

  event.preventDefault()
  const items = getItems().filter(item => item.attrs.focusable)
  let candidateNodes = items.map(item => item.ref)

  if (focusIntent === 'last') {
    candidateNodes.reverse()
  }
  else if (focusIntent === 'prev' || focusIntent === 'next') {
    if (focusIntent === 'prev')
      candidateNodes.reverse()
    const currentIndex = candidateNodes.indexOf(event.currentTarget as HTMLElement)
    candidateNodes = context.loop()
      ? wrapArray(candidateNodes, currentIndex + 1)
      : candidateNodes.slice(currentIndex + 1)
  }

  // TODO: wip
  /**
   * Imperative focus during keydown is risky so we prevent React's batching updates
   * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
   */
  setTimeout(() => focusFirst(candidateNodes))
})

defineExpose({
  $el,
})
</script>

<template>
  <Primitive
    :ref="forwardedRef"
    :as="as"
    :as-child="asChild"
    :tabindex="isCurrentTabStop ? 0 : -1"
    :data-orientation="context.orientation()"
    :[ITEM_DATA_ATTR]="true"
    v-bind="{
      ...attrs,
      onMousedown,
      onFocus,
      onKeydown,
    }"
  >
    <slot />
  </Primitive>
</template>
