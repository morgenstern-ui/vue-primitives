import type { Ref } from 'vue'

type SetRef<T> = (el: T | undefined) => void

export function forwardRef<T = HTMLElement>(elRef: Ref<T>) {
  let rawRef: T | undefined
  function setRef(nodeRef: any) {
    const node = nodeRef ? nodeRef.$el : undefined

    if (node === rawRef)
      return

    elRef.value = node
    rawRef = node
  }

  return setRef
}

export function useComposedRefs<T = HTMLElement>(refs: Array<SetRef<T>>) {
  let rawRef: T | undefined

  function setRef(nodeRef: any) {
    const node = nodeRef ? nodeRef.$el : undefined

    if (node === rawRef)
      return

    rawRef = node

    for (const set of refs) {
      set(node)
    }
  }

  return setRef
}

export function composeEventHandlers<E extends Event>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event)

    if (checkForDefaultPrevented === false || !((event as unknown) as Event).defaultPrevented)
      ourEventHandler?.(event)
  }
}
