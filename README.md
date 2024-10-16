# Color Shade Generator

Generate shades of color from a single hex color.

## Installation

```shell
npm i @nousantx/color-generator
```

## Usage

```javascript
import { generateColors } from '@nousantx/color-generator'

const colorShades = generateColors({
  option: {
    format: 'object2',
    output: 'hex'
  },
  color: {
    primary: '#ccf654',
    secondary: '#a55de7'
  }
})

console.log(colorShades)
```

## API

### `generateColors(options)`

Generates color shades based on the provided options.

#### Parameters

- `options`: An object containing the following properties:
  - `option`: An object with the following properties:
    - `format`: The output format. Default is 'css'.
    - `output`: The color format. Default is 'hex'.
  - `color`: An object where keys are color names and values are base color HEX values.

#### Returns

Depending on the format option, it returns CSS variables, SCSS variables, a JavaScript object, or an array of color shades.

## Options

### `option.format`

Specifies the output format of the generated color shades.

- Type: `'css' | 'scss' | 'object' | 'object2' | 'array'`
- Default: `'css'`

#### Format Types:

- `'css'`: Returns CSS custom properties (variables).
- `'scss'`: Returns SCSS variables.
- `'object'`: Returns a nested object with color names as keys and shade values as nested objects.
- `'object2'`: Returns a flat object with color-shade combinations as keys.
- `'array'`: Returns an object with color names as keys and arrays of shade values.

### `option.output`

Specifies the color format of the generated shades.

- Type: `'hex' | 'rgb' | 'hsl'`
- Default: `'hex'`

### `color`

An object where keys are color names and values are base color HEX values.

- Type: `{ [colorName: string]: string }`

## Example Output

```javascript
// With format: 'object2' and output: 'hex'
{
  'primary-50': '#f4fde6',
  'primary-100': '#e8fccc',
  // ... other primary shades
  'secondary-50': '#f7f0fe',
  'secondary-100': '#efe1fd',
  // ... other secondary shades
}
```

## Notes

- The generator creates 11 shades for each color (50, 100, 200, ..., 900, 950).
- Ensure that the input HEX colors are valid 6-digit HEX codes (e.g., '#ccf654').

## License

MIT
