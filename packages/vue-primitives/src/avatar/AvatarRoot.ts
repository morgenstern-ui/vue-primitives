import type { Ref } from 'vue'
import type { PrimitiveProps } from '../primitive/index.ts'
import { createContext } from '../hooks/index.ts'

export interface AvatarRootProps {
  as?: PrimitiveProps['as']
}

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

export interface AvatarContext {
  imageLoadingStatus: Ref<ImageLoadingStatus>
  onImageLoadingStatusChange: (status: ImageLoadingStatus) => void
};

export const [provideAvatarContext, useAvatarContext] = createContext<AvatarContext>('Avatar')
