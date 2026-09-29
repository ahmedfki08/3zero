export interface BarcodeBar {
  x: number;
  width: number;
}

export interface GeneratedBarcode {
  bars: BarcodeBar[];
  totalWidth: number;
  height: number;
}

/**
 * Deterministically generates a clean, centered barcode representation from a seed string
 */
export function generateBarcode(
  seedString: string,
  targetWidth = 120,
  height = 28
): GeneratedBarcode {
  let hash = 5381;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash * 33) ^ seedString.charCodeAt(i);
  }

  const bars: BarcodeBar[] = [];
  let currentX = 2;
  let bitIndex = 0;

  const getBit = () => {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    return (hash >> 16) & 1;
  };

  const getWidth = () => {
    hash = (hash * 1103515245 + 12345) >>> 0;
    const r = hash % 10;
    return r < 6 ? 1.2 : r < 9 ? 2.2 : 3.2;
  };

  while (currentX < targetWidth - 4) {
    const isBar = bitIndex % 2 === 0 || getBit() === 1;
    const barWidth = getWidth();

    if (isBar && currentX + barWidth < targetWidth - 2) {
      bars.push({
        x: currentX,
        width: barWidth,
      });
    }

    currentX += barWidth + (getBit() ? 1.2 : 0.8);
    bitIndex++;
  }

  return {
    bars,
    totalWidth: targetWidth,
    height,
  };
}
