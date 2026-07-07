"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Fixed corner buddy: the HackJam jam-jar mascot bobs in zero-g, leans
 * toward the cursor, and does a flip when clicked.
 */
export default function Mascot() {
  const rootRef = useRef<HTMLButtonElement>(null);
  const leanRef = useRef<HTMLDivElement>(null);
  const [flipping, setFlipping] = useState(false);

  // Lean toward the cursor — written straight to the DOM, rAF-throttled.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let mx = 0;
    let my = 0;
    const apply = () => {
      raf = 0;
      const root = rootRef.current;
      const lean = leanRef.current;
      if (!root || !lean) return;
      const r = root.getBoundingClientRect();
      const dx = mx - (r.left + r.width / 2);
      const dy = my - (r.top + r.height / 2);
      const len = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, len / 350);
      lean.style.transform = `translate(${(dx / len) * k * 5}px, ${
        (dy / len) * k * 5
      }px) rotate(${(dx / len) * k * 9}deg)`;
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <button
      ref={rootRef}
      type="button"
      aria-label="HackJam mascot — click for a flip"
      onClick={() => setFlipping(true)}
      onAnimationEnd={() => setFlipping(false)}
      className="fixed right-4 bottom-4 z-40 h-24 w-24 cursor-pointer sm:h-28 sm:w-28"
      style={{
        animation: flipping
          ? "hj-mascot-flip 0.7s cubic-bezier(0.34,1.56,0.64,1)"
          : "hj-float 4s ease-in-out infinite",
      }}
    >
      <div
        ref={leanRef}
        className="h-full w-full transition-transform duration-150 ease-out"
      >
        <Image
          src="/mascot/hackjam-mascot-512.png"
          alt=""
          width={112}
          height={112}
          className="crisp h-full w-full drop-shadow-[0_0_14px_rgba(123,47,247,0.35)]"
          priority={false}
        />
      </div>
    </button>
  );
}
