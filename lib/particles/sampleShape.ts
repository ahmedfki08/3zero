import { WordTargetRect } from './measureTextTargets';

export interface SampledShape {
  positions: Float32Array; // [x, y, z] * N (NDC coordinates: -1 to 1)
  colors: Float32Array;    // [r, g, b, a] * N (0 to 1)
  delays: Float32Array;    // [delay] * N (0 to 1 based on spatial wave)
  seeds: Float32Array;     // [rnd1, rnd2, sizeVar, speedVar] * N
}

interface RawPoint {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Samples non-transparent pixels from an HTMLImageElement
 */
export function sampleImage(
  img: HTMLImageElement,
  targetCount: number,
  viewWidth: number,
  viewHeight: number
): { positions: Float32Array; colors: Float32Array; delays: Float32Array; seeds: Float32Array } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Could not create offscreen 2D canvas');
  }

  const sampleW = Math.min(img.naturalWidth || 600, 800);
  const sampleH = Math.round((sampleW / (img.naturalWidth || 1)) * (img.naturalHeight || 300));

  canvas.width = sampleW;
  canvas.height = sampleH;
  ctx.drawImage(img, 0, 0, sampleW, sampleH);

  const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
  const data = imgData.data;

  const points: RawPoint[] = [];

  for (let y = 0; y < sampleH; y += 2) {
    for (let x = 0; x < sampleW; x += 2) {
      const idx = (y * sampleW + x) * 4;
      const alpha = data[idx + 3];

      if (alpha > 35) {
        points.push({
          x: (x / sampleW) * 2 - 1,
          y: -((y / sampleH) * 2 - 1),
          r: data[idx] / 255,
          g: data[idx + 1] / 255,
          b: data[idx + 2] / 255,
          a: alpha / 255,
        });
      }
    }
  }

  if (points.length === 0) {
    points.push({ x: 0, y: 0, r: 0.25, g: 0.66, b: 0.36, a: 1.0 });
  }

  // Target display width: ~70-85% of screen width or max 840px
  const targetW_NDC = Math.min(1.5, (840 / viewWidth) * 2);
  const targetH_NDC = targetW_NDC * (sampleH / sampleW) * (viewWidth / viewHeight);

  const positions = new Float32Array(targetCount * 3);
  const colors = new Float32Array(targetCount * 4);
  const delays = new Float32Array(targetCount);
  const seeds = new Float32Array(targetCount * 4);

  const numFound = points.length;

  for (let i = 0; i < targetCount; i++) {
    const pt = points[i % numFound];
    const jitterX = (Math.random() - 0.5) * 0.012;
    const jitterY = (Math.random() - 0.5) * 0.012;

    const posX = pt.x * (targetW_NDC * 0.5) + jitterX;
    const posY = pt.y * (targetH_NDC * 0.5) + jitterY;
    const posZ = (Math.random() - 0.5) * 0.04;

    positions[i * 3 + 0] = posX;
    positions[i * 3 + 1] = posY;
    positions[i * 3 + 2] = posZ;

    colors[i * 4 + 0] = pt.r;
    colors[i * 4 + 1] = pt.g;
    colors[i * 4 + 2] = pt.b;
    colors[i * 4 + 3] = pt.a;

    // Disintegration wave (top-to-bottom with radial ripple)
    const normY = (pt.y + 1) * 0.5;
    const normX = Math.abs(pt.x);
    const delay = (1.0 - normY) * 0.7 + normX * 0.3;
    delays[i] = Math.max(0, Math.min(1, delay + (Math.random() - 0.5) * 0.12));

    seeds[i * 4 + 0] = Math.random();
    seeds[i * 4 + 1] = Math.random();
    seeds[i * 4 + 2] = 0.65 + Math.random() * 0.7; // size factor
    seeds[i * 4 + 3] = 0.6 + Math.random() * 1.4;  // speed factor
  }

  return { positions, colors, delays, seeds };
}

/**
 * Samples target positions for:
 * 1. The headline letters in upper-middle viewport
 * 2. The description word targets in lower-middle viewport
 */
