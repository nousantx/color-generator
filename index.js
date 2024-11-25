import { generateColors } from './dist/index.esm.min.js'

const HEX = generateColors({
  option: {
    format: 'css',
    output: 'hex',
    prefix: 'hex_'
  },
  color: {
    primary: '#ccf654',
    slate: '#64748b',
    sienna: '#882D17'
  }
})

if (HEX.theme) {
  console.log(HWB.theme.colors)
} else {
  console.log(HEX)
}
