"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function LoadingScreen() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLImageElement>(null);
  const cabinetWrapRef = useRef<HTMLDivElement>(null);
  const cabinetRef = useRef<HTMLImageElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const screenTextRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    const cabinet = cabinetRef.current;
    const black = blackRef.current;
    if (!overlay || !cabinet || !black) return;

    // Lock page scroll while the intro is up; the real site sits underneath.
    document.body.style.overflow = "hidden";

    const play = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      window.removeEventListener("keydown", play);
      overlay.removeEventListener("click", play);

      // ── Timing knobs — adjust these to taste ──────────────────────────────
      const ZOOM_DURATION    = 1.2;  // seconds: how long the cabinet zooms in
      const FADE_START       = 0;    // seconds from click: when the overlay starts fading out (0 = same as zoom)
      const FADE_DURATION    = 1.4;  // seconds: how long the crossfade to the website takes
      // ──────────────────────────────────────────────────────────────────────

      const tl = gsap.timeline();

      // Fade the "press start" prompt and screen text out immediately.
      tl.to(promptRef.current,    { opacity: 0, duration: 0.2 }, 0);
      tl.to(screenTextRef.current, { opacity: 0, duration: 0.3 }, 0);

      // Zoom and crossfade happen at the same time.
      tl.to(cabinet, { scale: 8, ease: "power2.in", duration: ZOOM_DURATION }, 0);

      // Fade the entire overlay (room + cabinet) directly to the website — no black.
      tl.to(overlayRef.current, { opacity: 0, ease: "power2.inOut", duration: FADE_DURATION }, FADE_START);

      // Clean up once the fade is done.
      tl.add(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = "";
        overlay.style.display = "none";
      });
    };

    window.addEventListener("keydown", play);
    overlay.addEventListener("click", play);

    return () => {
      window.removeEventListener("keydown", play);
      overlay.removeEventListener("click", play);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 overflow-hidden cursor-pointer select-none"
    >
      {/* Room backdrop layer (behind the cabinet) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={roomRef}
        src="/background/loading_background.jpeg"
        alt=""
        width={2048}
        height={2048}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Cabinet layer, centered. transformOrigin is the screen's center so the
          zoom dives into the screen rather than the whole cabinet body. */}
      <div
        ref={cabinetWrapRef}
        className="absolute inset-0 flex items-end justify-center"
      >
        {/* items-end + negative margin anchors the cabinet to the floor and
            sinks its base just below the fold, so it reads as rising out of the
            ground. Negative margin (not transform) avoids fighting GSAP scale. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={cabinetRef}
          src="/background/hackjam_cabinet_final.png"
          alt="HackJam arcade cabinet"
          width={573}
          height={908}
          className="h-[94vh] w-auto max-w-[96vw] object-contain mb-[-2vh] will-change-transform"
          style={{ transformOrigin: "50% 25%" }}
          draggable={false}
        />

        {/*
          ── ARCADE SCREEN TEXT ──────────────────────────────────────────────
          This div is positioned over the cabinet's screen area and scales
          with the cabinet zoom since it shares the same parent.

          POSITIONING  → adjust `bottom` and `translateY` to move vertically,
                          the text is horizontally centered via `left-1/2 -translate-x-1/2`.
          FONT SIZE    → change `text-[1.4vh]` (relative to viewport height).
          FONT FAMILY  → change `font-mono` to any Tailwind font or a custom one.
          LINE SPACING → change `gap-[0.6vh]` between the three lines.
          COLOR        → text is #3b82f6 (Tailwind blue-500); glow matches it.
          BLINK SPEED  → controlled by `screenBlink` keyframes in globals.css.
          ────────────────────────────────────────────────────────────────────
        */}
        <div
          ref={screenTextRef}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            // Distance from bottom of the cabinet image to the screen center.
            // The screen sits at ~25% from the top of the image (same as
            // transformOrigin), which is ~75% from the bottom.
            bottom: "59%",
            // Fine-tune vertical centering within the screen bezel.
            transform: "translateX(0%) translateY(50%)",
          }}
        >
          <div className="flex flex-col items-center gap-[0.6vh] screen-blink">
            {/* ── Line 1 ── */}
            <span
              className="font-mono uppercase tracking-widest"
              style={{
                fontSize: "3vh",        // ← change font size here
                color: "#3b82f6",         // ← change text color here (blue-500)
                textShadow: "0 0 8px #3b82f6, 0 0 20px #3b82f6",  // ← glow
              }}
            >
              SHPE @ USF
            </span>
            {/* ── Line 2 ── */}
            <span
              className="font-mono uppercase tracking-widest"
              style={{
                fontSize: "1.4vh",
                color: "#3b82f6",
                textShadow: "0 0 8px #3b82f6, 0 0 20px #3b82f6",
              }}
            >
              Presents:
            </span>
            {/* ── Line 3 ── */}
            <span
              className="font-mono uppercase tracking-widest"
              style={{
                fontSize: "3.5vh",
                color: "green",
                textShadow: "0 0 8px green, 0 0 20px green",
              }}
            >
              HACKJAM 2026
            </span>
          </div>
        </div>
      </div>

      {/* Press-start prompt */}
      <div
        ref={promptRef}
        className="pointer-events-none absolute inset-x-0 bottom-[7%] flex justify-center"
      >
        <span className="animate-pulse font-mono text-sm tracking-[0.3em] uppercase text-cyan-300/80 drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]">
          ▶ Press any key or click to start
        </span>
      </div>

      {/* Full-screen black layer — the screen "turns black," then fades out to
          reveal the real site. Sits above room + cabinet within the overlay. */}
      <div ref={blackRef} className="absolute inset-0 z-10 bg-black opacity-0" />
    </div>
  );
}
