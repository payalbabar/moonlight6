import { useEffect, useState, type RefObject } from "react";

export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T | null>
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // When top of element enters bottom of viewport -> progress = 0
        // When bottom of element leaves top of viewport -> progress = 1
        const totalDistance = windowHeight + rect.height;
        const currentDistance = windowHeight - rect.top;
        const rawProgress = currentDistance / totalDistance;
        const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);

        setProgress(clampedProgress);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [ref]);

  return progress;
}
