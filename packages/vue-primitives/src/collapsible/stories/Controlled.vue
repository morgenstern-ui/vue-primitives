<script setup lang="ts">
import './styles.css'
import { shallowRef } from 'vue'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from '../index.ts'

const open = shallowRef(false)
</script>

<template>
  <div>
    <CollapsibleRoot v-model:open="open" class="collapsible_root">
      <CollapsibleTrigger class="collapsible_trigger">
        {{ open ? 'close' : 'open' }}
      </CollapsibleTrigger>
      <CollapsibleContent class="collapsible_content" as-child>
        <article>Content 1</article>
      </CollapsibleContent>
    </CollapsibleRoot>
  </div>
</template>
