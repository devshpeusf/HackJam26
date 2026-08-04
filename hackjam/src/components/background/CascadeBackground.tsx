"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { mulberry32, SPARKLE_CLIP } from "@/lib/pixels";

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

type Meteor = {
  x: number; // vw — start point
  y: number; // vh
  dir: 1 | -1; // 1 = falls down-right, -1 = falls down-left
  delay: number;
  duration: number;
  color: string;
};

/* Six meteors on staggered 14–20s cycles */
function makeMeteors(seed: number, count: number): Meteor[] {
  const rand = mulberry32(seed);
  const colors = ["#f4f1fb", "#ffd9a0", "#ffb1d9"];
  return Array.from({ length: count }, (_, i) => {
    const dir = (i % 2 === 0 ? -1 : 1) as 1 | -1;
    return {
      x: dir === -1 ? 45 + rand() * 65 : -10 + rand() * 65,
      y: -10 + rand() * 45,
      dir,
      delay: i * 3 + rand() * 2,
      duration: 14 + rand() * 6,
      color: colors[Math.floor(rand() * colors.length)],
    };
  });
}

/* Pixel-art trail: axis-aligned squares strung up the 45° diagonal */
const TRAIL = [
  { off: 9, size: 4, alpha: 0.9 },
  { off: 16, size: 3, alpha: 0.7 },
  { off: 22, size: 3, alpha: 0.5 },
  { off: 28, size: 2, alpha: 0.35 },
  { off: 33, size: 2, alpha: 0.2 },
];

function MeteorLayer({ meteors }: { meteors: Meteor[] }) {
  return (
    <div className="absolute inset-0">
      {meteors.map((m, i) => (
        <span
          key={i}
          className="absolute block"
          style={{
            left: `${m.x}vw`,
            top: `${m.y}vh`,
            opacity: 0,
            animation: `${
              m.dir === -1 ? "hj-meteor" : "hj-meteor-r"
            } ${m.duration}s linear ${m.delay}s infinite`,
          }}
        >
          {/* head */}
          <span
            className="absolute block h-1.5 w-1.5"
            style={{
              backgroundColor: m.color,
              boxShadow: `0 0 8px 1px color-mix(in srgb, ${m.color} 80%, transparent)`,
            }}
          />
          {/* trail */}
          {TRAIL.map((t, j) => (
            <span
              key={j}
              className="absolute block"
              style={{
                left: -m.dir * t.off,
                top: -t.off,
                width: t.size,
                height: t.size,
                backgroundColor: m.color,
                opacity: t.alpha,
              }}
            />
          ))}
        </span>
      ))}
    </div>
  );
}

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
 *
 * Performance notes vs. original:
 *  - far:  70 → 50 stars   (-20 DOM nodes, visually indistinguishable at 2px)
 *  - mid:  26 → 20 sparkles (-6 nodes)
 *  - near: 14 →  9 stars   (-5 nodes)
 *  - pink: 42 → 28 stars   (-14 nodes)
 *  - pinkSparkle: 9 → 7    (-2 nodes)
 *  - meteors: 6 → 6 (unchanged — they are essential to the aesthetic)
 *  Total DOM saving: ~47 fewer animated <span> elements
 */
export default function CascadeBackground() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  const layers = useMemo(
    () => ({
      far: makeStars(1, 50, ["#f4f1fb"], false),          // was 70
      mid: makeStars(2, 20, ["#f4f1fb", "#ffd9a0"], true), // was 26
      near: makeStars(3, 9, ["#ffb1d9", "#ffd9a0"], false), // was 14
      meteors: makeMeteors(4, 6),
      pink: makeStars(7, 28, ["#ff2e97", "#ff2e97", "#ffb1d9", "#f4f1fb"], false), // was 42
      pinkSparkle: makeStars(8, 7, ["#ff2e97", "#ffb1d9"], true), // was 9
    }),
    [],
  );

  useLayoutEffect(() => {
    const root = parallaxRef.current;
    if (!root) return;

    const pinkFade = (drift: boolean) =>
      gsap.to(root.querySelector("[data-stars=pink]"), {
        ...(drift ? { yPercent: -24 } : {}),
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: () => window.innerHeight * 1.2,
          scrub: drift ? 1.2 : true,
        },
      });

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
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
      pinkFade(true);
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      pinkFade(false);
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
        {/* Faint violet grid */}
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
        <div data-stars="pink" className="absolute inset-0">
          <StarLayer stars={layers.pink} />
          <StarLayer stars={layers.pinkSparkle} />
        </div>
        <MeteorLayer meteors={layers.meteors} />
      </div>
    </>
  );
}
