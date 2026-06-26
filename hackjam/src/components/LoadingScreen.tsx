"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function LoadingScreen() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const screen = screenRef.current;
    if (!wrapper || !screen) return;

    // Paused timeline — ScrollTrigger will scrub it via scroll position
    const tl = gsap.timeline({ paused: true });
    tl.to(screen, {
      scale: 3,
      opacity: 0,
      transformOrigin: "center center",
      ease: "none",
    });

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      animation: tl,
      onLeave: () => {
        screen.style.pointerEvents = "none";
      },
      onEnterBack: () => {
        screen.style.pointerEvents = "auto";
      },
    });

    // Keypress drives the same scrub by scrolling through the intro zone
    const handleKeydown = () => {
      gsap.to(window, {
        scrollTo: wrapper.offsetTop + wrapper.offsetHeight,
        duration: 1.2,
        ease: "power2.inOut",
      });
      window.removeEventListener("keydown", handleKeydown);
    };
    window.addEventListener("keydown", handleKeydown);

    ScrollTrigger.refresh();

    return () => {
      st.kill();
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    // Intro wrapper — overflowX clip prevents the scale transform from creating horizontal scrollable area
    <div ref={wrapperRef} style={{ height: "150vh", overflowX: "clip" }}>
      <div
        ref={screenRef}
        style={{ position: "sticky", top: 0 }}
        className="h-screen w-full z-50 flex items-center justify-center bg-black/95"
      >
        {/* Arcade screen placeholder — real CRT art replaces this later */}
        <div className="border-2 border-cyan-400 rounded-2xl w-[80vw] max-w-2xl px-12 py-14 flex flex-col items-center gap-8 shadow-[0_0_40px_rgba(0,255,255,0.25)]">
          <h2 className="text-cyan-400 font-mono text-3xl tracking-[0.2em] uppercase font-bold">
            HackJam
          </h2>
          <p className="text-cyan-300/60 font-mono text-xs tracking-widest uppercase text-center">
            Press any key or scroll down to start
          </p>
          {/* Faux loading bar — static placeholder */}
          <div className="w-full h-1.5 bg-cyan-900/50 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-cyan-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
