"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { siteConfig } from "@/config/site";
import Reveal from "@/components/effects/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import TeamShowcase from "@/components/ui/team-showcase";

/**
 * Sunset zone (spec §6.6–6.7): the judging panel over the warm band — a
 * staggered photo mosaic with a hover-linked roster (TeamShowcase). A
 * pixel sun sinks behind the content as the section scrolls by.
 */
export default function Judges() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const tween = gsap.fromTo(
        q("[data-sun]"),
        { yPercent: -20 },
        {
          yPercent: 55,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
      return () => tween.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="judges"
      ref={sectionRef}
      className="relative flex min-h-[82dvh] scroll-mt-14 flex-col items-center justify-center overflow-hidden px-4 py-20 sm:py-24"
    >
      {/* The setting pixel sun — behind the content, sinking on scroll */}
      <div
        data-sun
        aria-hidden
        className="absolute left-1/2 top-[30%] -z-10 h-64 w-64 -translate-x-1/2 will-change-transform sm:h-80 sm:w-80"
        style={{
          background:
            "radial-gradient(circle, #ffd9a0 0%, #e9743a 45%, rgba(233,116,58,0.4) 65%, transparent 72%)",
          imageRendering: "pixelated",
        }}
      />

      <Reveal className="flex w-full flex-col items-center">
        <SectionHeading
          title="JUDGES"
          sub="The crew scoring your final descent. Panel announced soon."
          accent="var(--color-star-warm)"
          className="mb-14"
        />

        <div data-reveal className="w-full">
          <TeamShowcase
            members={siteConfig.judges.map((j) => ({
              ...j,
              role: `Judge · ${j.role}`,
            }))}
            accent="var(--color-star-warm)"
          />
        </div>
      </Reveal>
    </section>
  );
}
