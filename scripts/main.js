
document.addEventListener('DOMContentLoaded', () => {
  //get dom elements
  const color1 = document.getElementById('color1');
  const color2 = document.getElementById('color2');
  const preview = document.getElementById('preview');
  const previewText = document.getElementById('preview-text');
  const contrastResult = document.getElementById('contrast-result');
  const accessibilityResult = document.getElementById('accessibility-result');

  //make updates
  color1.addEventListener('input', updateContrast);
  color2.addEventListener('input', updateContrast);

  //hex -> rgb conversion
  function hexToRgb(hex) {
    const value = hex.replace('#', '');
    const bigint = parseInt(value, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }

  //get luminance value
  function getLuminance([r, g, b]) {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  //contrast calculation
  function getContrast(rgb1, rgb2) {
    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  //WCAG standard
  function getAccessibility(ratio) {
    if (ratio >= 7) {
      return '✅ AAA (Excellent Contrast)';
    } else if (ratio >= 4.5) {
      return '✅ AA (Good for normal text)';
    } else if (ratio >= 3) {
      return '⚠️ AA Large (Only large text)';
    } else {
      return '❌ Fail (Poor contrast)';
    }
  }

  // main
  function updateContrast() {
    const textColor = color1.value;
    const bgColor = color2.value;

    //preview colors in text and background
    preview.style.color = textColor;
    preview.style.backgroundColor = bgColor;

    //contrast
    const rgbText = hexToRgb(textColor);
    const rgbBg = hexToRgb(bgColor);
    const ratio = getContrast(rgbText, rgbBg).toFixed(2);

    //update result text
    contrastResult.textContent = ratio;
    accessibilityResult.textContent = getAccessibility(ratio);
  }
});