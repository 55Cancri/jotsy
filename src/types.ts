import { colors } from './assets/colors'

export type LiteralUnion<T extends U, U = string> = T | (U & {})

export type ColorKeyword = typeof colors

export type ColorKeywords = LiteralUnion<keyof ColorKeyword>

export type Options = {
  showTimestamp?: boolean
  timestampColor?: ColorKeywords
  textColor?: ColorKeywords
}

export type InfoOptions = Options & {
  showMemoryUsage?: boolean
}

export type CountOptions = Options & {
  label?: string
}

export type Value = {
  timestamp?: string
  text: string
}

export type log = (input: unknown, options?: Options | undefined) => void

export type info = (input: unknown, options?: InfoOptions | undefined) => void

export type warn = (input: unknown, options: Options) => void

export type error = (input: unknown, options?: Options | undefined) => void

export type count = (input: unknown, options?: CountOptions | undefined) => void

// export = jot

// export as namespace jot

// declare namespace jot {
//   type LiteralUnion<T extends U, U = string> = T | (U & {})

//   type ColorKeyword = typeof colors

//   type ColorKeywords = LiteralUnion<keyof ColorKeyword>

//   type Options = {
//     showTimestamp?: boolean
//     timestampColor?: ColorKeywords
//     textColor?: ColorKeywords
//   }

//   type InfoOptions = Options & {
//     showMemoryUsage?: boolean
//   }

//   type CountOptions = Options & {
//     label?: string
//   }

//   type Value = {
//     timestamp?: string
//     text: string
//   }

//   type log2 = (
//     value: unknown,
//     options?: Options | undefined
//   ) => Output | undefined

//   type log = (input: unknown, options?: Options | undefined) => void

//   type info = (input: unknown, options?: InfoOptions | undefined) => void

//   type warn = (input: unknown, options: Options) => void

//   type error = (input: unknown, options?: Options | undefined) => void

//   type count = (input: unknown, options?: CountOptions | undefined) => void
// }
