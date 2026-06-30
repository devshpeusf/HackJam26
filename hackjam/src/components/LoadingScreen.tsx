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

      const tl = gsap.timeline();

      // Fade the "press start" prompt out immediately.
      tl.to(promptRef.current, { opacity: 0, duration: 0.2 }, 0);

      // Zoom INTO the cabinet screen — transformOrigin is set to the screen's
      // center, so the screen grows to fill the viewport as it scales up.
      tl.to(cabinet, { scale: 8, ease: "power2.in", duration: 1.2 }, 0);

      // The growing screen "becomes black" — fully opaque as the zoom peaks.
      tl.to(black, { opacity: 1, ease: "none", duration: 0.5 }, 0.8);

      // Fully black now: jump the site to the top and drop the room + cabinet
      // so nothing huge lingers behind the reveal.
      tl.add(() => {
        window.scrollTo(0, 0);
        gsap.set([roomRef.current, cabinetWrapRef.current], { autoAlpha: 0 });
      });

      // Reveal the actual website from the very top, then remove the overlay.
      tl.to(black, { opacity: 0, ease: "power2.out", duration: 0.7 }, ">0.15");
      tl.add(() => {
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
