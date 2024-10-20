import { generateColors } from './dist/index.esm.min.js'

const colorShades = generateColors({
  option: {
    format: 'object2',
    output: 'rgb-only',
    prefix: 'tx_',
    // opacityPrefix: 'bg',
    reverse: true
  },
  color: {
    primary: '#ccf654',
    secondary: '#a55de7'
  }
})

console.log(colorShades)
