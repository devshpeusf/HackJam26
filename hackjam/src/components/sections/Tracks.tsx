"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import PixelPlanet from "@/components/PixelPlanet";

/** Depth factor per planet for the cursor-drift parallax (spec §6.3). */
const DEPTHS = [18, 30, 24, 14];

export default function Tracks() {
  const sectionRef = useRef<HTMLElement>(null);
  const planetRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = section.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        planetRefs.current.forEach((el, i) => {
          if (el)
            el.style.transform = `translate3d(${nx * DEPTHS[i]}px, ${ny * DEPTHS[i]}px, 0)`;
        });
      });
    };
    section.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      section.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-32"
    >
      <h2 className="mb-4 text-center font-pixel text-base text-star-white sm:text-lg">
        CHOOSE YOUR WORLD
      </h2>
      <p className="mb-16 max-w-md text-center text-sm text-star-white/70">
        Four tracks. Four worlds. Pick where your project lands.
      </p>

      <div className="grid max-w-4xl grid-cols-1 gap-x-16 gap-y-20 sm:grid-cols-2 lg:grid-cols-4">
        {siteConfig.tracks.map((track, i) => (
          <div
            key={track.name}
            ref={(el) => {
              planetRefs.current[i] = el;
            }}
            className="will-change-transform"
          >
            <div
              className="group flex cursor-pointer flex-col items-center gap-5 text-center"
              style={{
                animation: `hj-float ${5 + i * 0.9}s ease-in-out ${i * 0.6}s infinite`,
              }}
            >
              <div
                className="transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 group-hover:brightness-125"
                style={{
                  filter: `drop-shadow(0 0 14px ${track.palette.glow}55)`,
                }}
              >
                <PixelPlanet track={track} seed={i + 1} />
              </div>
              <span
                className="font-pixel text-[10px] transition-colors duration-300"
                style={{ color: track.palette.highlight }}
              >
                {track.name.toUpperCase()}
              </span>
              <p className="max-w-[16rem] text-xs leading-relaxed text-star-white/50 transition-colors duration-500 group-hover:text-star-white/90">
                {track.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
