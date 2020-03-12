import chalk from 'chalk'
import * as rx from 'rxjs'
import * as util from 'util'
import * as op from 'rxjs/operators'
import * as dts from 'date-fns'
import { colors } from './assets/colors'

/* function composition */

const compose = <T extends Function>(...fns: T[]) => (...x: any[]) =>
  fns.reduceRight((acc, fn) => fn(...[acc, ...x.slice(1)]), x[0])

/* curry */

const curry = <T extends Function>(fn: T, ...args: unknown[]) =>
  fn.length <= args.length
    ? fn(...args)
    : (...more: unknown[]) => curry(fn, ...args, ...more)

/* when */

const when = <T extends Function, S extends Function>(cond: T, fn: S) => (
  x: unknown
) => (cond(x) ? fn(x) : x)

const isEmpty = (data: unknown) => {
  /* check if the data is an object */
  const isObject = typeof data === 'object'

  return !isObject ? true : Object.keys(data as object).length === 0
}

/* create a timestamp in the form of [hh:mm:ss] */

const getTimestamp = () => `[${dts.format(new Date(), 'hh:mm:ss')}]: `

/* helper function - get color keyword */

const getColorKeyword = (color: string) => {
  const hexRe = /^\#[\d|A-Za-z]{3,6}$/i
  const isHex = hexRe.test(color)
  const isKeyword = color in colors
  const keyword = color as keyof ColorKeyword

  const getHex = (c: string, h: boolean, k: boolean) => {
    if (h) return c
    if (k) return colors[c as keyof ColorKeyword]
    return ''
  }

  const hex = getHex(color, isHex, isKeyword)

  return { isHex, isKeyword, keyword, hex }
}

/* helper function - trace non-string values (text, showHidden?, depth?, color?)  */

const trace = (item: unknown) => util.inspect(item, false, null, true)

/* helper function - wrap item in object */

const box = (label: string) => (value: Value, options?: Options) => ({
  [label]: value
})

/* helper function - get the color from an option */

const getColor = (
  key: keyof Value,
  option: keyof Options,
  defaultColor: 'grey' | 'white' = 'white'
) => (value: Value, options?: Options) => {
  const text = value[key]

  /* return non-strings to be traced and colored at the end */
  if (typeof value.text !== 'string') {
    return value
  }

  if (options?.[option]) {
    const color = options[option]

    if (typeof color !== 'string') {
      throw new Error('The color option must be a string')
    }

    const { isKeyword, isHex, keyword } = getColorKeyword(color)

    if (isKeyword) return { ...value, [key]: chalk.hex(colors[keyword])(text) }
    if (isHex) return { ...value, [key]: chalk.hex(keyword)(text) }

    throw new Error('You provided an invalid color to jot')
  }

  const coloredText = text ? chalk.keyword(defaultColor)(text) : undefined

  return { ...value, [key]: coloredText }
}

/* time function - optionally apply timestamp */

const showtime = (value: Value, options?: Options) =>
  !options || options?.showTimestamp || options?.timestampColor
    ? { ...value, timestamp: getTimestamp() }
    : value

const time = compose(getColor('timestamp', 'timestampColor', 'grey'), showtime)

/* text function - optionally apply color to text */

const text = compose(getColor('text', 'textColor'))

/* print function - log result to console */

const print = (value: Value, options?: Options) => {
  const time = value.timestamp

  const finalMessage = time ? time + value.text : value.text

  const defaultOptions = {
    showTimestamp: true,
    timestampColor: 'grey',
    textColor: 'white'
  }

  const configuration = !isEmpty(options) ? options : defaultOptions

  const output = { ...configuration, finalMessage }

  if (typeof value.text === 'string') {
    console.log(finalMessage)

    return output
  }

  const { hex: timeHex } = getColorKeyword(
    options?.timestampColor ? options.timestampColor : 'grey'
  )
  const { hex: textHex } = getColorKeyword(
    options?.textColor ? options?.textColor : 'white'
  )

  console.group(chalk.hex(timeHex)(time?.slice(0, -2)))
  console.log(chalk.hex(textHex)(trace(value.text)))
  console.groupEnd()

  return output
}

const logError = (error: Error, isInternal?: boolean) => {
  /* split the stack */
  const [stackLineOne, stackLineTwo] = error?.stack?.split('\n') || []

  /* get the error type e.g. ReferenceError */
  const [, errorType] = stackLineOne.match(/^(.*)\:/i) || []

  /* get the line number e.g. 11:43 */
  const [, lineNumber] = stackLineTwo.match(/\:(.*)$/i) || []

  /* find the first and last index of the problem file name */
  const indexOflastSlash = stackLineTwo.lastIndexOf('/') + 1
  const indexOfFileNameEnd = stackLineTwo.search(lineNumber) - 1

  /* get the string between those indices */
  const fileName = stackLineTwo.slice(indexOflastSlash, indexOfFileNameEnd)

  /* mark the timestamp */
  const timestamp = chalk.hex(colors.grey)(getTimestamp())

  /* define the error location */
  const location = isInternal
    ? chalk.hex(colors.red)(`Usage error:`)
    : chalk.hex(colors.red)(
        `${errorType} in ${fileName} on line ${lineNumber}:`
      )
  /* define the error cause */
  const cause = chalk.hex(colors.red)(` ${error.message}. `)

  /* concatenate the location and cause in a message */
  const message = `${location}${cause}`

  /* log the error information */
  return rx.of(console.log(timestamp, message))
}

/* wrap function - catches errors */

const wrap = <T extends Function>(f: T) => (...args: any[]) => {
  try {
    return f(...args) as Output
  } catch (error) {
    logError(error, true)
  }
}

/* log function - compose transformation functions */

const composedLog = compose(print, text, time, box('text'))

export const log = (value: unknown, options?: Options) =>
  wrap(composedLog)(value, options)

const jot = {
  log,
  info: (value: unknown) => console.log(value),
  warn: (value: unknown) => console.log(value),
  error: (value: unknown) => console.log(value)
}

export default { ...jot }
