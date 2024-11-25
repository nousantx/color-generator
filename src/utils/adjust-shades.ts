import type { HSL } from '../types'

export function adjustShade(
  hsl: HSL,
  index: number,
  isNeutral: boolean,
  lighterLightness: number,
  lighterSaturation: number,
  darkerLightness: number,
  darkerSaturation: number
): HSL {
  let [h, s, l] = hsl

  // Lighter color adjustment
  if (index < 5) {
    l = Math.min(98, l + (98 - l) * ((5 - index) / lighterLightness))
    if (!isNeutral) {
      s = Math.max(10, s - s * ((5 - index) / lighterSaturation))
    }
  }

  // Darker color adjustment
  else if (index > 5) {
    l = l * (1 - (index - 5) / darkerLightness)
    if (!isNeutral) {
      s = Math.min(100, s + (100 - s) * ((index - 5) / darkerSaturation))
    }
  }
  return [h, s, l]
}
