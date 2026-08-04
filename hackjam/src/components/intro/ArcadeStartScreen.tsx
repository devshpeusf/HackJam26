"use client";

import type { RefObject } from "react";

export type IntroPhase = "boot" | "ready" | "launching";

/**
 * The CRT content sitting inside the cabinet's screen rect. Purely
 * self-contained — it never renders the real site.
 *
 * Every size is expressed in container units (`cqw`/`cqh`) against the screen
 * div, so the whole layout scales with the cabinet instead of with the
 * viewport. That keeps it legible when the cabinet shrinks on mobile.
 */
export default function ArcadeStartScreen({
  phase,
  progress,
  onStart,
  buttonRef,
}: {
  phase: IntroPhase;
  progress: number;
  onStart: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  const booting = phase === "boot";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[6cqh] px-[8cqw] text-center">
      <div className="flex flex-col items-center gap-[1.6cqh]">
        {/* accent-magenta is the wordmark's own orbit-ring pink — the GIF
            samples #fd2d96, which is this token within 1/255 per channel. */}
        <span
          className="font-pixel text-[2.6cqw] uppercase leading-none tracking-[0.3em] text-accent-magenta"
          style={{
            textShadow:
              "0 0 0.7em color-mix(in srgb, var(--color-accent-magenta) 65%, transparent)",
          }}
        >
          &copy;SHPE USF Presents
        </span>
        {/* Same wordmark the landing page uses, so the cabinet screen shows
            the real HackJam header rather than a separate text treatment.
            It already carries '26, so no year line is needed here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gifs/HackJam26_black_levitate.webp"
          alt="HackJam"
          className="crisp w-[64cqw] max-w-full"
        />
      </div>

      {booting ? (
        <div className="flex w-full flex-col items-center gap-[2.5cqh]">
          <span className="font-pixel text-[2.8cqw] uppercase tracking-widest text-star-white/70">
            Loading
          </span>
          {/* Real progress — driven by image decode + font readiness */}
          <div className="h-[1.8cqh] w-full bg-void-700">
            <div
              className="h-full bg-accent-cyan transition-[width] duration-200 ease-out"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          onClick={onStart}
          className="hj-press-blink font-pixel text-[3.2cqw] uppercase leading-relaxed text-star-white focus-visible:outline focus-visible:outline-[0.5cqw] focus-visible:outline-offset-[1.2cqw] focus-visible:outline-accent-cyan"
        >
          {/* Press Start 2P has no ▸/◂ glyphs — those silently fell back to a
              non-pixel system font. > and < are in the latin subset. */}
          &gt; Press any key to start &lt;
        </button>
      )}

      <div className="flex w-full items-center justify-between font-pixel text-[2.2cqw] text-star-white/40">
        <span>INSERT COIN</span>
        <span>CR 00</span>
      </div>
    </div>
  );
}
