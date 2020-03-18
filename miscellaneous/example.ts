import * as jot from '../src/index'

jot.log('Regular log.')

jot.info('Info log.', { showMemoryUsage: true })

jot.warn('Warning log.')

jot.error('Error log.')

jot.count('Count log.', {
  label: 'variable',
  textColor: 'springgreen',
  timestampColor: 'palegreen'
})
