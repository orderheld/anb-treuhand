"use client";

import { useEffect, useRef, useState } from "react";
import { cn, formatNumber } from "@/lib/utils";

/**
 * A number that counts smoothly to its new value (0.7 s, ease-out). With reduced motion it jumps
 * to the new value in the next frame. Screen readers get the final value from the result's live
 * region, not from here.
 */
export function AnimatedNumber({ value, className, duration = 700 }: { value: number; className?: string; duration?: number }) {
  const [display, setDisplay] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    const from = current.current;
    if (from === value) return;
    const length = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duration;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = length > 0 ? Math.min(1, (now - start) / length) : 1;
      const eased = 1 - (1 - t) ** 3;
      const next = from + (value - from) * eased;
      current.current = next;
      setDisplay(next);
      if (t < 1) frame = requestAnimationFrame(tick);
      else current.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span aria-hidden className={cn("tabular", className)}>
      {formatNumber(Math.round(display))}
    </span>
  );
}
