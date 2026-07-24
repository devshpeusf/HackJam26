"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { siteConfig } from "@/config/site";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        });

        timeline
          .fromTo(
            "[data-hero-logo]",
            { y: 90, scale: 0.72, rotation: 3, autoAlpha: 0 },
            { y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 1 },
          )
          .fromTo(
            "[data-hero-detail]",
            { y: 36, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.12 },
            0.35,
          );
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-[100dvh] flex-col items-center justify-start px-4 pb-20 pt-24 text-center sm:pt-28">
      <div className="flex flex-col items-center gap-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-hero-logo
          src="/gifs/HackJam26_black_levitate.gif"
          alt={siteConfig.name}
          className="crisp w-[min(92vw,64rem)] max-w-full"
        />

        <p data-hero-detail className="font-pixel text-[12px] leading-relaxed text-nebula-core sm:text-[16px]">
          {siteConfig.eventDate} &middot; {siteConfig.venue}
        </p>

        <a
          data-hero-detail
          href={siteConfig.registrationUrl}
          className="mt-2 inline-block bg-accent-magenta px-10 py-5 font-pixel text-sm text-void-deep transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-[0.98]"
          style={{
            boxShadow:
              "0 -4px 0 0 #ff2e97, 0 4px 0 0 #ff2e97, -4px 0 0 0 #ff2e97, 4px 0 0 0 #ff2e97",
          }}
        >
          REGISTER NOW
        </a>
      </div>
    </section>
  );
}
