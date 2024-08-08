function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // Achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
  (h /= 360), (s /= 100), (l /= 100);
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function generateColors({ option = {}, color }) {
  const { format = "css", output = "hex" } = option;
  let result = format === "array" ? {} : "";

  for (const [colorName, hexColor] of Object.entries(color)) {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const hsl = rgbToHsl(r, g, b);
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const isNeutral = hsl[1] < 10;

    if (format === "array") {
      result[colorName] = [];
    }

    steps.forEach((step, index) => {
      let [h, s, l] = hsl;
      if (index < 5) {
        l = Math.min(98, l + (98 - l) * ((5 - index) / 4.5));
        if (!isNeutral) {
          s = Math.max(10, s - s * ((5 - index) / 10));
        }
      } else if (index > 5) {
        l = l * (1 - (index - 5) / 6.5);
        if (!isNeutral) {
          s = Math.min(100, s + (100 - s) * ((index - 5) / 7));
        }
      }

      let colorValue;
      switch (output) {
        case "hsl":
          colorValue = `hsl(${Math.round(h)}, ${Math.round(s)}%, ${l.toFixed(1)}%)`;
          break;
        case "rgb":
          const [r, g, b] = hslToRgb(h, s, l);
          colorValue = `rgb(${r} ${g} ${b} / var(--opacity))`;
          break;
        case "hex":
        default:
          const rgb = hslToRgb(h, s, l);
          colorValue = `#${rgb[0].toString(16).padStart(2, "0")}${rgb[1].toString(16).padStart(2, "0")}${rgb[2]
            .toString(16)
            .padStart(2, "0")}`;
      }

      switch (format) {
        case "scss":
          result += `$${colorName}-${step}: ${colorValue};\n`;
          break;
        case "object":
          if (typeof result !== "object") result = {};
          if (!result[colorName]) result[colorName] = {};
          result[colorName][step] = colorValue;
          break;
        case "array":
          result[colorName].push(colorValue);
          break;
        case "css":
        default:
          result += `--${colorName}-${step}: ${colorValue};\n`;
      }
    });
  }
  return result;
}

// Usage
// const colorShades = generateColors({
//   option: {
//     format: "array",
//     output: "hex"
//   },
//   color: {
//     primary: "#ccf654",
//     secondary: "#e56de8"
//   }
// });
// console.log(colorShades);
