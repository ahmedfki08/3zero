'use client';

import { useState, useEffect } from 'react';

interface ScrollSpyOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export function useScrollSpy(
  sectionIds: string[],
  options: ScrollSpyOptions = {}
): string {
  const [activeId, setActiveId] = useState<string>('');
  const { rootMargin = '-25% 0px -60% 0px', threshold = [0, 0.25, 0.5, 0.75, 1] } = options;

  useEffect(() => {
    if (typeof window === 'undefined' || sectionIds.length === 0) return;

    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id') || '';
          if (!id) return;

          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }
        });

        // Pick section with highest intersection ratio, or the topmost visible section
        if (visibleSections.size > 0) {
          let highestRatio = -1;
          let bestId = '';

          visibleSections.forEach((ratio, id) => {
            if (ratio > highestRatio) {
              highestRatio = ratio;
              bestId = id;
            }
          });

          if (bestId) {
            setActiveId(bestId);
          }
        } else if (window.scrollY < 200) {
          // At very top, reset if hero is not explicitly tracked
          setActiveId('');
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    const elements: HTMLElement[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [sectionIds, rootMargin, threshold]);

  return activeId;
}
