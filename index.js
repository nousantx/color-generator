import { generateColors } from './dist/index.esm.js'

const colorShades = generateColors({
  option: {
    format: 'object',
    output: 'hex'
  },
  color: {
    primary: '#ccf654',
    secondary: '#a55de7',
    
  }
})


console.log(colorShades)
