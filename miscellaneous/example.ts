import * as jot from '../src/index'

jot.log('Regular log.')

const message = [
  {
    benjaminFranklin:
      'Tell me and I forget. Teach me and I remember. Involve me and I learn.'
  },
  { anneFrank: 'Whoever is happy will make others happy too.' }
]

/* log message */
jot.log(message, { textColor: 'deepskyblue', showTimestamp: true })

jot.info('Info log.', { showMemoryUsage: true })

jot.warn('Warning log.')

jot.error('Error log.')

jot.count('Hi')

jot.count(null)

jot.count(null, {
  label: 'variable',
  textColor: 'springgreen',
  timestampColor: 'palegreen'
})

// jot.count('Count log.', {
//   label: 'variable',
//   textColor: 'springgreen',
//   timestampColor: 'palegreen'
// })
