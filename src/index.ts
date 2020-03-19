import chalk from 'chalk'
import * as rx from 'rxjs'
import R from 'ramda'
import * as util from 'util'
import * as op from 'rxjs/operators'
import * as d from 'date-fns'
import { colors } from './assets/colors'
import type {
  LiteralUnion,
  ColorKeyword,
  ColorKeywords,
  CountOptions,
  InfoOptions,
  Options,
  Value
} from './types'

/**
 * helper function - trace non-string values
 *  until.inspect(value, showHidden?, depth?, color?)
 * */
  const trace = (item: unknown) => util.inspect(item, false, null, true)

/* color a string */
  const colorize = (text: unknown) => (hex: string) => chalk.hex(hex)(typeof text === 'string' ? text : trace(text))

/* get the current time */
const getTimestamp = () => `[${d.format(new Date(), 'hh:mm:ss')}]: `

/* throw an error with a custom error message */
const throwError = (message: string) => (_: any) => {
  throw new Error(message)
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


/* convert n arguments into an array */
const stringsToArray = (...args: unknown[]) => args

/* concat an array of n number of strings */
const reduceConcat = R.reduce(R.concat as any, '')

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
    R.prop('timestampColor') as any,
    R.ifElse(
      R.either(
        R.and(R.is(String) as any, R.complement(R.isEmpty)) as any,
        R.isNil
      ),
      R.identity,
      throwError('Timestamp must be color.')
    ),
    R.defaultTo(defaultColor),
    getHex,
    colorize(getTimestamp())
  )

/* create text */
const text = (text: unknown, defaultColor: ColorKeywords = 'white') =>
  R.pipe(
    R.prop('textColor') as any,
    R.ifElse(
      R.either(R.both(R.is(String), R.complement(R.isEmpty)), R.isNil),
      R.identity,
      throwError('Text must be color.')
    ),
    R.defaultTo(defaultColor),
    getHex,
    colorize(text)
  )

  /* jot function - log a variable */
export const log = (input: unknown, options?: Options) => {
  /* ramda - log to the console */
  const output = R.converge(concatStrings, [
    timestamp('darkgray'),
    text(input, 'white')
  ])

  /* log colorful message */
  return console.log(output(options))
}

/* jot function - log info */
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
    R.prop('showMemoryUsage') as any,
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

/* jot function - give a warning message */
export const warn = (input: unknown, options: Options) => {
  /* ramda - log to the console */
  const output = R.converge(concatStrings, [
    timestamp('goldenrod'),
    text(input, 'gold')
  ])

  /* log colorful message */
  return console.log(output(options))
}

/* jot function - log an error */
export const error = (input: unknown, options?: Options) => {
  /* ramda - log to the console */
  const output = R.converge(concatStrings, [
    timestamp('firebrick'),
    text(input, 'crimson')
  ])

  /* log colorful message */
  return console.log(output(options))
}

/* jot function - count the elements in a data type */
export const count = (input: unknown, options?: CountOptions) => {
  /* helper function - create message */
  const logLength = ([type, unit]: [string, string]) => (
    variableLength: number
  ) => {
    const value =
      typeof options?.label === 'string'
        ? `"${chalk.italic(options.label)}"`
        : `The ${type}`

    // @ts-ignore
    return text(`${value} has ${variableLength} ${unit}.`)(options)
  }

  /* ramda - count the variable */
  const length = (text: unknown) => (options: Options) =>
    R.pipe(
      R.cond([
        [R.is(String), R.pipe(R.length, logLength(['string', 'characters']))],
        [R.is(Array), R.pipe(R.length, logLength(['array', 'items']))],
        [R.is(Object), R.pipe(R.keys, R.length, logLength(['object', 'keys']))],
        [R.T, () => false]
      ])
      // @ts-ignore
    )(text)

  const nullInput = () => R.isNil(input)

  /* ramda - log to the console */
  const output = R.ifElse(
    nullInput,
    R.curry(error)('Value is not iterable.'),
    R.converge(concatStrings, [timestamp(), length(input)])
  )

  /* log colorful message */
  return output(options) && console.log(output(options))
}

export {
  ColorKeywords,
  CountOptions,
  InfoOptions,
  Options,
  Value
}
