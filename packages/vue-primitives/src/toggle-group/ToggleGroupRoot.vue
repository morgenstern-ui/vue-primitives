<script setup lang="ts" generic="T extends ToggleGroupType">
import { computed } from 'vue'
import { useControllableState } from '../hooks/index.ts'
import { useDirection } from '../direction/Direction.ts'
import { RovingFocusGroupRoot } from '../roving-focus/index.ts'
import { Primitive } from '../primitive/index.ts'
import { arrayify } from '../utils/array.ts'
import { type ToggleGroupEmits, type ToggleGroupProps, type ToggleGroupType, provideToggleGroupContext } from './ToggleGroupRoot.ts'

type SingleValue = Exclude<ToggleGroupProps<'single'>['value'], undefined>
type MultipleValue = Exclude<ToggleGroupProps<'multiple'>['value'], undefined>
type Value = T extends 'single' ? SingleValue : MultipleValue

defineOptions({
  name: 'ToggleGroup',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ToggleGroupProps<T>>(), {
  disabled: false,
  rovingFocus: true,
  loop: true,
})
const emit = defineEmits<ToggleGroupEmits<T>>()

const value = useControllableState(props, v => emit('update:value', v as Value), 'value', props.defaultValue)

const TYPE_SINGLE = 'single' as const satisfies ToggleGroupType

const direction = useDirection(() => props.dir)

provideToggleGroupContext({
  type() {
    return props.type
  },
  value: computed(() => {
    if (props.type === TYPE_SINGLE)
      return typeof value.value === 'string' ? [value.value] : []
    return Array.isArray(value.value) ? value.value : []
  }),
  onItemActivate(itemValue) {
    if (props.type === TYPE_SINGLE) {
      value.value = itemValue as Value
    }
    else {
      value.value = [...arrayify<SingleValue>(value.value || []), itemValue] as Value
    }
  },
  onItemDeactivate(itemValue) {
    if (props.type === TYPE_SINGLE) {
      value.value = '' as Value
    }
    else {
      value.value = arrayify<SingleValue>(value.value || []).filter(value => value !== itemValue) as Value
    }
  },
  rovingFocus() {
    return props.rovingFocus
  },
  disabled() {
    return props.disabled
  },
})
</script>

<template>
  <RovingFocusGroupRoot
    v-if="rovingFocus"
    as-child
    :orientation="orientation"
    :dir="direction"
    :loop="loop"
  >
    <Primitive
      v-bind="$attrs"
      role="group"
      :dir="direction"
    >
      <slot />
    </Primitive>
  </RovingFocusGroupRoot>
  <Primitive
    v-else
    v-bind="$attrs"
    role="group"
    :dir="direction"
  >
    <slot />
  </Primitive>
</template>
