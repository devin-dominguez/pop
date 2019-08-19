export default class Color {
  constructor(color) {
    this.value = color;
  }

  scaled(scale) {
    const hexString = this.value.substring(1);
    const r = scale * parseInt(hexString.substring(0, 2), 16);
    const g = scale * parseInt(hexString.substring(2, 4), 16);
    const b = scale * parseInt(hexString.substring(4, 6), 16);

    return `rgb(${r}, ${g}, ${b})`;
  }
}
