import type { ToggleProps } from '../toggle/index.ts'

export interface ToggleGroupItemProps {
  pressed?: ToggleProps['pressed']

  /**
   * A string value for the toggle group item. All items within a toggle group should use a unique value.
   */
  value: string

  disabled?: boolean
}
