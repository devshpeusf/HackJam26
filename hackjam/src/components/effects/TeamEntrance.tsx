"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Keeps the team section server-rendered while adding its GSAP entrance. */
export default function TeamEntrance({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const strip = root.querySelector<HTMLElement>("[data-team-strip]");
        if (!strip) return;

        const timeline = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        });

        timeline
          .fromTo(
            "[data-team-heading]",
            { y: 64, scale: 0.94, autoAlpha: 0 },
            { y: 0, scale: 1, autoAlpha: 1, duration: 0.9 },
          )
          .fromTo(
            strip,
            { x: -110, y: 28, scale: 0.96, autoAlpha: 0 },
            {
              x: 0,
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 1,
              onComplete: () => gsap.set(strip, { clearProps: "transform" }),
            },
            0.24,
          );
      }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
