export type RGB = [number, number, number]
export type HSL = [number, number, number]
export type HWB = [number, number, number]
export type LCH = [number, number, number]
export type LAB = [number, number, number]
export type XYZ = [number, number, number]
export type OKLAB = [number, number, number]
export type OKLCH = [number, number, number]

export type ColorFormat =
  | 'hsl'
  | 'hsl-value'
  | 'rgb'
  | 'rgb-value'
  | 'hwb'
  | 'hwb-value'
  | 'lab'
  | 'lab-value'
  | 'lch'
  | 'lch-value'
  | 'oklch'
  | 'oklch-value'
  | 'hex'
export type OutputFormat = 'css' | 'scss' | 'tailwind' | 'object' | 'object2' | 'array'

export interface ColorOptions {
  format?: OutputFormat
  output?: ColorFormat
  opacityPrefix?: string
  prefix?: string
  reverse?: boolean
  lighterLightness?: number
  lighterSaturation?: number
  darkerLightness?: number
  darkerSaturation?: number
}

export interface ColorInput {
  [hex: string]: string
}

export type ColorShade = {
  [colorName: string]: {
    [shade: number]: string
  }
}

export interface TailwindColors {
  theme: {
    colors: {
      [colorName: string]: {
        [shade: number]: string
      }
    }
  }
}
