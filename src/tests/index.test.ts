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

afterEach(() => jest.restoreAllMocks())

describe('#jot.log', () => {
  it('logs with default options', () => {
    const message = 'The way to get started is to quit talking and begin doing.'

    /* setup spy */
    const spy = jest.spyOn(jot, 'log')

    /* log message */
    jot.log(message)

    /* assert on call */
    expect(spy).toHaveBeenCalledWith(message)
  })

  it('logs with timestamp', () => {
    /* define the message */
    const message =
      "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking."

    /* define the text color */
    const textColor: jot.ColorKeywords = 'palegreen'

    /* define jot options */
    const options: jot.Options = { showTimestamp: true, textColor }

    /* setup spy */
    const spy = jest.spyOn(jot, 'log')

    /* call the logger */
    jot.log(message, options)

    /* assert on call */
    expect(spy).toHaveBeenCalledWith(message, options)
  })

  it('logs without timestamp', () => {
    /* define the message */
    const message =
      "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success."

    /* define the text color */
    const textColor: jot.ColorKeywords = 'blanchedalmond'

    /* define jot options */
    const options: jot.Options = { showTimestamp: false, textColor }

    /* setup spy */
    const spy = jest.spyOn(jot, 'log')

    /* log message */
    jot.log(message, options)

    /* assert on call */
    expect(spy).toHaveBeenCalledWith(message, options)
  })

  it('logs custom timestamp color', () => {
    /* define the message */
    const message =
      'You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.'

    /* define the text color */
    const timestampColor: jot.ColorKeywords = 'darkorange'

    /* define jot options */
    const options: jot.Options = { timestampColor }

    /* setup spy */
    const spy = jest.spyOn(jot, 'log')

    /* log message */
    jot.log(message, options)

    /* assert on call */
    expect(spy).toHaveBeenCalledWith(message, options)
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
    const textColor: jot.ColorKeywords = 'deeppink'

    /* define jot options */
    const options: jot.Options = { showTimestamp: true, textColor }

    /* setup spy */
    const spy = jest.spyOn(jot, 'log')

    /* log message */
    jot.log(message, options)

    /* assert on call */
    expect(spy).toHaveBeenCalledWith(message, options)
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
    const textColor: jot.ColorKeywords = 'deepskyblue'

    /* define jot options */
    const options: jot.Options = { showTimestamp: true, textColor }

    /* setup spy */
    const spy = jest.spyOn(jot, 'log')

    /* log message */
    jot.log(message, options)

    /* assert on call */
    expect(spy).toHaveBeenCalledWith(message, options)
  })
})
