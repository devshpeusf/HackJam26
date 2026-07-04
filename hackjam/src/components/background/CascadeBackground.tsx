"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/* Deterministic PRNG so star positions match between server and client
   render (Math.random() here would cause hydration mismatches). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = {
  x: number; // vw
  y: number; // vh
  size: number; // px
  color: string;
  delay: number;
  duration: number;
  sparkle: boolean;
};

function makeStars(
  seed: number,
  count: number,
  colors: string[],
  sparkle: boolean,
): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: sparkle ? 8 + Math.round(rand() * 6) : 2 + Math.round(rand() * 2),
    color: colors[Math.floor(rand() * colors.length)],
    delay: rand() * 5,
    duration: 2.5 + rand() * 3.5,
    sparkle,
  }));
}

/* Four-point sparkle (✦) drawn as a CSS clip-path so it stays crisp. */
const SPARKLE_CLIP =
  "polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)";

function StarLayer({
  stars,
  className,
}: {
  stars: Star[];
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 ${className ?? ""}`}>
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute block"
          style={{
            left: `${s.x}vw`,
            top: `${s.y}vh`,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            clipPath: s.sparkle ? SPARKLE_CLIP : undefined,
            animation: `hj-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * The continuous cascade (spec §5): one tall vertical gradient spanning the
 * whole page (space → nebula → sky → sunset → grass), plus fixed parallax
 * star layers and a faint grid overlay. Rendered once behind all sections.
 */
export default function CascadeBackground() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Star colors per spec: white, warm gold, pink — no cyan in the starfield.
  const layers = useMemo(
    () => ({
      far: makeStars(1, 70, ["#f4f1fb"], false),
      mid: makeStars(2, 26, ["#f4f1fb", "#ffd9a0"], true),
      near: makeStars(3, 14, ["#ffb1d9", "#ffd9a0"], false),
    }),
    [],
  );

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const root = parallaxRef.current;
      if (!root) return;
      // Deeper layers scroll slower — depth through speed difference.
      const speeds: [string, number][] = [
        ["[data-stars=far]", -8],
        ["[data-stars=mid]", -18],
        ["[data-stars=near]", -32],
      ];
      for (const [sel, yPercent] of speeds) {
        gsap.to(root.querySelector(sel), {
          yPercent,
          ease: "none",
          scrollTrigger: {
            start: 0,
            end: () => ScrollTrigger.maxScroll(window),
            scrub: 1.2,
          },
        });
      }
    });
    return () => mm.revert();
  }, []);

  return (
    <>
      {/* The cascade gradient — absolute, spans the full page height. */}
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              #07060d 0%,
              #0c0a14 10%,
              #1a1530 20%,
              #2d1b54 28%,
              #5b2f8f 36%,
              #9c2f7d 43%,
              #3a6ea5 54%,
              #6f88b8 60%,
              #e9743a 68%,
              #d6489e 74%,
              #a22155 79%,
              #3f7d3a 86%,
              #2c5a2a 94%,
              #14260f 100%
            )`,
          }}
        />

        {/* Nebula gas — dim, organic, pushed to the edges (upper zones only) */}
        <div
          className="absolute inset-x-0 top-0 h-[45%] opacity-25"
          style={{ animation: "hj-drift 40s ease-in-out infinite" }}
        >
          <div
            className="absolute left-[-15%] top-[12%] h-[35%] w-[55%] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse, rgba(91,47,143,0.5), transparent 70%)",
            }}
          />
          <div
            className="absolute right-[-20%] top-[28%] h-[40%] w-[60%] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse, rgba(156,47,125,0.45), transparent 70%)",
            }}
          />
          <div
            className="absolute left-[20%] top-[55%] h-[30%] w-[45%] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse, rgba(214,72,158,0.25), transparent 70%)",
            }}
          />
        </div>
      </div>

      {/* Fixed layers: grid overlay + parallax starfield */}
      <div
        ref={parallaxRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
      >
        {/* Faint violet grid — the digital/arcade whisper (spec §5c) */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(123,47,247,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(123,47,247,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div data-stars="far" className="absolute inset-0">
          <StarLayer stars={layers.far} />
        </div>
        <div data-stars="mid" className="absolute inset-0">
          <StarLayer stars={layers.mid} />
        </div>
        <div data-stars="near" className="absolute inset-0">
          <StarLayer stars={layers.near} />
        </div>
      </div>
    </>
  );
}
