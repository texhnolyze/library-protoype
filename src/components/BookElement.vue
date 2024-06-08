<script setup lang="ts">
import type { Book } from '../types'

defineProps<{ book: Book, selectText: string }>()

const emit = defineEmits(['select:book'])

const selected = ref(false)

function onClick(book: Book) {
  emit('select:book', book)
}
</script>

<template>
  <div
    type="button"
    cursor-pointer
    class="basis-[calc(25%-1.125rem)]"
    tabindex="1"
    @mouseover="selected = true"
    @mouseleave="selected = false"
    @focus="selected = true"
    @blur="selected = false"
    @click="onClick(book)"
  >
    <img
      mb-4
      transition
      duration-200
      ease-in-out
      :src="book.coverUrl.toString()"
      :alt="`Cover - ${book.title}`"
      :class="{ 'transform-scale-103': selected }"
    >
    <div text-xl fw-bold>
      {{ book.title }}
    </div>
    <div v-for="author in book.authors" :key="author.name">
      {{ author.name }}
    </div>
    <div italic>
      {{ book.isbn }}
    </div>
    <div

      text-lg text-blue-500 fw-bold opacity-0 transition duration-200 ease-in-out
      :class="{ 'opacity-100': selected }"
    >
      {{ selectText }}
    </div>
  </div>
</template>
