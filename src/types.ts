import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface Signature {
  uuid: string
}

export interface Author {
  name: string
}

export interface Book {
  id: Signature
  number: number
  title: string
  isbn: string
  publishedAt: Date
  authors: Author[]
  coverUrl: URL
}
