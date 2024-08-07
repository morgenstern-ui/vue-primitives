import type { PrimitiveProps } from '../primitive/index.ts'

export interface RadioGroupIndicatorProps extends PrimitiveProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}
