import { colors } from '../assets/colors'

declare global {
  /**
   * An enhanced string type that offers hints for specific options.
   */
  type LiteralUnion<T extends U, U = string> = T | (U & {})

  type ColorKeyword = typeof colors

  type ColorKeywords = LiteralUnion<keyof ColorKeyword>

  type Options = {
    showTimestamp?: boolean
    timestampColor?: ColorKeywords
    textColor?: ColorKeywords
  }

  type Output = Options & { finalMessage: string }

  type Value = {
    timestamp?: string
    text: string
  }
}
