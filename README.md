# Color Shades Generator

This library provides functions to generate color shades from a base color. The generated shades can be output in various formats such as CSS variables, SCSS variables, JavaScript objects, or arrays. The colors can also be output in different formats like HEX, RGB, or HSL.

## Function

```javascript
function generateColors({ option = {}, color }) {}
```

Generates shades for a set of colors.

**Parameters:**
- `option` (object): Options for generating colors.
  - `format` (string): The output format. Can be "css", "scss", "object", or "array". Default is "css".
  - `output` (string): The color format. Can be "hex", "rgb", or "hsl". Default is "hex".
- `color` (object): An object where keys are color names and values are base color HEX values.

**Returns:**
- Depending on the `format` option, it returns CSS variables, SCSS variables, a JavaScript object, or an array of color shades.

## Options

### `option`

- `format`: Specifies the format of the output.
  - `"css"`: Outputs CSS variables.
  - `"scss"`: Outputs SCSS variables.
  - `"object"`: Outputs a JavaScript object.
  - `"array"`: Outputs an array of colors.
- `output`: Specifies the color format.
  - `"hex"`: Outputs colors in HEX format.
  - `"rgb"`: Outputs colors in RGB format.
  - `"hsl"`: Outputs colors in HSL format.

### `color`

An object where each key is the name of the color and each value is the HEX value of the base color.

## Usage Example

```javascript
const colorShades = generateColors({
  option: {
    format: "array", // Output format: "css", "scss", "object", or "array"
    output: "hex"    // Color format: "hex", "rgb", or "hsl"
  },
  color: {
    primary: "#ccf654",  // Base color for "primary"
    secondary: "#e56de8" // Base color for "secondary"
  }
});

console.log(colorShades);
```

### Example Output (Array Format)

```json
{
  "primary": [
    "#fdfdfd", "#fdfdfd", "#fbfefb", "#f7fdf7", "#f2fcf2", "#ccf654",
    "#4be344", "#1dd14e", "#0fb94e", "#088f4a", "#047a47"
  ],
  "secondary": [
    "#fefcfe", "#fef8fe", "#fdebfc", "#fcd9f9", "#fac2f4", "#e56de8",
    "#d62ac9", "#c31dad", "#a1198c", "#79156a", "#631353"
  ]
}
```
