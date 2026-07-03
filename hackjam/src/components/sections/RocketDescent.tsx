"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/* Pixel rocket drawn as SVG rects, nose down (re-entry). Grid is 12x18. */
function PixelRocket() {
  const body = "#f4f1fb";
  const stripe = "#ef6359";
  const dark = "#1a1530";
  const window_ = "#21e6c1";
  const flame1 = "#ffd9a0";
  const flame2 = "#e9743a";

  // [x, y, w, h, fill] — remember: nose points DOWN (we're descending).
  const rects: [number, number, number, number, string][] = [
    // exhaust flame trails upward (behind the ship as it falls)
    [5, 0, 2, 2, flame1],
    [4, 1, 1, 2, flame2],
    [7, 1, 1, 2, flame2],
    [5, 2, 2, 1, flame2],
    // nozzle
    [4, 3, 4, 1, dark],
    // body
    [4, 4, 4, 7, body],
    [4, 6, 4, 1, stripe],
    // window
    [5, 8, 2, 2, window_],
    [5, 8, 2, 1, "#9be4ff"],
    // fins (top, since we're inverted)
    [2, 3, 2, 3, stripe],
    [8, 3, 2, 3, stripe],
    [2, 3, 1, 1, dark],
    [9, 3, 1, 1, dark],
    // taper to nose cone (pointing down)
    [4, 11, 4, 1, body],
    [5, 12, 2, 2, stripe],
    [5, 14, 2, 1, "#9f1823"],
  ];

  return (
    <svg
      width={120}
      height={180}
      viewBox="0 0 12 18"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <g
        style={{
          transformOrigin: "6px 1.5px",
          animation: "hj-flame 0.35s steps(2) infinite",
        }}
      >
        <rect x={5} y={0} width={2} height={2} fill={flame1} />
        <rect x={4} y={1} width={1} height={2} fill={flame2} />
        <rect x={7} y={1} width={1} height={2} fill={flame2} />
        <rect x={5} y={2} width={2} height={1} fill={flame2} />
      </g>
      {rects.slice(4).map(([x, y, w, h, f], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={f} />
      ))}
    </svg>
  );
}

/**
 * The signature set-piece (spec §7): a scroll-scrubbed re-entry. The section
 * is 300vh tall; a sticky viewport pins the scene while GSAP scrubs the
 * rocket down through the atmosphere. Scroll is the single source of truth.
 */
export default function RocketDescent() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      tl.fromTo(
        q("[data-rocket]"),
        { yPercent: -180, xPercent: -30, rotation: -6 },
        { yPercent: 160, xPercent: 30, rotation: 6, ease: "none" },
        0,
      )
        .fromTo(
          q("[data-streaks]"),
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: 0.35 },
          0.15,
        )
        .to(q("[data-streaks]"), { opacity: 0, ease: "none", duration: 0.3 }, 0.7)
        .fromTo(
          q("[data-reentry-label]"),
          { opacity: 0 },
          { opacity: 1, duration: 0.15 },
          0.25,
        )
        .to(q("[data-reentry-label]"), { opacity: 0, duration: 0.15 }, 0.55);

      return () => tl.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
        {/* Speed streaks — vertical lines suggesting velocity */}
        <div data-streaks className="absolute inset-0 opacity-0">
          {[12, 28, 45, 62, 78, 90].map((left, i) => (
            <span
              key={i}
              className="absolute w-[2px] bg-star-white/25"
              style={{
                left: `${left}%`,
                top: `${(i * 17) % 60}%`,
                height: `${18 + (i % 3) * 10}vh`,
              }}
            />
          ))}
        </div>

        <div data-rocket className="will-change-transform">
          <PixelRocket />
        </div>

        <p
          data-reentry-label
          className="absolute bottom-[20%] left-1/2 -translate-x-1/2 font-pixel text-[10px] text-star-white/80 opacity-0"
        >
          ENTERING ATMOSPHERE...
        </p>
      </div>
    </section>
  );
}
