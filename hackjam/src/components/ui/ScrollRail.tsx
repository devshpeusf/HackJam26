"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

const BUTTON_SHADOW =
  "0 -3px 0 0 var(--color-accent-cyan), 0 3px 0 0 var(--color-accent-cyan), -3px 0 0 0 var(--color-accent-cyan), 3px 0 0 0 var(--color-accent-cyan)";

type Props = {
  children: React.ReactNode;
  /** Announced to screen readers as "<label>, scrollable". */
  label: string;
  /** Selector for one card inside the rail; a press steps exactly one card. */
  cardSelector: string;
  /** Gap between cards in px — must match the rail's Tailwind gap. */
  gap: number;
  /** Smooth-scroll on press. Ignored (forced to a jump) under reduced motion. */
  smooth?: boolean;
  /** Classes for the scroll container itself (gap, padding). */
  railClassName?: string;
};

/**
 * A snap-scrolling horizontal rail with prev/next controls beneath it.
 * Swipe/trackpad scroll works natively; the buttons step one card at a time
 * and disable at the ends. Shared by the judges panel and the reduced-motion
 * crew strip so the edge-tracking and stepping logic lives once.
 */
export default function ScrollRail({
  children,
  label,
  cardSelector,
  gap,
  smooth = false,
  railClassName = "",
}: Props) {
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
    syncEdges();
    const el = railRef.current;
    if (!el) return;
    const ro = new ResizeObserver(syncEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncEdges]);

  const nudge = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(cardSelector);
    // One card plus its gap, so a press always lands cleanly on the next face.
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: smooth && !reduce ? "smooth" : "auto" });
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div
        ref={railRef}
        onScroll={syncEdges}
        role="region"
        aria-label={`${label}, scrollable`}
        tabIndex={0}
        className={`hj-no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scroll-padding-inline:1rem] ${railClassName}`}
      >
        {children}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => nudge(-1)}
          disabled={atStart}
          aria-label={`Previous ${label.toLowerCase()}`}
          className="flex h-10 w-10 cursor-pointer touch-manipulation items-center justify-center bg-void-deep text-accent-cyan transition-opacity disabled:cursor-default disabled:opacity-30"
          style={{ boxShadow: BUTTON_SHADOW }}
        >
          <Arrow dir="left" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          disabled={atEnd}
          aria-label={`Next ${label.toLowerCase()}`}
          className="flex h-10 w-10 cursor-pointer touch-manipulation items-center justify-center bg-void-deep text-accent-cyan transition-opacity disabled:cursor-default disabled:opacity-30"
          style={{ boxShadow: BUTTON_SHADOW }}
        >
          <Arrow dir="right" />
        </button>
      </div>
    </div>
  );
}
