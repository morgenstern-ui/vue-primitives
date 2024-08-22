import { isClient } from '@vueuse/core'
import { type Ref, nextTick, watch } from 'vue'

export type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent
}>
export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

export const DISMISSABLE_LAYER_NAME = 'DismissableLayer'
// export const CONTEXT_UPDATE = 'dismissableLayer.update'
export const POINTER_DOWN_OUTSIDE = 'dismissableLayer.pointerDownOutside'
export const FOCUS_OUTSIDE = 'dismissableLayer.focusOutside'

/**
 * Listens for `pointerdown` outside a DOM subtree. We use `pointerdown` rather than `pointerup`
 * to mimic layer dismissing behaviour present in OS.
 * Returns props to pass to the node we want to check for outside events.
 */
export function usePointerdownOutside(
  onPointerDownOutside: (event: PointerDownOutsideEvent) => void,
  node: Ref<HTMLElement | undefined>,
) {
  let isPointerInsideDOMTree = false
  let handleClick = () => { }

  const ret = {
    // ensures we check React component tree (not just DOM tree)
    onPointerdownCapture: () => (isPointerInsideDOMTree = true),
  }

  if (!isClient) {
    return ret
  }

  watch(node, (nodeVal, _, onCleanup) => {
    if (!nodeVal)
      return

    const ownerDocument = nodeVal.ownerDocument

    async function handlePointerDown(event: PointerEvent) {
      if (!node.value)
        return

      const target = event.target as HTMLElement

      // TODO: wip
      // if (isLayerExist(node.value, target)) {
      //   isPointerInsideDOMTree = false
      //   return
      // }

      if (target && !isPointerInsideDOMTree) {
        const eventDetail = { originalEvent: event }

        function handleAndDispatchPointerDownOutsideEvent() {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            onPointerDownOutside,
            eventDetail,
          )
        }

        /**
         * On touch devices, we need to wait for a click event because browsers implement
         * a ~350ms delay between the time the user stops touching the display and when the
         * browser executes events. We need to ensure we don't reactivate pointer-events within
         * this timeframe otherwise the browser may execute events that should have been prevented.
         *
         * Additionally, this also lets us deal automatically with cancellations when a click event
         * isn't raised because the page was considered scrolled/drag-scrolled, long-pressed, etc.
         *
         * This is why we also continuously remove the previous listener, because we cannot be
         * certain that it was raised, and therefore cleaned-up.
         */
        if (event.pointerType === 'touch') {
          ownerDocument.removeEventListener('click', handleClick)
          handleClick = handleAndDispatchPointerDownOutsideEvent
          ownerDocument.addEventListener('click', handleClick, { once: true })
        }
        else {
          handleAndDispatchPointerDownOutsideEvent()
        }
      }
      else {
        // We need to remove the event listener in case the outside click has been canceled.
        // See: https://github.com/radix-ui/primitives/issues/2171
        ownerDocument.removeEventListener('click', handleClick)
      }
      isPointerInsideDOMTree = false
    }

    /**
     * if this hook executes in a component that mounts via a `pointerdown` event, the event
     * would bubble up to the document and trigger a `pointerDownOutside` event. We avoid
     * this by delaying the event listener registration on the document.
     * This is how the DOM works, ie:
     * ```
     * button.addEventListener('pointerdown', () => {
     *   console.log('I will log');
     *   document.addEventListener('pointerdown', () => {
     *     console.log('I will also log');
     *   })
     * });
     */
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener('pointerdown', handlePointerDown)
    }, 0)

    onCleanup(() => {
      window.clearTimeout(timerId)
      ownerDocument.removeEventListener('pointerdown', handlePointerDown)
      ownerDocument.removeEventListener('click', handleClick)
    })
  })

  return ret
}

/**
 * Listens for when focus happens outside a DOM subtree.
 * Returns props to pass to the root (node) of the subtree we want to check.
 */
export function useFocusOutside(
  onFocusOutside: (event: FocusOutsideEvent) => void,
  node: Ref<HTMLElement | undefined>,
) {
  let isFocusInsideDOMTree = false

  const ret = {
    onFocusCapture: () => (isFocusInsideDOMTree = true),
    onBlurCapture: () => (isFocusInsideDOMTree = false),
  }

  if (!isClient) {
    return ret
  }

  watch(node, (nodeVal, _, onCleanup) => {
    if (!nodeVal)
      return

    const ownerDocument = nodeVal.ownerDocument

    async function handleFocus(event: FocusEvent) {
      // await nextTick()

      // TODO: wip
      // if (!node.value || isLayerExist(node.value, event.target as HTMLElement))
      // return

      if (event.target && !isFocusInsideDOMTree) {
        const eventDetail = { originalEvent: event }
        handleAndDispatchCustomEvent(FOCUS_OUTSIDE, onFocusOutside, eventDetail)
      }
    }

    ownerDocument.addEventListener('focusin', handleFocus)

    onCleanup(() => ownerDocument.removeEventListener('focusin', handleFocus))
  })

  return ret
}

function isLayerExist(layerElement: HTMLElement, targetElement: HTMLElement) {
  const targetLayer = targetElement.closest<HTMLElement>('[data-dismissable-layer]')

  if (!targetLayer)
    return false

  const mainLayer = layerElement.dataset.dismissableLayer === '' ? layerElement : layerElement.querySelector<HTMLElement>('[data-dismissable-layer]')

  if (!mainLayer)
    return false

  if (mainLayer === targetLayer)
    return true

  const nodeList = Array.from(layerElement.ownerDocument.querySelectorAll<HTMLElement>('[data-dismissable-layer]'))

  if (nodeList.indexOf(mainLayer) < nodeList.indexOf(targetLayer))
    return true

  return false
}

function handleAndDispatchCustomEvent<E extends CustomEvent, OriginalEvent extends Event>(
  name: string,
  handler: ((event: E) => void) | undefined,
  detail: { originalEvent: OriginalEvent } & (E extends CustomEvent<infer D> ? D : never),
) {
  const target = detail.originalEvent.target as HTMLElement
  const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail })

  if (handler)
    target.addEventListener(name, handler as EventListener, { once: true })

  target.dispatchEvent(event)
}