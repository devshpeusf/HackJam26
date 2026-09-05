"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { PixelCapsule } from "@/components/transitions/RocketSprites";
import AtmosphereClouds from "@/components/effects/AtmosphereClouds";
import Sponsors from "@/components/sections/Sponsors";

/**
 * The signature set-piece (spec §7): a scroll-scrubbed re-entry. The section
 * is 360vh tall; a sticky viewport pins the scene while GSAP scrubs the
 * rocket down through the atmosphere. Scroll is the single source of truth.
 */
export default function RocketDescent() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.35,
        },
      });

      tl.fromTo(
        q("[data-rocket]"),
        { yPercent: -180, xPercent: -30, rotation: -6 },
        {
          // Keep the capsule in-frame through the first three cloud banks.
          // The final leg below carries it into the fourth cloud by Judges.
          yPercent: 35,
          xPercent: 24,
          rotation: 4,
          ease: "power1.inOut",
          duration: 0.88,
        },
        0,
      )
        // Fade the ship in over the first stretch of the descent, so it
        // materializes as the section scrolls in instead of popping.
        .fromTo(
          q("[data-rocket]"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.15, ease: "none" },
          0,
        )
        // Glide down-right into the opaque mass of the fourth cloud. The
        // cloud layer has z-10, so it physically covers the capsule instead
        // of a visibility toggle making the capsule disappear early.
        .to(
          q("[data-rocket]"),
          {
            x: "20vw",
            y: "12vh",
            yPercent: 135,
            rotation: 8,
            ease: "power1.in",
            duration: 0.12,
          },
          0.88,
        )
        .fromTo(
          q("[data-streaks]"),
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: 0.35 },
          0.15,
        )
        .to(q("[data-streaks]"), { opacity: 0, ease: "none", duration: 0.3 }, 0.7)
        .fromTo(
          q("[data-reentry-label]"),
          { opacity: 0 },
          { opacity: 1, duration: 0.15 },
          0.25,
        )
        .to(q("[data-reentry-label]"), { opacity: 0, duration: 0.15 }, 0.55);

      return () => tl.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[360vh]">
      {/* Clouds sit in normal flow, so they scroll past the pinned scene */}
      <AtmosphereClouds />
      {/* Sponsors heading sits above the cloud band; no z-index so the
          pinned pod scene (later sibling) and the clouds (z-10) both pass
          in front of it */}
      <div className="absolute inset-x-0 top-[10%]">
        <Sponsors />
      </div>
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
        {/* Speed streaks — vertical lines suggesting velocity */}
        <div data-streaks className="absolute inset-0 opacity-0">
          {[12, 28, 45, 62, 78, 90].map((left, i) => (
            <span
              key={i}
              className="absolute w-[2px] bg-star-white/25"
              style={{
                left: `${left}%`,
                top: `${(i * 17) % 60}%`,
                height: `${18 + (i % 3) * 10}vh`,
              }}
            />
          ))}
        </div>

        <div data-rocket className="will-change-transform">
          <div data-rocket-visual className="motion-reduce:invisible">
            <PixelCapsule size={190} />
          </div>
        </div>

        <p
          data-reentry-label
          className="absolute bottom-[20%] left-1/2 -translate-x-1/2 font-pixel text-[10px] text-star-white/80 opacity-0"
        >
          ENTERING ATMOSPHERE...
        </p>
      </div>
    </section>
  );
}
