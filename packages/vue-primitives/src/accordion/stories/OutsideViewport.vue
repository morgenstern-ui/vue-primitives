<script setup lang="ts">
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from '../index.ts'
import './styles.css'
</script>

<template>
  <div>
    <p>Scroll down to see tabs</p>
    <div :style="{ height: '150vh' }" />
    <p>
      When accordion buttons are focused and the user is navigating via keyboard, the page should
      not scroll unless the next tab is entering the viewport.
    </p>
    <AccordionRoot type="single" class="accordion_rootClass">
      <AccordionItem class="accordion_itemClass" value="one">
        <AccordionHeader class="accordion_headerClass">
          <AccordionTrigger class="accordion_triggerClass">
            One
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent class="accordion_contentClass">
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem class="accordion_itemClass" value="two">
        <AccordionHeader class="accordion_headerClass">
          <AccordionTrigger class="accordion_triggerClass">
            Two
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent class="accordion_contentClass">
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem class="accordion_itemClass" value="three" disabled>
        <AccordionHeader class="accordion_headerClass">
          <AccordionTrigger class="accordion_triggerClass">
            Three (disabled)
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent class="accordion_contentClass">
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem class="accordion_itemClass" value="four">
        <AccordionHeader class="accordion_headerClass">
          <AccordionTrigger class="accordion_triggerClass">
            Four
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent class="accordion_contentClass">
          Odio placerat
          <a href="#">quisque</a>
          sapien sagittis non sociis ligula penatibus
          dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
    <div :style="{ height: '150vh' }" />
  </div>
</template>
