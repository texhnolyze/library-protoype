<script setup lang="ts">
import SearchInput from 'vue-search-input'
import 'vue-search-input/dist/styles.css'

import BookElement from '../../components/BookElement.vue'
import type { Book } from '../../types'

defineOptions({
  name: 'LendBookPage',
})

const books = useBooksStore()

const search = ref('')
const foundBooks = ref<Book[]>(books.all)

function updatePreview() {
  foundBooks.value = books.search(search.value)
}
</script>

<template>
  <div flex-container gap-lg>
    <SearchInput
      v-model="search"
      :shortcut-icon="false"
      placeholder="Exemplar suchen"
      class="search-input-wrapper basis-[100%]"
      @update:model-value="updatePreview($event)"
    />

    <div v-if="search && foundBooks.length === 0" w-full py-4>
      No books found.
    </div>
    <BookElement
      v-for="book in foundBooks"
      v-else
      :key="book.id.uuid"
      :book="book"
      select-text="Lend book"
    />
  </div>
</template>
