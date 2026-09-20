"use client";

/* Four side-mounted clouds spread through the descent, placed like the
   planet pods: alternating edges, most of the sprite hanging off-screen.
   Tops are % of the host section (RocketDescent's 360vh), starting far
   enough down that the first cloud appears once the sky has turned blue. */
const CLOUDS = [
  { top: "30%", left: true, width: "clamp(960px, 136vw, 2080px)", flip: false },
  { top: "48%", left: false, width: "clamp(800px, 112vw, 1720px)", flip: true },
  { top: "66%", left: true, width: "clamp(880px, 120vw, 1840px)", flip: true },
  { top: "94%", left: false, width: "clamp(1000px, 144vw, 2240px)", flip: false },
] as const;

/**
 * Fixed pixel clouds for the atmosphere leg of the descent. Each sits at
 * its edge with most of it off-screen — no slide-in, no scroll triggers.
 * Render inside a positioned, tall section.
 */
export default function AtmosphereClouds() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {CLOUDS.map((c, i) => {
        // Most of the cloud hangs off-screen so the sky shows through.
        const offset = c.left ? "-60%" : "60%";
        return (
          <div
            key={i}
            data-cloud-index={i}
            className={`absolute -translate-y-1/2 ${c.left ? "left-0" : "right-0"}`}
            style={{ top: c.top }}
          >
            <div
              className="relative"
              style={{ width: c.width, transform: `translateX(${offset})` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/clouds/pixel-cloud.webp"
                alt=""
                aria-hidden
                className="crisp relative z-10 w-full"
                loading="lazy"
                decoding="async"
                style={c.flip ? { transform: "scaleX(-1)" } : undefined}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
