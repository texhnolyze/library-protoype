import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Book } from '../types'

const BOOKS_LOCAL_STORAGE_KEY = 'books'

export const useBooksStore = defineStore('books', () => {
  const storedBooks = getFromLocalStorage<Book[]>(BOOKS_LOCAL_STORAGE_KEY)
  const defaultBooks: Book[] = [
    {
      id: { uuid: 'd1e38e1b-e5b3-47b7-9821-e94dfe07516e' },
      number: 2,
      title: 'The Hobbit',
      authors: [{ name: 'J.R.R. Tolkien' }],
      isbn: '978-0547928227',
      publishedAt: new Date('2012-09-18'),
      coverUrl: new URL(
        'https://m.media-amazon.com/images/I/712cDO7d73L._SL1500_.jpg',
      ),
    },
    {
      id: { uuid: '55be0b87-46f3-4828-ad06-a59a0dbe7d97' },
      number: 3,
      title: '1984',
      authors: [{ name: 'George Orwell' }],
      isbn: '978-3730614389',
      publishedAt: new Date('2024-04-24'),
      coverUrl: new URL(
        'https://m.media-amazon.com/images/I/818C5YoQ0GL._SL1500_.jpg',
      ),
    },
  ]

  const books = ref<Book[]>(storedBooks || defaultBooks)

  function add(book: Book) {
    books.value.push(book)
    saveInLocalStorage(BOOKS_LOCAL_STORAGE_KEY, books.value)
  }

  function search(query: string): Book[] {
    return books.value.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()),
    )
  }

  function getByUUID(uuid: string): Book | undefined {
    return books.value.find(book => book.id.uuid === uuid)
  }

  return {
    all: books,
    add,
    search,
    get: getByUUID,
  }
})

function getFromLocalStorage<T>(key: string): T | undefined {
  const item = localStorage.getItem(key)

  if (!item)
    return undefined

  return JSON.parse(item)
}

function saveInLocalStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBooksStore as any, import.meta.hot),
  )
}
