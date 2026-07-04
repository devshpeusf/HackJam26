"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { siteConfig } from "@/config/site";
import {
  PixelExhaustPlume,
  PixelRocket,
  PixelSmokeCloud,
  ROCKET_ASPECT,
} from "./RocketSprites";

/* Timeline phase map, in scrubbed-progress units (0..1 across the pin).
   Tune here — every tween below positions itself relative to these. */
const PHASE = {
  platformIn: 0, // platform + rockets set in
  ignition: 0.16, // plumes flare, rumble, hint fades
  liftoff: 0.3, // rockets accelerate off the top
  liftoffStagger: 0.04,
  dust: 0.35, // fuel dust billows from each launch point
  bloom: 0.7, // white radials swell
  whiteout: 0.88, // fixed overlay drives to full white
};

/* Per-rocket smoke-puff layout: small preset variety (offset/size/mirror)
   so the cluster doesn't look like a single stamped shape before GSAP
   spreads it during the billow phase. Last two are dropped on small
   screens (`hidden sm:block`) per the perf budget. */
const PUFF_LAYOUT: {
  leftPct: number;
  width: number;
  variant: "a" | "b";
  flip?: boolean;
}[] = [
  { leftPct: -60, width: 170, variant: "a" },
  { leftPct: 20, width: 200, variant: "a", flip: true },
  { leftPct: -20, width: 130, variant: "b" },
  { leftPct: 55, width: 120, variant: "b", flip: true },
  { leftPct: -95, width: 110, variant: "b" },
];

/**
 * The launch (counterpart to RocketDescent): a pinned, scrubbed set-piece
 * that carries the user from the descent into Sponsors. Platform sets in →
 * ignition → staggered liftoff → fuel-dust billow → white bloom → full
 * whiteout. A second trigger on the next section clears the fixed whiteout
 * as it scrolls up underneath, so the seam is never visible.
 */
