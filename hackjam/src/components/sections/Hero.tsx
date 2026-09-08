"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { siteConfig } from "@/config/site";
import PixelButton from "@/components/ui/PixelButton";

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
    <section ref={sectionRef} className="relative flex min-h-[78dvh] flex-col items-center justify-start px-4 pb-8 pt-24 text-center sm:min-h-[100dvh] sm:pb-20 sm:pt-28">
      <div className="flex flex-col items-center gap-8">
        {/* This is the LCP element. fetchPriority raises it above the
            browser's default guess for a late-discovered image; decoding
            keeps the decode off the main thread. (loading="eager" would be
            redundant — it is already the default.) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-hero-logo
          src="/gifs/HackJam26_black_levitate.webp"
          alt={siteConfig.name}
          className="crisp mt-14 w-[min(92vw,64rem)] max-w-full sm:mt-20"
          decoding="async"
          fetchPriority="high"
        />

        <p data-hero-detail className="font-pixel text-[12px] leading-relaxed text-nebula-core sm:text-[16px]">
          {siteConfig.eventDate} &middot; {siteConfig.venue}
        </p>

        <PixelButton
          data-hero-detail
          href={siteConfig.registrationUrl}
          variant="magenta"
          size="lg"
          className="mt-2"
        >
          Register Now
        </PixelButton>
      </div>
    </section>
  );
}
