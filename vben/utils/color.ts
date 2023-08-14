// 检测是否是十六进制
export function isHexColor(color: string) {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/;
  return reg.test(color);
}

export function rgbToHex(r: number, g: number, b: number) {
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
}

export function hexToRGB(hex: string) {
  let sHex = hex.toLowerCase();
  if (isHexColor(hex)) {
    if (sHex.length === 4) {
      let sColorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1));
      }
      sHex = sColorNew;
    }
    const sColorChange: number[] = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sHex.slice(i, i + 2)));
    }
    return "RGB(" + sColorChange.join(",") + ")";
  }
  return sHex;
}

// 暗黑模式检测
export function colorIsDark(color: string) {
  if (!isHexColor(color)) return;
  const [r, g, b] = hexToRGB(color)
    .replace(/(?:\(|\)|rgb|RGB)*/g, "")
    .split(",")
    .map((item) => Number(item));
  return r * 0.299 + g * 0.578 + b * 0.114 < 192; // 特定阈值
}