export default function RocketLaunchTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const whiteoutRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      const whiteout = whiteoutRef.current;
      if (!section || !whiteout) return;
      const q = gsap.utils.selector(section);
      const cfg = siteConfig.rocketLaunch;
      const rand = gsap.utils.random;

      const platform = q("[data-launch-platform]");
      const hint = q("[data-launch-hint]");
      const rocketEls = q<HTMLElement>("[data-launch-rocket]");
      const plumeEls = q<HTMLElement>("[data-launch-plume]");
      const bloomEls = q<HTMLElement>("[data-launch-bloom]");
      const dustEls = q<HTMLElement>("[data-launch-dust]");
      const puffGroups = dustEls.map((container) =>
        Array.from(
          container.querySelectorAll<HTMLElement>("[data-launch-dust-puff]"),
        ),
      );

      gsap.set(hint, { autoAlpha: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "rocket-launch",
          trigger: section,
          start: "top top",
          end: `+=${cfg.scrollDistance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Platform sets in; rockets settle into ready.
      tl.fromTo(
        platform,
        { yPercent: 160, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.13, ease: "power2.out" },
        PHASE.platformIn,
      ).fromTo(
        rocketEls,
        { y: 56, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.09, ease: "power2.out", stagger: 0.015 },
        PHASE.platformIn + 0.05,
      );

      // Ignition: hint out, plumes flare on, subtle rumble.
      tl.to(hint, { autoAlpha: 0, duration: 0.04 }, PHASE.ignition - 0.01)
        .fromTo(
          plumeEls,
          { scaleY: 0.001, autoAlpha: 0 },
          { scaleY: 1, autoAlpha: 1, duration: 0.1, ease: "power3.out", stagger: 0.03 },
          PHASE.ignition,
        )
        .to(
          rocketEls,
          { keyframes: { x: [0, -2, 2, -1.5, 1.5, -1, 1, 0] }, duration: 0.13 },
          PHASE.ignition,
        );

      // Liftoff: accelerate off the top; exhaust elongates, then trails off.
      rocketEls.forEach((el, i) => {
        const at = PHASE.liftoff + i * PHASE.liftoffStagger;
        tl.to(
          el,
          { y: () => -(window.innerHeight * 1.35), duration: 0.31, ease: "power2.in" },
          at,
        )
          .to(plumeEls[i], { scaleY: 2.3, duration: 0.12, ease: "power1.in" }, at)
          .to(plumeEls[i], { autoAlpha: 0, scaleY: 3, duration: 0.1 }, at + 0.14);
      });

      // Dust billow: the smoke-puff cluster expands outward + upward from
      // each launch point, then fades as the bloom takes over.
      puffGroups.forEach((puffs, i) => {
        puffs.forEach((p, j) => {
          const at =
            PHASE.dust + i * PHASE.liftoffStagger + j * 0.015 + rand(0, 0.04);
          tl.fromTo(
            p,
            { x: 0, y: 0, scale: 0.35, autoAlpha: 0 },
            {
              x: rand(-1, 1) * rand(30, 140),
              y: -rand(20, 170),
              scale: rand(0.9, 1.7),
              autoAlpha: rand(0.6, 0.95),
              duration: 0.3,
              ease: "power1.out",
            },
            at,
          ).to(p, { autoAlpha: 0, duration: 0.15 }, Math.min(at + 0.3, 0.68));
        });
      });

      // White blooms swell from the launch points.
      tl.fromTo(
        bloomEls,
        { scale: 0.001, autoAlpha: 0 },
        { scale: 16, autoAlpha: 1, duration: 0.2, ease: "power2.in", stagger: 0.01 },
        PHASE.bloom,
      );

      /* Whiteout ramp: one continuous trigger owns the full 0→1→0 curve
         (ramp up through the last stretch of the pin, peak exactly at pin
         release, ramp down as Sponsors scrolls up). Splitting this across
         two ScrollTriggers with different scrub values (a laggy scrubbed
         one for the ramp-up, an instant one for the ramp-down) raced: the
         laggy one could still be pushing toward autoAlpha 1 for up to ~1s
         after Sponsors was already on screen, reading as a stuck whiteout
         over Sponsors' heading/cards. One trigger, one progress value, no
         race — start/end are computed from the pin's OWN resolved bounds
         (pinST.end) via functions (so they stay correct across refresh)
         rather than a "top+=X" string on the pinned element itself, which
         doesn't account for the pin's inflated virtual scroll range. */
      const pinST = tl.scrollTrigger!;
      const rampUpPx = (1 - PHASE.whiteout) * cfg.scrollDistance;
      const clearPx = 380;
      const peak = rampUpPx / (rampUpPx + clearPx);
      ScrollTrigger.create({
        id: "rocket-launch-whiteout",
        start: () => pinST.end - rampUpPx,
        end: () => pinST.end + clearPx,
        scrub: 0.3,
        onUpdate(self) {
          const alpha =
            self.progress <= peak
              ? self.progress / peak
              : 1 - (self.progress - peak) / (1 - peak);
          gsap.set(whiteout, { autoAlpha: alpha });
        },
      });

      /* The pin shifts every downstream trigger's offsets — recompute once
         layout settles, again when fonts land, and when sprites decode.
         (ScrollTrigger already re-runs refresh on window resize.) */
      const refresh = () => ScrollTrigger.refresh();
      const raf = requestAnimationFrame(refresh);
      document.fonts?.ready.then(refresh).catch(() => {});
      const sprites = q<HTMLImageElement>("img").filter((img) => !img.complete);
      sprites.forEach((img) =>
        img.addEventListener("load", refresh, { once: true }),
      );

      return () => {
        cancelAnimationFrame(raf);
        sprites.forEach((img) => img.removeEventListener("load", refresh));
      };
    });
    return () => mm.revert();
  }, []);

  const rockets = siteConfig.rocketLaunch.rockets.slice(
    0,
    siteConfig.rocketLaunch.rocketCount,
  );

  return (
    <>
      {/* Background stays transparent — the rockets launch out of the same
          cascade the rest of the page lives in. Reduced motion gets this as
          a static launch-pad scene (no pin, no whiteout). */}
      <section
        ref={sectionRef}
        aria-hidden
        className="relative h-[100dvh] overflow-hidden"
      >
        {/* Launch platform — dark pad + legs, steel accents matching the hull */}
        <div data-launch-platform className="absolute inset-x-[10%] bottom-[7%] z-0">
          <div
            className="relative h-3"
            style={{
              background: "var(--color-void-800)",
              boxShadow:
                "0 -3px 0 0 var(--color-hull-shadow), 0 3px 0 0 var(--color-void-700), 0 -3px 16px 0 color-mix(in srgb, var(--color-hull-shadow) 35%, transparent)",
            }}
          >
            {rockets.map((r, i) => (
              <span
                key={i}
                className="absolute -top-2 h-2 w-2"
                style={{
                  left: `${((r.xPercent - 10) / 80) * 100}%`,
                  transform: "translateX(-50%)",
                  background: "var(--color-hull-highlight)",
                }}
              />
            ))}
          </div>
          <div className="relative h-6">
            {[12, 50, 88].map((l) => (
              <span
                key={l}
                className="absolute top-0 h-6 w-2"
                style={{
                  left: `${l}%`,
                  transform: "translateX(-50%)",
                  background: "var(--color-void-700)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Launch points: smoke-puff clusters stay anchored to the pad
            while rockets fly; each puff is animated independently below. */}
        {rockets.map((r, i) => (
          <div
            key={i}
            data-launch-dust
            className="absolute bottom-[7%] z-10 h-0 w-0"
            style={{ left: `${r.xPercent}%` }}
          >
            {PUFF_LAYOUT.map((puff, j) => (
              <div
                key={j}
                data-launch-dust-puff
                className={
                  j >= 3 ? "absolute bottom-0 hidden opacity-0 will-change-transform sm:block" : "absolute bottom-0 opacity-0 will-change-transform"
                }
                style={{
                  left: puff.leftPct,
                  transform: "translateX(-50%)",
                }}
              >
                <PixelSmokeCloud
                  width={puff.width}
                  variant={puff.variant}
                  flip={puff.flip}
                />
              </div>
            ))}
          </div>
        ))}

        {/* Rockets + exhaust plumes (plume rides with its rocket) */}
        {rockets.map((r, i) => (
          <div
            key={i}
            data-launch-rocket
            className="absolute z-20 will-change-transform"
            style={{
              left: `${r.xPercent}%`,
              bottom: "calc(7% + 24px)",
              transform: `translateX(-50%) scale(${r.scale})`,
            }}
          >
            {r.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={r.src}
                alt=""
                width={96}
                height={Math.round(96 * ROCKET_ASPECT)}
                className="crisp"
              />
            ) : (
              <PixelRocket size={96} />
            )}
            <div
              data-launch-plume
              className="absolute left-1/2 top-full -z-10 opacity-0"
              style={{
                marginLeft: -11,
                marginTop: -8,
                transformOrigin: "top center",
                willChange: "transform",
              }}
            >
              <PixelExhaustPlume width={22} />
            </div>
          </div>
        ))}

        {/* White blooms — one per launch point, in front of the rockets */}
        {rockets.map((r, i) => (
          <div
            key={i}
            data-launch-bloom
            className="absolute z-30 h-44 w-44 rounded-full opacity-0"
            style={{
              left: `${r.xPercent}%`,
              bottom: "2%",
              transform: "translate(-50%, 30%)",
              willChange: "transform",
              background:
                "radial-gradient(circle, var(--color-star-white) 0%, color-mix(in srgb, var(--color-star-white) 65%, transparent) 45%, transparent 72%)",
            }}
          />
        ))}

        <p
          data-launch-hint
          className="absolute bottom-[2.5%] left-1/2 z-20 -translate-x-1/2 font-pixel text-[10px] text-star-white/80 opacity-0"
        >
          T-MINUS: KEEP SCROLLING
        </p>
      </section>

      {/* Fixed whiteout — bridges the pin release into the next section.
          Sits under the z-50 loading screen; above everything else. */}
      <div
        ref={whiteoutRef}
        id="launch-whiteout"
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 opacity-0"
        style={{ background: "var(--color-star-white)", visibility: "hidden" }}
      />
    </>
  );
}
