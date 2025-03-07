import {
  rgbToHsl,
  hslToRgb,
  hexToRgb,
  rgbToHex,
  rgbToOklch,
  rgbToHwb,
  rgbToLab,
  rgbToLch
} from './lib/converter'
import type {
  RGB,
  HSL,
  ColorFormat,
  OutputFormat,
  ColorOptions,
  ColorInput,
  ColorShade
} from './types'
import { adjustShade } from './utils/adjust-shades'

function formatColor(hsl: HSL, format: ColorFormat, opacityPrefix: string = ''): string {
  const [h, s, l] = hsl
  const rgb = hslToRgb(h, s, l)
  const opacityVar = opacityPrefix ? ` / var(--${opacityPrefix}-opacity)` : ''

  // Define a helper function to extract values for *-value formats
  const extractValues = (str: string) => str.match(/[\d.]+%?/g)?.join(' ') || ''

  switch (format) {
    case 'rgb':
      return `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]}${opacityVar})`
    case 'rgb-value':
      return extractValues(`rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`)
    case 'hsl':
      return `hsl(${Math.round(h)} ${Math.round(s)}% ${l.toFixed(1)}%${opacityVar})`
    case 'hsl-value':
      return extractValues(`hsl(${Math.round(h)} ${Math.round(s)}% ${l.toFixed(1)}%)`)
    case 'hwb':
    case 'hwb-value': {
      const [hw, w, b] = rgbToHwb(...rgb)
      const result = `hwb(${Math.round(hw)} ${Math.round(w)}% ${Math.round(b)}%)`
      return format === 'hwb-value' ? extractValues(result) : result
    }
    case 'lab':
    case 'lab-value': {
      const [L2, a, b2] = rgbToLab(...rgb)
      const result = `lab(${L2.toFixed(1)}% ${a.toFixed(1)} ${b2.toFixed(1)})`
      return format === 'lab-value' ? extractValues(result) : result
    }
    case 'lch':
    case 'lch-value': {
      const [L3, C2, H2] = rgbToLch(...rgb)
      const result = `lch(${L3.toFixed(1)}% ${C2.toFixed(1)} ${H2.toFixed(1)})`
      return format === 'lch-value' ? extractValues(result) : result
    }
    case 'oklch':
    case 'oklch-value': {
      const [L, C, H] = rgbToOklch(...rgb)
      const result = `oklch(${L.toFixed(1)}% ${C.toFixed(3)} ${H.toFixed(1)})`
      return format === 'oklch-value' ? extractValues(result) : result
    }
    case 'hex':
    default:
      return rgbToHex(rgb)
  }
}

export function generateColors({
  option = {},
  color
}: {
  option?: ColorOptions
  color: ColorInput
}): string | ColorShade | string[] {
  const {
    format = 'css',
    output = 'hex',
    opacityPrefix = '',
    prefix = '',
    reverse = false,
    lighterLightness = 4.5,
    lighterSaturation = 10,
    darkerLightness = 6.5,
    darkerSaturation = 7
  } = option
  const colorSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const steps = reverse ? [...colorSteps].reverse() : colorSteps
  let result: any =
    format === 'array'
      ? {}
      : format === 'object' || format === 'object2'
        ? {}
        : format === 'tailwind'
          ? { theme: { colors: {} } }
          : ''

  for (let [colorName, hexColor] of Object.entries(color)) {
    const rgb = hexToRgb(hexColor)
    const hsl = rgbToHsl(...rgb)
    const isNeutral = hsl[1] < 10
    if (prefix !== '') {
      colorName = prefix + colorName
    }
    if (format === 'array') {
      result[colorName] = []
    }
    steps.forEach((step, index) => {
      const adjustedHsl = adjustShade(
        hsl,
        index,
        isNeutral,
        lighterLightness,
        lighterSaturation,
        darkerLightness,
        darkerSaturation
      )
      const colorValue = formatColor(adjustedHsl, output, opacityPrefix)
      switch (format) {
        case 'scss':
          result += `$${colorName}-${step}: ${colorValue};\n`
          break
        case 'tailwind':
          if (!result.theme.colors[colorName]) {
            result.theme.colors[colorName] = {}
          }
          result.theme.colors[colorName][step] = colorValue
          break
        case 'object':
          if (typeof result !== 'object') result = {}
          if (!result[colorName]) result[colorName] = {}
          result[colorName][step] = colorValue
          break
        case 'object2':
          result[`${colorName}-${step}`] = colorValue
          break
        case 'array':
          result[colorName].push(colorValue)
          break
        case 'css':
        default:
          result += `--${colorName}-${step}: ${colorValue};\n`
      }
    })
    if (format === 'array' && reverse) {
      result[colorName].reverse()
    }
  }
  return result
}

export * from './lib/converter'
export * from './types'
export default {
  generateColors,
  rgbToHsl,
  hslToRgb,
  hexToRgb,
  rgbToHex,
  rgbToOklch,
  rgbToHwb,
  rgbToLab,
  rgbToLch
}
