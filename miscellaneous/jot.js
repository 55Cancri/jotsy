const util = require("util")
const chalk = require("chalk")
const colors = require("colors")
const dtfns = require("date-fns")
const rxjs = require("rxjs")
const operators = require("rxjs/operators")

// define a basic compose function
// const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x)

const options = {
  showTime: true, // false, hh:mm:ss
  textColor: "red", // orange, yellow
  timeColor: "grey", // green, blue
}

const deps = {
  trace: data =>
    console.log(
      defaultTimeColor(deps.getTimeStamp()),
      util.inspect(data, false, null, true),
    ),
  isEmpty: data => {
    /* check if the data is an object */
    const isObject = typeof data === "object"

    if (!isObject) {
      // throw new Error("Parameter to isEmpty must be an object")
      return true
    }

    /* check if the object is empty */
    return Object.keys(data).length === 0
  },
  /* create a timestamp of the form: [hh:mm:ss] */
  getTimeStamp: () => `[${dtfns.format(new Date(), "hh:mm:ss")}]`,
  applyColor: (text, options = {}) => {
    const { mode, value } = options
    console.log({ mode })
    return chalk[mode](value)(text)
  },
}

const defaultTimeColor = chalk.grey
const defaultTextColor = chalk.blue
const errorColor = chalk.bold.red
const errorStyle = chalk.bold.white

const logError = error => {
  /* split the stack */
  const [stackLineOne, stackLineTwo] = error.stack.split("\n")

  /* get the error type e.g. ReferenceError */
  const [, errorType] = stackLineOne.match(/^(.*)\:/i)

  /* get the line number e.g. 11:43 */
  const [, lineNumber] = stackLineTwo.match(/\:(.*)\)/i)

  /* find the first and last index of the problem file name */
  const indexOflastSlash = stackLineTwo.lastIndexOf("/") + 1
  const indexOfFileNameEnd = stackLineTwo.search(lineNumber) - 1

  /* get the string between those indices */
  const fileName = stackLineTwo.slice(indexOflastSlash, indexOfFileNameEnd)

  /* mark the timestamp */
  const timestamp = defaultTimeColor(deps.getTimeStamp())

  /* define the error location */
  const location = errorColor(
    `${errorType} in ${fileName} on line ${lineNumber}:`,
  )
  /* define the error cause */
  const cause = errorStyle(` ${error.message}. `)

  /* concatenate the location and cause in a message */
  const message = `${location}${cause}`

  /* log the error information */
  return rxjs.of(console.log(timestamp, message))
}

const jot = {
  log: (...args) =>
    rxjs
      .of(args)
      .pipe(
        operators.map(([message, options]) => ({ message, options })),
        operators.map(({ message, options }) => {
          /* if no options, */
          if (!options || deps.isEmpty(options)) {
            /* and if the message is a string, */
            if (typeof message === "string") {
              /* then log a default style */
              console.log(
                defaultTimeColor(deps.getTimeStamp()),
                defaultTextColor(message),
              )
            } else {
              /* otherwise if not a string, then log the data structure (timestamp included) */
              deps.trace(message)
            }
          } else {
            /* and if the message is a string, */
            if (typeof message === "string") {
              const time = deps.applyColor(
                `${deps.getTimeStamp()}: `,
                !deps.isEmpty(options.timeColor)
                  ? options.timeColor
                  : defaultTimeColor,
              )

              /* create a timestamp */
              const timestamp = options.showTime ? time : ""

              /* create colored text */
              const text = !deps.isEmpty(options.textColor)
                ? deps.applyColor(message, options.textColor)
                : defaultTextColor(message)

              const record = `${timestamp}${text}`

              /* then log a default style */
              console.log(record)
            } else {
              /* otherwise if not a string, then log the data structure (timestamp included) */
              deps.trace(message)
            }
          }
        }),
        operators.catchError(logError),
      )
      .subscribe(),
  warn: (data, options) => {},
  error: (data, options) => logError(data),
  fatal: (data, options) => {},
}

module.exports = { jot }
