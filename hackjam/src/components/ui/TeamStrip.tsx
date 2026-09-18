"use client";

import { useSyncExternalStore } from "react";
import { Marquee } from "@/components/ui/marquee";
import ScrollRail from "@/components/ui/ScrollRail";

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
    <ScrollRail
      label="Team members"
      cardSelector="[data-crew-card]"
      gap={32}
      railClassName="gap-8 px-4 py-2 sm:gap-10 sm:px-6"
    >
      {children}
    </ScrollRail>
  );
}
