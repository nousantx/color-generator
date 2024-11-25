#!/usr/bin/env node
import { generateColors, ColorFormat, OutputFormat, ColorInput, ColorOptions } from './index'

type CliOptions = ColorOptions & {
  colors: string
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    format: 'css',
    output: 'hex',
    prefix: '',
    opacityPrefix: '',
    colors: '',
    reverse: false,
    lighterLightness: 4.5,
    lighterSaturation: 10,
    darkerLightness: 6.5,
    darkerSaturation: 7
  }

  for (let i = 2; i < args.length; i += 2) {
    const flag = args[i]
    const value = args[i + 1]

    switch (flag) {
      case '-f':
      case '--format':
        options.format = value as OutputFormat
        break
      case '-o':
      case '--output':
        options.output = value as ColorFormat
        break
      case '-p':
      case '--prefix':
        options.prefix = value
        break
      case '-ox':
      case '--opacity-prefix':
        options.opacityPrefix = value
        break
      case '-c':
      case '--colors':
        options.colors = value
        break
      case '-r':
      case '--reverse':
        options.reverse = true
        i-- // doesn't need any value actually
        break
      case '--lighter-lightness':
        options.lighterLightness = parseFloat(value)
        break
      case '--lighter-saturation':
        options.lighterSaturation = parseFloat(value)
        break
      case '--darker-lightness':
        options.darkerLightness = parseFloat(value)
        break
      case '--darker-saturation':
        options.darkerSaturation = parseFloat(value)
        break
      case '-h':
      case '--help':
        printHelp()
        process.exit(0)
    }
  }
  return options
}

function printHelp(): void {
  console.log(`\nUsage: generate-color [options]
Options:
  -f, --format             Output format (css, scss, tailwind, object, object2, array) (default: "css")
  -o, --output            Color format (hex, rgb, rgb-only, hsl, hwb, lab, lch, oklch) (default: "hex")
  -p, --prefix            Set custom prefix for color name (e.g. 'color-')
  -ox, --opacity-prefix   Opacity prefix and enable opacity variable
  -r, --reverse           Reverse generated shades (i.e. 50 => 950, 100 => 900)
  -c, --colors            Colors in JavaScript object or JSON format
  --lighter-lightness     Adjust lightness for lighter shades (default: 4.5)
  --lighter-saturation    Adjust saturation for lighter shades (default: 10)
  --darker-lightness      Adjust lightness for darker shades (default: 6.5)
  --darker-saturation     Adjust saturation for darker shades (default: 7)
  -h, --help              Display this help message

Example:
  generate-color -c '{"primary": "#ccf654", "secondary": "#a55de7"}'\n`)
}

function validateColors(colors: string): ColorInput {
  if (!colors || colors.trim() === '') {
    throw new Error(
      `No color data provided. Please use -c or --colors flags and provide colors in javascript object / JSON format. (e.g. _ generate-color -c '{"primary":"#ccf654","secondary":"#a55de7"}'`
    )
  }

  try {
    return JSON.parse(colors)
  } catch (error) {
    throw new Error(
      'Invalid JSON format for colors. Please ensure your color input is in valid JavaScript object or JSON format.'
    )
  }
}

const options = parseArgs(process.argv)

try {
  const colorInput: ColorInput = validateColors(options.colors)
  const result = generateColors({
    option: {
      format: options.format,
      output: options.output,
      prefix: options.prefix,
      opacityPrefix: options.opacityPrefix,
      reverse: options.reverse,
      lighterLightness: options.lighterLightness,
      lighterSaturation: options.lighterSaturation,
      darkerLightness: options.darkerLightness,
      darkerSaturation: options.darkerSaturation
    },
    color: colorInput
  })

  if (typeof result === 'string') {
    console.log(result)
  } else {
    console.log(JSON.stringify(result, null, 2))
  }
} catch (error) {
  console.error('Error:', (error as Error).message)
  printHelp()
  process.exit(1)
}
