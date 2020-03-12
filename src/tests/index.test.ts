// import jot from '../index'
import * as jot from '../index'
import chalk from 'chalk'

type Config = { text: string; color?: string }

const hasTime = (text: string) => /\[(\d\d\:){2}\d\d\]:\s/.test(text)

const nthIndex = (
  base: string,
  targetText: string,
  instance: number,
  lastIndex: number = 0,
  count: number = 0
): number => {
  const index = base.indexOf(targetText, lastIndex + 1)

  if (index === -1) return -1

  if (count === instance) return index

  return nthIndex(base, targetText, instance, index, count + 1)
}

const extractTimestamp = (text: string) => {
  const timestampIndex = nthIndex(text, ':', 2)

  if (timestampIndex === -1) return ''

  const timestampEnd = timestampIndex + 2
  const timestampText = text.slice(0, timestampEnd)
  const [, timestamp] = timestampText.match(/((?<=[A-Za-z])\[.*\]:\s)/i) || []
  return timestamp
}

const applyChalk = (config: Config[]) =>
  config.map(({ text, color = 'white' }) => chalk.keyword(color)(text))

/* mock out console.log */
// beforeEach(() => jest.spyOn(console, 'log').mockImplementation(() => {}))

describe('#jot.log', () => {
  it('logs with default options', () => {
    const message = 'The way to get started is to quit talking and begin doing.'
    const { finalMessage, ...output } = jot.log(message)!

    const defaultOptions = {
      showTimestamp: true,
      timestampColor: 'grey',
      textColor: 'white'
    }

    const timestamp = extractTimestamp(finalMessage)

    const comparator = `${chalk.keyword('grey')(timestamp)}${chalk.keyword(
      'white'
    )(message)}`

    /* ensure options are correct */
    expect(output).toEqual(defaultOptions)

    /* ensure a time is included in the form of [xx:xx:xx]: */
    expect(hasTime(finalMessage)).toBe(true)

    /* ensure the surrounding chalk ansi color escape codes are correct */
    expect(finalMessage).toEqual(comparator)
  })

  it('logs with timestamp', () => {
    /* define the message */
    const message =
      "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking."

    /* define the text color */
    const textColor: ColorKeywords = 'palegreen'

    /* define jot options */
    const options: Options = { showTimestamp: true, textColor }

    /* call the logger */
    const { finalMessage, ...output } = jot.log(message, options)!

    /* extract the timestamp text */
    const timestamp = extractTimestamp(finalMessage)

    /* create config object */
    const config = [
      { text: timestamp, color: 'grey' },
      { text: message, color: textColor }
    ]

    /* extract the chalk-ified text */
    const [coloredTime, coloredText] = applyChalk(config)

    /* create how the chalk output should be */
    const comparator = coloredTime + coloredText

    /* ensure options are correct */
    expect(output).toEqual(options)

    /* ensure a time is included in the form of [hh:mm:ss]: */
    expect(hasTime(finalMessage)).toBe(true)

    /* ensure the surrounding chalk ansi color escape codes are correct */
    expect(finalMessage).toEqual(comparator)
  })

  it('logs without timestamp', () => {
    /* define the message */
    const message =
      "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success."

    /* define the text color */
    const textColor: ColorKeywords = 'blanchedalmond'

    /* define jot options */
    const options: Options = { showTimestamp: false, textColor }

    /* call the logger */
    const { finalMessage, ...output } = jot.log(message, options)!

    /* extract the timestamp text */
    const timestamp = extractTimestamp(finalMessage)

    /* create config object */
    const config = [
      { text: timestamp, color: 'grey' },
      { text: message, color: textColor }
    ]

    /* extract the chalk-ified text */
    const [coloredTime, coloredText] = applyChalk(config)

    /* create how the chalk output should be */
    const comparator = coloredTime + coloredText

    /* ensure options are correct */
    expect(output).toEqual(options)

    /* ensure a time is included in the form of [hh:mm:ss]: */
    expect(hasTime(finalMessage)).toBe(false)

    /* ensure the surrounding chalk ansi color escape codes are correct */
    expect(finalMessage).toEqual(comparator)
  })

  it('logs custom timestamp color', () => {
    /* define the message */
    const message =
      'You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.'

    /* define the text color */
    const timestampColor: ColorKeywords = 'darkorange'

    /* define jot options */
    const options: Options = { timestampColor }

    /* call the logger */
    const { finalMessage, ...output } = jot.log(message, options)!

    /* extract the timestamp text */
    const timestamp = extractTimestamp(finalMessage)

    /* create config object */
    const config = [{ text: timestamp, color: timestampColor }]

    /* extract the chalk-ified text */
    const [coloredTime] = applyChalk(config)

    /* create how the chalk output should be */
    const comparator = coloredTime + chalk.keyword('white')(message)

    /* ensure options are correct */
    expect(output).toEqual(options)

    /* ensure a time is included in the form of [hh:mm:ss]: */
    expect(hasTime(finalMessage)).toBe(true)

    /* ensure the surrounding chalk ansi color escape codes are correct */
    expect(finalMessage).toEqual(comparator)
  })

  it('traces an object', () => {
    /* define the message */
    const message = {
      age: 27,
      name: 'Kaya Scodelario',
      movies: [
        { name: 'Wuthering Heights', year: 2011 },
        { name: 'Maze Runner', year: 2014 }
      ]
    }

    /* define the text color */
    const textColor: ColorKeywords = 'deeppink'

    /* define jot options */
    const options: Options = { showTimestamp: true, textColor }

    /* call the logger */
    const { finalMessage, ...output } = jot.log(message, options)!

    /* extract the timestamp text */
    const timestamp = extractTimestamp(finalMessage)

    /* ensure options are correct */
    expect(output).toEqual(options)

    /* ensure a time is included in the form of [hh:mm:ss]: */
    expect(hasTime(finalMessage)).toBe(true)
  })

  it('traces an array of objects', () => {
    /* define the message */
    const message = [
      {
        benjaminFranklin:
          'Tell me and I forget. Teach me and I remember. Involve me and I learn.'
      },
      { anneFrank: 'Whoever is happy will make others happy too.' }
    ]

    /* define the text color */
    const textColor: ColorKeywords = 'deepskyblue'

    /* define jot options */
    const options: Options = { showTimestamp: true, textColor }

    /* call the logger */
    const { finalMessage, ...output } = jot.log(message, options)!

    /* extract the timestamp text */
    const timestamp = extractTimestamp(finalMessage)

    /* ensure options are correct */
    expect(output).toEqual(options)

    /* ensure a time is included in the form of [hh:mm:ss]: */
    expect(hasTime(finalMessage)).toBe(true)
  })
})
