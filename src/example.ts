import jot from './index'

// jot.log('You can provide color keywords.', {
//   timestampColor: '#aaa',
//   textColor: 'springgreen'
// })

// jot.log('But hex values work too!', {
//   timestampColor: 'aquamarine',
//   textColor: 'cornflowerblue'
// })

// jot.log('The default looks nice right?')

// jot.log('And logs can be timeless!', {
//   textColor: 'tan'
// })

jot.log(
  'Life is just an 80 or so year interruption from the void. --Nuziburt\n\n\n\n\n'
)

jot.log(
  'High self-awareness means that when you look in the mirror, you see yourself as you are—a flawed thinker with endless potential to learn. --Tim Urban.\n\n\n\n\n',
  { textColor: 'springgreen' }
)

jot.log(
  "Stay determined——not impatient nor discouraged——and with repeated trial and error, you're bound to reach a splendid outcome eventually. --Koro Sensei\n\n\n\n\n",
  { timestampColor: 'dodgerblue' }
)

jot.log(
  'I always knew that looking back on the tears would make me laugh. But I never knew looking back on the laughs would make me cry.  --The Office\n\n\n\n\n',
  { showTimestamp: false, textColor: 'mediumpurple' }
)

const planet = {
  name: 'Earth',
  population: '7.7b',
  orbitDistance: '1au',
  orbitPeriod: '365.24d',
  age: '4.5b'
}

jot.log(planet, { textColor: 'wheat' })
