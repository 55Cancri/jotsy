import chalk from 'chalk'
import * as rx from 'rxjs'
import R from 'ramda'
import * as util from 'util'
import * as op from 'rxjs/operators'
import * as d from 'date-fns'
import { colors } from './assets/colors'

// define the types

/**
 * An enhanced string type that offers hints for specific options.
 */
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

export type Output = Options & { finalMessage: string }

export type Value = {
  timestamp?: string
  text: string
}

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

const getTimestamp = () => `[${d.format(new Date(), 'hh:mm:ss')}]: `

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
      throw new Error('The color option must be a string.')
    }

    const { isKeyword, isHex, keyword } = getColorKeyword(color)

    if (isKeyword) return { ...value, [key]: chalk.hex(colors[keyword])(text) }
    if (isHex) return { ...value, [key]: chalk.hex(keyword)(text) }

    throw new Error('You provided an invalid color to jot.')
  }

  const coloredText = text ? chalk.keyword(defaultColor)(text) : undefined

  return { ...value, [key]: coloredText }
}

/* time function - optionally apply timestamp */

const showtime = (value: Value, options?: Options) =>
  options?.showTimestamp === false
    ? value
    : { ...value, timestamp: getTimestamp() }

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
    // for image capture
    // console.log('\n\n\n\n\n' + finalMessage + '\n\n\n\n\n')

    return output
  }

  const { hex: timeHex } = getColorKeyword(
    options?.timestampColor ? options.timestampColor : 'grey'
  )
  const { hex: textHex } = getColorKeyword(
    options?.textColor ? options?.textColor : 'white'
  )

  time && console.group(chalk.hex(timeHex)(time?.slice(0, -2)))
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
  const [, lineNumber] = stackLineTwo.match(/\:([1-9\:]*)/i) || []

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
  const cause = chalk.hex(colors.red)(` ${error.message} `)

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

/* ============================================================ */

/* color a string */
const colorize = (text: string) => (hex: string) => chalk.hex(hex)(text)

/* get the current time */
const getTimestamp = () => `[${d.format(new Date(), 'hh:mm:ss')}]: `

/* throw an error with a custom error message */
const throwError = (message: string) => () => {
  throw new Error(message)
}

/* convert n arguments into an array */
const stringsToArray = (...args) => args

/* concat an array of n number of strings */
const reduceConcat = R.reduce(R.concat, '')

const concatStrings = R.pipe(stringsToArray, reduceConcat)

/* ramda - get the hex value of a color keyword */
const getHex = (color: string) =>
  R.ifElse(
    R.has(color),
    R.prop(color),
    throwError('Invalid color provided.')
  )(colors)

/* ramda - create timestamp */
const timestamp = (defaultColor: ColorKeywords = 'darkgray') =>
  R.pipe(
    R.prop('timestampColor'),
    R.ifElse(
      R.either(R.and(R.is(String), R.complement(R.isEmpty)), R.isNil),
      R.identity,
      throwError('Timestamp must be color.')
    ),
    R.defaultTo(defaultColor),
    getHex,
    colorize(getTimestamp())
  )

/* create text */
const text = (text: string, defaultColor: ColorKeywords = 'white') =>
  R.pipe(
    R.prop('textColor'),
    R.ifElse(
      R.either(R.both(R.is(String), R.complement(R.isEmpty)), R.isNil),
      R.identity,
      throwError('Text must be color.')
    ),
    R.defaultTo(defaultColor),
    getHex,
    colorize(text)
  )

export const info = (input: unknown, options?: InfoOptions) => {
  /* helper function - calculate the memory usage in MB */
  const calculateMemoryUsage = () =>
    Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100

  /* ramda - get the memory usage */
  const getMemoryUsage = R.pipe(
    R.always('gray' as ColorKeywords),
    getHex,
    colorize(
      `${' '.repeat(12)}${chalk.bold(
        'Memory used:'
      )} ${calculateMemoryUsage()} MB.`
    ),
    R.concat('\n')
  )

  /* ramda - conditionally create memory usage */
  const memoryUsage = R.pipe(
    R.prop('showMemoryUsage'),
    R.cond([
      [R.either(R.equals(true), R.isNil), getMemoryUsage],
      [R.equals(false), R.always(undefined)],
      [R.T, throwError('Memory usage must be a boolean.')]
    ])
  )

  /* ramda - log to the console */
  const output = R.converge(concatStrings, [
    timestamp('dodgerblue'),
    text(input, 'skyblue'),
    memoryUsage
  ])

  /* log colorful message */
  return console.log(output(options))
}

export const warn = (input: unknown, options: Options) => {
  /* ramda - log to the console */
  const output = R.converge(concatStrings, [
    timestamp('goldenrod'),
    text(input, 'gold')
  ])

  /* log colorful message */
  return console.log(output(options))
}

export const error = (input: unknown, options?: Options) => {
  /* ramda - log to the console */
  const output = R.converge(concatStrings, [
    timestamp('firebrick'),
    text(input, 'crimson')
  ])

  /* log colorful message */
  return console.log(output(options))
}

export const count = (input: unknown, options?: CountOptions) => {
  /* helper function - create message */
  const logLength = ([type, unit]: [string, string]) => (length: number) => {
    const value =
      typeof options?.label === 'string'
        ? `"${chalk.italic(options.label)}"`
        : `The ${type}`
    return text(`${value} has ${length} ${unit}.`)(options)
  }

  /* ramda - count the variable */
  const length = (input: string) => (options: Options) =>
    R.pipe(
      R.cond([
        [R.is(String), R.pipe(R.length, logLength(['string', 'characters']))],
        [R.is(Array), R.pipe(R.length, logLength(['array', 'items']))],
        [R.is(Object), R.pipe(R.keys, R.length, logLength(['object', 'keys']))],
        [(R.T, throwError('Value is not iterable.'))]
      ])
    )(input)

  /* ramda - log to the console */
  const output = R.converge(concatStrings, [timestamp(), length(input)])

  /* log colorful message */
  return console.log(output(options))
}

// const ltrBuddy = rx
//   .of(input!)
//   .pipe(
//     op.switchMap(value => {
//       if (Array.isArray(value)) return 'array has ' + value.length + ' items.'
//       if (typeof value === 'string')
//         return 'string has ' + value.length + ' characters.'
//       if (typeof value === 'object' && value !== null)
//         return 'object has ' + Object.keys(value).length + ' keys.'

//       return 'Value is not countable.'
//     })
//   )
//   .subscribe()

export as namespace jot
