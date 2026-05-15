'use client';

import { useEffect, useRef, useState } from 'react';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

/** Tracks vertical scroll direction (down = scrolling content up). */
export function useScrollDirection() {
  const directionRef = useRef('down');
  const lastYRef = useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastYRef.current + 2) {
        directionRef.current = 'down';
      } else if (currentY < lastYRef.current - 2) {
        directionRef.current = 'up';
      }
      lastYRef.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return directionRef;
}

export function useScrollReveal(options = {}) {
  const { rootMargin = '0px 0px -8% 0px', threshold = 0.12, once = false } = options;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [enterFrom, setEnterFrom] = useState('below');
  const scrollDirectionRef = useScrollDirection();
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotionRef.current) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotionRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const scrollingDown = scrollDirectionRef.current === 'down';
          setEnterFrom(scrollingDown ? 'below' : 'above');
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once, scrollDirectionRef]);

  return { ref, visible, enterFrom };
}

/** @deprecated Use useScrollReveal for direction-aware reveals */
export default function useInView(options = {}) {
  const { ref, visible } = useScrollReveal({ ...options, once: options.once ?? true });
  return { ref, inView: visible };
}