export async function sampleCombinedTargets(
  headlineLines: string[],
  wordTargets: WordTargetRect[],
  targetCount: number,
  viewWidth: number,
  viewHeight: number,
  textColor: [number, number, number] = [0.247, 0.658, 0.356]
): Promise<{ positions: Float32Array; colors: Float32Array; targetMeta: Float32Array }> {
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }

  const positions = new Float32Array(targetCount * 3);
  const colors = new Float32Array(targetCount * 4);
  const targetMeta = new Float32Array(targetCount * 4);

  const isMobile = viewWidth < 768;
  const descShare = 0.34;
  const descCount = Math.floor(targetCount * descShare);
  const headlineCount = targetCount - descCount;

  // 1. Sample Headline in Upper Viewport
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (ctx) {
    const canvasW = 1600;
    const canvasH = 900;
    canvas.width = canvasW;
    canvas.height = canvasH;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize = isMobile ? 88 : 116;
    const lineHeight = fontSize * 1.2;
    ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;

    const totalHeight = headlineLines.length * lineHeight;
    // Upper quadrant (Y center around 260px on 900px canvas)
    const startY = 240 - totalHeight / 2 + lineHeight / 2;

    headlineLines.forEach((line, idx) => {
      ctx.fillText(line, canvasW / 2, startY + idx * lineHeight);
    });

    const imgData = ctx.getImageData(0, 0, canvasW, canvasH);
    const data = imgData.data;
    const headlinePoints: { x: number; y: number }[] = [];

    for (let y = 0; y < canvasH; y += 2) {
      for (let x = 0; x < canvasW; x += 2) {
        const idx = (y * canvasW + x) * 4;
        if (data[idx + 3] > 40) {
          headlinePoints.push({
            x: (x / canvasW) * 2 - 1,
            y: -((y / canvasH) * 2 - 1), // WebGL NDC
          });
        }
      }
    }

    const numPoints = headlinePoints.length > 0 ? headlinePoints.length : 1;
    const scaleX = isMobile ? 0.95 : 0.84;
    const scaleY = scaleX * (canvasH / canvasW) * (viewWidth / viewHeight);

    for (let i = 0; i < headlineCount; i++) {
      const pt = headlinePoints.length > 0 ? headlinePoints[i % numPoints] : { x: 0, y: 0.35 };
      const jitterX = (Math.random() - 0.5) * 0.008;
      const jitterY = (Math.random() - 0.5) * 0.008;

      positions[i * 3 + 0] = pt.x * scaleX + jitterX;
      positions[i * 3 + 1] = pt.y * scaleY + jitterY;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.03;

      const gradientFactor = (pt.x + 1) * 0.5;
      colors[i * 4 + 0] = textColor[0] * (0.85 + gradientFactor * 0.3);
      colors[i * 4 + 1] = textColor[1] * (0.9 + gradientFactor * 0.2);
      colors[i * 4 + 2] = textColor[2] * (0.8 + gradientFactor * 0.4);
      colors[i * 4 + 3] = 1.0;

      targetMeta[i * 4 + 0] = 0.0; // 0 = headline particle
      targetMeta[i * 4 + 1] = 0.0;
      targetMeta[i * 4 + 2] = 0.0;
      targetMeta[i * 4 + 3] = 0.0;
    }
  }

  // 2. Sample Description Word Targets in Lower Viewport
  const totalWords = Math.max(1, wordTargets.length);

  for (let i = 0; i < descCount; i++) {
    const pIdx = headlineCount + i;
    const wordIdx = i % totalWords;

    let targetX = 0;
    let targetY = 0;

    if (wordTargets.length > 0) {
      const word = wordTargets[wordIdx];
      const padX = (word.ndcWidth || 0.04) * 0.4;
      const padY = (word.ndcHeight || 0.03) * 0.4;

      targetX = word.ndcCenterX + (Math.random() - 0.5) * padX;
      targetY = word.ndcCenterY + (Math.random() - 0.5) * padY;
    } else {
      // Geometric fallback paragraph grid in lower quadrant NDC [-0.6 to -0.1]
      const row = Math.floor(wordIdx / 8);
      const col = wordIdx % 8;
      targetX = ((col / 7) * 2 - 1) * 0.65 + (Math.random() - 0.5) * 0.04;
      targetY = -0.2 - (row * 0.12) + (Math.random() - 0.5) * 0.03;
    }

    positions[pIdx * 3 + 0] = targetX;
    positions[pIdx * 3 + 1] = targetY;
    positions[pIdx * 3 + 2] = (Math.random() - 0.5) * 0.04;

    // Bright glowing mint/emerald for description stream
    colors[pIdx * 4 + 0] = 0.29;
    colors[pIdx * 4 + 1] = 0.87;
    colors[pIdx * 4 + 2] = 0.50;
    colors[pIdx * 4 + 3] = 0.95;

    // Target meta: 1.0 = desc particle, word normalized index [0..1]
    targetMeta[pIdx * 4 + 0] = 1.0;
    targetMeta[pIdx * 4 + 1] = wordIdx / totalWords;
    targetMeta[pIdx * 4 + 2] = (wordIdx + 1) / totalWords;
    targetMeta[pIdx * 4 + 3] = Math.random();
  }

  return { positions, colors, targetMeta };
}
