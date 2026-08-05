"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { siteConfig } from "@/config/site";
import {
  PixelExhaustPlume,
  PixelRocket,
  ROCKET_ASPECT,
} from "./RocketSprites";

/* Timeline phase map, in seconds from click. Tune here — every tween
   below positions itself relative to these. Full cloud cover ~4.1s. */
const PHASE = {
  ignition: 1.1, // plumes flare, rumble
  liftoff: 1.8, // rockets accelerate off the top
  liftoffStagger: 0.12,
  cover: 2.2, // cloud wall starts billowing up from below
  covered: 4.0, // screen fully blanketed — page snaps to top under it
};

/* The cloud wall: 5 rows × 4 columns of oversized cloud sprites (percent
   positions of the viewport, width in vw). Rows fill bottom-up, spaced far
   tighter than a sprite's height so they overlap heavily, and a soft fill
   behind them seals anything left at full cover. */
const COVER_CLOUDS: { x: number; y: number; w: number; flip?: boolean }[] = [
  { x: 5, y: 98, w: 62 },
  { x: 35, y: 103, w: 68, flip: true },
  { x: 65, y: 97, w: 62 },
  { x: 95, y: 102, w: 66, flip: true },
  { x: 18, y: 76, w: 64, flip: true },
  { x: 48, y: 72, w: 68 },
  { x: 78, y: 78, w: 62, flip: true },
  { x: 105, y: 73, w: 60 },
  { x: 0, y: 52, w: 66 },
  { x: 30, y: 48, w: 62, flip: true },
  { x: 60, y: 54, w: 68 },
  { x: 92, y: 49, w: 64 },
  { x: 14, y: 28, w: 62, flip: true },
  { x: 44, y: 24, w: 68 },
  { x: 74, y: 30, w: 62, flip: true },
  { x: 102, y: 25, w: 64 },
  { x: 2, y: 6, w: 64, flip: true },
  { x: 33, y: 1, w: 68 },
  { x: 63, y: 8, w: 62, flip: true },
  { x: 93, y: 3, w: 66 },
];

/**
 * The "PLAY AGAIN?" ender: a click-triggered, auto-playing launch that
 * replaces the old scroll-scrubbed transition. The button summons a
 * full-screen overlay — platform rises, rockets ignite and lift off,
 * then a wall of oversized pixel clouds rises to blanket the
 * whole screen — the page snaps back to the top underneath, and the wall
 * parts to the sides to reveal the intro screen. Escape cancels
 * mid-flight. Reduced motion skips the show and just returns to the top.
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
    const coverEls = q<HTMLElement>("[data-cover-cloud]");
    const coverFill = q("[data-cover-fill]");

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

    // Cloud cover: the wall billows up row by row from the bottom until
    // the whole viewport is blanketed; the soft fill fades in underneath
    // to seal the gaps between sprites.
    coverEls.forEach((el, i) => {
      const row = Math.floor(i / 4); // 0 = bottom row, rises first
      const at = PHASE.cover + row * 0.2 + (i % 4) * 0.06 + rand(0, 0.06);
      tl.fromTo(
        el,
        { y: () => window.innerHeight * 0.7 + 400, scale: 0.6, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.75, ease: "power2.out" },
        at,
      );
    });
    tl.to(
      coverFill,
      { autoAlpha: 1, duration: 0.6, ease: "power1.in" },
      PHASE.covered - 0.8,
    );

    // Fully covered: ditch the platform while it's hidden behind the wall
    // (so nothing of the pad survives into the reveal), snap to the top
    // underneath the clouds, hold a beat, then part the wall to the sides
    // to reveal the intro screen. "instant" overrides the global smooth
    // scroll-behavior.
    tl.set(platform, { autoAlpha: 0 }, PHASE.covered);
    tl.call(
      () => window.scrollTo({ top: 0, behavior: "instant" }),
      [],
      PHASE.covered,
    ).to(
      coverFill,
      { autoAlpha: 0, duration: 0.6, ease: "power1.out" },
      PHASE.covered + 0.4,
    );
    coverEls.forEach((el, i) => {
      const dir = COVER_CLOUDS[i].x < 50 ? -1 : 1;
      tl.to(
        el,
        {
          x: () => dir * window.innerWidth * 1.35,
          duration: 1,
          ease: "power2.in",
        },
        PHASE.covered + 0.4 + rand(0, 0.18),
      );
    });
    tl.to(root, { autoAlpha: 0, duration: 0.3 }, PHASE.covered + 1.6).call(() =>
      setPlaying(false),
    );

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

          {/* Cloud wall — billows up to blanket the screen; the reset hides
              behind it, then it parts to the sides over the intro screen */}
          <div className="absolute inset-0 z-40 overflow-hidden">
            <div
              data-cover-fill
              className="absolute inset-0 opacity-0"
              style={{ background: "#ffeef6" }}
            />
            {COVER_CLOUDS.map((c, i) => (
              <div
                key={i}
                data-cover-cloud
                className="absolute opacity-0 will-change-transform"
                style={{
                  left: `${c.x}%`,
                  top: `${c.y}%`,
                  width: `${c.w}vw`,
                  marginLeft: `${-c.w / 2}vw`,
                  marginTop: `${-c.w / 4.2}vw`,
                  // Bottom row stacks frontmost; each higher row slides in
                  // behind the one below it, so the wall reads as filling
                  // up from the ground.
                  zIndex: 10 - Math.floor(i / 4),
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/clouds/pixel-cloud.webp"
                  alt=""
                  className={`crisp w-full ${c.flip ? "-scale-x-100" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
