export interface WordTargetRect {
  index: number;
  text: string;
  ndcLeft: number;
  ndcRight: number;
  ndcTop: number;
  ndcBottom: number;
  ndcCenterX: number;
  ndcCenterY: number;
  ndcWidth: number;
  ndcHeight: number;
}

/**
 * Measures all word spans inside the description container and maps them to WebGL NDC [-1..1]
 */
export function measureWordTargets(
  container: HTMLElement | null,
  viewWidth: number,
  viewHeight: number
): WordTargetRect[] {
  if (!container || typeof window === 'undefined') return [];

  const wordElements = container.querySelectorAll<HTMLElement>('[data-word-idx]');
  const targets: WordTargetRect[] = [];

  wordElements.forEach((el) => {
    const idxAttr = el.getAttribute('data-word-idx');
    if (idxAttr === null) return;
    const index = parseInt(idxAttr, 10);
    const rect = el.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) return;

    // Convert pixel rect [0..viewWidth, 0..viewHeight] to NDC [-1..1]
    const ndcLeft = (rect.left / viewWidth) * 2 - 1;
    const ndcRight = (rect.right / viewWidth) * 2 - 1;
    const ndcTop = -((rect.top / viewHeight) * 2 - 1);
    const ndcBottom = -((rect.bottom / viewHeight) * 2 - 1);

    const ndcCenterX = (ndcLeft + ndcRight) * 0.5;
    const ndcCenterY = (ndcTop + ndcBottom) * 0.5;
    const ndcWidth = ndcRight - ndcLeft;
    const ndcHeight = Math.abs(ndcTop - ndcBottom);

    targets.push({
      index,
      text: el.textContent?.trim() || '',
      ndcLeft,
      ndcRight,
      ndcTop,
      ndcBottom,
      ndcCenterX,
      ndcCenterY,
      ndcWidth,
      ndcHeight,
    });
  });

  return targets.sort((a, b) => a.index - b.index);
}
