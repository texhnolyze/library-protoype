<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'
import type { Book } from '../../types'

defineOptions({
  name: 'AddBookPage',
})
const route = useRoute('/books/add')

const canvasId = ref('qr-code-canvas')
const formId = ref('add-book-form')
const formData = ref({
  title: '',
  authors: '',
  isbn: '',
  coverUrl: '',
  number: 1,
  publishedAt: '',
})

const formChecked = ref(false)
const isTitleValid = computed(() => formData.value.title.length > 0)
const isPublishedAtValid = computed(
  () => formData.value.publishedAt.length > 0,
)
const areAuthorsValid = computed(() => formData.value.authors.length > 3)
const isIsbnValid = computed(
  () => formData.value.isbn.length >= 13 && formData.value.isbn.length <= 14,
)
const isNumberValid = computed(() => formData.value.number > 0)
const isCoverUrlValid = computed(
  () => !formData.value.coverUrl || URL.canParse(formData.value.coverUrl),
)

const isFormValid = computed(
  () =>
    isTitleValid.value
    && areAuthorsValid.value
    && isIsbnValid.value
    && isNumberValid.value
    && isCoverUrlValid.value,
)

const errors = ref<object>({})

function checkForm() {
  errors.value = {}
  formChecked.value = true

  if (!isTitleValid.value)
    errors.value.title = 'Title is required.'

  if (!areAuthorsValid.value)
    errors.value.authors = 'Authors must be at least 3 characters long.'

  if (!isIsbnValid.value)
    errors.value.isbn = 'ISBN must be 13 characters long.'

  if (!isPublishedAtValid.value)
    errors.value.publishedAt = 'Published at is required.'

  if (!isNumberValid.value)
    errors.value.number = 'Number of copies must be at least 1.'

  if (!isCoverUrlValid.value)
    errors.value.coverUrl = 'Cover URL must be a valid URL.'
}

const books = useBooksStore()
const book = ref<Book>({
  id: { uuid: '' },
  title: '',
  authors: [],
  isbn: '',
  number: 0,
  coverUrl: null,
  publishedAt: null,
})

function bookToFormData() {
  formData.value = {
    title: book.value.title,
    authors: book.value.authors.map(author => author.name).join(', '),
    isbn: book.value.isbn,
    coverUrl: book.value.coverUrl.toString(),
    publishedAt: book.value.publishedAt.toISOString().split('T')[0],
    number: book.value.number,
  }
}

function formDataToBook() {
  book.value = {
    id: { uuid: uuidv4() },
    title: formData.value.title,
    authors: formData.value.authors
      .split(',')
      .map(name => ({ name: name.trim() })),
    isbn: formData.value.isbn,
    publishedAt: new Date(formData.value.publishedAt),
    number: formData.value.number,
  }

  if (formData.value.coverUrl)
    book.value.coverUrl = new URL(formData.value.coverUrl)
}

function addBookToLibrary() {
  checkForm()
  if (!isFormValid.value)
    return

  formDataToBook()
  console.log(book.value.id.uuid)
  const uuid = String(book.value.id.uuid)
  console.log(uuid)
  QRCode.toCanvas(canvasId.value, uuid, (err: Error) => {
    if (err)
      console.error(err)
  })
}

watchEffect(() => {
  if (route.query?.uuid) {
    const foundBook = books.get(route.query.uuid)
    if (foundBook) {
      book.value = foundBook
      bookToFormData()
    }
  }
})
</script>

<template>
  <div flex-container gap-lg>
    <form :id="formId" w-full flex flex-wrap method="post" @submit="">
      <div form-row>
        <label input-label class="basis-[calc(33.3%-1.125rem)]" for="title">Title</label>
        <input

          id="title"
          v-model="formData.title"
          class="basis-[calc(66.6%-1.125rem)]"
          type="text"
          minlength="1"
          maxlength="100" required
          input-field
          :class="{ 'border-red-300': formChecked && !isTitleValid }"
        >
      </div>
      <div form-row>
        <label input-label class="basis-[calc(33.3%-1.125rem)]" for="authors">Authors</label>
        <input

          id="authors"
          v-model="formData.authors"
          class="basis-[calc(66.6%-1.125rem)]"
          type="text"
          minlength="3" required
          input-field
          :class="{ 'border-red-300': formChecked && !areAuthorsValid }"
        >
      </div>
      <div form-row>
        <label input-label class="basis-[calc(33.3%-1.125rem)]" for="isbn">ISBN-13</label>
        <input

          id="isbn"
          v-model="formData.isbn"
          class="basis-[calc(66.6%-1.125rem)]"
          type="text"
          minlength="13"
          maxlength="14" required
          input-field
          :class="{ 'border-red-300': formChecked && !isIsbnValid }"
        >
      </div>
      <div form-row>
        <label
          input-label
          class="basis-[calc(33.3%-1.125rem)]"
          for="publishedAt"
        >Published at</label>
        <input

          id="publishedAt"
          v-model="formData.publishedAt"
          class="basis-[calc(66.6%-1.125rem)]"
          type="date" required
          input-field
          :class="{ 'border-red-300': formChecked && !isPublishedAtValid }"
        >
      </div>
      <div form-row>
        <label input-label class="basis-[calc(33.3%-1.125rem)]" for="number">Number of copies</label>
        <input

          id="number"
          v-model="formData.number"
          class="basis-[calc(66.6%-1.125rem)]"
          type="number"
          min="1"
          max="10" required
          input-field
          :class="{ 'border-red-300': formChecked && !isNumberValid }"
        >
      </div>
      <div form-row>
        <label input-label class="basis-[calc(33.3%-1.125rem)]" for="coverUrl">Bookcover URL</label>
        <input
          id="coverUrl"
          v-model="formData.coverUrl"
          input-field
          class="basis-[calc(66.6%-1.125rem)]"
          type="url"
          :class="{ 'border-red-300': formChecked && !isCoverUrlValid }"
        >
      </div>
      <div v-show="formData.coverUrl.length" form-row>
        <div
          input-label
          class="basis-[calc(33.3%-1.125rem)]"
          for="coverPreview"
        >
          Preview
        </div>
        <img
          w-1
          class="basis-[calc(33.3%-1.125rem)]"
          :src="formData.coverUrl"
        >
      </div>

      <div form-row>
        <div class="basis-[calc(33.3%-1.125rem)]" />
        <div class="basis-[calc(66.6%-1.125rem)]">
          <p

            v-for="(error, key) of errors" :key="key" text-left
            text-red-500
            font-bold
          >
            {{ error }}
          </p>
        </div>
      </div>

      <div form-row>
        <div class="basis-[calc(33.3%-1.125rem)]" />
        <button
          btn
          add-btn
          type="button"
          class="basis-[calc(66.6%-1.125rem)]"
          :disabled="formChecked && !isFormValid"
          @click="addBookToLibrary"
        >
          Add Book(s) to Library
        </button>
      </div>
    </form>

    <canvas :id="canvasId" w-full />
  </div>
</template>
