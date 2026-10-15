"use client";

import { useEffect, useState, type RefObject } from "react";

interface UseInViewOptions {
  rootMargin?: string;
  /**
   * Stay true after the first time the element comes near the viewport, so a
   * map preview mounts once and keeps its state while scrolling. Turn off to
   * follow visibility both ways and release offscreen previews.
   */
  once?: boolean;
}

export function useInView(
  ref: RefObject<Element | null>,
  { rootMargin = "200px", once = true }: UseInViewOptions = {},
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!once) {
          setInView(entry.isIntersecting);
        } else if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin, once]);

  return inView;
}
