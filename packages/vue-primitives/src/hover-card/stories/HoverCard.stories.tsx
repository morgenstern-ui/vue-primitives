import CBasic from './Basic.vue'
import CContainTextSelection from './ContainTextSelection.vue'
import CAsyncUpdate from './AsyncUpdate.vue'
import CCustomDurations from './CustomDurations.vue'
import CControlled from './Controlled.vue'
import CLayerable from './Layerable.vue'
import CAnimated from './Animated.vue'
import CForcedMount from './ForcedMount.vue'
import CNested from './Nested.vue'
import CNonPortal from './NonPortal.vue'
import CWithSlottedTrigger from './WithSlottedTrigger.vue'
import CWithSlottedContent from './WithSlottedContent.vue'
import CChromatic from './Chromatic.vue'

export default { title: 'Components/HoverCard' }

export function Basic() {
  return CBasic
}

export function ContainTextSelection() {
  return CContainTextSelection
}

export function AsyncUpdate() {
  return CAsyncUpdate
}

export function CustomDurations() {
  return CCustomDurations
}

export function Controlled() {
  return CControlled
}

export function Layerable() {
  return CLayerable
}

export function Animated() {
  return CAnimated
}

export function ForcedMount() {
  return CForcedMount
}

export function Nested() {
  return CNested
}

export function NonPortal() {
  return CNonPortal
}

export function WithSlottedTrigger() {
  return CWithSlottedTrigger
}

export function WithSlottedContent() {
  return CWithSlottedContent
}

export function Chromatic() {
  return CChromatic
}
Chromatic.parameters = { chromatic: { disable: false } }
