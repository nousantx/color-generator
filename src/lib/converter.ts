import { RGB, HSL, XYZ, LAB, OKLAB, OKLCH, HWB, LCH } from '../types'

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h: number
  let s: number
  const l = (max + min) / 2
  if (max === min) {
    h = s = 0 // Achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
      default:
        h = 0
    }
    h /= 6
  }

  return [h * 360, s * 100, l * 100]
}
export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360
  s /= 100
  l /= 100
  let r: number
  let g: number
  let b: number
  if (s === 0) {
    r = g = b = l // Achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}
export function hexToRgb(hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return [r, g, b]
}
export function rgbToHex([r, g, b]: RGB): string {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}`
}
export function rgbToHwb(r: number, g: number, b: number): HWB {
  r /= 255
  g /= 255
  b /= 255
  const white = Math.min(r, g, b)
  const black = 1 - Math.max(r, g, b)
  let hue
  const [h] = rgbToHsl(r * 255, g * 255, b * 255)
  hue = h

  return [hue, white * 100, black * 100]
}
export function rgbToLab(r: number, g: number, b: number): LAB {
  const [x, y, z] = rgbToXyz(r, g, b)

  // Using D65 illuminant
  const xn = 0.95047
  const yn = 1.0
  const zn = 1.08883

  const xx = x / xn
  const yy = y / yn
  const zz = z / zn

  const fx = xx > 0.008856 ? Math.pow(xx, 1 / 3) : 7.787 * xx + 16 / 116
  const fy = yy > 0.008856 ? Math.pow(yy, 1 / 3) : 7.787 * yy + 16 / 116
  const fz = zz > 0.008856 ? Math.pow(zz, 1 / 3) : 7.787 * zz + 16 / 116

  const L = 116 * fy - 16
  const A = 500 * (fx - fy)
  const B = 200 * (fy - fz)

  return [L, A, B]
}
export function rgbToLch(r: number, g: number, b: number): LCH {
  // Convert to CIE LCH color space (different from OKLch)
  const [L, A, B] = rgbToLab(r, g, b)
  const c = Math.sqrt(A * A + B * B)
  let h = (Math.atan2(B, A) * 180) / Math.PI
  if (h < 0) h += 360

  return [L, c, h]
}
function toLinear(value: number): number {
  const val = value / 255

  return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
}
function rgbToXyz(r: number, g: number, b: number): XYZ {
  r = toLinear(r)
  g = toLinear(g)
  b = toLinear(b)
  const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b
  const z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b

  return [x, y, z]
}
function xyzToOklab(x: number, y: number, z: number): OKLAB {
  const l = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z)
  const m = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z)
  const s = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z)

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ]
}
function oklabToOklch(L: number, a: number, b: number): OKLCH {
  const c = Math.sqrt(a * a + b * b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360

  return [L, c * 1, h]
}
export function rgbToOklch(r: number, g: number, b: number): OKLCH {
  const xyz = rgbToXyz(r, g, b)
  const lab = xyzToOklab(...xyz)
  const [L, c, h] = oklabToOklch(...lab)

  return [L * 100, c, h]
}
export default { rgbToHex, rgbToHsl, hslToRgb, hexToRgb, rgbToHwb, rgbToLab, rgbToLch, rgbToOklch }
