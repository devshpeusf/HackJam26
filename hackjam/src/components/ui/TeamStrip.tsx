"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Marquee } from "@/components/ui/marquee";

/** Subscribe to the OS "reduce motion" setting so the component re-renders
 *  if the user flips it without reloading. */
const QUERY = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false, // server: assume motion, matching the marquee markup
  );
}

/** Chunky pixel arrow, drawn rather than typed so it matches the rest of the
 *  site's sprite look instead of dropping a system glyph in the middle of it. */
function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 8 8"
      aria-hidden
      className={`h-3.5 w-3.5 ${dir === "left" ? "" : "-scale-x-100"}`}
      shapeRendering="crispEdges"
    >
      <path d="M5 1h2v1H5zM3 2h2v1H3zM1 3h2v2H1zM3 5h2v1H3zM5 6h2v1H5z" fill="currentColor" />
    </svg>
  );
}

/**
 * The crew rail.
 *
 * Default: the auto-scrolling marquee, which is how the section is meant to
 * read — the crew drifting past on their own.
 *
 * Reduced motion: the marquee is frozen solid by the global
 * `animation-duration: 0.01ms !important` rule in globals.css, which left the
 * strip parked on crew 01–02 inside an `overflow-hidden` box. Every other
 * member was simply unreachable — not merely un-animated, but impossible to
 * see at all. So in that mode we swap the animation for a real scroll
 * container plus prev/next controls: same cards, same order, driven by the
 * user instead of by a timer.
 */
export default function TeamStrip({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    // 2px of slack: fractional scroll widths never land exactly on the end.
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    if (!reduced) return;
    syncEdges();
    const el = railRef.current;
    if (!el) return;
    const ro = new ResizeObserver(syncEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduced, syncEdges]);

  const nudge = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-crew-card]");
    // One card plus its gap, so a press always lands cleanly on the next face.
    const step = card ? card.offsetWidth + 32 : el.clientWidth * 0.8;
    // Honor the setting we are here to serve: jump, never smooth-scroll.
    el.scrollBy({ left: dir * step, behavior: "auto" });
  };

  if (!reduced) {
    return (
      <Marquee
        pauseOnHover
        className="[--duration:30s] [--gap:2rem] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] sm:[--gap:2.5rem]"
      >
        {children}
      </Marquee>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div
        ref={railRef}
        onScroll={syncEdges}
        role="region"
        aria-label="Team members, scrollable"
        tabIndex={0}
        className="hj-no-scrollbar flex w-full snap-x snap-mandatory gap-8 overflow-x-auto px-4 py-2 [scroll-padding-inline:1rem] sm:gap-10 sm:px-6"
        style={{ scrollBehavior: "auto" }}
      >
        {children}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => nudge(-1)}
          disabled={atStart}
          aria-label="Previous team members"
          className="flex h-10 w-10 cursor-pointer touch-manipulation items-center justify-center bg-void-deep text-accent-cyan transition-opacity disabled:cursor-default disabled:opacity-30"
          style={{
            boxShadow:
              "0 -3px 0 0 var(--color-accent-cyan), 0 3px 0 0 var(--color-accent-cyan), -3px 0 0 0 var(--color-accent-cyan), 3px 0 0 0 var(--color-accent-cyan)",
          }}
        >
          <Arrow dir="left" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          disabled={atEnd}
          aria-label="Next team members"
          className="flex h-10 w-10 cursor-pointer touch-manipulation items-center justify-center bg-void-deep text-accent-cyan transition-opacity disabled:cursor-default disabled:opacity-30"
          style={{
            boxShadow:
              "0 -3px 0 0 var(--color-accent-cyan), 0 3px 0 0 var(--color-accent-cyan), -3px 0 0 0 var(--color-accent-cyan), 3px 0 0 0 var(--color-accent-cyan)",
          }}
        >
          <Arrow dir="right" />
        </button>
      </div>
    </div>
  );
}
