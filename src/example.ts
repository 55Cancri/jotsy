import jot from './index'

jot.log('You can provide color keywords.', {
  timestampColor: '#aaa',
  textColor: 'springgreen'
})

jot.log('But hex values work too!', {
  timestampColor: 'aquamarine',
  textColor: 'cornflowerblue'
})

jot.log('The default looks nice right?')

jot.log('And logs can be timeless!', {
  textColor: 'tan'
})
