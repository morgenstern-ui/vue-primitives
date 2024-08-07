import { Comment, type VNode, cloneVNode, defineComponent, shallowRef, warn } from 'vue'
import { getRawChildren } from '../utils/getRawChildren.ts'
import { ELEMENT_NODE } from '../primitive/Primitive.ts'

export const Slot = defineComponent({
  name: 'Slot',
  setup(_, { slots, expose }) {
    const elRef = shallowRef<HTMLElement>()

    function setElRef(nodeRef: any) {
      const vnode = (nodeRef?.$el ?? nodeRef)
      const node = vnode && vnode.nodeType === ELEMENT_NODE ? vnode : undefined
      if (elRef.value === node)
        return
      elRef.value = node
    }

    expose({
      $el: elRef,
    })

    return () => {
      if (!slots.default)
        return null

      const children = slots.default && getRawChildren(slots.default())

      if (!children || !children.length)
        return null

      let child: VNode | undefined = children[0]

      if (children.length > 1) {
        let hasFound = false
        // locate first non-comment child
        for (const c of children) {
          if (c.type !== Comment) {
            if (__DEV__ && hasFound) {
              // warn more than one non-comment child
              warn(
                '<Slot> can only be used on a single element or component.',
              )
              break
            }
            child = c
            hasFound = true
            if (!__DEV__)
              break
          }
        }
      }

      if (child && child.type !== Comment) {
        return cloneVNode(child, {
          ref: setElRef,
        }, true)
      }

      return null
    }
  },
})
