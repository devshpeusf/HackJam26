"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { siteConfig } from "@/config/site";

const EASE_SPRING = "cubic-bezier(0.34,1.56,0.64,1)";

/* Four side-mounted clouds spread through the descent, placed like the
   planet pods: alternating edges, half the sprite hanging off-screen.
   Tops are % of the host section (RocketDescent's 300vh), starting far
   enough down that the first cloud appears once the sky has turned blue. */
const CLOUDS = [
  { top: "30%", left: true, width: "clamp(960px, 136vw, 2080px)", flip: false },
  { top: "48%", left: false, width: "clamp(800px, 112vw, 1720px)", flip: true },
  { top: "66%", left: true, width: "clamp(880px, 120vw, 1840px)", flip: true },
  { top: "84%", left: false, width: "clamp(1000px, 144vw, 2240px)", flip: false },
] as const;

/**
 * Scroll-revealed pixel clouds for the atmosphere leg of the descent.
 * Each cloud slides in from its edge (planet-pod style) and settles with
 * half of it off-screen. Render inside a positioned, tall section.
 */
export default function AtmosphereClouds() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(() =>
    CLOUDS.map(() => false),
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() =>
        setVisible((v) => v.map(() => true)),
      );
      return () => cancelAnimationFrame(raf);
    }
    // Slide in while the cloud is in the viewport band, pop back out to its
    // side once it scrolls past (and again when scrolling back up).
    const setAt = (i: number, on: boolean) =>
      setVisible((v) => v.map((x, j) => (j === i ? on : x)));
    const triggers = refs.current.map(
      (el, i) =>
        el &&
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          end: "bottom 12%",
          onEnter: () => setAt(i, true),
          onLeave: () => setAt(i, false),
          onEnterBack: () => setAt(i, true),
          onLeaveBack: () => setAt(i, false),
        }),
    );
    return () => triggers.forEach((t) => t && t.kill());
  }, []);

  // One sponsor per cloud, tucked behind the sprite and peeking out from
  // its inner edge (~3/4 of the name/logo visible past the cloud).
  const sponsors = siteConfig.sponsors.slice(0, CLOUDS.length);

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {CLOUDS.map((c, i) => {
        // Settled: half the cloud off-screen. Hidden: fully off-screen.
        const settled = c.left ? "-50%" : "50%";
        const hidden = c.left ? "-110%" : "110%";
        const sponsor = sponsors[i];
        return (
          <div
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={`absolute -translate-y-1/2 ${c.left ? "left-0" : "right-0"}`}
            style={{ top: c.top }}
          >
            <div
              className="relative will-change-transform"
              style={{
                width: c.width,
                transform: `translateX(${visible[i] ? settled : hidden})`,
                opacity: visible[i] ? 1 : 0,
                transition: `transform .9s ${EASE_SPRING}, opacity .6s ease`,
              }}
            >
              {sponsor && (
                <a
                  href={sponsor.url}
                  aria-label={sponsor.name}
                  className="pointer-events-auto absolute top-[45%] z-0 -translate-y-1/2 whitespace-nowrap"
                  style={c.left ? { left: "78%" } : { right: "78%" }}
                >
                  {sponsor.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="crisp w-[clamp(96px,10vw,180px)] object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    // Generic placeholder until real logos land — every
                    // cloud reads the same, no tier names.
                    <span
                      className="font-pixel text-[clamp(12px,1.2vw,18px)] tracking-[0.2em] text-star-white"
                      style={{ textShadow: "0 2px 10px rgba(0,0,0,0.45)" }}
                    >
                      SPONSOR
                    </span>
                  )}
                </a>
              )}
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
