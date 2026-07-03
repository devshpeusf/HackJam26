"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { siteConfig } from "@/config/site";

/**
 * Sunset zone (spec §6.6–6.7): sponsor placeholder tiles over the warm band.
 * A pixel sun sits behind the grid and sinks toward the horizon as the
 * section scrolls by — the "setting sun" depth effect.
 */
export default function Sponsors() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const tween = gsap.fromTo(
        q("[data-sun]"),
        { yPercent: -20 },
        {
          yPercent: 55,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
      return () => tween.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, []);

  const gold = siteConfig.sponsors.filter((s) => s.tier === "gold");
  const silver = siteConfig.sponsors.filter((s) => s.tier === "silver");

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-32"
    >
      {/* The setting pixel sun — behind the content, sinking on scroll */}
      <div
        data-sun
        aria-hidden
        className="absolute left-1/2 top-[30%] -z-10 h-64 w-64 -translate-x-1/2 will-change-transform sm:h-80 sm:w-80"
        style={{
          background:
            "radial-gradient(circle, #ffd9a0 0%, #e9743a 45%, rgba(233,116,58,0.4) 65%, transparent 72%)",
          imageRendering: "pixelated",
        }}
      />

      <h2 className="mb-4 text-center font-pixel text-base text-void-deep sm:text-lg">
        SPONSORS
      </h2>
      <p className="mb-14 max-w-md text-center text-sm font-bold text-void-deep/80">
        The people making the descent possible. Want your logo here?
      </p>

      <div className="flex w-full max-w-3xl flex-col gap-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {gold.map((s, i) => (
            <div
              key={i}
              className="flex aspect-square flex-col items-center justify-center gap-3 bg-void-deep/80 p-4"
              style={{ border: "4px dashed rgba(255,217,160,0.6)" }}
            >
              <span className="font-pixel text-[10px] text-star-warm">
                GOLD
              </span>
              <span className="text-xs text-star-white/60">
                Your logo here
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {silver.map((s, i) => (
            <div
              key={i}
              className="flex aspect-square flex-col items-center justify-center gap-2 bg-void-deep/70 p-3"
              style={{ border: "4px dashed rgba(244,241,251,0.4)" }}
            >
              <span className="font-pixel text-[8px] text-star-white/80">
                SILVER
              </span>
              <span className="text-[10px] text-star-white/50">
                Your logo here
              </span>
            </div>
          ))}
        </div>
      </div>

      <a
        href="mailto:sponsors@hackjam.dev"
        className="mt-14 inline-block bg-void-deep px-6 py-4 font-pixel text-[10px] text-star-warm transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105"
        style={{
          boxShadow:
            "0 -4px 0 0 #07060d, 0 4px 0 0 #07060d, -4px 0 0 0 #07060d, 4px 0 0 0 #07060d",
        }}
      >
        BECOME A SPONSOR
      </a>
    </section>
  );
}
