import type { Ref } from 'vue'
import { createContext } from '../hooks/index.ts'
import type { RovingFocusGroupRootProps } from '../roving-focus/index.ts'

export interface RadioGroupProps {
  name?: string
  required?: boolean
  disabled?: boolean
  dir?: RovingFocusGroupRootProps['dir']
  orientation?: RovingFocusGroupRootProps['orientation']
  loop?: RovingFocusGroupRootProps['loop']
  defaultValue?: string
  value?: string
}

// eslint-disable-next-line ts/consistent-type-definitions
export type RadioGroupEmits = {
  'update:value': [value: string]
}

export interface RadioGroupContextValue {
  name: () => string | undefined
  required: () => boolean
  disabled: () => boolean
  value: Ref<string>
  onValueChange: (value: string) => void
}

export const [provideRadioGroupContext, useRadioGroupContext] = createContext<RadioGroupContextValue>('RadioGroup')
