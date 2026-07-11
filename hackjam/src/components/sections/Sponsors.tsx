"use client";

import Reveal from "@/components/effects/Reveal";

/**
 * Sky band: just the section heading, floating above the atmosphere
 * clouds in the blue stretch of the descent. Oversized on purpose — it
 * titles the whole cloud stretch, and the descending pod flies over it.
 * The sponsor names/logos themselves ride behind the clouds (see
 * AtmosphereClouds), peeking out. Rendered inside RocketDescent's tall
 * section, so it scrolls past the pinned capsule scene.
 */
export default function Sponsors() {
  return (
    <section
      id="sponsors"
      className="relative flex scroll-mt-14 flex-col items-center px-4"
    >
      <Reveal className="flex w-full flex-col items-center gap-6 text-center">
        <h2
          data-reveal
          className="font-pixel text-[clamp(2rem,6vw,4rem)] leading-relaxed text-star-white"
          style={{ textShadow: "0 4px 18px rgba(0,0,0,0.35)" }}
        >
          SPONSORS
        </h2>
        <div data-reveal aria-hidden className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5"
            style={{ background: "var(--color-accent-cyan)", opacity: 0.5 }}
          />
          <span
            className="h-2 w-2"
            style={{ background: "var(--color-accent-cyan)" }}
          />
          <span
            className="h-1.5 w-1.5"
            style={{ background: "var(--color-accent-cyan)", opacity: 0.5 }}
          />
        </div>
        <p
          data-reveal
          className="max-w-xl text-base leading-relaxed text-star-white/80 sm:text-lg"
        >
          The people making the descent possible. Want your logo here?
        </p>
      </Reveal>
    </section>
  );
}
