import { RGB, HSL, rgbToHsl, hslToRgb, hexToRgb, rgbToHex } from './lib/converter'

export type ColorFormat = 'hex' | 'rgb' | 'rgb-only' | 'hsl'
export type OutputFormat = 'css' | 'scss' | 'object' | 'object2' | 'array'

export interface GenerateColorsOptions {
  format?: OutputFormat
  output?: ColorFormat
  reverse?: boolean
  prefix?: string
  opacityPrefix?: string
}

export interface ColorInput {
  [colorName: string]: string
}

type ColorShades = {
  [colorName: string]: {
    [shade: number]: string
  }
}

const colorSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

function adjustShade(hsl: HSL, index: number, isNeutral: boolean): HSL {
  let [h, s, l] = hsl
  if (index < 5) {
    l = Math.min(98, l + (98 - l) * ((5 - index) / 4.5))
    if (!isNeutral) {
      s = Math.max(10, s - s * ((5 - index) / 10))
    }
  } else if (index > 5) {
    l = l * (1 - (index - 5) / 6.5)
    if (!isNeutral) {
      s = Math.min(100, s + (100 - s) * ((index - 5) / 7))
    }
  }
  return [h, s, l]
}

function formatColor(hsl: HSL, format: ColorFormat, opacityPrefix: string = ''): string {
  const [h, s, l] = hsl
  const rgb = hslToRgb(h, s, l)
  const opacityVar = opacityPrefix ? ` / var(--${opacityPrefix}-opacity)` : ''

  switch (format) {
    case 'hsl':
      return `hsl(${Math.round(h)} ${Math.round(s)}% ${l.toFixed(1)}%${opacityVar})`
    case 'rgb':
      return `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]}${opacityVar})`
    case 'rgb-only':
      return `${rgb[0]} ${rgb[1]} ${rgb[2]}`
    case 'hex':
    default:
      return rgbToHex(rgb)
  }
}

export function generateColors({
  option = {},
  color
}: {
  option?: GenerateColorsOptions
  color: ColorInput
}): string | ColorShades | string[] {
  const {
    format = 'css',
    output = 'hex',
    opacityPrefix = '',
    prefix = '',
    reverse = false
  } = option
  let result: any = format === 'array' ? {} : format === 'object' || format === 'object2' ? {} : ''
  const steps = reverse ? [...colorSteps].reverse() : colorSteps

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
      const adjustedHsl = adjustShade(hsl, index, isNeutral)
      const colorValue = formatColor(adjustedHsl, output, opacityPrefix)
      switch (format) {
        case 'scss':
          result += `$${colorName}-${step}: ${colorValue};\n`
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
