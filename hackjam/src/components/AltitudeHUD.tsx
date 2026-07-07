"use client";

import { useEffect, useRef } from "react";

/* Zone bands mirror the CascadeBackground gradient stops (space → grass). */
const ZONES: [number, string][] = [
  [0.2, "LOW ORBIT"],
  [0.43, "NEBULA FIELD"],
  [0.6, "UPPER ATMOSPHERE"],
  [0.79, "SUNSET BAND"],
  [1.01, "SURFACE"],
];

const MAX_ALT_KM = 402;

function zoneFor(progress: number) {
  for (const [limit, name] of ZONES) {
    if (progress < limit) return name;
  }
  return "SURFACE";
}

/**
 * Fixed cockpit-instrument readout (bottom-left): altitude counts down from
 * 402 km to 0 as the page descends from space to grass. Text is written
 * straight to the DOM from a rAF-throttled scroll handler — no re-renders.
 */
export default function AltitudeHUD() {
  const altRef = useRef<HTMLSpanElement>(null);
  const zoneRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (altRef.current) {
        altRef.current.textContent = String(
          Math.round((1 - p) * MAX_ALT_KM),
        ).padStart(3, "0");
      }
      if (zoneRef.current) zoneRef.current.textContent = zoneFor(p);
      if (barRef.current) barRef.current.style.width = `${(1 - p) * 100}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pixel-panel fixed bottom-5 left-5 z-40 flex flex-col gap-2 px-4 py-3 max-sm:hidden"
    >
      <div className="flex items-baseline gap-2">
        <span className="font-pixel text-[8px] tracking-[0.2em] text-accent-cyan">
          ALT
        </span>
        <span className="font-pixel text-[12px] text-star-white">
          <span ref={altRef}>{MAX_ALT_KM}</span> KM
        </span>
      </div>
      <div className="h-1 w-28 bg-void-700">
        <div
          ref={barRef}
          className="h-full bg-accent-cyan"
          style={{ width: "100%" }}
        />
      </div>
      <span
        ref={zoneRef}
        className="font-pixel text-[7px] tracking-[0.25em] text-star-white/55"
      >
        LOW ORBIT
      </span>
    </div>
  );
}
