"use client";

import { useEffect, useRef } from "react";
import { PLANET_DEFS, Planet } from "@/lib/pixelPlanet";

/**
 * Mounts one WebGL pixel-art planet (see lib/pixelPlanet.ts).
 * Each layer is its own WebGL2 context and browsers cap ~16 live contexts,
 * so the effect's cleanup MUST dispose the planet on unmount.
 */
export default function PixelPlanet({
  index,
  size = 300,
  spin = 0.22,
  onClick,
  className,
}: {
  index: number;
  size?: number;
  spin?: number;
  onClick?: () => void;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const def = PLANET_DEFS[index];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const glCanvases = def.layers.map(() => {
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      c.style.display = "none";
      wrap.appendChild(c);
      return c;
    });
    const comp = document.createElement("canvas");
    comp.width = size;
    comp.height = size;
    comp.style.cssText =
      "width:100%;height:100%;border-radius:50%;display:block;image-rendering:pixelated;will-change:transform";
    wrap.appendChild(comp);

    const planet = new Planet(glCanvases, comp, def.layers, reduced ? 0 : spin);

    let raf = 0;
    let last = 0;
    let visible = true;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      planet.render(dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame((t) => {
        last = t;
        loop(t);
      });
    };
    start();

    // Pause rendering while off-screen.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) {
        visible = true;
        start();
      } else if (!e.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(wrap);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      planet.dispose();
      // Remove will-change before destroying to release the GPU layer
      comp.style.willChange = "auto";
      wrap.replaceChildren();
    };
  }, [index, size, spin]);

  return (
    <div
      ref={wrapRef}
      onClick={onClick}
      className={className}
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
}
