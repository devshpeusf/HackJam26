"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { siteConfig, type WorldTrack } from "@/config/site";
import PixelPlanet from "@/components/PixelPlanet";

const EASE_SPRING = "cubic-bezier(0.34,1.56,0.64,1)";

/** One side-mounted planet pod inside its full-height scroll trigger. */
function PlanetPod({
  world,
  left,
  visible,
  onOpen,
}: {
  world: WorldTrack;
  left: boolean;
  visible: boolean;
  onOpen: () => void;
}) {
  const side = left
    ? "-left-90 max-xl:-left-18"
    : "-right-90 max-xl:-right-18";
  const labelSide = left
    ? "left-[calc(100%+30px)] max-xl:left-[calc(100%+12px)]"
    : "right-[calc(100%+30px)] text-right max-xl:right-[calc(100%+12px)]";
  // Spin-in entrance: the world rolls in from its edge — offset, rotated a
  // full-ish turn and scaled down — then springs upright at full size. The
  // rotation direction matches travel, so it reads as rolling, not twirling.
  const entrance = visible
    ? "translateX(0) rotate(0deg) scale(1)"
    : left
      ? "translateX(-900px) rotate(-270deg) scale(0.3)"
      : "translateX(900px) rotate(270deg) scale(0.3)";

  return (
    <div
      className={`pointer-events-none absolute top-1/2 z-20 -translate-y-1/2 ${side}`}
    >
      <div
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View ${world.name} track details`}
        className={`group pointer-events-auto relative h-52 w-52 cursor-pointer will-change-transform sm:h-60 sm:w-60 xl:h-200 xl:w-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: entrance,
          transition: `transform 1.1s ${EASE_SPRING}, opacity .5s ease`,
        }}
      >
        {/* hover glow */}
        <div className="pointer-events-none absolute -inset-2.5 rounded-full transition-shadow duration-400 group-hover:[box-shadow:0_0_40px_6px_color-mix(in_srgb,var(--color-accent-violet)_30%,transparent)]" />
        {/* pulsing outer ring */}
        <div
          className={`pointer-events-none absolute -inset-3.5 rounded-full border border-star-white/10 transition-opacity delay-600 duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{ animation: "hj-ring-pulse 3s ease-in-out infinite" }}
        />
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <PixelPlanet index={world.planetIndex} size={800} />
        </div>
        {/* track label + faded watermark, same line, + hint on the inner
            (visible) side */}
        <div
          className={`hj-pixel-fade pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-baseline gap-4 whitespace-nowrap delay-[850ms] ${labelSide} ${
            visible ? "is-visible" : ""
          }`}
        >
          <span className="font-pixel text-[12px] tracking-[0.14em] text-star-white/80 sm:text-[14px] sm:tracking-[0.18em] xl:text-[20px] xl:tracking-[0.22em]">
            {world.name.toUpperCase()}
          </span>
          <span className="hidden font-pixel text-[16px] tracking-[0.2em] text-star-white/20 xl:inline">
            {world.num} · {world.name.toUpperCase()}
          </span>
        </div>
        <div
          className={`pointer-events-none absolute top-[calc(50%+2rem)] hidden -translate-y-1/2 whitespace-nowrap font-pixel text-[11px] tracking-[0.18em] text-accent-violet opacity-0 transition-opacity duration-250 group-hover:opacity-100 xl:block ${labelSide}`}
        >
          CLICK TO EXPAND
        </div>
      </div>
    </div>
  );
}

export default function WorldsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const worlds: WorldTrack[] = siteConfig.worlds;
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(() =>
    siteConfig.worlds.map(() => false),
  );
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-tracks-intro]",
          { y: 54, scale: 0.9, autoAlpha: 0 },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.85,
            ease: "power4.out",
            stagger: 0.14,
            scrollTrigger: {
              trigger: section,
              start: "top 76%",
              once: true,
            },
          },
        );
      }, section);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  // Slide each planet in once its trigger section scrolls into view.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() =>
        setVisible((v) => v.map(() => true)),
      );
      return () => cancelAnimationFrame(raf);
    }
    const triggers = triggerRefs.current.map(
      (el, i) =>
        el &&
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          once: true,
          onEnter: () =>
            setVisible((v) => v.map((x, j) => (j === i ? true : x))),
        }),
    );
    return () => triggers.forEach((t) => t && t.kill());
  }, []);

  // Modal: Escape closes, body scroll locks while open.
  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIdx]);

  const open = openIdx !== null ? worlds[openIdx] : null;

  return (
    <section ref={sectionRef} id="tracks" className="relative scroll-mt-14 px-4 py-20 sm:py-24">
      <h2
        data-tracks-intro
        className="mb-6 text-center font-pixel text-[clamp(2rem,6vw,4rem)] leading-relaxed text-star-white"
        style={{ textShadow: "0 4px 18px rgba(0,0,0,0.35)" }}
      >
        TRACKS
      </h2>
      <p data-tracks-intro className="mx-auto mb-8 max-w-3xl text-center font-pixel text-base leading-loose text-star-white/70 sm:text-lg">
        Three tracks. Three worlds. Pick where your project lands.
      </p>

      {worlds.map((world, i) => (
        <div
          key={world.name}
          ref={(el) => {
            triggerRefs.current[i] = el;
          }}
          className="relative flex h-[68vh] items-center justify-center sm:h-[78vh] xl:h-[92vh]"
        >
          <PlanetPod
            world={world}
            left={i % 2 === 0}
            visible={visible[i]}
            onOpen={() => setOpenIdx(i)}
          />
        </div>
      ))}

      <AnimatePresence>
        {open && openIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.4 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpenIdx(null);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-void-deep/90 p-8 backdrop-blur-[6px]"
          >
            <button
              onClick={() => setOpenIdx(null)}
              aria-label="Close"
              className="fixed top-6 right-6 flex h-10.5 w-10.5 cursor-pointer items-center justify-center rounded-full border border-star-white/10 bg-star-white/5 text-star-white/50 transition-colors hover:bg-star-white/10 hover:text-star-white"
            >
              ✕
            </button>
            <motion.div
              initial={{ scale: 0.85, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 24 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", duration: 0.55, bounce: 0.35 }
              }
              className="flex w-full max-w-240 items-center gap-[clamp(2rem,5vw,5rem)] max-md:flex-col"
            >
              <div className="relative aspect-square w-[clamp(220px,35vw,380px)] shrink-0">
                <PixelPlanet index={open.planetIndex} size={380} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-3 font-pixel text-[10px] tracking-[0.4em] text-accent-violet">
                  {open.num}
                </div>
                <div className="mb-5 bg-linear-to-br from-star-white to-accent-violet bg-clip-text font-pixel text-[clamp(1.6rem,4vw,3rem)] leading-tight text-transparent uppercase">
                  {open.name}
                </div>
                <p className="mb-9 text-xs leading-loose tracking-[0.08em] text-star-white/50 uppercase">
                  {open.blurb}
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  {(
                    [
                      ["ORBIT PERIOD", open.stats.orbit],
                      ["SURFACE TEMP", open.stats.temp],
                      ["RADIUS", open.stats.radius],
                      ["ATMOSPHERE", open.stats.atm],
                    ] as const
                  ).map(([label, value]) => (
                    <div
                      key={label}
                      className="border-t border-accent-violet/20 pt-3"
                    >
                      <div className="mb-1 text-[9px] tracking-[0.3em] text-star-white/30 uppercase">
                        {label}
                      </div>
                      <div className="font-pixel text-[11px] text-star-white uppercase">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
