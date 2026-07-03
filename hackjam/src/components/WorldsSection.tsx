"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollTrigger } from "@/lib/gsap";
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
    ? "-left-90 max-lg:-left-[130px]"
    : "-right-90 max-lg:-right-[130px]";
  const labelSide = left
    ? "left-[calc(100%+30px)]"
    : "right-[calc(100%+30px)] text-right";
  const offX = visible ? "translate-x-0" : left ? "-translate-x-225" : "translate-x-225";

  return (
    <div
      className={`pointer-events-none absolute top-1/2 z-20 -translate-y-1/2 ${side}`}
    >
      <div
        onClick={onOpen}
        className={`group pointer-events-auto relative h-200 w-200 cursor-pointer will-change-transform max-lg:h-70 max-lg:w-70 ${offX} ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transition: `transform .75s ${EASE_SPRING}, opacity .5s ease`,
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
        {/* track label + hint on the inner (visible) side */}
        <div
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-pixel text-[10px] tracking-[0.28em] text-star-white/65 transition-opacity delay-[850ms] duration-400 ${labelSide} ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {world.name.toUpperCase()}
        </div>
        <div
          className={`pointer-events-none absolute top-[calc(50%+1.5rem)] -translate-y-1/2 whitespace-nowrap font-pixel text-[8px] tracking-[0.18em] text-accent-violet opacity-0 transition-opacity duration-250 group-hover:opacity-100 ${labelSide}`}
        >
          CLICK TO EXPAND
        </div>
      </div>
    </div>
  );
}

export default function WorldsSection() {
  const worlds = siteConfig.worlds;
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(() =>
    worlds.map(() => false),
  );
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const reduced = useReducedMotion();

  // Slide each planet in once its trigger section scrolls into view.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(worlds.map(() => true));
      return;
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
  }, [worlds]);

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
    <section className="relative px-4 py-32">
      <h2 className="mb-4 text-center font-pixel text-base text-star-white sm:text-lg">
        CHOOSE YOUR WORLD
      </h2>
      <p className="mx-auto mb-8 max-w-md text-center text-sm text-star-white/70">
        Three tracks. Three worlds. Pick where your project lands.
      </p>

      {worlds.map((world, i) => (
        <div
          key={world.name}
          ref={(el) => {
            triggerRefs.current[i] = el;
          }}
          className="relative flex h-[110vh] items-center justify-center"
        >
          <span
            className={`font-pixel text-[10px] tracking-[0.35em] transition-colors duration-600 ${
              visible[i] ? "text-star-white/20" : "text-star-white/5"
            }`}
          >
            {world.num} · {world.name.toUpperCase()}
          </span>
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
