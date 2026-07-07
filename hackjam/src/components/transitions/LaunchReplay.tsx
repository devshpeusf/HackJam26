"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { siteConfig } from "@/config/site";
import {
  PixelExhaustPlume,
  PixelRocket,
  PixelSmokeCloud,
  ROCKET_ASPECT,
} from "./RocketSprites";

/* Timeline phase map, in seconds from click. Tune here — every tween
   below positions itself relative to these. Full white lands ~3.9s. */
const PHASE = {
  ignition: 1.1, // plumes flare, rumble
  liftoff: 1.8, // rockets accelerate off the top
  liftoffStagger: 0.12,
  dust: 1.95, // fuel dust billows from each launch point
  bloom: 2.9, // white radials swell
  whiteout: 3.4, // overlay drives to full white
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
 * The "PLAY AGAIN?" ender: a click-triggered, auto-playing launch that
 * replaces the old scroll-scrubbed transition. The button summons a
 * full-screen overlay — platform rises, rockets ignite and lift off,
 * fuel dust billows, white blooms swell to a full whiteout — then the
 * page snaps back to the top under the white and the overlay fades out
 * over the hero. Escape cancels mid-flight. Reduced motion skips the
 * show and just returns to the top.
 */
export default function LaunchReplay() {
  const [playing, setPlaying] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const begin = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    setPlaying(true);
  };

  useLayoutEffect(() => {
    if (!playing) return;
    const root = overlayRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const rand = gsap.utils.random;

    const platform = q("[data-launch-platform]");
    const rocketEls = q<HTMLElement>("[data-launch-rocket]");
    const plumeEls = q<HTMLElement>("[data-launch-plume]");
    const bloomEls = q<HTMLElement>("[data-launch-bloom]");
    const dustEls = q<HTMLElement>("[data-launch-dust]");
    const whiteout = q("[data-launch-whiteout]");
    const puffGroups = dustEls.map((container) =>
      Array.from(
        container.querySelectorAll<HTMLElement>("[data-launch-dust-puff]"),
      ),
    );

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tlRef.current = tl;

    /* No backdrop — the launch plays over whatever is on screen. Platform
       and rockets rise together from below the viewport edge, like the pad
       is being raised out of the ground. The offset clears the tallest
       rocket so nothing pops in mid-screen. */
    gsap.set(root, { autoAlpha: 1 });
    const riseFrom = () => window.innerHeight * 0.07 + 300;
    tl.fromTo(
      platform,
      { y: riseFrom },
      { y: 0, duration: 0.9, ease: "power2.out" },
      0.05,
    ).fromTo(
      rocketEls,
      { y: riseFrom, autoAlpha: 1 },
      { y: 0, autoAlpha: 1, duration: 0.9, ease: "power2.out" },
      0.05,
    );

    // Ignition: plumes flare on, subtle rumble.
    tl.fromTo(
      plumeEls,
      { scaleY: 0.001, autoAlpha: 0 },
      { scaleY: 1, autoAlpha: 1, duration: 0.3, ease: "power3.out", stagger: 0.08 },
      PHASE.ignition,
    ).to(
      rocketEls,
      { keyframes: { x: [0, -2, 2, -1.5, 1.5, -1, 1, 0] }, duration: 0.5 },
      PHASE.ignition,
    );

    // Liftoff: accelerate off the top; exhaust elongates, then trails off.
    rocketEls.forEach((el, i) => {
      const at = PHASE.liftoff + i * PHASE.liftoffStagger;
      tl.to(
        el,
        { y: () => -(window.innerHeight * 1.35), duration: 1, ease: "power2.in" },
        at,
      )
        .to(plumeEls[i], { scaleY: 2.3, duration: 0.4, ease: "power1.in" }, at)
        .to(plumeEls[i], { autoAlpha: 0, scaleY: 3, duration: 0.3 }, at + 0.45);
    });

    // Dust billow: the smoke-puff cluster expands outward + upward from
    // each launch point, then fades as the bloom takes over.
    puffGroups.forEach((puffs, i) => {
      puffs.forEach((p, j) => {
        const at =
          PHASE.dust + i * PHASE.liftoffStagger + j * 0.05 + rand(0, 0.12);
        tl.fromTo(
          p,
          { x: 0, y: 0, scale: 0.35, autoAlpha: 0 },
          {
            x: rand(-1, 1) * rand(30, 140),
            y: -rand(20, 170),
            scale: rand(0.9, 1.7),
            autoAlpha: rand(0.6, 0.95),
            duration: 0.85,
            ease: "power1.out",
          },
          at,
        ).to(p, { autoAlpha: 0, duration: 0.4 }, at + 0.85);
      });
    });

    // White blooms swell from the launch points.
    tl.fromTo(
      bloomEls,
      { scale: 0.001, autoAlpha: 0 },
      { scale: 16, autoAlpha: 1, duration: 0.7, ease: "power2.in", stagger: 0.04 },
      PHASE.bloom,
    );

    // Whiteout, then snap to the top under the white and fade back in
    // on the hero. "instant" overrides the global smooth scroll-behavior.
    tl.to(whiteout, { autoAlpha: 1, duration: 0.5, ease: "power1.in" }, PHASE.whiteout)
      .call(() => window.scrollTo({ top: 0, behavior: "instant" }))
      .to(root, { autoAlpha: 0, duration: 0.8, ease: "power1.inOut" }, "+=0.2")
      .call(() => setPlaying(false));

    return () => {
      tlRef.current = null;
      tl.kill();
    };
  }, [playing]);

  // Escape aborts the launch and stays put.
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlaying(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [playing]);

  const rockets = siteConfig.rocketLaunch.rockets.slice(
    0,
    siteConfig.rocketLaunch.rocketCount,
  );

  return (
    <>
      <button
        type="button"
        onClick={begin}
        className="inline-block cursor-pointer bg-accent-magenta px-8 py-4 font-pixel text-xs text-void-deep transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-[0.98]"
        style={{
          boxShadow:
            "0 -4px 0 0 #ff2e97, 0 4px 0 0 #ff2e97, -4px 0 0 0 #ff2e97, 4px 0 0 0 #ff2e97, 0 0 28px rgba(255,46,151,0.5)",
        }}
      >
        PLAY AGAIN?
      </button>

      {playing && (
        <div
          ref={overlayRef}
          aria-hidden
          className="fixed inset-0 z-50 overflow-hidden opacity-0"
          style={{ visibility: "hidden" }}
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
              while rockets fly; each puff is animated independently above. */}
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
                    j >= 3
                      ? "absolute bottom-0 hidden opacity-0 will-change-transform sm:block"
                      : "absolute bottom-0 opacity-0 will-change-transform"
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
              className="absolute z-20 opacity-0 will-change-transform"
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

          {/* Full whiteout — the top layer the reset hides behind */}
          <div
            data-launch-whiteout
            className="absolute inset-0 z-40 opacity-0"
            style={{ background: "var(--color-star-white)" }}
          />
        </div>
      )}
    </>
  );
}
